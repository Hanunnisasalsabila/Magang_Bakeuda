import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { StatusAjuan, Pekerjaan, StatusWp, KondisiBangunan, JenisKonstruksi, JenisAtap, JenisDinding, JenisLantai, JenisLangitLangit } from '@prisma/client';
import { CreateSpopDto } from './dto/create-spop.dto.js';
import { CreateDraftDto } from './dto/create-draft.dto.js';
import { VerifikasiBakeudaDto } from './dto/verifikasi-bakeuda.dto.js';
import { NopGeneratorService } from '../lib/nop-generator.js';

@Injectable()
export class TransaksiSpopService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly nopGenerator: NopGeneratorService,
  ) {}

  async createDraft(dto: CreateSpopDto, id_user: string) {
    const jenis_transaksi = dto.jenis_layanan;
    const jenis_tanah_baru = dto.objek_pajak_sementara.jenis_tanah;
    const pekerjaan_enum = dto.subjek_pajak.pekerjaan;
    const status_wp = dto.subjek_pajak.status_wp;

    const currentYear = new Date().getFullYear();
    const final_status: StatusAjuan = dto.is_draft ? StatusAjuan.DRAFT : StatusAjuan.MENUNGGU;

    // Validasi & Pembersihan Cerdas NOP berdasarkan Jenis Transaksi
    if (['MUTASI', 'PERUBAHAN_DATA', 'HAPUS'].includes(jenis_transaksi)) {
      if (!dto.is_draft && !dto.nop_utama) {
        throw new BadRequestException(`NOP Utama wajib diisi untuk jenis layanan ${jenis_transaksi}`);
      }
      dto.nop_asal = []; // Paksa kosong
      dto.no_sppt_lama = undefined; // Paksa kosong
    } else if (jenis_transaksi === 'BARU') {
      dto.nop_utama = undefined; // Paksa kosong
      dto.nop_asal = []; // Paksa kosong
    } else if (jenis_transaksi === 'PECAH') {
      dto.nop_utama = undefined; // Paksa kosong
      if (!dto.is_draft && (!dto.nop_asal || dto.nop_asal.filter(n => n && n.trim() !== '').length !== 1)) {
        throw new BadRequestException(`NOP Asal wajib diisi tepat 1 untuk jenis layanan ${jenis_transaksi}`);
      }
    } else if (jenis_transaksi === 'GABUNG') {
      dto.nop_utama = undefined; // Paksa kosong
      if (!dto.is_draft && (!dto.nop_asal || dto.nop_asal.filter(n => n && n.trim() !== '').length < 2)) {
        throw new BadRequestException(`NOP Asal wajib diisi minimal 2 untuk jenis layanan ${jenis_transaksi}`);
      }
    }
    // Validasi Cerdas Bangunan
    if (jenis_tanah_baru !== 'TANAH_BANGUNAN') {
      dto.objek_pajak_sementara.luas_bangunan = 0;
      dto.objek_pajak_sementara.jumlah_bangunan = 0;
    } else {
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

    if (['BARU', 'PECAH'].includes(jenis_transaksi)) {
      const hasDenahLokasi = dto.lampiran?.some(l => l.jenis_dokumen === 'DENAH_LOKASI');
      if (!hasDenahLokasi) {
        throw new BadRequestException(`Denah Lokasi wajib dilampirkan untuk jenis layanan ${jenis_transaksi}`);
      }
    }

    // Validasi Eksistensi NOP
    if (dto.nop_bersama) {
      const exists = await this.prisma.objekPajak.findUnique({ where: { nop: dto.nop_bersama } });
      if (!exists) throw new BadRequestException(`NOP Bersama (${dto.nop_bersama}) tidak terdaftar di database. Silakan gunakan NOP yang valid.`);
    }
    if (dto.nop_utama) {
      const exists = await this.prisma.objekPajak.findUnique({ where: { nop: dto.nop_utama } });
      if (!exists) throw new BadRequestException(`NOP Utama (${dto.nop_utama}) tidak terdaftar di database.`);
    }
    if (dto.nop_asal && dto.nop_asal.length > 0) {
      for (const nopAsal of dto.nop_asal) {
        const exists = await this.prisma.objekPajak.findUnique({ where: { nop: nopAsal } });
        if (!exists) throw new BadRequestException(`NOP Asal (${nopAsal}) tidak terdaftar di database.`);
      }
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
      // 1. Jika ID transaksi sudah ada (submit dari draf), hapus detail lama
      if (dto.id_transaksi) {
        await tx.detailTransaksiTujuan.deleteMany({ where: { id_transaksi: dto.id_transaksi } });
        await tx.detailTransaksiAsal.deleteMany({ where: { id_transaksi: dto.id_transaksi } });
        await tx.lampiranDokumen.deleteMany({ where: { id_transaksi: dto.id_transaksi } });
      }

      const upsertData = {
          id_user,
          tahun_pajak: currentYear,
          jenis_transaksi,
          nop_bersama: dto.nop_bersama || null,
          no_sppt_lama: dto.no_sppt_lama || null,
          nama_pengaju: dto.subjek_pajak.nama,
          tanggal_pengajuan: new Date(),
          status_ajuan: final_status,
          menggunakan_kuasa: dto.is_kuasa || false,
          
          // Data Detail Asal (Conditionally inserted)
          detail_asal: (dto.nop_utama && dto.nop_utama.trim() !== '') || (dto.nop_asal && dto.nop_asal.filter(n => n && n.trim() !== '').length > 0) ? {
            create: [
              ...(dto.nop_utama && dto.nop_utama.trim() !== '' ? [{ nop_asal: dto.nop_utama }] : []),
              ...(dto.nop_asal ? dto.nop_asal.filter(n => n && n.trim() !== '').map(n => ({ nop_asal: n })) : []),
            ]
          } : undefined,

          // Data Tujuan
          detail_tujuan: {
            create: {
              nik_calon_subjek: dto.subjek_pajak.nik !== '0000000000000000' && dto.subjek_pajak.nik !== '' ? dto.subjek_pajak.nik : undefined,
              calon_subjek_json: (dto.subjek_pajak as any),
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
              koordinat_polygon: dto.objek_pajak_sementara.koordinat_polygon ? (dto.objek_pajak_sementara.koordinat_polygon as any) : undefined,
              batas_utara: dto.objek_pajak_sementara.batas_utara,
              batas_selatan: dto.objek_pajak_sementara.batas_selatan,
              batas_timur: dto.objek_pajak_sementara.batas_timur,
              batas_barat: dto.objek_pajak_sementara.batas_barat,
              data_bangunan_json: dto.bangunan && dto.bangunan.length > 0 ? (dto.bangunan as any) : undefined,
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
              keterangan: dto.is_draft ? 'Draft Formulir SPOP Disimpan' : 'Formulir SPOP Diajukan ke Bakeuda',
            },
          },
      };

      // 2. Buat atau Timpa Transaksi
      const transaksi = await tx.transaksiSpop.upsert({
        where: { id_transaksi: dto.id_transaksi || '00000000-0000-0000-0000-000000000000' },
        update: {
          ...upsertData,
          updated_at: new Date(),
        },
        create: {
          ...(dto.id_transaksi ? { id_transaksi: dto.id_transaksi } : {}),
          ...upsertData,
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
    } catch (error) {
      if (error.code === 'P2003') {
        throw new BadRequestException('NOP Asal atau NOP Bersama yang dimasukkan belum terdaftar di sistem. Harap periksa kembali.');
      }
      throw error;
    }
  }

  async saveDraft(dto: CreateDraftDto, id_user: string) {
    const currentYear = new Date().getFullYear();
    const final_status: StatusAjuan = StatusAjuan.DRAFT;

    const subjek = dto.subjek_pajak || {};
    const objek = dto.objek_pajak_sementara || {};

    const nik = subjek.nik || '0000000000000000';
    const nama_subjek = subjek.nama || 'DRAFT';
    const jenis_layanan = dto.jenis_layanan || 'BARU';
    const jenis_tanah_baru = objek.jenis_tanah || 'TANAH_KOSONG';

    // Validasi & Pembersihan Cerdas NOP berdasarkan Jenis Transaksi untuk Draft
    if (['MUTASI', 'PERUBAHAN_DATA', 'HAPUS'].includes(jenis_layanan as string)) {
      dto.nop_asal = []; // Paksa kosong
      dto.no_sppt_lama = undefined; // Paksa kosong
    } else if (jenis_layanan === 'BARU') {
      dto.nop_utama = undefined; // Paksa kosong
      dto.nop_asal = []; // Paksa kosong
    } else if (jenis_layanan === 'PECAH') {
      dto.nop_utama = undefined; // Paksa kosong
    } else if (jenis_layanan === 'GABUNG') {
      dto.nop_utama = undefined; // Paksa kosong
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
      // 1. (Dihapus) Tidak lagi upsert ke Master untuk Draft Subjek Pajak

      // 2. Jika ID transaksi sudah ada, hapus detail lama (karena kita akan replace)
      if (dto.id_transaksi) {
        await tx.detailTransaksiTujuan.deleteMany({ where: { id_transaksi: dto.id_transaksi } });
        await tx.detailTransaksiAsal.deleteMany({ where: { id_transaksi: dto.id_transaksi } });
        await tx.lampiranDokumen.deleteMany({ where: { id_transaksi: dto.id_transaksi } });
      }

          // 3. Upsert Transaksi SPOP
          const transaksi = await tx.transaksiSpop.upsert({
        where: { id_transaksi: dto.id_transaksi || '00000000-0000-0000-0000-000000000000' },
        update: {
          jenis_transaksi: jenis_layanan,
          nop_bersama: dto.nop_bersama || null,
          no_sppt_lama: dto.no_sppt_lama || null,
          nama_pengaju: nama_subjek,
          menggunakan_kuasa: dto.is_kuasa || false,
          updated_at: new Date(),
        },
        create: {
          ...(dto.id_transaksi ? { id_transaksi: dto.id_transaksi } : {}),
          id_user,
          tahun_pajak: currentYear,
          jenis_transaksi: jenis_layanan,
          nop_bersama: dto.nop_bersama || null,
          no_sppt_lama: dto.no_sppt_lama || null,
          nama_pengaju: nama_subjek,
          tanggal_pengajuan: new Date(),
          status_ajuan: final_status,
          menggunakan_kuasa: dto.is_kuasa || false,
          riwayat: {
            create: {
              status_riwayat: final_status,
              keterangan: 'Draft Formulir SPOP Disimpan',
            },
          },
        },
      });

      // 4. Create Detail Asal, Detail Tujuan, Lampiran (karena sudah dihapus jika update)
      const detail_asal_data: any[] = [];
      if (dto.nop_utama && dto.nop_utama.trim() !== '') {
        detail_asal_data.push({ nop_asal: dto.nop_utama, id_transaksi: transaksi.id_transaksi });
      }
      if (dto.nop_asal && dto.nop_asal.length > 0) {
        dto.nop_asal.filter(n => n && n.trim() !== '').forEach(n => detail_asal_data.push({ nop_asal: n, id_transaksi: transaksi.id_transaksi }));
      }
      if (detail_asal_data.length > 0) {
        await tx.detailTransaksiAsal.createMany({ data: detail_asal_data });
      }

      await tx.detailTransaksiTujuan.create({
        data: {
          id_transaksi: transaksi.id_transaksi,
          nik_calon_subjek: nik !== '0000000000000000' && nik !== '' ? nik : undefined,
          calon_subjek_json: Object.keys(subjek).length > 0 ? (subjek as any) : undefined,
          luas_tanah_baru: objek.luas_tanah || 0,
          luas_bangunan_baru: objek.luas_bangunan || 0,
          jumlah_bangunan_baru: objek.jumlah_bangunan || 0,
          jenis_tanah_baru,
          jalan_op_baru: objek.jalan_op,
          rt_op_baru: objek.rt_op,
          rw_op_baru: objek.rw_op,
          blok_kav_no_baru: objek.blok_kav_no,
          kelurahan_op_baru: objek.kelurahan_op,
          kecamatan_op_baru: objek.kecamatan_op,
          no_persil_baru: objek.no_persil,
          latitude: objek.latitude,
          longitude: objek.longitude,
          batas_utara: objek.batas_utara,
          batas_selatan: objek.batas_selatan,
          batas_timur: objek.batas_timur,
          batas_barat: objek.batas_barat,
          data_bangunan_json: dto.bangunan && dto.bangunan.length > 0 ? (dto.bangunan as any) : undefined,
          nop_generated: ['MUTASI', 'PERUBAHAN_DATA', 'HAPUS'].includes(jenis_layanan as string) ? dto.nop_utama : undefined,
        }
      });

      if (dto.lampiran && dto.lampiran.length > 0) {
        await tx.lampiranDokumen.createMany({
          data: dto.lampiran.map(l => ({
            id_transaksi: transaksi.id_transaksi,
            jenis_dokumen: l.jenis_dokumen || 'DRAFT',
            url_file: l.url_file || '',
            uploaded_by: id_user,
          }))
        });
      }

      return await tx.transaksiSpop.findUnique({
        where: { id_transaksi: transaksi.id_transaksi },
        include: { detail_tujuan: true, detail_asal: true, lampiran: true, riwayat: true }
      });
    });
    } catch (error) {
      if (error.code === 'P2003') {
        throw new BadRequestException('Draft gagal disimpan: NOP Asal atau NOP Bersama yang Anda masukkan belum terdaftar di sistem.');
      }
      throw error;
    }
  }

  async updateTransaksi(id_transaksi: string, dto: CreateSpopDto | CreateDraftDto, id_user_request: string) {
    const transaksiLama = await this.prisma.transaksiSpop.findUnique({
      where: { id_transaksi },
      include: { lampiran: true, detail_tujuan: true },
    });

    if (!transaksiLama) {
      throw new NotFoundException('Data transaksi tidak ditemukan.');
    }

    // Lapis 1: Guard Status
    if (transaksiLama.status_ajuan !== 'DRAFT' && transaksiLama.status_ajuan !== 'REVISI') {
      throw new BadRequestException('Hanya berkas DRAFT atau REVISI yang dapat diperbarui.');
    }

    // Lapis 2: Guard Kepemilikan (Ownership)
    if (transaksiLama.id_user !== id_user_request) {
      throw new ForbiddenException('Akses ditolak. Anda tidak berhak mengubah data milik pengguna lain.');
    }

    const isFullSubmit = !dto.is_draft;
    const final_status: StatusAjuan = transaksiLama.status_ajuan; 
    
    const jenis_transaksi = dto.jenis_layanan || transaksiLama.jenis_transaksi;
    const currentYear = new Date().getFullYear();

    const subjek = dto.subjek_pajak || {};
    const objek = dto.objek_pajak_sementara || {};

    const nik = subjek.nik || '0000000000000000';
    const nama_subjek = subjek.nama || (isFullSubmit ? '' : 'DRAFT');
    const jenis_tanah_baru = objek.jenis_tanah || 'TANAH_KOSONG';

    // Validasi Dasar NOP
    if (['MUTASI', 'PERUBAHAN_DATA', 'HAPUS'].includes(jenis_transaksi as string)) {
      if (isFullSubmit && !dto.nop_utama) {
        throw new BadRequestException(`NOP Utama wajib diisi untuk jenis layanan ${jenis_transaksi}`);
      }
      dto.nop_asal = []; 
      dto.no_sppt_lama = undefined; 
    } else if (jenis_transaksi === 'BARU') {
      dto.nop_utama = undefined; 
      dto.nop_asal = []; 
    } else if (jenis_transaksi === 'PECAH') {
      dto.nop_utama = undefined; 
      if (isFullSubmit && (!dto.nop_asal || dto.nop_asal.filter(n => n && n.trim() !== '').length !== 1)) {
        throw new BadRequestException(`NOP Asal wajib diisi tepat 1 untuk jenis layanan ${jenis_transaksi}`);
      }
    } else if (jenis_transaksi === 'GABUNG') {
      dto.nop_utama = undefined; 
      if (isFullSubmit && (!dto.nop_asal || dto.nop_asal.filter(n => n && n.trim() !== '').length < 2)) {
        throw new BadRequestException(`NOP Asal wajib diisi minimal 2 untuk jenis layanan ${jenis_transaksi}`);
      }
    }
    
    // Retensi Lampiran (Lapis 3 attachment handling)
    let lampiranFinal: any[] = [];
    if (dto.lampiran && dto.lampiran.length > 0) {
      lampiranFinal = dto.lampiran;
    } else {
      lampiranFinal = transaksiLama.lampiran; // Pertahankan yang lama
    }

    if (isFullSubmit) {
       if (dto.is_kuasa && !lampiranFinal.some(l => l.jenis_dokumen === 'SURAT_KUASA')) {
          throw new BadRequestException('Surat Kuasa wajib dilampirkan jika pendaftar bertindak selaku kuasa');
       }
       if (['BARU', 'PECAH'].includes(jenis_transaksi as string) && !lampiranFinal.some(l => l.jenis_dokumen === 'DENAH_LOKASI')) {
          throw new BadRequestException(`Denah Lokasi wajib dilampirkan untuk jenis layanan ${jenis_transaksi}`);
       }
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        // Hapus child data lama
        await tx.detailTransaksiTujuan.deleteMany({ where: { id_transaksi } });
        await tx.detailTransaksiAsal.deleteMany({ where: { id_transaksi } });
        await tx.lampiranDokumen.deleteMany({ where: { id_transaksi } });

        // Update Transaksi Induk
        await tx.transaksiSpop.update({
          where: { id_transaksi },
          data: {
            jenis_transaksi: jenis_transaksi as string as any,
            nop_bersama: dto.nop_bersama || null,
            no_sppt_lama: dto.no_sppt_lama || null,
            nama_pengaju: nama_subjek,
            menggunakan_kuasa: dto.is_kuasa || false,
            updated_at: new Date(),
          }
        });

        // Insert Detail Asal
        const detail_asal_data: any[] = [];
        if (dto.nop_utama && dto.nop_utama.trim() !== '') {
          detail_asal_data.push({ nop_asal: dto.nop_utama, id_transaksi });
        }
        if (dto.nop_asal && dto.nop_asal.length > 0) {
          dto.nop_asal.filter(n => n && n.trim() !== '').forEach(n => detail_asal_data.push({ nop_asal: n, id_transaksi }));
        }
        if (detail_asal_data.length > 0) {
          await tx.detailTransaksiAsal.createMany({ data: detail_asal_data });
        }

        // Insert Detail Tujuan (Lapis 3 Safety Net: Hanya update staging, tidak ke Master)
        await tx.detailTransaksiTujuan.create({
          data: {
            id_transaksi,
            nik_calon_subjek: nik !== '0000000000000000' && nik !== '' ? nik : undefined,
            calon_subjek_json: Object.keys(subjek).length > 0 ? (subjek as any) : undefined,
            luas_tanah_baru: objek.luas_tanah || 0,
            luas_bangunan_baru: objek.luas_bangunan || 0,
            jumlah_bangunan_baru: objek.jumlah_bangunan || 0,
            jenis_tanah_baru: jenis_tanah_baru as string as any,
            jalan_op_baru: objek.jalan_op,
            rt_op_baru: objek.rt_op,
            rw_op_baru: objek.rw_op,
            blok_kav_no_baru: objek.blok_kav_no,
            kelurahan_op_baru: objek.kelurahan_op,
            kecamatan_op_baru: objek.kecamatan_op,
            no_persil_baru: objek.no_persil,
            latitude: objek.latitude,
            longitude: objek.longitude,
            koordinat_polygon: objek.koordinat_polygon ? (objek.koordinat_polygon as any) : undefined,
            batas_utara: objek.batas_utara,
            batas_selatan: objek.batas_selatan,
            batas_timur: objek.batas_timur,
            batas_barat: objek.batas_barat,
            data_bangunan_json: dto.bangunan && dto.bangunan.length > 0 
              ? (dto.bangunan as any) 
              : (transaksiLama.detail_tujuan?.[0]?.data_bangunan_json || undefined),
            nop_generated: ['MUTASI', 'PERUBAHAN_DATA', 'HAPUS'].includes(jenis_transaksi as string) ? dto.nop_utama : undefined,
          }
        });

        // Insert Lampiran (baik yang baru, atau dari retensi yang lama)
        if (lampiranFinal && lampiranFinal.length > 0) {
          await tx.lampiranDokumen.createMany({
            data: lampiranFinal.map(l => ({
              id_transaksi,
              jenis_dokumen: l.jenis_dokumen || 'DRAFT',
              url_file: l.url_file || '',
              uploaded_by: l.uploaded_by || id_user_request,
            }))
          });
        }

        await tx.riwayatPelacakan.create({
          data: {
            id_transaksi,
            status_riwayat: final_status,
            keterangan: 'Data berkas telah diperbarui oleh Desa.',
          },
        });

        return await tx.transaksiSpop.findUnique({
          where: { id_transaksi },
          include: { detail_tujuan: true, detail_asal: true, lampiran: true, riwayat: true }
        });
      });
    } catch (error) {
      if (error.code === 'P2003') {
        throw new BadRequestException('NOP Asal atau NOP Bersama yang Anda masukkan belum terdaftar di sistem.');
      }
      throw error;
    }
  }

  async lockForReview(id_transaksi: string, idAdmin: string) {
    // 1. Atomic Update
    const updateResult = await this.prisma.transaksiSpop.updateMany({
      where: {
        id_transaksi,
        status_ajuan: 'MENUNGGU',
        locked_by: null,
      },
      data: {
        status_ajuan: 'PROSES',
        locked_by: idAdmin,
        locked_at: new Date(),
      },
    });

    if (updateResult.count === 0) {
      // Gagal mengunci, cari tahu alasannya
      const transaksi = await this.prisma.transaksiSpop.findUnique({
        where: { id_transaksi },
        include: { reviewer: true },
      });

      if (!transaksi) {
        throw new NotFoundException('Data transaksi tidak ditemukan.');
      }

      if (transaksi.status_ajuan === 'PROSES') {
        if (transaksi.locked_by === idAdmin) {
          // Re-entry aman (Admin A refresh halaman)
          return this.getDetailTransaksi(id_transaksi);
        } else {
          throw new BadRequestException(
            `🔒 Berkas sedang direviu oleh ${transaksi.reviewer?.nama_lengkap || 'Admin Lain'}. Silakan pilih berkas lain.`
          );
        }
      }

      throw new BadRequestException('Berkas tidak dalam status MENUNGGU atau sudah diproses.');
    }

    // 2. Jika berhasil mengunci, catat ke riwayat
    await this.prisma.riwayatPelacakan.create({
      data: {
        id_transaksi,
        status_riwayat: 'PROSES',
        keterangan: 'Berkas mulai direviu oleh Admin Bakeuda.',
      },
    });

    return this.getDetailTransaksi(id_transaksi);
  }

  async unlockReview(id_transaksi: string, idAdmin: string) {
    const transaksi = await this.prisma.transaksiSpop.findUnique({
      where: { id_transaksi },
    });

    if (!transaksi) {
      throw new NotFoundException('Data transaksi tidak ditemukan.');
    }

    if (transaksi.status_ajuan !== 'PROSES') {
      throw new BadRequestException('Berkas tidak sedang dalam status PROSES.');
    }

    // Untuk saat ini, kita anggap semua role BAKEUDA bisa unlock (super admin mode sementara)
    // Jika nanti ada role khusus, bisa dicek di sini.
    // if (transaksi.locked_by !== idAdmin && !(isAdminSuperAdmin(idAdmin))) { ... }

    await this.prisma.$transaction(async (tx) => {
      await tx.transaksiSpop.update({
        where: { id_transaksi },
        data: {
          status_ajuan: 'MENUNGGU',
          locked_by: null,
          locked_at: null,
        },
      });

      await tx.riwayatPelacakan.create({
        data: {
          id_transaksi,
          status_riwayat: 'MENUNGGU',
          keterangan: 'Reviu dibatalkan (Lepas Kunci). Berkas kembali ke antrean.',
        },
      });
    });

    return { message: 'Kunci berhasil dilepas. Berkas kembali ke antrean.' };
  }

  async autoReleaseExpiredLocks() {
    const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);
    
    const expiredLocks = await this.prisma.transaksiSpop.findMany({
      where: {
        status_ajuan: 'PROSES',
        locked_at: {
          lt: thirtyMinsAgo,
        },
      },
    });

    if (expiredLocks.length === 0) return 0;

    const ids = expiredLocks.map(t => t.id_transaksi);

    await this.prisma.$transaction(async (tx) => {
      await tx.transaksiSpop.updateMany({
        where: { id_transaksi: { in: ids } },
        data: {
          status_ajuan: 'MENUNGGU',
          locked_by: null,
          locked_at: null,
        },
      });

      const riwayatData = ids.map(id => ({
        id_transaksi: id,
        status_riwayat: 'MENUNGGU' as StatusAjuan,
        keterangan: 'Kunci dilepas otomatis (timeout 30 menit)',
      }));

      await tx.riwayatPelacakan.createMany({
        data: riwayatData,
      });
    });

    return ids.length;
  }

  async getAllTransaksi(status_ajuan?: string, kode_wilayah?: string) {
    // Jalankan auto release expired locks setiap kali inbox dipanggil
    await this.autoReleaseExpiredLocks();

    const where: any = {};
    if (status_ajuan) {
      where.status_ajuan = status_ajuan;
    }
    if (kode_wilayah) {
      where.pengaju = {
        kode_wilayah: kode_wilayah,
      };
    }

    try {
      const result = await this.prisma.transaksiSpop.findMany({
        where,
        include: {
          detail_tujuan: true,
          pengaju: {
            select: {
              nama_lengkap: true,
              kode_wilayah: true,
            }
          },
          reviewer: {
            select: {
              nama_lengkap: true,
            }
          },
          verifikator: {
            select: {
              nama_lengkap: true,
            }
          }
        },
        orderBy: {
          updated_at: 'desc',
        },
      });
      return {
        success: true,
        data: result
      };
    } catch (e) {
      console.error(e);
      throw new BadRequestException('Gagal mengambil data transaksi');
    }
  }



  async ajukanKeBakeuda(id_transaksi: string, kode_wilayah_user: string) {
    const transaksi = await this.prisma.transaksiSpop.findUnique({
      where: { id_transaksi },
      include: { pengaju: true },
    });

    if (!transaksi) {
      throw new NotFoundException('Draf transaksi tidak ditemukan.');
    }

    if (transaksi.pengaju.kode_wilayah !== kode_wilayah_user) {
      throw new BadRequestException('Anda tidak berhak mengajukan dokumen dari wilayah lain.');
    }

    if (transaksi.status_ajuan !== 'DRAFT' && transaksi.status_ajuan !== 'REVISI') {
      throw new BadRequestException('Hanya dokumen berstatus DRAFT atau REVISI yang dapat diajukan.');
    }

    return await this.prisma.$transaction(async (tx) => {
      const updatedTransaksi = await tx.transaksiSpop.update({
        where: { id_transaksi },
        data: { 
          status_ajuan: 'MENUNGGU',
          catatan_bakeuda: null 
        },
      });

      await tx.riwayatPelacakan.create({
        data: {
          id_transaksi: id_transaksi,
          status_riwayat: 'MENUNGGU',
          keterangan: 'Berkas berhasil diajukan dan sedang menunggu verifikasi dari Bakeuda.',
        },
      });

      return {
        message: 'Berkas berhasil diajukan ke Bakeuda.',
        data: updatedTransaksi,
      };
    });
  }

  async verifikasiBakeuda(
    id_transaksi: string, 
    dto: VerifikasiBakeudaDto,
    idVerifikator: string
  ) {
    const transaksi = await this.prisma.transaksiSpop.findUnique({
      where: { id_transaksi },
      include: {
        detail_tujuan: true,
        detail_asal: true
      }
    });

    if (!transaksi) {
      throw new NotFoundException('Data SPOP tidak ditemukan.');
    }

    if (transaksi.status_ajuan !== 'PROSES') {
      throw new BadRequestException('SPOP ini belum direviu (belum di-lock). Silakan mulai reviu terlebih dahulu.');
    }

    if (transaksi.locked_by !== idVerifikator) {
      throw new BadRequestException('Hanya admin yang sedang mereviu yang boleh mengambil keputusan akhir.');
    }

    return await this.prisma.$transaction(async (tx) => {
      const updatedTransaksi = await tx.transaksiSpop.update({
        where: { id_transaksi },
        data: { 
          status_ajuan: dto.status_ajuan,
          id_verifikator: idVerifikator,
          verified_at: new Date(),
          catatan_bakeuda: dto.catatan || null,
          locked_by: null,
          locked_at: null,
        },
      });

      let ket = '';
      if (dto.status_ajuan === 'DISETUJUI') ket = 'Berkas disetujui oleh Bakeuda.';
      else if (dto.status_ajuan === 'DITOLAK') ket = `Berkas ditolak. Catatan: ${dto.catatan}`;
      else if (dto.status_ajuan === 'REVISI') ket = `Berkas dikembalikan untuk direvisi. Catatan: ${dto.catatan}`;

      await tx.riwayatPelacakan.create({
        data: {
          id_transaksi: id_transaksi,
          status_riwayat: dto.status_ajuan,
          keterangan: ket,
        },
      });

      // === FASE 3: MASTERING (EKSEKUSI PENANAMAN DATA MASTER) ===
      if (dto.status_ajuan === 'DISETUJUI' && transaksi.detail_tujuan.length > 0) {
        const tujuan = transaksi.detail_tujuan[0];
        let finalNop: string;

        if (['BARU', 'PECAH', 'GABUNG'].includes(transaksi.jenis_transaksi)) {
          // Validasi input dari Admin Bakeuda
          if (!dto.kode_wilayah || dto.kode_wilayah.length !== 10) {
            throw new BadRequestException('Kode Wilayah wajib dipilih.');
          }
          if (!dto.kode_blok || dto.kode_blok.length !== 3) {
            throw new BadRequestException('Kode Blok wajib diisi (3 digit).');
          }
          const kode_jenis_op = dto.kode_jenis_op || '0';

          finalNop = await this.nopGenerator.generateNop({
            kode_wilayah: dto.kode_wilayah,
            kode_blok: dto.kode_blok,
            kode_jenis_op,
          }, tx as any);
        } else {
          // MUTASI / PERUBAHAN_DATA / HAPUS → pakai NOP yang sudah ada
          finalNop = tujuan.nop_generated || '';
        }

        if (!finalNop || finalNop.length !== 18) {
          throw new BadRequestException('NOP tidak valid atau belum diisi (harus 18 digit).');
        }

        // 1. Menonaktifkan NOP Lama (jika ada dan diset nonaktif)
        if (transaksi.detail_asal.length > 0) {
          for (const asal of transaksi.detail_asal) {
            if (asal.nonaktifkan_saat_disetujui && asal.nop_asal) {
              await tx.objekPajak.update({
                where: { nop: asal.nop_asal },
                data: {
                  status_aktif: false,
                  nonaktif_oleh: idVerifikator,
                  nonaktif_at: new Date()
                }
              });
            }
          }
        }

        // 2. Update nop_generated di detail_tujuan dengan finalNop yang baru/dipilih
        if (finalNop !== tujuan.nop_generated) {
          await tx.detailTransaksiTujuan.update({
            where: { id_detail_tujuan: tujuan.id_detail_tujuan },
            data: { nop_generated: finalNop }
          });
        }

        // 2.5 Upsert ke Master SubjekPajak (Wajib Pajak)
        if (tujuan.calon_subjek_json) {
          const subjekTemp: any = tujuan.calon_subjek_json;
          let pekerjaan_enum: Pekerjaan = Pekerjaan.LAINNYA;
          switch (subjekTemp.pekerjaan) {
            case 'PNS': pekerjaan_enum = Pekerjaan.PNS; break;
            case 'ABRI': pekerjaan_enum = Pekerjaan.ABRI; break;
            case 'PENSIUNAN': pekerjaan_enum = Pekerjaan.PENSIUNAN; break;
            case 'BADAN': pekerjaan_enum = Pekerjaan.BADAN; break;
          }
          let status_wp: StatusWp = StatusWp.PEMILIK;
          switch (subjekTemp.status_wp) {
            case 'PENYEWA': status_wp = StatusWp.PENYEWA; break;
            case 'PENGELOLA': status_wp = StatusWp.PENGELOLA; break;
            case 'PEMAKAI': status_wp = StatusWp.PEMAKAI; break;
            case 'SENGKETA': status_wp = StatusWp.SENGKETA; break;
          }

          const nikToSave = subjekTemp.nik || tujuan.nik_calon_subjek || '0000000000000000';

          let validKodeWilayah = subjekTemp.kode_wilayah;
          if (!validKodeWilayah) {
            // Try to find matching wilayah by desa & kecamatan
            const matchedWilayah = await tx.wilayah.findFirst({
              where: { 
                nama_desa: subjekTemp.kelurahan || '',
                kecamatan: subjekTemp.kecamatan || ''
              }
            });
            if (matchedWilayah) {
              validKodeWilayah = matchedWilayah.kode_wilayah;
            } else {
              // Fallback to dto.kode_wilayah, or just any valid wilayah
              validKodeWilayah = dto.kode_wilayah;
              if (!validKodeWilayah) {
                const firstWilayah = await tx.wilayah.findFirst();
                validKodeWilayah = firstWilayah?.kode_wilayah || '3303000000';
              }
            }
          }

          await tx.subjekPajak.upsert({
            where: { nik: nikToSave },
            update: {
              nama_subjek: subjekTemp.nama || 'TANPA NAMA',
              pekerjaan: pekerjaan_enum,
              status_wp: status_wp,
              npwp: subjekTemp.npwp,
              no_hp: subjekTemp.no_hp,
              email: subjekTemp.email,
              alamat_jalan: subjekTemp.alamat || 'TANPA ALAMAT',
              blok_kav_no_subjek: subjekTemp.blok_kav_no,
              rt: subjekTemp.rt,
              rw: subjekTemp.rw,
              kode_wilayah: validKodeWilayah,
              kode_pos: subjekTemp.kode_pos,
            },
            create: {
              nik: nikToSave,
              nama_subjek: subjekTemp.nama || 'TANPA NAMA',
              pekerjaan: pekerjaan_enum,
              status_wp: status_wp,
              npwp: subjekTemp.npwp,
              no_hp: subjekTemp.no_hp,
              email: subjekTemp.email,
              alamat_jalan: subjekTemp.alamat || 'TANPA ALAMAT',
              blok_kav_no_subjek: subjekTemp.blok_kav_no,
              rt: subjekTemp.rt,
              rw: subjekTemp.rw,
              kode_wilayah: validKodeWilayah,
              kode_pos: subjekTemp.kode_pos,
              created_by: idVerifikator,
            }
          });

          // Memastikan nik yang dipakai ke ObjekPajak adalah nikToSave
          tujuan.nik_calon_subjek = nikToSave;
        }

        // 3. Insert ke Master ObjekPajak (Tanah/Bumi)
        const kode_propinsi = finalNop.substring(0, 2);
        const kode_dati2 = finalNop.substring(2, 4);
        const kode_kecamatan = finalNop.substring(4, 7);
        const kode_kelurahan = finalNop.substring(7, 10);
        const kode_blok = finalNop.substring(10, 13);
        const no_urut = finalNop.substring(13, 17);
        const kode_jenis_op = finalNop.substring(17, 18);

        // Pastikan NOP belum ada
        const existingOp = await tx.objekPajak.findUnique({ where: { nop: finalNop } });
        if (!existingOp) {
          await tx.objekPajak.create({
            data: {
              nop: finalNop,
              kode_wilayah: finalNop.substring(0, 10),
              kode_blok,
              no_urut,
              kode_jenis_op,
              nik_subjek: tujuan.nik_calon_subjek || '0000000000000000',
              no_persil: tujuan.no_persil_baru,
              jalan_op: tujuan.jalan_op_baru || '',
              blok_kav_no: tujuan.blok_kav_no_baru,
              rw_op: tujuan.rw_op_baru,
              rt_op: tujuan.rt_op_baru,

              jenis_tanah: tujuan.jenis_tanah_baru,
              luas_tanah: tujuan.luas_tanah_baru,
              luas_bangunan: tujuan.luas_bangunan_baru,
              jumlah_bangunan: tujuan.jumlah_bangunan_baru,
              status_aktif: true,
            }
          });
        } else if (['MUTASI', 'PERUBAHAN_DATA'].includes(transaksi.jenis_transaksi)) {
          // Jika mutasi/perubahan, update data master yang ada
          await tx.objekPajak.update({
            where: { nop: finalNop },
            data: {
              nik_subjek: tujuan.nik_calon_subjek || '0000000000000000',
              no_persil: tujuan.no_persil_baru,
              jalan_op: tujuan.jalan_op_baru || '',
              blok_kav_no: tujuan.blok_kav_no_baru,
              rw_op: tujuan.rw_op_baru,
              rt_op: tujuan.rt_op_baru,

              jenis_tanah: tujuan.jenis_tanah_baru,
              luas_tanah: tujuan.luas_tanah_baru,
              luas_bangunan: tujuan.luas_bangunan_baru,
              jumlah_bangunan: tujuan.jumlah_bangunan_baru,
              status_aktif: true,
            }
          });
        }

        // 4. Insert ke Master ObjekBangunan (LSPOP)
        if (tujuan.data_bangunan_json && Array.isArray(tujuan.data_bangunan_json)) {
          // Hapus bangunan lama jika mutasi/perubahan data dan mengupdate bangunan
          if (['MUTASI', 'PERUBAHAN_DATA'].includes(transaksi.jenis_transaksi)) {
             await tx.objekBangunanFasilitas.deleteMany({
               where: { objek_bangunan: { nop: finalNop } }
             });
             await tx.objekBangunan.deleteMany({
               where: { nop: finalNop }
             });
          }

          let no_bng = 1;
          for (const bngRaw of tujuan.data_bangunan_json as any[]) {
            const bng = bngRaw as any;
            // Pemetaan JPB ke Kode 2 digit (Dummy mapping, aslinya join ke referensi)
            let kode_jpb = '01'; // Default Perumahan
            if (bng.jenisPenggunaan === 'Perkantoran Swasta') kode_jpb = '02';
            else if (bng.jenisPenggunaan === 'Pabrik') kode_jpb = '03';
            else if (bng.jenisPenggunaan === 'Toko/Apotik/Pasar/Ruko') kode_jpb = '04';

            // Cek apakah JPB eksis di database untuk menghindari error FK
            const existingJpb = await tx.referensiJenisPenggunaanBangunan.findUnique({ where: { kode_jpb } });
            if (!existingJpb) {
              const firstJpb = await tx.referensiJenisPenggunaanBangunan.findFirst();
              if (firstJpb) {
                kode_jpb = firstJpb.kode_jpb;
              } else {
                await tx.referensiJenisPenggunaanBangunan.create({
                  data: {
                    kode_jpb,
                    nama_jpb: bng.jenisPenggunaan || 'Perumahan'
                  }
                });
              }
            }

            const createdBng = await tx.objekBangunan.create({
              data: {
                nop: finalNop,
                no_bangunan: no_bng,
                kode_jpb: kode_jpb,
                luas_bangunan: bng.luasBangunan ? parseFloat(bng.luasBangunan) : 0,
                jumlah_lantai: bng.jumlahLantai ? parseInt(bng.jumlahLantai) : 1,
                tahun_dibangun: bng.tahunDibangun ? parseInt(bng.tahunDibangun) : null,
                tahun_renovasi: bng.tahunDirenovasi ? parseInt(bng.tahunDirenovasi) : null,
                daya_listrik_watt: bng.dayaListrik ? parseInt(bng.dayaListrik) : null,
                kondisi_bangunan: bng.kondisi === 'Sangat Baik' ? KondisiBangunan.SANGAT_BAIK : (bng.kondisi === 'Baik' ? KondisiBangunan.BAIK : (bng.kondisi === 'Sedang' ? KondisiBangunan.SEDANG : KondisiBangunan.JELEK)),
                jenis_konstruksi: bng.konstruksi === 'Baja' ? JenisKonstruksi.BAJA : (bng.konstruksi === 'Beton' ? JenisKonstruksi.BETON : (bng.konstruksi === 'Batu Bata' ? JenisKonstruksi.BATU_BATA : JenisKonstruksi.KAYU)),
                jenis_atap: bng.atap === 'Genting/Beton' ? JenisAtap.DECRABON_BETON_GLAZUR : (bng.atap === 'Asbes' ? JenisAtap.ASBES : JenisAtap.SENG),
                kode_dinding: bng.dinding === 'Bata/Beton' ? JenisDinding.BATU_BATA_CONBLOK : (bng.dinding === 'Kayu' ? JenisDinding.KAYU : JenisDinding.SENG),
                kode_lantai: bng.lantai === 'Marmer' ? JenisLantai.MARMER : (bng.lantai === 'Keramik' ? JenisLantai.KERAMIK : JenisLantai.SEMEN),
                kode_langit_langit: bng.langitLangit === 'Eternit' ? JenisLangitLangit.AKUSTIK_JATI : JenisLangitLangit.TRIPLEK_ASBES_BAMBU,
              }
            });

            // Insert Fasilitas
            await tx.objekBangunanFasilitas.create({
              data: {
                id_bangunan: createdBng.id_bangunan,
                jumlah_ac_split: bng.acSplit ? parseInt(bng.acSplit) : 0,
                jumlah_ac_window: bng.acWindow ? parseInt(bng.acWindow) : 0,
                ac_sentral: bng.acSentral === 'Ada',
                luas_kolam_renang: bng.kolamRenangLuas ? parseFloat(bng.kolamRenangLuas) : 0,
                kolam_diplester: bng.kolamRenangFinishing === 'Diplester',
              }
            });
            no_bng++;
          }
        }
      }

      return {
        message: `Verifikasi berhasil dengan status ${dto.status_ajuan}.`,
        data: updatedTransaksi
      };
    });
  }

  async getDetailTransaksi(id_transaksi: string, kodeWilayahUser?: string) {
    const transaksi = await this.prisma.transaksiSpop.findUnique({
      where: { id_transaksi },
      include: {
        detail_tujuan: true,
        detail_asal: true,
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
        reviewer: {
          select: {
            nama_lengkap: true,
          }
        },
        verifikator: {
          select: {
            nama_lengkap: true,
          }
        }
      },
    });

    if (!transaksi) {
      throw new NotFoundException('Detail transaksi tidak ditemukan.');
    }

    // Optional Security: Block if different wilayah and not a Bakeuda admin
    // We can just rely on the UI hiding the id, or enforce it strictly here.
    // For now, let's enforce it.
    if (kodeWilayahUser && transaksi.pengaju.kode_wilayah !== kodeWilayahUser) {
      // throw new ForbiddenException('Akses ditolak.'); 
    }

    // Attach calon_subjek_temp for frontend compatibility
    const responseData = {
      ...transaksi,
      calon_subjek_temp: transaksi.detail_tujuan?.[0]?.calon_subjek_json || null,
      locked_by: transaksi.locked_by,
      locked_at: transaksi.locked_at,
      reviewer_nama: transaksi.reviewer?.nama_lengkap || null,
      verifikator_nama: transaksi.verifikator?.nama_lengkap || null,
    };

    return {
      success: true,
      data: responseData,
    };
  }

  async getStats(kode_wilayah?: string) {
    const baseWhere = kode_wilayah ? { pengaju: { kode_wilayah } } : {};

    const [totalDikirim, menunggu, disetujui, perluPerbaikan] = await Promise.all([
      this.prisma.transaksiSpop.count({
        where: {
          ...baseWhere,
          status_ajuan: { not: StatusAjuan.DRAFT }
        }
      }),
      this.prisma.transaksiSpop.count({
        where: {
          ...baseWhere,
          status_ajuan: StatusAjuan.MENUNGGU
        }
      }),
      this.prisma.transaksiSpop.count({
        where: {
          ...baseWhere,
          status_ajuan: StatusAjuan.DISETUJUI
        }
      }),
      this.prisma.transaksiSpop.count({
        where: {
          ...baseWhere,
          status_ajuan: StatusAjuan.REVISI
        }
      })
    ]);

    return {
      success: true,
      data: {
        totalDikirim,
        menunggu,
        disetujui,
        perluPerbaikan
      }
    };
  }
}
