import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateSpopDto } from './dto/create-spop.dto.js';
import { VerifikasiDesaDto } from './dto/verifikasi-desa.dto.js';

@Injectable()
export class TransaksiSpopService {
  constructor(private readonly prisma: PrismaService) {}

  async createDraft(dto: CreateSpopDto, id_user: string) {
    // Mapping jenis_layanan text (from UI) to Enum JenisTransaksi
    let jenis_transaksi: 'BARU' | 'MUTASI' | 'PECAH' | 'GABUNG' | 'PERUBAHAN_DATA' = 'BARU';
    const jL = dto.jenis_layanan.toLowerCase();
    if (jL.includes('mutasi')) jenis_transaksi = 'MUTASI';
    else if (jL.includes('pecah')) jenis_transaksi = 'PECAH';
    else if (jL.includes('gabung')) jenis_transaksi = 'GABUNG';
    else if (jL.includes('ubah') || jL.includes('perubahan')) jenis_transaksi = 'PERUBAHAN_DATA';

    // Mapping jenis_tanah string to Enum JenisTanah
    let jenis_tanah_baru: 'TANAH_BANGUNAN' | 'TANAH_PERTANIAN' | 'TANAH_PERKEBUNAN' | 'TANAH_KEHUTANAN' | 'TANAH_LAINNYA' = 'TANAH_BANGUNAN';
    const jT = dto.objek_pajak_sementara.jenis_tanah.toLowerCase();
    if (jT.includes('pertanian')) jenis_tanah_baru = 'TANAH_PERTANIAN';
    else if (jT.includes('perkebunan')) jenis_tanah_baru = 'TANAH_PERKEBUNAN';
    else if (jT.includes('kehutanan')) jenis_tanah_baru = 'TANAH_KEHUTANAN';
    else if (jT.includes('lainnya')) jenis_tanah_baru = 'TANAH_LAINNYA';

    let pekerjaan_enum: 'PNS' | 'TNI_POLRI' | 'PEGAWAI_SWASTA' | 'WIRASWASTA' | 'PETANI' | 'NELAYAN' | 'PENSIUNAN' | 'LAINNYA' = 'LAINNYA';
    const pkj = dto.subjek_pajak.pekerjaan.toLowerCase();
    if (pkj.includes('pns')) pekerjaan_enum = 'PNS';
    else if (pkj.includes('tni') || pkj.includes('polri')) pekerjaan_enum = 'TNI_POLRI';
    else if (pkj.includes('swasta')) pekerjaan_enum = 'PEGAWAI_SWASTA';
    else if (pkj.includes('wiraswasta')) pekerjaan_enum = 'WIRASWASTA';
    else if (pkj.includes('petani')) pekerjaan_enum = 'PETANI';
    else if (pkj.includes('nelayan')) pekerjaan_enum = 'NELAYAN';
    else if (pkj.includes('pensiunan')) pekerjaan_enum = 'PENSIUNAN';

    const currentYear = new Date().getFullYear();

    return this.prisma.$transaction(async (tx) => {
      // 1. Pastikan SubjekPajak ada / Upsert
      await tx.subjekPajak.upsert({
        where: { nik: dto.subjek_pajak.nik },
        update: {
          nama_subjek: dto.subjek_pajak.nama,
          pekerjaan: pekerjaan_enum,
          alamat_jalan: dto.subjek_pajak.alamat,
        },
        create: {
          nik: dto.subjek_pajak.nik,
          nama_subjek: dto.subjek_pajak.nama,
          pekerjaan: pekerjaan_enum,
          alamat_jalan: dto.subjek_pajak.alamat,
          status_wp: 'PEMILIK', // Default as owner
          kelurahan: '-',       // Placeholder unless added to UI
          kabupaten: '-',       // Placeholder unless added to UI
          created_by: id_user,
        },
      });

      // 2. Buat Cangkang Transaksi
      const transaksi = await tx.transaksiSpop.create({
        data: {
          id_user,
          tahun_pajak: currentYear,
          jenis_transaksi,
          nama_pengaju: dto.subjek_pajak.nama,
          tanggal_pengajuan: new Date(),
          status_ajuan: 'DRAFT',
          // Data Tujuan
          detail_tujuan: {
            create: {
              nik_calon_subjek: dto.subjek_pajak.nik,
              luas_tanah_baru: dto.objek_pajak_sementara.luas_tanah,
              jenis_tanah_baru,
              jalan_op_baru: dto.objek_pajak_sementara.jalan_op,
              rt_op_baru: dto.objek_pajak_sementara.rt_op,
              rw_op_baru: dto.objek_pajak_sementara.rw_op,
            },
          },
          // Data Lampiran
          lampiran: dto.lampiran && dto.lampiran.length > 0 ? {
            create: dto.lampiran.map((l) => ({
              jenis_dokumen: l.jenis_dokumen,
              url_file: l.url_file,
              uploaded_by: id_user,
            })),
          } : undefined,
          // Riwayat Pelacakan
          riwayat: {
            create: {
              status_riwayat: 'DRAFT',
              keterangan: 'Pengajuan Berkas Berhasil Dibuat',
            },
          },
        },
        include: {
          detail_tujuan: true,
          lampiran: true,
          riwayat: true,
        },
      });

      return transaksi;
    });
  }

  async getAllTransaksi(status_ajuan?: string, kode_wilayah?: string) {
    const where: any = {};
    if (status_ajuan) {
      where.status_ajuan = status_ajuan;
    }
    if (kode_wilayah) {
      // Filter by pengaju's kode_wilayah
      where.pengaju = {
        kode_wilayah,
      };
    }

    return this.prisma.transaksiSpop.findMany({
      where,
      include: {
        detail_tujuan: true,
        pengaju: {
          select: {
            nama_lengkap: true,
            kode_wilayah: true,
          }
        }
      },
      orderBy: {
        updated_at: 'desc',
      },
    });
  }

