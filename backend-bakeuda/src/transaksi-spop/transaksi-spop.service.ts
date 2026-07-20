import { Injectable, BadRequestException, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { NopGeneratorService } from '../lib/nop-generator.js';
import { StatusAjuan, JenisTransaksi, Prisma, TransaksiSpop, Pekerjaan, StatusWp } from '@prisma/client';
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

    // Kalau ada detail_asal, pastikan semua NOP asal itu ada dan di wilayah user (kalau DESA)
    if (dto.detail_asal?.length) {
      for (const asal of dto.detail_asal) {
        const objek = await this.prisma.objekPajak.findUnique({ where: { nop: asal.nop_asal } });
        if (!objek) throw new BadRequestException(`NOP asal ${asal.nop_asal} tidak ditemukan`);
        if (!objek.status_aktif) throw new BadRequestException(`NOP asal ${asal.nop_asal} sudah nonaktif, tidak bisa diajukan transaksi`);
        assertWilayahAccess(currentUser, objek.kode_wilayah);
      }
    }

    // Untuk BARU dan PECAH, pastikan ada kode_wilayah_baru
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

    const transaksi = await this.prisma.transaksiSpop.create({
      data: {
        id_user: currentUser.id_user,
        tahun_pajak: dto.tahun_pajak,
        jenis_transaksi: dto.jenis_transaksi,
        no_sppt_lama: dto.no_sppt_lama,
        nama_pengaju: dto.nama_pengaju,
        no_formulir: dto.no_formulir,
        nop_bersama: dto.nop_bersama,
        menggunakan_kuasa: dto.menggunakan_kuasa ?? false,
        tanggal_pengajuan: new Date(dto.tanggal_pengajuan),
        status_ajuan: statusAjuan,
        detail_asal: dto.detail_asal ? {
          create: dto.detail_asal.map((a) => ({
            nop_asal: a.nop_asal,
            nonaktifkan_saat_disetujui: a.nonaktifkan_saat_disetujui ?? true
          }))
        } : undefined,
        detail_tujuan: dto.detail_tujuan ? {
          create: dto.detail_tujuan.map((t) => ({
            ...t,
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

    await this.catatRiwayat(transaksi.id_transaksi, null, transaksi.status_ajuan, currentUser.id_user, 'Pengajuan dibuat');

    return { success: true, message: 'Pengajuan berhasil dibuat', data: transaksi };
  }

  // Update existing draft
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

    await this.prisma.$transaction(async (tx) => {
      await tx.detailTransaksiTujuan.deleteMany({ where: { id_transaksi } });
      await tx.detailTransaksiAsal.deleteMany({ where: { id_transaksi } });
      await tx.lampiranDokumen.deleteMany({ where: { id_transaksi } });

      await tx.transaksiSpop.update({
        where: { id_transaksi },
        data: {
          tahun_pajak: dto.tahun_pajak,
          jenis_transaksi: dto.jenis_transaksi,
          no_sppt_lama: dto.no_sppt_lama,
          nama_pengaju: dto.nama_pengaju,
          no_formulir: dto.no_formulir,
          nop_bersama: dto.nop_bersama,
          menggunakan_kuasa: dto.menggunakan_kuasa ?? false,
          tanggal_pengajuan: new Date(dto.tanggal_pengajuan),
          detail_asal: dto.detail_asal ? {
            create: dto.detail_asal.map((a) => ({
              nop_asal: a.nop_asal,
              nonaktifkan_saat_disetujui: a.nonaktifkan_saat_disetujui ?? true
            }))
          } : undefined,
          detail_tujuan: dto.detail_tujuan ? {
            create: dto.detail_tujuan.map((t) => ({
              ...t,
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
        riwayat: { orderBy: { created_at: 'asc' }, include: { user: { select: { nama_lengkap: true } } } },
        reviewer: { select: { nama_lengkap: true } }
      },
    });

    if (!transaksi) throw new NotFoundException('Detail transaksi tidak ditemukan');
    if (currentUser.role === 'DESA' && transaksi.pengaju.kode_wilayah !== currentUser.kode_wilayah) {
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
      return this.getDetail(idTransaksi, currentUser); // Re-entry
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
          data: { id_transaksi: id, status_lama: 'PROSES', status_baru: 'MENUNGGU', id_user: 'system', catatan: 'Kunci dilepas otomatis (timeout 30 menit)' }
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

  private async catatRiwayat(id_transaksi: string, status_lama: StatusAjuan | null, status_baru: StatusAjuan, id_user: string, catatan: string) {
    await this.prisma.riwayatPelacakan.create({
      data: { id_transaksi, status_lama, status_baru, id_user, catatan }
    });
  }

  private async pastikanSedangDireviuOleh(idTransaksi: string, currentUser: CurrentUser) {
    const t = await this.prisma.transaksiSpop.findUnique({ where: { id_transaksi: idTransaksi } });
    if (!t) throw new NotFoundException('Transaksi tidak ditemukan');
    if (t.status_ajuan !== 'PROSES') throw new BadRequestException('Transaksi harus berstatus PROSES');
    if (t.locked_by !== currentUser.id_user) throw new ForbiddenException('Hanya verifikator yang mengunci yang bisa memproses');
  }

  private validateJumlahDetail(jenis: JenisTransaksi, asal?: any[], tujuan?: any[]) {
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

  private async eksekusiBaru(tx: Prisma.TransactionClient, transaksi: TransaksiSpopWithDetail, currentUser: CurrentUser) {
    const t = transaksi.detail_tujuan[0];
    const nikSubjek = await this.upsertSubjek(tx, t, transaksi.id_user);

    const kodeWilayah = t.kode_wilayah_baru || transaksi.pengaju.kode_wilayah;
    if (!kodeWilayah) throw new BadRequestException('Kode wilayah tidak ditemukan');
    
    const nop = await this.nopGenerator.generateNop({ kode_wilayah: kodeWilayah, kode_blok: t.kode_blok_baru || '001', kode_jenis_op: '1' }, tx);

    const objek = await tx.objekPajak.create({
      data: {
        nop,
        kode_wilayah: kodeWilayah,
        kode_blok: t.kode_blok_baru || '001',
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

    await tx.detailTransaksiTujuan.update({ where: { id_detail_tujuan: t.id_detail_tujuan }, data: { nop_generated: nop } });
    return { nop_baru: nop };
  }

  private async eksekusiMutasi(tx: Prisma.TransactionClient, transaksi: TransaksiSpopWithDetail) {
    const nopAsal = transaksi.detail_asal[0].nop_asal!;
    const t = transaksi.detail_tujuan[0];

    const nikBaru = await this.upsertSubjek(tx, t, transaksi.id_user);

    await tx.objekPajak.update({ where: { nop: nopAsal }, data: { nik_subjek: nikBaru } });
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
      
      const kodeWilayah = t.kode_wilayah_baru || transaksi.pengaju.kode_wilayah;
      if (!kodeWilayah) throw new BadRequestException('Kode wilayah tidak ditemukan');
      
      const nop = await this.nopGenerator.generateNop({ kode_wilayah: kodeWilayah, kode_blok: t.kode_blok_baru || '001', kode_jenis_op: '1' }, tx);
      await tx.objekPajak.create({
        data: {
          nop,
          kode_wilayah: kodeWilayah,
          kode_blok: t.kode_blok_baru || '001',
          no_urut: nop.substring(13, 17),
          kode_jenis_op: '1',
          nik_subjek: nikSubjek,
          jalan_op: t.jalan_op_baru ?? '',
          jenis_tanah: t.jenis_tanah_baru,
          luas_tanah: t.luas_tanah_baru,
          luas_bangunan: t.luas_bangunan_baru ?? 0,
        },
      });
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
    
    const kodeWilayah = t.kode_wilayah_baru || transaksi.pengaju.kode_wilayah;
    if (!kodeWilayah) throw new BadRequestException('Kode wilayah tidak ditemukan');
      
    const nop = await this.nopGenerator.generateNop({ kode_wilayah: kodeWilayah, kode_blok: t.kode_blok_baru || '001', kode_jenis_op: '1' }, tx);
    await tx.objekPajak.create({
      data: {
        nop,
        kode_wilayah: kodeWilayah,
        kode_blok: t.kode_blok_baru || '001',
        no_urut: nop.substring(13, 17),
        kode_jenis_op: '1',
        nik_subjek: nikSubjek,
        jalan_op: t.jalan_op_baru ?? '',
        jenis_tanah: t.jenis_tanah_baru,
        luas_tanah: t.luas_tanah_baru,
        luas_bangunan: t.luas_bangunan_baru ?? 0,
      },
    });
    await tx.detailTransaksiTujuan.update({ where: { id_detail_tujuan: t.id_detail_tujuan }, data: { nop_generated: nop } });
    return { nop_asal_dinonaktifkan: transaksi.detail_asal.map((a) => a.nop_asal), nop_baru: nop };
  }

  private async eksekusiHapus(tx: Prisma.TransactionClient, transaksi: TransaksiSpopWithDetail, currentUser: CurrentUser) {
    const asal = transaksi.detail_asal[0];
    await tx.objekPajak.update({
      where: { nop: asal.nop_asal! },
      data: { status_aktif: false, nonaktif_oleh: currentUser.id_user, nonaktif_at: new Date() },
    });
    return { nop_dihapus: asal.nop_asal };
  }
}
