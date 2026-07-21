import { Injectable, BadRequestException, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { NopGeneratorService } from '../lib/nop-generator.js';
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
  JenisLangitLangit 
} from '@prisma/client';
import { SubmitTransaksiDto } from './dto/submit-transaksi.dto.js';
import { CurrentUser, assertWilayahAccess } from '../common/wilayah-scope.helper.js';

type TransaksiSpopWithDetail = Prisma.TransaksiSpopGetPayload<{
  include: { detail_asal: true; detail_tujuan: true; lampiran: true; pengaju: true }
}>;

@Injectable()
export class TransaksiSpopService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly nopGenerator: NopGeneratorService,
  ) {}

  async submitPengajuan(dto: SubmitTransaksiDto, currentUser: CurrentUser, asDraft: boolean) {
    this.validateJumlahDetail(dto.jenis_transaksi, dto.detail_asal, dto.detail_tujuan);
    if (!asDraft && dto.jenis_transaksi) {
      this.validateByJenisTransaksi(dto.jenis_transaksi, dto);
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
           const wil = await this.prisma.wilayah.findUnique({ where: { kode_wilayah: tujuan.kode_wilayah_baru }});
           if (!wil) throw new BadRequestException(`Kode wilayah ${tujuan.kode_wilayah_baru} tidak ditemukan`);
        }
      }
    }

    const statusAjuan = asDraft ? 'DRAFT' : 'MENUNGGU';

    let transaksi;
    try {
      transaksi = await this.prisma.transaksiSpop.create({
        data: {
          id_user: currentUser.id_user,
          tahun_pajak: dto.tahun_pajak as number,
          jenis_transaksi: dto.jenis_transaksi as JenisTransaksi,
          no_sppt_lama: dto.no_sppt_lama,
          nama_pengaju: dto.nama_pengaju,
          no_formulir: dto.no_formulir,
          nop_bersama: dto.nop_bersama,
          menggunakan_kuasa: dto.menggunakan_kuasa ?? false,
          tanggal_pengajuan: new Date(dto.tanggal_pengajuan as string),
          status_ajuan: statusAjuan,
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
              jenis_tanah_baru: t.jenis_tanah_baru ?? 'TANAH_KOSONG',
              calon_subjek_json: t.calon_subjek_json as any,
              data_bangunan_json: t.data_bangunan_json as any
            }))
          } : undefined,
          lampiran: dto.lampiran ? {
            create: dto.lampiran.map((l) => ({
              ...l,
              uploaded_by: currentUser.id_user
            }))
          } : undefined
        },
        include: { detail_asal: true, detail_tujuan: true },
      });
    } catch (error) {
      throw new BadRequestException('PRISMA ERROR: ' + error.message);
    }

    await this.catatRiwayat(transaksi.id_transaksi, null, transaksi.status_ajuan, currentUser.id_user, 'Pengajuan dibuat');

    return { success: true, message: 'Pengajuan berhasil dibuat', data: transaksi };
  }

  async saveDraft(id_transaksi: string, dto: SubmitTransaksiDto, currentUser: CurrentUser) {
    const existing = await this.prisma.transaksiSpop.findUnique({ where: { id_transaksi }});
    if (!existing) throw new NotFoundException('Transaksi tidak ditemukan');
    if (existing.id_user !== currentUser.id_user && currentUser.role !== 'BAKEUDA') {
       throw new ForbiddenException('Akses ditolak');
    }
    if (existing.status_ajuan !== 'DRAFT' && existing.status_ajuan !== 'REVISI') {
       throw new BadRequestException('Hanya pengajuan berstatus DRAFT atau REVISI yang bisa diupdate');
    }

    this.validateJumlahDetail(dto.jenis_transaksi, dto.detail_asal, dto.detail_tujuan);

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
            tanggal_pengajuan: new Date(dto.tanggal_pengajuan as string),
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
                jenis_tanah_baru: t.jenis_tanah_baru ?? 'TANAH_KOSONG',
                calon_subjek_json: t.calon_subjek_json as any,
                data_bangunan_json: t.data_bangunan_json as any
              }))
            } : undefined,
            lampiran: dto.lampiran ? {
              create: dto.lampiran.map((l) => ({
                ...l,
                uploaded_by: currentUser.id_user
              }))
            } : undefined
          }
        });
      });
    } catch (error) {
      throw new BadRequestException('PRISMA ERROR: ' + error.message);
    }

    const updated = await this.prisma.transaksiSpop.findUnique({
      where: { id_transaksi },
      include: { detail_asal: true, detail_tujuan: true }
    });

    return { success: true, message: 'Draft berhasil diupdate', data: updated };
  }

  async finalisasiSubmit(idTransaksi: string, currentUser: CurrentUser) {
    const transaksi = await this.prisma.transaksiSpop.findUnique({
      where: { id_transaksi: idTransaksi },
      include: { pengaju: true },
    });

    if (!transaksi) throw new NotFoundException('Pengajuan tidak ditemukan');
    if (transaksi.status_ajuan !== 'DRAFT') {
      throw new BadRequestException('Hanya dokumen berstatus DRAFT yang dapat disubmit');
    }
    if (transaksi.pengaju.kode_wilayah !== currentUser.kode_wilayah && currentUser.role !== 'BAKEUDA') {
      throw new ForbiddenException('Akses ditolak');
    }

    const updated = await this.prisma.transaksiSpop.update({
      where: { id_transaksi: idTransaksi },
      data: { status_ajuan: 'MENUNGGU' },
    });

    await this.catatRiwayat(idTransaksi, 'DRAFT', 'MENUNGGU', currentUser.id_user, 'Berkas disubmit dan menunggu verifikasi');

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
    } else if (query.kode_wilayah) {
      where.pengaju = { kode_wilayah: query.kode_wilayah };
    }

    const result = await this.prisma.transaksiSpop.findMany({
      where,
      include: {
        detail_tujuan: true,
        pengaju: { select: { nama_lengkap: true, kode_wilayah: true } },
        reviewer: { select: { nama_lengkap: true } }
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
        detail_asal: true,
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

    return { success: true, data: transaksi };
  }

  async getStats(kode_wilayah?: string) {
    const baseWhere = kode_wilayah ? { pengaju: { kode_wilayah } } : {};

    const [totalDikirim, menunggu, disetujui, perluPerbaikan] = await Promise.all([
      this.prisma.transaksiSpop.count({ where: { ...baseWhere, status_ajuan: { not: StatusAjuan.DRAFT } } }),
      this.prisma.transaksiSpop.count({ where: { ...baseWhere, status_ajuan: StatusAjuan.MENUNGGU } }),
      this.prisma.transaksiSpop.count({ where: { ...baseWhere, status_ajuan: StatusAjuan.DISETUJUI } }),
      this.prisma.transaksiSpop.count({ where: { ...baseWhere, status_ajuan: StatusAjuan.REVISI } })
    ]);

    return { success: true, data: { totalDikirim, menunggu, disetujui, perluPerbaikan } };
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

    const updated = await this.prisma.transaksiSpop.update({
      where: { id_transaksi: idTransaksi },
      data: { status_ajuan: 'PROSES', locked_by: currentUser.id_user, locked_at: new Date() },
    });

    await this.catatRiwayat(idTransaksi, 'MENUNGGU', 'PROSES', currentUser.id_user, 'Mulai direviu');
    return { success: true, data: updated };
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
      for (const id of ids) {
        await tx.riwayatPelacakan.create({
          data: { id_transaksi: id, status_lama: StatusAjuan.PROSES, status_baru: StatusAjuan.MENUNGGU, id_user: 'system', catatan: 'Kunci dilepas otomatis (timeout 30 menit)' }
        });
      }
    });
    return ids.length;
  }

  async approve(idTransaksi: string, currentUser: CurrentUser) {
    await this.pastikanSedangDireviuOleh(idTransaksi, currentUser);
    
    const transaksi = await this.prisma.transaksiSpop.findUnique({
      where: { id_transaksi: idTransaksi },
      include: { detail_asal: true, detail_tujuan: true, pengaju: true, lampiran: true },
    });
    if (!transaksi) throw new NotFoundException('Transaksi tidak ditemukan');

    const hasil = await this.prisma.$transaction(async (tx) => {
      switch (transaksi.jenis_transaksi) {
        case 'BARU': return this.eksekusiBaru(tx, transaksi as any, currentUser);
        case 'MUTASI': return this.eksekusiMutasi(tx, transaksi as any);
        case 'PERUBAHAN_DATA': return this.eksekusiPerubahanData(tx, transaksi as any);
        case 'PECAH': return this.eksekusiPecah(tx, transaksi as any, currentUser);
        case 'GABUNG': return this.eksekusiGabung(tx, transaksi as any, currentUser);
        case 'HAPUS': return this.eksekusiHapus(tx, transaksi as any, currentUser);
        default: throw new BadRequestException('Jenis transaksi tidak didukung');
      }
    }, { isolationLevel: 'Serializable' });

    await this.prisma.transaksiSpop.update({
      where: { id_transaksi: idTransaksi },
      data: { status_ajuan: 'DISETUJUI', id_verifikator: currentUser.id_user, verified_at: new Date(), locked_by: null, locked_at: null },
    });
    await this.catatRiwayat(idTransaksi, 'PROSES', 'DISETUJUI', currentUser.id_user, 'Disetujui, data dieksekusi');

    return { success: true, message: 'Transaksi disetujui dan data berhasil diproses', data: hasil };
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

  private async upsertSubjek(tx: Prisma.TransactionClient, t: any, transaksiUserId: string) {
    let nikSubjek = t.nik_calon_subjek;
    if (!nikSubjek && t.calon_subjek_json) {
      const subjekTemp = t.calon_subjek_json as any;
      const nikToSave = subjekTemp.nik || '0000000000000000';
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
          kode_wilayah: subjekTemp.kode_wilayah || '0000000000',
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
          kode_wilayah: subjekTemp.kode_wilayah || '0000000000',
          kode_pos: subjekTemp.kode_pos,
          created_by: transaksiUserId,
        }
      });
      nikSubjek = nikToSave;
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
            ac_sentral: bng.acSentral === 'Ada',
            luas_kolam_renang: bng.kolamRenangLuas ? parseFloat(bng.kolamRenangLuas) : 0,
            kolam_diplester: bng.kolamRenangFinishing === 'Diplester',
          }
        });
        no_bng++;
      }
    }
  }

  private async eksekusiBaru(tx: Prisma.TransactionClient, transaksi: TransaksiSpopWithDetail, currentUser: CurrentUser) {
    const t = transaksi.detail_tujuan[0];
    const nikSubjek = await this.upsertSubjek(tx, t, transaksi.id_user);

    const kodeWilayah = (t as any).kode_wilayah_baru || transaksi.pengaju.kode_wilayah;
    if (!kodeWilayah) throw new BadRequestException('Kode wilayah tidak ditemukan');
    
    const nop = await this.nopGenerator.generateNop({ kode_wilayah: kodeWilayah, kode_blok: (t as any).kode_blok_baru || '001', kode_jenis_op: '1' }, tx);

    const objek = await tx.objekPajak.create({
      data: {
        nop,
        kode_wilayah: kodeWilayah,
        kode_blok: (t as any).kode_blok_baru || '001',
        no_urut: nop.substring(13, 17),
        kode_jenis_op: '1',
        nik_subjek: nikSubjek,
        no_persil: t.no_persil_baru,
        jalan_op: t.jalan_op_baru ?? '',
        blok_kav_no: t.blok_kav_no_baru,
        rw_op: t.rw_op_baru,
        rt_op: t.rt_op_baru,
        jenis_tanah: t.jenis_tanah_baru,
        luas_tanah: t.luas_tanah_baru,
        luas_bangunan: t.luas_bangunan_baru ?? 0,
        jumlah_bangunan: t.jumlah_bangunan_baru ?? 0,
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

    const nikBaru = await this.upsertSubjek(tx, t, transaksi.id_user);

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
        jenis_tanah: t.jenis_tanah_baru,
        jalan_op: t.jalan_op_baru ?? undefined,
      },
    });

    await this.upsertLspop(tx, t, nopAsal, true);

    await tx.detailTransaksiTujuan.update({ where: { id_detail_tujuan: t.id_detail_tujuan }, data: { nop_generated: nopAsal } });
    return { nop: nopAsal };
  }

  private async eksekusiPecah(tx: Prisma.TransactionClient, transaksi: TransaksiSpopWithDetail, currentUser: CurrentUser) {
    const asal = transaksi.detail_asal[0];
    await tx.objekPajak.update({
      where: { nop: asal.nop_asal! },
      data: { status_aktif: false, nonaktif_oleh: currentUser.id_user, nonaktif_at: new Date() },
    });

    const hasilNop: string[] = [];
    for (const t of transaksi.detail_tujuan) {
      const nikSubjek = await this.upsertSubjek(tx, t, transaksi.id_user);
      
      const kodeWilayah = (t as any).kode_wilayah_baru || transaksi.pengaju.kode_wilayah;
      if (!kodeWilayah) throw new BadRequestException('Kode wilayah tidak ditemukan');
      
      const nop = await this.nopGenerator.generateNop({ kode_wilayah: kodeWilayah, kode_blok: (t as any).kode_blok_baru || '001', kode_jenis_op: '1' }, tx);
      await tx.objekPajak.create({
        data: {
          nop,
          kode_wilayah: kodeWilayah,
          kode_blok: (t as any).kode_blok_baru || '001',
          no_urut: nop.substring(13, 17),
          kode_jenis_op: '1',
          nik_subjek: nikSubjek,
          jalan_op: t.jalan_op_baru ?? '',
          jenis_tanah: t.jenis_tanah_baru,
          luas_tanah: t.luas_tanah_baru,
          luas_bangunan: t.luas_bangunan_baru ?? 0,
        },
      });

      await this.upsertLspop(tx, t, nop, false);

      await tx.detailTransaksiTujuan.update({ where: { id_detail_tujuan: t.id_detail_tujuan }, data: { nop_generated: nop } });
      hasilNop.push(nop);
    }
    return { nop_asal_dinonaktifkan: asal.nop_asal, nop_baru: hasilNop };
  }

  private async eksekusiGabung(tx: Prisma.TransactionClient, transaksi: TransaksiSpopWithDetail, currentUser: CurrentUser) {
    for (const asal of transaksi.detail_asal) {
      await tx.objekPajak.update({
        where: { nop: asal.nop_asal! },
        data: { status_aktif: false, nonaktif_oleh: currentUser.id_user, nonaktif_at: new Date() },
      });
    }

    const t = transaksi.detail_tujuan[0];
    const nikSubjek = await this.upsertSubjek(tx, t, transaksi.id_user);
    
    const kodeWilayah = (t as any).kode_wilayah_baru || transaksi.pengaju.kode_wilayah;
    if (!kodeWilayah) throw new BadRequestException('Kode wilayah tidak ditemukan');
      
    const nop = await this.nopGenerator.generateNop({ kode_wilayah: kodeWilayah, kode_blok: (t as any).kode_blok_baru || '001', kode_jenis_op: '1' }, tx);
    await tx.objekPajak.create({
      data: {
        nop,
        kode_wilayah: kodeWilayah,
        kode_blok: (t as any).kode_blok_baru || '001',
        no_urut: nop.substring(13, 17),
        kode_jenis_op: '1',
        nik_subjek: nikSubjek,
        jalan_op: t.jalan_op_baru ?? '',
        jenis_tanah: t.jenis_tanah_baru,
        luas_tanah: t.luas_tanah_baru,
        luas_bangunan: t.luas_bangunan_baru ?? 0,
      },
    });

    await this.upsertLspop(tx, t, nop, false);

    await tx.detailTransaksiTujuan.update({ where: { id_detail_tujuan: t.id_detail_tujuan }, data: { nop_generated: nop } });
    return { nop_asal_dinonaktifkan: transaksi.detail_asal.map((a) => a.nop_asal), nop_baru: nop };
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