  async ajukanKeLurah(id_transaksi: string, kode_wilayah_user: string) {
    // 1. Pengecekan Keberadaan Dokumen & Keamanan Cross-Reference Wilayah
    const transaksi = await this.prisma.transaksiSpop.findUnique({
      where: { id_transaksi },
      include: { pengaju: true },
    });

    if (!transaksi) {
      throw new NotFoundException('Draf transaksi tidak ditemukan.');
    }

    // Validasi Keamanan: Pastikan dokumen ini milik desa/wilayah dari operator yang request
    if (transaksi.pengaju.kode_wilayah !== kode_wilayah_user) {
      throw new BadRequestException('Anda tidak berhak mengajukan dokumen dari wilayah lain.');
    }

    if (transaksi.status_ajuan !== 'DRAFT') {
      throw new BadRequestException('Hanya dokumen berstatus DRAFT yang dapat diajukan ke kelurahan.');
    }

    // 2. Eksekusi Database menggunakan Transaction
    return await this.prisma.$transaction(async (tx) => {
      // A. Geser Status Transaksi Utama
      const updatedTransaksi = await tx.transaksiSpop.update({
        where: { id_transaksi },
        data: {
          status_ajuan: 'MENUNGGU_VERIFIKASI_DESA',
        },
      });

      // B. Catat Jejak Digitalnya di Tabel Riwayat
      await tx.riwayatPelacakan.create({
        data: {
          id_transaksi: id_transaksi,
          status_riwayat: 'MENUNGGU_VERIFIKASI_DESA',
          keterangan: 'Berkas berhasil diinput dan sedang mengantre validasi internal Kepala Desa.',
        },
      });

      return {
        message: 'Berkas berhasil diajukan ke Kelurahan.',
        data: updatedTransaksi,
      };
    });
  }

  async verifikasiOlehDesa(
    id_transaksi: string, 
    dto: VerifikasiDesaDto, 
    kodeWilayahUser: string
  ) {
    // 1. Validasi Status Transaksi
    const transaksi = await this.prisma.transaksiSpop.findUnique({
      where: { id_transaksi }
    });

    if (!transaksi) {
      throw new NotFoundException('Data SPOP tidak ditemukan.');
    }

    if (transaksi.status_ajuan !== 'MENUNGGU_VERIFIKASI_DESA') {
      throw new BadRequestException('SPOP ini belum diajukan ke tahap persetujuan atau sudah diproses.');
    }

    // 2. VALIDASI KEAMANAN BERLAPIS
    // Cek apakah NIP tersebut ada di database DAN terdaftar di wilayah yang sama dengan operator
    const pejabatValid = await this.prisma.pejabatDesa.findFirst({
      where: {
        nip: dto.nipPemeriksaDesa,
        kode_wilayah: kodeWilayahUser,
      },
    });

    if (!pejabatValid) {
      throw new ForbiddenException('NIP Pemeriksa tidak valid atau tidak terdaftar di wilayah Anda.');
    }

    // 3. Eksekusi Transaction (Ubah Status SPOP + Catat Riwayat)
    return await this.prisma.$transaction(async (tx) => {
      // A. Update Transaksi (Stempel Kades masuk ke DB)
      const updatedTransaksi = await tx.transaksiSpop.update({
        where: { id_transaksi },
        data: { 
          status_ajuan: 'PROSES', // Berubah jadi PROSES (Masuk antrean Bakeuda)
          nip_pemeriksa_desa: dto.nipPemeriksaDesa,
          url_dokumen_fisik: dto.urlDokumenFisik
        },
      });

      // B. Catat Riwayat Pelacakan
      await tx.riwayatPelacakan.create({
        data: {
          id_transaksi: id_transaksi,
          status_riwayat: 'PROSES',
          keterangan: `Berkas disetujui oleh ${pejabatValid.nama_pejabat} (${pejabatValid.jabatan}) dan dikirim ke Kabupaten.`,
        },
      });

      return {
        message: 'Verifikasi kelurahan berhasil. Dokumen telah diteruskan ke Bakeuda.',
        data: updatedTransaksi
      };
    });
  }

  async getDetailTransaksi(id_transaksi: string, kodeWilayahUser: string) {
    const transaksi = await this.prisma.transaksiSpop.findUnique({
      where: { id_transaksi },
      include: {
        detail_tujuan: true,
        pengaju: {
          select: {
            nama_lengkap: true,
            kode_wilayah: true,
          }
        },
        lampiran: true,
        riwayat: {
          orderBy: {
            waktu_kejadian: 'asc',
          },
        },
      },
    });

    if (!transaksi) {
      throw new NotFoundException('Detail transaksi tidak ditemukan.');
    }

    // Optional Security: Block if different wilayah and not a Bakeuda admin
    // We can just rely on the UI hiding the id, or enforce it strictly here.
    // For now, let's enforce it.
    if (transaksi.pengaju.kode_wilayah !== kodeWilayahUser) {
      // Assuming Bakeuda has empty or '000000' kode_wilayah, you might want to skip this check for them
      // but since the instruction says "Otorisasi Opsional" we'll leave it as commented or simple check
      // throw new ForbiddenException('Akses ditolak.'); 
    }

    return {
      message: 'Detail transaksi berhasil diambil.',
      data: transaksi,
    };
  }
}
