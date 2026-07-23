import { Injectable, BadRequestException, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { NopGeneratorService } from '../lib/nop-generator.js';
import { OracleWriteService } from '../oracle/oracle-write.service.js';
import {
  StatusAjuan,
  JenisTransaksi,
  Prisma,
  TransaksiSpop,
  Pekerjaan,
  StatusWp,
  KondisiBangunan,
  JenisKonstruksi,
  JenisAtap,
  JenisDinding,
  JenisLantai,
  JenisLangitLangit,
  BahanPagar
} from '@prisma/client';
import { SubmitTransaksiDto } from './dto/submit-transaksi.dto.js';
import { VerifikasiBakeudaDto } from './dto/verifikasi-bakeuda.dto.js';
import { CurrentUser, assertWilayahAccess } from '../common/wilayah-scope.helper.js';
import { validasiSelisihLuasPecah } from './luas-validation.helper.js';

type TransaksiSpopWithDetail = Prisma.TransaksiSpopGetPayload<{
  include: { detail_asal: true; detail_tujuan: true; lampiran: true; pengaju: true }
}>;

@Injectable()
export class TransaksiSpopService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly nopGenerator: NopGeneratorService,
    private readonly oracleWriteService: OracleWriteService,
  ) { }

  async submitPengajuan(dto: SubmitTransaksiDto, currentUser: CurrentUser, asDraft: boolean) {
    if (!asDraft) {
      this.validateJumlahDetail(dto.jenis_transaksi, dto.detail_asal, dto.detail_tujuan);
      if (dto.jenis_transaksi) {
        this.validateByJenisTransaksi(dto.jenis_transaksi, dto);
      }
    }

    if (dto.detail_asal?.length) {
      for (const asal of dto.detail_asal) {
        const objek = await this.prisma.objekPajak.findUnique({ where: { nop: asal.nop_asal } });
        if (!objek) throw new BadRequestException(`NOP asal ${asal.nop_asal} tidak ditemukan`);
        if (!objek.status_aktif) throw new BadRequestException(`NOP asal ${asal.nop_asal} sudah nonaktif, tidak bisa diajukan transaksi`);
        assertWilayahAccess(currentUser, objek.kode_wilayah);
      }
    }

    if (dto.detail_tujuan?.length) {
      for (const tujuan of dto.detail_tujuan) {
        if (!tujuan.kode_wilayah_baru && currentUser.role === 'DESA') {
          tujuan.kode_wilayah_baru = currentUser.kode_wilayah || undefined;
        }
        if (tujuan.kode_wilayah_baru) {
          const wil = await this.prisma.wilayah.findUnique({ where: { kode_wilayah: tujuan.kode_wilayah_baru } });
          if (!wil) throw new BadRequestException(`Kode wilayah ${tujuan.kode_wilayah_baru} tidak ditemukan`);
        }
      }
    }

    // Validasi soft warning selisih luas — KHUSUS PECAH (GABUNG tidak perlu, luas dihitung otomatis)
    const peringatanValidasi = await this.hitungPeringatanValidasiLuas(dto);

    const statusAjuan = asDraft ? 'DRAFT' : 'MENUNGGU';

    const transaksi = await this.prisma.transaksiSpop.create({
      data: {
        id_user: currentUser.id_user,
        tahun_pajak: dto.tahun_pajak as number,
        jenis_transaksi: dto.jenis_transaksi as JenisTransaksi,
        no_sppt_lama: dto.no_sppt_lama,
        nama_pengaju: dto.nama_pengaju,
        no_formulir: dto.no_formulir,
        nop_bersama: dto.nop_bersama,
        menggunakan_kuasa: dto.menggunakan_kuasa ?? false,
        tanggal_pengajuan: dto.tanggal_pengajuan ? new Date(dto.tanggal_pengajuan as string) : new Date(),
        status_ajuan: statusAjuan,
        peringatan_validasi: peringatanValidasi,
        catatan_pengaju: dto.catatan_pengaju,
        detail_asal: dto.detail_asal ? {
          create: dto.detail_asal.map((a) => ({
            nop_asal: a.nop_asal,
            nonaktifkan_saat_disetujui: a.nonaktifkan_saat_disetujui ?? true
          }))
        } : undefined,
        detail_tujuan: dto.detail_tujuan ? {
          create: dto.detail_tujuan.map((t) => ({
            ...t,
            luas_tanah_baru: t.luas_tanah_baru ?? 0,
            luas_bangunan_baru: t.luas_bangunan_baru ?? 0,
            jumlah_bangunan_baru: t.jumlah_bangunan_baru ?? 0,
            jenis_tanah_baru: t.jenis_tanah_baru ?? 'TANAH_KOSONG' as any,
            koordinat_polygon: t.koordinat_polygon as any,
            calon_subjek_json: t.calon_subjek_json as any,
            data_bangunan_json: t.data_bangunan_json as any
          }))
        } : undefined,
        lampiran: dto.lampiran ? {
          create: {
            url_ktp: dto.lampiran.url_ktp || [],
            url_sertifikat: dto.lampiran.url_sertifikat || [],
            url_ajb: dto.lampiran.url_ajb || [],
            url_imb: dto.lampiran.url_imb || [],
            url_pendukung_lokasi: dto.lampiran.url_pendukung_lokasi || [],
            url_surat_kuasa: dto.lampiran.url_surat_kuasa || [],
            uploaded_by: currentUser.id_user,
          } as any
        } : undefined
      },
      include: { detail_asal: true, detail_tujuan: true },
    });

    await this.catatRiwayat(
      transaksi.id_transaksi,
      null,
      transaksi.status_ajuan,
      currentUser.id_user,
      peringatanValidasi ? `Pengajuan dibuat — ${peringatanValidasi}` : 'Pengajuan dibuat',
    );

    return {
      success: true,
      message: 'Pengajuan berhasil dibuat',
      data: transaksi,
      peringatan: peringatanValidasi,
    };
  }



  async saveDraft(id_transaksi: string, dto: SubmitTransaksiDto, currentUser: CurrentUser) {
    const existing = await this.prisma.transaksiSpop.findUnique({ where: { id_transaksi } });
    if (!existing) throw new NotFoundException('Transaksi tidak ditemukan');
    if (existing.id_user !== currentUser.id_user && currentUser.role !== 'BAKEUDA') {
      throw new ForbiddenException('Akses ditolak');
    }
    if (existing.status_ajuan !== 'DRAFT' && existing.status_ajuan !== 'REVISI') {
      throw new BadRequestException('Hanya pengajuan berstatus DRAFT atau REVISI yang bisa diupdate');
    }

    const peringatanValidasi = await this.hitungPeringatanValidasiLuas(dto);

    if (dto.detail_asal && dto.detail_asal.length > 0) {
      for (const asal of dto.detail_asal) {
        if (!asal.nop_asal) continue;
        const objek = await this.prisma.objekPajak.findUnique({ where: { nop: asal.nop_asal } });
        if (!objek) throw new BadRequestException(`NOP asal ${asal.nop_asal} tidak ditemukan`);
        if (!objek.status_aktif) throw new BadRequestException(`NOP asal ${asal.nop_asal} sudah nonaktif, tidak bisa diajukan transaksi`);
      }
    }

    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.detailTransaksiTujuan.deleteMany({ where: { id_transaksi } });
        await tx.detailTransaksiAsal.deleteMany({ where: { id_transaksi } });
        await tx.lampiranDokumen.deleteMany({ where: { id_transaksi } });

        await tx.transaksiSpop.update({
          where: { id_transaksi },
          data: {
            tahun_pajak: dto.tahun_pajak as number,
            jenis_transaksi: dto.jenis_transaksi as JenisTransaksi,
            no_sppt_lama: dto.no_sppt_lama,
            nama_pengaju: dto.nama_pengaju,
            no_formulir: dto.no_formulir,
            nop_bersama: dto.nop_bersama,
            menggunakan_kuasa: dto.menggunakan_kuasa ?? false,
            tanggal_pengajuan: dto.tanggal_pengajuan ? new Date(dto.tanggal_pengajuan as string) : undefined,
            peringatan_validasi: peringatanValidasi,
            catatan_pengaju: dto.catatan_pengaju,
            detail_asal: dto.detail_asal ? {
              create: dto.detail_asal.map((a) => ({
                nop_asal: a.nop_asal,
                nonaktifkan_saat_disetujui: this.shouldDeactivateAsal(dto.jenis_transaksi as string)
              }))
            } : undefined,
            detail_tujuan: dto.detail_tujuan ? {
              create: dto.detail_tujuan.map((t) => ({
                ...t,
                luas_tanah_baru: t.luas_tanah_baru ?? 0,
                luas_bangunan_baru: t.luas_bangunan_baru ?? 0,
                jumlah_bangunan_baru: t.jumlah_bangunan_baru ?? 0,
                jenis_tanah_baru: t.jenis_tanah_baru ?? 'TANAH_KOSONG' as any,
                koordinat_polygon: t.koordinat_polygon as any,
                calon_subjek_json: t.calon_subjek_json as any,
                data_bangunan_json: t.data_bangunan_json as any
              }))
            } : undefined,
            lampiran: dto.lampiran ? {
              create: {
                url_ktp: dto.lampiran.url_ktp || [],
                url_sertifikat: dto.lampiran.url_sertifikat || [],
                url_ajb: dto.lampiran.url_ajb || [],
                url_imb: dto.lampiran.url_imb || [],
                url_pendukung_lokasi: dto.lampiran.url_pendukung_lokasi || [],
                url_surat_kuasa: dto.lampiran.url_surat_kuasa || [],
                uploaded_by: currentUser.id_user,
              } as any
            } : undefined
          }
        });
      });
    } catch (error) {
      console.error("PRISMA ERROR:", error);
      throw new BadRequestException('PRISMA ERROR: ' + (error.message || String(error)));
    }

    const updated = await this.prisma.transaksiSpop.findUnique({
      where: { id_transaksi },
      include: { detail_asal: true, detail_tujuan: true }
    });

    return { success: true, message: 'Draft berhasil diupdate', data: updated, peringatan: peringatanValidasi };
  }

  async finalisasiSubmit(idTransaksi: string, currentUser: CurrentUser) {
    const transaksi = await this.prisma.transaksiSpop.findUnique({
      where: { id_transaksi: idTransaksi },
      include: { pengaju: true, detail_asal: true, detail_tujuan: true },
    });

    if (!transaksi) throw new NotFoundException('Pengajuan tidak ditemukan');
    if (transaksi.status_ajuan !== 'DRAFT' && transaksi.status_ajuan !== 'REVISI') {
      throw new BadRequestException('Hanya dokumen berstatus DRAFT atau REVISI yang dapat disubmit');
    }
    if (transaksi.pengaju.kode_wilayah !== currentUser.kode_wilayah && currentUser.role !== 'BAKEUDA') {
      throw new ForbiddenException('Akses ditolak');
    }

    this.validateJumlahDetail(transaksi.jenis_transaksi, transaksi.detail_asal, transaksi.detail_tujuan);

    // Construct DTO-like object for validation
    const dtoForValidation = {
      ...transaksi,
      detail_tujuan: transaksi.detail_tujuan,
    } as any;

    this.validateByJenisTransaksi(transaksi.jenis_transaksi, dtoForValidation);

    if (transaksi.detail_asal && transaksi.detail_asal.length > 0) {
      for (const asal of transaksi.detail_asal) {
        if (!asal.nop_asal) continue;
        const objek = await this.prisma.objekPajak.findUnique({ where: { nop: asal.nop_asal } });
        if (!objek) throw new BadRequestException(`NOP asal ${asal.nop_asal} tidak ditemukan`);
        if (!objek.status_aktif) throw new BadRequestException(`NOP asal ${asal.nop_asal} sudah nonaktif, tidak bisa diajukan transaksi`);
      }
    }

    const updated = await this.prisma.transaksiSpop.update({
      where: { id_transaksi: idTransaksi },
      data: { status_ajuan: 'MENUNGGU' },
    });

    await this.catatRiwayat(idTransaksi, transaksi.status_ajuan, 'MENUNGGU', currentUser.id_user, 'Berkas disubmit dan menunggu verifikasi');

    return { success: true, message: 'Berkas berhasil diajukan', data: updated };
  }

  async list(query: any, currentUser: CurrentUser) {
    await this.autoReleaseExpiredLocks();

    const where: any = {};
    if (query.status_ajuan) {
      where.status_ajuan = query.status_ajuan;
    }
    if (currentUser.role === 'DESA') {
      where.pengaju = { kode_wilayah: currentUser.kode_wilayah };
    } else {
      if (query.kode_wilayah) {
        where.pengaju = { kode_wilayah: query.kode_wilayah };
      }
      if (!where.status_ajuan) {
        where.status_ajuan = { not: 'DRAFT' };
      }
    }

    // Filter opsional — BAKEUDA bisa lihat khusus transaksi yang punya peringatan validasi
    if (query.ada_peringatan === 'true') {
      where.peringatan_validasi = { not: null };
    }

    const result = await this.prisma.transaksiSpop.findMany({
      where,
      include: {
        detail_asal: true,
        detail_tujuan: true,
        pengaju: { select: { nama_lengkap: true, kode_wilayah: true } },
        reviewer: { select: { nama_lengkap: true } },
        verifikator: { select: { nama_lengkap: true } }
      },
      orderBy: { updated_at: 'desc' },
    });
    return { success: true, data: result };
  }

  async getDetail(id_transaksi: string, currentUser: CurrentUser) {
    const transaksi = await this.prisma.transaksiSpop.findUnique({
      where: { id_transaksi },
      include: {
        detail_tujuan: true,
        detail_asal: {
          include: { objek_asal: true }
        },
        pengaju: { select: { nama_lengkap: true, kode_wilayah: true } },
        lampiran: true,
        riwayat: { orderBy: { created_at: 'asc' } },
        reviewer: { select: { nama_lengkap: true } }
      },
    });

    if (!transaksi) throw new NotFoundException('Detail transaksi tidak ditemukan');
    if (currentUser.role === 'DESA' && (transaksi as any).pengaju?.kode_wilayah !== currentUser.kode_wilayah) {
      throw new ForbiddenException('Akses ditolak');
    }

    if (transaksi.lampiran) {
      let l: any = transaksi.lampiran;
      if (typeof l === 'string') {
        try { l = JSON.parse(l); } catch(e) {}
      }
      const mappedLampiran: any[] = [];
      const mapItem = (urls: any, type: string) => {
        if (!urls) return;
        let parsed = urls;
        if (typeof parsed === 'string') {
          try { parsed = JSON.parse(parsed); } catch(e) {}
        }
        if (Array.isArray(parsed)) {
          parsed.forEach(u => mappedLampiran.push({ jenis_dokumen: type, url_file: u, id_lampiran: Math.random().toString(36).substring(7) }));
        }
      };
      mapItem(l.url_ktp, 'KTP');
      mapItem(l.url_sertifikat, 'SERTIFIKAT_HAK_MILIK');
      mapItem(l.url_ajb, 'AKTE_JUAL_BELI');
      mapItem(l.url_imb, 'IZIN_MENDIRIKAN_BANGUNAN');
      mapItem(l.url_pendukung_lokasi, 'DOKUMEN_PENDUKUNG_LOKASI');
      mapItem(l.url_surat_kuasa, 'SURAT_KUASA');
      
      return { success: true, data: { ...transaksi, lampiran: mappedLampiran } };
    }

    return { success: true, data: transaksi };
  }

  async getStats(kode_wilayah?: string) {
    const baseWhere = kode_wilayah ? { pengaju: { kode_wilayah } } : {};

    const [totalDikirim, menunggu, disetujui, perluPerbaikan] = await Promise.all([
      this.prisma.transaksiSpop.count({ where: { ...baseWhere, status_ajuan: { not: StatusAjuan.DRAFT } } }),
      this.prisma.transaksiSpop.count({ where: { ...baseWhere, status_ajuan: { in: ['MENUNGGU', 'PROSES'] } } }),
      this.prisma.transaksiSpop.count({ where: { ...baseWhere, status_ajuan: StatusAjuan.DISETUJUI } }),
      this.prisma.transaksiSpop.count({ where: { ...baseWhere, status_ajuan: StatusAjuan.REVISI } })
    ]);

    // Calculate weekly trends (Sen, Sel, Rab, Kam, Jum)
    const today = new Date();
    // Go to Monday of this week
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1));
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklyData = await this.prisma.transaksiSpop.findMany({
      where: {
        ...baseWhere,
        created_at: { gte: startOfWeek }
      },
      select: { created_at: true }
    });

    const weeklyTrends = [0, 0, 0, 0, 0];
    weeklyData.forEach(t => {
      const day = t.created_at.getDay(); // 1 = Monday, 5 = Friday
      if (day >= 1 && day <= 5) {
        weeklyTrends[day - 1]++;
      }
    });

    return { success: true, data: { totalDikirim, menunggu, disetujui, perluPerbaikan, weeklyTrends } };
  }

  async lockForReview(idTransaksi: string, currentUser: CurrentUser) {
    const transaksi = await this.prisma.transaksiSpop.findUnique({ where: { id_transaksi: idTransaksi } });
    if (!transaksi) throw new NotFoundException('Transaksi tidak ditemukan');
    if (transaksi.status_ajuan !== 'MENUNGGU' && transaksi.status_ajuan !== 'PROSES') {
      throw new BadRequestException('Transaksi tidak bisa dikunci');
    }
    if (transaksi.locked_by && transaksi.locked_by !== currentUser.id_user) {
      throw new ConflictException('Transaksi sedang direviu oleh verifikator lain');
    }

    if (transaksi.locked_by === currentUser.id_user) {
      return this.getDetail(idTransaksi, currentUser);
    }

    await this.prisma.transaksiSpop.update({
      where: { id_transaksi: idTransaksi },
      data: { status_ajuan: 'PROSES', locked_by: currentUser.id_user, locked_at: new Date() },
    });

    await this.catatRiwayat(idTransaksi, 'MENUNGGU', 'PROSES', currentUser.id_user, 'Mulai direviu');
    return this.getDetail(idTransaksi, currentUser);
  }

  async unlockReview(idTransaksi: string, currentUser: CurrentUser) {
    const transaksi = await this.prisma.transaksiSpop.findUnique({ where: { id_transaksi: idTransaksi } });
    if (!transaksi) throw new NotFoundException('Transaksi tidak ditemukan');
    if (transaksi.locked_by !== currentUser.id_user) {
      throw new ForbiddenException('Hanya verifikator yang mengunci yang bisa melepaskannya');
    }

    const updated = await this.prisma.transaksiSpop.update({
      where: { id_transaksi: idTransaksi },
      data: { status_ajuan: 'MENUNGGU', locked_by: null, locked_at: null },
    });

    await this.catatRiwayat(idTransaksi, 'PROSES', 'MENUNGGU', currentUser.id_user, 'Reviu dibatalkan/dilepas');
    return { success: true, data: updated };
  }

  private async autoReleaseExpiredLocks() {
    const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);
    const expiredLocks = await this.prisma.transaksiSpop.findMany({
      where: { status_ajuan: 'PROSES', locked_at: { lt: thirtyMinsAgo } },
    });
    if (expiredLocks.length === 0) return 0;
    const ids = expiredLocks.map(t => t.id_transaksi);
    await this.prisma.$transaction(async (tx) => {
      await tx.transaksiSpop.updateMany({
        where: { id_transaksi: { in: ids } },
        data: { status_ajuan: 'MENUNGGU', locked_by: null, locked_at: null },
      });
      for (const t of expiredLocks) {
        await tx.riwayatPelacakan.create({
          data: { id_transaksi: t.id_transaksi, status_lama: StatusAjuan.PROSES, status_baru: StatusAjuan.MENUNGGU, id_user: t.locked_by || '', catatan: 'Kunci dilepas otomatis (timeout 30 menit)' }
        });
      }
    });
    return ids.length;
  }

  async approve(idTransaksi: string, dto: VerifikasiBakeudaDto, currentUser: CurrentUser) {
    await this.pastikanSedangDireviuOleh(idTransaksi, currentUser);

    const transaksi = await this.prisma.transaksiSpop.findUnique({
      where: { id_transaksi: idTransaksi },
      include: { detail_asal: true, detail_tujuan: true, pengaju: true, lampiran: true },
    });
    if (!transaksi) throw new NotFoundException('Transaksi tidak ditemukan');

    if (transaksi.status_ajuan === 'DISETUJUI') throw new BadRequestException('Transaksi sudah disetujui sebelumnya');

    const hasil = await this.prisma.$transaction(async (tx) => {
      switch (transaksi.jenis_transaksi) {
        case 'BARU': return this.eksekusiBaru(tx, transaksi as any, currentUser, dto);
        case 'MUTASI': return this.eksekusiMutasi(tx, transaksi as any);
        case 'PERUBAHAN_DATA': return this.eksekusiPerubahanData(tx, transaksi as any);
        case 'PECAH': return this.eksekusiPecah(tx, transaksi as any, currentUser, dto);
        case 'GABUNG': return this.eksekusiGabung(tx, transaksi as any, currentUser, dto);
        case 'HAPUS': return this.eksekusiHapus(tx, transaksi as any, currentUser);
        default: throw new BadRequestException('Jenis transaksi tidak didukung');
      }
    }, { isolationLevel: 'Serializable' });

    await this.prisma.transaksiSpop.update({
      where: { id_transaksi: idTransaksi },
      data: { status_ajuan: 'DISETUJUI', id_verifikator: currentUser.id_user, verified_at: new Date(), locked_by: null, locked_at: null },
    });
    await this.catatRiwayat(idTransaksi, 'PROSES', 'DISETUJUI', currentUser.id_user, 'Disetujui, data dieksekusi');

    // WRITE-THROUGH KE ORACLE
    try {
      await this.syncToOracle(hasil);
    } catch (oracleError) {
      console.error("Gagal write-through ke Oracle:", oracleError);
      // Optional: Anda bisa memutuskan apakah kegagalan Oracle membatalkan transaksi Postgres
      // Untuk write-through strict, bisa di-throw error di sini. 
      // Saat ini kita biarkan sukses di Postgres, dan catat error.
      await this.catatRiwayat(idTransaksi, 'DISETUJUI', 'DISETUJUI', currentUser.id_user, 'WARNING: Sinkronisasi ke Oracle Gagal');
    }

    return { success: true, message: 'Transaksi disetujui dan data berhasil diproses', data: hasil };
  }

  /**
   * Helper untuk Write-Through ke Oracle
   */
  private async syncToOracle(hasilEksekusi: any) {
    const nopsToSync: string[] = [];

    if (hasilEksekusi.nop_baru) {
      if (Array.isArray(hasilEksekusi.nop_baru)) {
        nopsToSync.push(...hasilEksekusi.nop_baru);
      } else {
        nopsToSync.push(hasilEksekusi.nop_baru);
      }
    }
    if (hasilEksekusi.nop) {
      nopsToSync.push(hasilEksekusi.nop);
    }

    // Ambil data terbaru dari Prisma lalu push ke Oracle
    for (const nop of nopsToSync) {
      const objekPajak = await this.prisma.objekPajak.findUnique({
        where: { nop },
        include: { subjek_pajak: true }
      });

      if (objekPajak) {
        if (objekPajak.subjek_pajak) {
          await this.oracleWriteService.writeSubjekPajak(objekPajak.subjek_pajak);
        }
        await this.oracleWriteService.writeObjekPajak(objekPajak);
      }
    }
  }

  async tolak(idTransaksi: string, catatan: string, currentUser: CurrentUser) {
    await this.pastikanSedangDireviuOleh(idTransaksi, currentUser);
    const updated = await this.prisma.transaksiSpop.update({
      where: { id_transaksi: idTransaksi },
      data: { status_ajuan: 'DITOLAK', catatan_bakeuda: catatan, id_verifikator: currentUser.id_user, verified_at: new Date(), locked_by: null, locked_at: null },
    });
    await this.catatRiwayat(idTransaksi, 'PROSES', 'DITOLAK', currentUser.id_user, catatan);
    return { success: true, data: updated };
  }

  async mintaRevisi(idTransaksi: string, catatan: string, currentUser: CurrentUser) {
    await this.pastikanSedangDireviuOleh(idTransaksi, currentUser);

    const transaksi = await this.prisma.transaksiSpop.findUnique({
      where: { id_transaksi: idTransaksi },
      include: { detail_asal: true },
    });

    if (transaksi?.jenis_transaksi === 'HAPUS' && transaksi.detail_asal?.length > 0) {
      for (const asal of transaksi.detail_asal) {
        if (!asal.nop_asal) continue;
        const objek = await this.prisma.objekPajak.findUnique({ where: { nop: asal.nop_asal } });
        if (objek && !objek.status_aktif) {
          throw new BadRequestException(`NOP asal ${asal.nop_asal} sudah nonaktif. Transaksi HAPUS ini tidak dapat direvisi, silakan TOLAK ajuan ini.`);
        }
      }
    }

    const updated = await this.prisma.transaksiSpop.update({
      where: { id_transaksi: idTransaksi },
      data: { status_ajuan: 'REVISI', catatan_bakeuda: catatan, locked_by: null, locked_at: null },
    });
    await this.catatRiwayat(idTransaksi, 'PROSES', 'REVISI', currentUser.id_user, catatan);
    return { success: true, data: updated };
  }

  async kembalikanKeDraft(idTransaksi: string, currentUser: CurrentUser) {
    const transaksi = await this.prisma.transaksiSpop.findUnique({ where: { id_transaksi: idTransaksi } });
    if (!transaksi) throw new NotFoundException('Transaksi tidak ditemukan');
    if (transaksi.id_user !== currentUser.id_user) throw new ForbiddenException('Hanya pengaju yang bisa mengedit ulang');
    if (transaksi.status_ajuan !== 'REVISI') throw new BadRequestException('Transaksi tidak dalam status REVISI');

    const updated = await this.prisma.transaksiSpop.update({ where: { id_transaksi: idTransaksi }, data: { status_ajuan: 'DRAFT' } });
    await this.catatRiwayat(idTransaksi, 'REVISI', 'DRAFT', currentUser.id_user, 'Dikembalikan ke draft untuk diedit ulang');
    return { success: true, data: updated };
  }

  private async catatRiwayat(id_transaksi: string, status_lama: StatusAjuan | string | null, status_baru: StatusAjuan | string, id_user: string, catatan: string) {
    await this.prisma.riwayatPelacakan.create({
      data: { id_transaksi, status_lama: status_lama as StatusAjuan, status_baru: status_baru as StatusAjuan, id_user, catatan }
    });
  }

  private async pastikanSedangDireviuOleh(idTransaksi: string, currentUser: CurrentUser) {
    const t = await this.prisma.transaksiSpop.findUnique({ where: { id_transaksi: idTransaksi } });
    if (!t) throw new NotFoundException('Transaksi tidak ditemukan');
    if (t.status_ajuan !== 'PROSES') throw new BadRequestException('Transaksi harus berstatus PROSES');
    if (t.locked_by !== currentUser.id_user) throw new ForbiddenException('Hanya verifikator yang mengunci yang bisa memproses');
  }

  private validateJumlahDetail(jenis?: JenisTransaksi, asal?: any[], tujuan?: any[]) {
    if (!jenis) return; // Allow empty jenis_transaksi during early DRAFT creation
    const rules: Record<JenisTransaksi, { asal: [number, number]; tujuan: [number, number] }> = {
      BARU: { asal: [0, 0], tujuan: [1, 1] },
      MUTASI: { asal: [1, 1], tujuan: [1, 1] },
      PECAH: { asal: [1, 1], tujuan: [2, Infinity] },
      GABUNG: { asal: [2, Infinity], tujuan: [1, 1] },
      PERUBAHAN_DATA: { asal: [1, 1], tujuan: [1, 1] },
      HAPUS: { asal: [1, 1], tujuan: [0, 0] },
    };
    const rule = rules[jenis];
    const jumlahAsal = asal?.length ?? 0;
    const jumlahTujuan = tujuan?.length ?? 0;
    if (jumlahAsal < rule.asal[0] || jumlahAsal > rule.asal[1]) {
      throw new BadRequestException(`Jumlah detail asal tidak sesuai untuk transaksi ${jenis}`);
    }
    if (jumlahTujuan < rule.tujuan[0] || jumlahTujuan > rule.tujuan[1]) {
      throw new BadRequestException(`Jumlah detail tujuan tidak sesuai untuk transaksi ${jenis}`);
    }
  }

  /**
   * Hitung peringatan validasi selisih luas tanah — khusus PECAH.
   * Dipanggil dari submitPengajuan() DAN saveDraft() supaya tidak duplikasi logic.
   */
  private async hitungPeringatanValidasiLuas(dto: SubmitTransaksiDto): Promise<string | null> {
    if (dto.jenis_transaksi !== 'PECAH' || !dto.detail_asal?.length || !dto.detail_tujuan?.length) {
      return null;
    }

    const objekAsal = await this.prisma.objekPajak.findUnique({ where: { nop: dto.detail_asal[0].nop_asal } });
    if (!objekAsal) return null;

    const totalLuasTujuan = dto.detail_tujuan.reduce((sum, t) => sum + Number(t.luas_tanah_baru), 0);
    const hasil = validasiSelisihLuasPecah(Number(objekAsal.luas_tanah), totalLuasTujuan);

    return hasil.ada_selisih ? hasil.pesan : null;
  }

  private validateByJenisTransaksi(jenis: JenisTransaksi, dto: SubmitTransaksiDto) {
    const tujuan = dto.detail_tujuan?.[0];

    switch (jenis) {
      case 'BARU':
        if (!tujuan?.luas_tanah_baru || tujuan.luas_tanah_baru <= 0)
          throw new BadRequestException('Luas tanah wajib diisi untuk pendaftaran baru.');
        if (!tujuan?.jenis_tanah_baru)
          throw new BadRequestException('Jenis tanah wajib dipilih untuk pendaftaran baru.');
        if (!tujuan?.calon_subjek_json)
          throw new BadRequestException('Data subjek pajak wajib diisi.');
        break;

      case 'PECAH':
      case 'GABUNG':
        if (!dto.detail_tujuan?.length)
          throw new BadRequestException('Detail tujuan wajib ada untuk transaksi ini.');
        for (const t of dto.detail_tujuan) {
          if (!t.luas_tanah_baru || t.luas_tanah_baru <= 0)
            throw new BadRequestException('Luas tanah setiap tujuan wajib diisi.');
          if (!t.jenis_tanah_baru)
            throw new BadRequestException('Jenis tanah setiap tujuan wajib dipilih.');
        }
        break;

      case 'MUTASI':
        if (!tujuan?.calon_subjek_json)
          throw new BadRequestException('Data pemilik baru (subjek pajak) wajib diisi untuk mutasi.');
        break;

      case 'PERUBAHAN_DATA':
        if (!tujuan?.luas_tanah_baru || tujuan.luas_tanah_baru <= 0)
          throw new BadRequestException('Luas tanah wajib diisi untuk perubahan data.');
        break;

      case 'HAPUS':
        if (!dto.catatan_pengaju)
          throw new BadRequestException('Alasan penghapusan wajib diisi untuk transaksi hapus.');
        break;
    }
  }

  private shouldDeactivateAsal(jenisTransaksi: string): boolean {
    return ['PECAH', 'GABUNG', 'HAPUS'].includes(jenisTransaksi);
  }

  // --- EKSEKUSI DATA MASTER ---

  private async upsertSubjek(tx: Prisma.TransactionClient, t: any, transaksiUserId: string, fallbackKodeWilayah: string | null) {
    let nikSubjek = t.nik_calon_subjek;

    if (t.calon_subjek_json) {
      const subjekTemp = t.calon_subjek_json as any;
      const nikToSave = subjekTemp.nik || nikSubjek || '0000000000000000';
      await tx.subjekPajak.upsert({
        where: { nik: nikToSave },
        update: {
          nama_subjek: subjekTemp.nama_subjek || subjekTemp.nama || 'TANPA NAMA',
          pekerjaan: subjekTemp.pekerjaan || Pekerjaan.LAINNYA,
          status_wp: subjekTemp.status_wp || StatusWp.PEMILIK,
          npwp: subjekTemp.npwp,
          no_hp: subjekTemp.no_hp,
          email: subjekTemp.email,
          alamat_jalan: subjekTemp.alamat_jalan || subjekTemp.alamat || 'TANPA ALAMAT',
          blok_kav_no_subjek: subjekTemp.blok_kav_no_subjek,
          rt: subjekTemp.rt,
          rw: subjekTemp.rw,
          kode_wilayah: subjekTemp.kode_wilayah || fallbackKodeWilayah || '0000000000',
          kode_pos: subjekTemp.kode_pos,
        },
        create: {
          nik: nikToSave,
          nama_subjek: subjekTemp.nama_subjek || subjekTemp.nama || 'TANPA NAMA',
          pekerjaan: subjekTemp.pekerjaan || Pekerjaan.LAINNYA,
          status_wp: subjekTemp.status_wp || StatusWp.PEMILIK,
          npwp: subjekTemp.npwp,
          no_hp: subjekTemp.no_hp,
          email: subjekTemp.email,
          alamat_jalan: subjekTemp.alamat_jalan || subjekTemp.alamat || 'TANPA ALAMAT',
          blok_kav_no_subjek: subjekTemp.blok_kav_no_subjek,
          rt: subjekTemp.rt,
          rw: subjekTemp.rw,
          kode_wilayah: subjekTemp.kode_wilayah || fallbackKodeWilayah || '0000000000',
          kode_pos: subjekTemp.kode_pos,
          created_by: transaksiUserId,
        }
      });
      return nikToSave;
    }
    return nikSubjek || '0000000000000000';
  }

  private async upsertLspop(tx: Prisma.TransactionClient, t: any, finalNop: string, isMutasiAtauPerubahan: boolean) {
    if (t.data_bangunan_json && Array.isArray(t.data_bangunan_json)) {
      if (isMutasiAtauPerubahan) {
        await tx.objekBangunanFasilitas.deleteMany({
          where: { objek_bangunan: { nop: finalNop } }
        });
        await tx.objekBangunan.deleteMany({
          where: { nop: finalNop }
        });
      }

      let no_bng = 1;
      for (const bngRaw of t.data_bangunan_json as any[]) {
        const bng = bngRaw as any;
        // Skip pembuatan ulang data bangunan jika LSPOP ditandai sebagai Penghapusan
        if (bng.jenisTransaksi === 'Penghapusan Data' || bng.jenisTransaksi === 'PENGHAPUSAN' || bng.jenisTransaksi === 'HAPUS') {
          continue;
        }

        let kode_jpb = '01';
        if (bng.jenisPenggunaan === 'Perkantoran Swasta') kode_jpb = '02';
        else if (bng.jenisPenggunaan === 'Pabrik') kode_jpb = '03';
        else if (bng.jenisPenggunaan === 'Toko/Apotik/Pasar/Ruko') kode_jpb = '04';

        const existingJpb = await tx.referensiJenisPenggunaanBangunan.findUnique({ where: { kode_jpb } });
        if (!existingJpb) {
          const firstJpb = await tx.referensiJenisPenggunaanBangunan.findFirst();
          if (firstJpb) {
            kode_jpb = firstJpb.kode_jpb;
          } else {
            await tx.referensiJenisPenggunaanBangunan.create({
              data: { kode_jpb, nama_jpb: bng.jenisPenggunaan || 'Perumahan' }
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

        await tx.objekBangunanFasilitas.create({
          data: {
            id_bangunan: createdBng.id_bangunan,
            jumlah_ac_split: bng.acSplit ? parseInt(bng.acSplit) : 0,
            jumlah_ac_window: bng.acWindow ? parseInt(bng.acWindow) : 0,
            ac_sentral: bng.acSentral === '1' || bng.acSentral === 'Ada' || bng.acSentral === true,
            luas_kolam_renang: bng.kolamRenangLuas ? parseFloat(bng.kolamRenangLuas) : 0,
            kolam_diplester: bng.kolamRenangFinishing === 'Diplester',
            kolam_dengan_pelapis: bng.kolamRenangFinishing === 'Dengan Pelapis',
            perkerasan_ringan: bng.halamanRingan ? parseFloat(bng.halamanRingan) : 0,
            perkerasan_sedang: bng.halamanSedang ? parseFloat(bng.halamanSedang) : 0,
            perkerasan_berat: bng.halamanBerat ? parseFloat(bng.halamanBerat) : 0,
            perkerasan_dengan_penutup: bng.halamanPenutupLantai ? parseFloat(bng.halamanPenutupLantai) : 0,
            tenis_beton_dgn_lampu: bng.lapanganTenisLampuBeton ? parseInt(bng.lapanganTenisLampuBeton) : 0,
            tenis_beton_tanpa_lampu: bng.lapanganTenisTanpaLampuBeton ? parseInt(bng.lapanganTenisTanpaLampuBeton) : 0,
            tenis_aspal_dgn_lampu: bng.lapanganTenisLampuAspal ? parseInt(bng.lapanganTenisLampuAspal) : 0,
            tenis_aspal_tanpa_lampu: bng.lapanganTenisTanpaLampuAspal ? parseInt(bng.lapanganTenisTanpaLampuAspal) : 0,
            tenis_tanah_rumput_dgn_lampu: bng.lapanganTenisLampuTanah ? parseInt(bng.lapanganTenisLampuTanah) : 0,
            tenis_tanah_rumput_tanpa_lampu: bng.lapanganTenisTanpaLampuTanah ? parseInt(bng.lapanganTenisTanpaLampuTanah) : 0,
            lift_penumpang: bng.liftPenumpang ? parseInt(bng.liftPenumpang) : 0,
            lift_kapsul: bng.liftKapsul ? parseInt(bng.liftKapsul) : 0,
            lift_barang: bng.liftBarang ? parseInt(bng.liftBarang) : 0,
            tangga_berjalan_lbr_kurang_080m: bng.tanggaBerjalanKecil ? parseInt(bng.tanggaBerjalanKecil) : 0,
            tangga_berjalan_lbr_lebih_080m: bng.tanggaBerjalanBesar ? parseInt(bng.tanggaBerjalanBesar) : 0,
            panjang_pagar_m: bng.panjangPagar ? parseFloat(bng.panjangPagar) : 0,
            bahan_pagar: bng.bahanPagar === 'Bata/Batako' ? BahanPagar.BATA_BATAKO : (bng.bahanPagar === 'Baja/Besi' ? BahanPagar.BAJA_BESI : null),
            hydrant_ada: bng.pemadamHydrant === '1' || bng.pemadamHydrant === true,
            sprinkler_ada: bng.pemadamSprinkler === '1' || bng.pemadamSprinkler === true,
            fire_alarm_ada: bng.pemadamFireAl === '1' || bng.pemadamFireAl === true,
            jumlah_saluran_pabx: bng.saluranPabx ? parseInt(bng.saluranPabx) : 0,
            kedalaman_sumur_artesis_m: bng.sumurArtesis ? parseFloat(bng.sumurArtesis) : 0,
          }
        });
        no_bng++;
      }
    }
  }

  private async eksekusiBaru(tx: Prisma.TransactionClient, transaksi: TransaksiSpopWithDetail, currentUser: CurrentUser, dto: VerifikasiBakeudaDto) {
    const t = transaksi.detail_tujuan[0];
    const kodeWilayah = dto.kode_wilayah || (t as any).kode_wilayah_baru || transaksi.pengaju.kode_wilayah;
    const nikSubjek = await this.upsertSubjek(tx, t, transaksi.id_user, kodeWilayah);

    if (!kodeWilayah) throw new BadRequestException('Kode wilayah tidak ditemukan');
    if (!dto.kode_blok) throw new BadRequestException('Kode blok wajib diisi untuk penetapan NOP baru');
    if (!dto.kode_jenis_op) throw new BadRequestException('Kode jenis OP wajib diisi untuk penetapan NOP baru');

    const nop = await this.nopGenerator.generateNop({ kode_wilayah: kodeWilayah, kode_blok: dto.kode_blok, kode_jenis_op: dto.kode_jenis_op }, tx);

    const objek = await tx.objekPajak.create({
      data: {
        nop,
        kode_wilayah: kodeWilayah,
        kode_blok: dto.kode_blok,
        no_urut: nop.substring(13, 17),
        kode_jenis_op: dto.kode_jenis_op,
        nik_subjek: nikSubjek,
        no_persil: t.no_persil_baru,
        jalan_op: t.jalan_op_baru ?? '',
        blok_kav_no: t.blok_kav_no_baru,
        rw_op: t.rw_op_baru,
        rt_op: t.rt_op_baru,
        jenis_tanah: t.jenis_tanah_baru ?? 'TANAH_KOSONG' as any,
        luas_tanah: t.luas_tanah_baru,
        luas_bangunan: t.luas_bangunan_baru ?? 0,
        jumlah_bangunan: t.jumlah_bangunan_baru ?? 0,
        koordinat_polygon: t.koordinat_polygon as any,
        status_aktif: true,
      },
    });

    await this.upsertLspop(tx, t, nop, false);

    await tx.detailTransaksiTujuan.update({ where: { id_detail_tujuan: t.id_detail_tujuan }, data: { nop_generated: nop } });
    return { nop_baru: nop };
  }

  private async eksekusiMutasi(tx: Prisma.TransactionClient, transaksi: TransaksiSpopWithDetail) {
    const nopAsal = transaksi.detail_asal[0].nop_asal!;
    const t = transaksi.detail_tujuan[0];

    const nikBaru = await this.upsertSubjek(tx, t, transaksi.id_user, transaksi.pengaju.kode_wilayah);

    await tx.objekPajak.update({ where: { nop: nopAsal }, data: { nik_subjek: nikBaru } });

    // MUTASI: JANGAN sentuh bangunan/LSPOP
    // Bangunan mengikuti NOP secara otomatis via relasi FK.

    await tx.detailTransaksiTujuan.update({ where: { id_detail_tujuan: t.id_detail_tujuan }, data: { nop_generated: nopAsal } });
    return { nop: nopAsal, subjek_baru: nikBaru };
  }

  private async eksekusiPerubahanData(tx: Prisma.TransactionClient, transaksi: TransaksiSpopWithDetail) {
    const nopAsal = transaksi.detail_asal[0].nop_asal!;
    const t = transaksi.detail_tujuan[0];

    await tx.objekPajak.update({
      where: { nop: nopAsal },
      data: {
        luas_tanah: t.luas_tanah_baru,
        luas_bangunan: t.luas_bangunan_baru ?? undefined,
        jenis_tanah: t.jenis_tanah_baru ?? 'TANAH_KOSONG' as any,
        jalan_op: t.jalan_op_baru ?? undefined,
        koordinat_polygon: t.koordinat_polygon != null ? (t.koordinat_polygon as any) : undefined,
      },
    });

    await this.upsertLspop(tx, t, nopAsal, true);

    await tx.detailTransaksiTujuan.update({ where: { id_detail_tujuan: t.id_detail_tujuan }, data: { nop_generated: nopAsal } });
    return { nop: nopAsal };
  }

  private async eksekusiPecah(tx: Prisma.TransactionClient, transaksi: TransaksiSpopWithDetail, currentUser: CurrentUser, dto: VerifikasiBakeudaDto) {
    for (const asal of transaksi.detail_asal) {
      if (asal.nonaktifkan_saat_disetujui) {
        await tx.objekPajak.update({
          where: { nop: asal.nop_asal! },
          data: { status_aktif: false }
        });
      }
    }

    if (!dto.kode_blok) throw new BadRequestException('Kode blok wajib diisi untuk pemecahan NOP');
    if (!dto.kode_jenis_op) throw new BadRequestException('Kode jenis OP wajib diisi untuk pemecahan NOP');

    const hasilNop: string[] = [];
    for (const t of transaksi.detail_tujuan) {
      const kodeWilayah = dto.kode_wilayah || (t as any).kode_wilayah_baru || transaksi.pengaju.kode_wilayah;
      const nikSubjek = await this.upsertSubjek(tx, t, transaksi.id_user, kodeWilayah);

      if (!kodeWilayah) throw new BadRequestException('Kode wilayah tidak ditemukan');

      const nop = await this.nopGenerator.generateNop({ kode_wilayah: kodeWilayah, kode_blok: dto.kode_blok, kode_jenis_op: dto.kode_jenis_op }, tx);
      await tx.objekPajak.create({
        data: {
          nop,
          kode_wilayah: kodeWilayah,
          kode_blok: dto.kode_blok,
          no_urut: nop.substring(13, 17),
          kode_jenis_op: dto.kode_jenis_op,
          nik_subjek: nikSubjek,
          jalan_op: t.jalan_op_baru ?? '',
          jenis_tanah: t.jenis_tanah_baru ?? 'TANAH_KOSONG' as any,
          luas_tanah: t.luas_tanah_baru,
          luas_bangunan: t.luas_bangunan_baru ?? 0,
          koordinat_polygon: t.koordinat_polygon as any,
        },
      });

      await this.upsertLspop(tx, t, nop, false);

      await tx.detailTransaksiTujuan.update({ where: { id_detail_tujuan: t.id_detail_tujuan }, data: { nop_generated: nop } });
      hasilNop.push(nop);
    }
    return { nop_asal_dinonaktifkan: transaksi.detail_asal.map((a) => a.nop_asal), nop_baru: hasilNop };
  }

  // GABUNG — REVISI: luas tanah/bangunan dihitung OTOMATIS dari total NOP asal,
  // bukan lagi input manual DESA. Alamat tetap wajib diisi manual (data baru, sama
  // seperti transaksi BARU), tapi ada FALLBACK ke alamat NOP asal pertama kalau kosong.
  private async eksekusiGabung(tx: Prisma.TransactionClient, transaksi: TransaksiSpopWithDetail, currentUser: CurrentUser, dto: VerifikasiBakeudaDto) {
    // 1. Ambil data lengkap semua NOP asal SEBELUM dinonaktifkan — dipakai untuk auto-sum luas dan fallback alamat
    const semuaObjekAsal = await tx.objekPajak.findMany({
      where: { nop: { in: transaksi.detail_asal.map((a) => a.nop_asal!) } },
    });

    const totalLuasTanah = semuaObjekAsal.reduce((sum, o) => sum + Number(o.luas_tanah), 0);
    const totalLuasBangunan = semuaObjekAsal.reduce((sum, o) => sum + Number(o.luas_bangunan), 0);

    // Gunakan luas_tanah_baru dari input (yang sudah diauto-fill & diedit manual di FE) jika ada,
    // fallback ke perhitungan sum jika FE mengirim 0.
    const t = transaksi.detail_tujuan[0];
    const finalLuasTanah = (t.luas_tanah_baru != null && Number(t.luas_tanah_baru) > 0) ? Number(t.luas_tanah_baru) : totalLuasTanah;
    const finalLuasBangunan = (t.luas_bangunan_baru != null && Number(t.luas_bangunan_baru) > 0) ? Number(t.luas_bangunan_baru) : totalLuasBangunan;

    // Fallback alamat — pakai data dari NOP asal PERTAMA di array detail_asal
    const objekAsalPertama = semuaObjekAsal.find((o) => o.nop === transaksi.detail_asal[0].nop_asal);

    // 2. Nonaktifkan semua NOP asal
    for (const asal of transaksi.detail_asal) {
      if (asal.nonaktifkan_saat_disetujui) {
        await tx.objekPajak.update({
          where: { nop: asal.nop_asal! },
          data: { status_aktif: false }
        });
      }
    }

    if (!dto.kode_blok) throw new BadRequestException('Kode blok wajib diisi untuk penggabungan NOP');
    if (!dto.kode_jenis_op) throw new BadRequestException('Kode jenis OP wajib diisi untuk penggabungan NOP');

    // 3. Buat NOP baru hasil gabungan
    const kodeWilayah = dto.kode_wilayah || (t as any).kode_wilayah_baru || transaksi.pengaju.kode_wilayah;
    const nikSubjek = await this.upsertSubjek(tx, t, transaksi.id_user, kodeWilayah);

    if (!kodeWilayah) throw new BadRequestException('Kode wilayah tidak ditemukan');

    const nop = await this.nopGenerator.generateNop({ kode_wilayah: kodeWilayah, kode_blok: dto.kode_blok, kode_jenis_op: dto.kode_jenis_op }, tx);

    const objekBaru = await tx.objekPajak.create({
      data: {
        nop,
        kode_wilayah: kodeWilayah,
        kode_blok: dto.kode_blok,
        no_urut: nop.substring(13, 17),
        kode_jenis_op: dto.kode_jenis_op,
        nik_subjek: nikSubjek,
        jalan_op: t.jalan_op_baru || objekAsalPertama?.jalan_op || '',   // FALLBACK di sini
        blok_kav_no: t.blok_kav_no_baru || objekAsalPertama?.blok_kav_no || undefined,
        rw_op: t.rw_op_baru || objekAsalPertama?.rw_op || undefined,
        rt_op: t.rt_op_baru || objekAsalPertama?.rt_op || undefined,
        no_persil: t.no_persil_baru || undefined,
        jenis_tanah: t.jenis_tanah_baru!,
        luas_tanah: totalLuasTanah,       // ← AUTO-HITUNG, bukan lagi t.luas_tanah_baru
        luas_bangunan: totalLuasBangunan, // ← AUTO-HITUNG juga
      },
    });

    await this.upsertLspop(tx, t, nop, false);

    await tx.detailTransaksiTujuan.update({ where: { id_detail_tujuan: t.id_detail_tujuan }, data: { nop_generated: nop } });

    return {
      nop_asal_dinonaktifkan: transaksi.detail_asal.map((a) => a.nop_asal),
      nop_baru: nop,
      luas_tanah_hasil: finalLuasTanah,
      luas_bangunan_hasil: finalLuasBangunan,
      alamat_dipakai: objekBaru.jalan_op,
      alamat_dari_fallback: !t.jalan_op_baru,  // true kalau DESA tidak isi manual, dipakai dari fallback
    };
  }

  private async eksekusiHapus(tx: Prisma.TransactionClient, transaksi: TransaksiSpopWithDetail, currentUser: CurrentUser) {
    const asal = transaksi.detail_asal[0];
    if (!asal?.nop_asal) throw new BadRequestException('NOP asal wajib ada untuk transaksi HAPUS.');

    const objek = await tx.objekPajak.findUnique({ where: { nop: asal.nop_asal } });
    if (!objek) throw new BadRequestException(`NOP ${asal.nop_asal} tidak ditemukan.`);
    if (!objek.status_aktif) throw new BadRequestException(`NOP ${asal.nop_asal} sudah nonaktif.`);

    await tx.objekPajak.updateMany({
      where: { nop: asal.nop_asal, status_aktif: true },
      data: { status_aktif: false, nonaktif_oleh: currentUser.id_user, nonaktif_at: new Date() },
    });
    return { nop_dihapus: asal.nop_asal };
  }
}