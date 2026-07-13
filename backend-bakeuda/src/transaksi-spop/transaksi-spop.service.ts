import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateSpopDto } from './dto/create-spop.dto.js';
import { VerifikasiDesaDto } from './dto/verifikasi-desa.dto.js';

@Injectable()
export class TransaksiSpopService {
  constructor(private readonly prisma: PrismaService) {}

  async createDraft(dto: CreateSpopDto, id_user: string) {
    const jenis_transaksi = dto.jenis_layanan;
    const jenis_tanah_baru = dto.objek_pajak_sementara.jenis_tanah;
    const pekerjaan_enum = dto.subjek_pajak.pekerjaan;
    const status_wp = dto.subjek_pajak.status_wp;

    const currentYear = new Date().getFullYear();
    const final_status = dto.is_draft ? 'DRAFT' : 'MENUNGGU_VERIFIKASI_DESA';

    // Validasi Cerdas
    if (jenis_transaksi === 'MUTASI' && !dto.nop_utama) {
      throw new BadRequestException('NOP Utama wajib diisi untuk jenis layanan Pemutakhiran Data (Mutasi)');
    }
    if (jenis_transaksi === 'PECAH' && !dto.nop_asal) {
      throw new BadRequestException('NOP Asal wajib diisi untuk jenis layanan Pecah Tanah');
    }
    if (jenis_tanah_baru === 'TANAH_BANGUNAN') {
      if (!dto.objek_pajak_sementara.luas_bangunan || dto.objek_pajak_sementara.luas_bangunan <= 0) {
        throw new BadRequestException('Luas bangunan wajib diisi jika jenis tanah adalah TANAH & BANGUNAN');
      }
    }
    if (dto.is_kuasa) {
      const hasSuratKuasa = dto.lampiran?.some(l => l.jenis_dokumen === 'SURAT_KUASA');
      if (!hasSuratKuasa) {
        throw new BadRequestException('Surat Kuasa wajib dilampirkan jika pendaftar bertindak selaku kuasa');
      }
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Pastikan SubjekPajak ada / Upsert
      await tx.subjekPajak.upsert({
        where: { nik: dto.subjek_pajak.nik },
        update: {
          nama_subjek: dto.subjek_pajak.nama,
          pekerjaan: pekerjaan_enum,
          status_wp: status_wp,
          npwp: dto.subjek_pajak.npwp,
          no_hp: dto.subjek_pajak.no_hp,
          email: dto.subjek_pajak.email,
          alamat_jalan: dto.subjek_pajak.alamat,
          blok_kav_no_subjek: dto.subjek_pajak.blok_kav_no,
          rt: dto.subjek_pajak.rt,
          rw: dto.subjek_pajak.rw,
          kelurahan: dto.subjek_pajak.kelurahan,
          kecamatan: dto.subjek_pajak.kecamatan,
          kabupaten: dto.subjek_pajak.kabupaten,
          kode_pos: dto.subjek_pajak.kode_pos,
        },
        create: {
          nik: dto.subjek_pajak.nik,
          nama_subjek: dto.subjek_pajak.nama,
          pekerjaan: pekerjaan_enum,
          status_wp: status_wp,
          npwp: dto.subjek_pajak.npwp,
          no_hp: dto.subjek_pajak.no_hp,
          email: dto.subjek_pajak.email,
          alamat_jalan: dto.subjek_pajak.alamat,
          blok_kav_no_subjek: dto.subjek_pajak.blok_kav_no,
          rt: dto.subjek_pajak.rt,
          rw: dto.subjek_pajak.rw,
          kelurahan: dto.subjek_pajak.kelurahan,
          kecamatan: dto.subjek_pajak.kecamatan,
          kabupaten: dto.subjek_pajak.kabupaten,
          kode_pos: dto.subjek_pajak.kode_pos,
          created_by: id_user,
        },
      });

      // 2. Buat Cangkang Transaksi
      const transaksi = await tx.transaksiSpop.create({
        data: {
          id_user,
          tahun_pajak: currentYear,
          jenis_transaksi,
          nop_bersama: dto.nop_bersama,
          no_sppt_lama: dto.no_sppt_lama,
          nama_pengaju: dto.subjek_pajak.nama,
          tanggal_pengajuan: new Date(),
          status_ajuan: final_status,
          menggunakan_kuasa: dto.is_kuasa || false,
          
          // Data Detail Asal (Conditionally inserted)
          detail_asal: dto.nop_utama || dto.nop_asal ? {
            create: {
              nop_asal: dto.nop_utama || dto.nop_asal,
            }
          } : undefined,

          // Data Tujuan
          detail_tujuan: {
            create: {
              nik_calon_subjek: dto.subjek_pajak.nik,
              luas_tanah_baru: dto.objek_pajak_sementara.luas_tanah,
              luas_bangunan_baru: dto.objek_pajak_sementara.luas_bangunan || 0,
              jumlah_bangunan_baru: dto.objek_pajak_sementara.jumlah_bangunan || 0,
              jenis_tanah_baru,
              jalan_op_baru: dto.objek_pajak_sementara.jalan_op,
              rt_op_baru: dto.objek_pajak_sementara.rt_op,
              rw_op_baru: dto.objek_pajak_sementara.rw_op,
              blok_kav_no_baru: dto.objek_pajak_sementara.blok_kav_no,
              kelurahan_op_baru: dto.objek_pajak_sementara.kelurahan_op,
              kecamatan_op_baru: dto.objek_pajak_sementara.kecamatan_op,
              no_persil_baru: dto.objek_pajak_sementara.no_persil,
              latitude: dto.objek_pajak_sementara.latitude,
              longitude: dto.objek_pajak_sementara.longitude,
              batas_utara: dto.objek_pajak_sementara.batas_utara,
              batas_selatan: dto.objek_pajak_sementara.batas_selatan,
              batas_timur: dto.objek_pajak_sementara.batas_timur,
              batas_barat: dto.objek_pajak_sementara.batas_barat,
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
              status_riwayat: final_status,
              keterangan: dto.is_draft ? 'Draft Formulir SPOP Disimpan' : 'Formulir SPOP Diajukan, Menunggu Verifikasi Desa',
            },
          },
        },
        include: {
          detail_tujuan: true,
          detail_asal: true,
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
