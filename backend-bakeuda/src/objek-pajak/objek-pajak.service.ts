import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { NopGeneratorService } from '../lib/nop-generator.js';
import { CreateObjekPajakDto } from './dto/create-objek-pajak.dto.js';
import { UpdateObjekPajakDto } from './dto/update-objek-pajak.dto.js';
import { UpdateObjekBumiDto } from './dto/update-objek-bumi.dto.js';
import { UpdateObjekBangunanDto } from './dto/update-objek-bangunan.dto.js';
import { UpdateFasilitasBangunanDto } from './dto/update-fasilitas-bangunan.dto.js';

@Injectable()
export class ObjekPajakService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly nopGenerator: NopGeneratorService,
  ) {}

  // ─────────────────────────────────────────
  // CREATE — generate NOP + nested bumi/bangunan
  // ─────────────────────────────────────────

  async create(dto: CreateObjekPajakDto) {
    const subjek = await this.prisma.subjekPajak.findUnique({
      where: { nik: dto.nik_subjek },
    });
    if (!subjek)
      throw new BadRequestException('Subjek pajak (NIK) tidak ditemukan');

    const nop = await this.nopGenerator.generateNop({
      kode_propinsi: dto.kode_propinsi,
      kode_dati2: dto.kode_dati2,
      kode_kecamatan: dto.kode_kecamatan,
      kode_kelurahan: dto.kode_kelurahan,
      kode_blok: dto.kode_blok,
      kode_jenis_op: dto.kode_jenis_op,
    });

    // Hitung agregat dari bumi & bangunan
    const totalLuasTanah = dto.bumi.reduce((sum, b) => sum + b.luas_bumi, 0);
    const totalLuasBangunan = (dto.bangunan ?? []).reduce(
      (sum, b) => sum + b.luas_bangunan,
      0,
    );

    const objek = await this.prisma.objekPajak.create({
      data: {
        nop,
        kode_propinsi: dto.kode_propinsi,
        kode_dati2: dto.kode_dati2,
        kode_kecamatan: dto.kode_kecamatan,
        kode_kelurahan: dto.kode_kelurahan,
        kode_blok: dto.kode_blok,
        no_urut: nop.substring(13, 17),
        kode_jenis_op: dto.kode_jenis_op,
        nik_subjek: dto.nik_subjek,
        no_persil: dto.no_persil,
        jalan_op: dto.jalan_op,
        blok_kav_no: dto.blok_kav_no,
        rw_op: dto.rw_op,
        rt_op: dto.rt_op,
        kelurahan_op: dto.kelurahan_op,
        kecamatan_op: dto.kecamatan_op,
        jenis_tanah: dto.jenis_tanah,
        luas_tanah: totalLuasTanah,
        luas_bangunan: totalLuasBangunan,
        jumlah_bangunan: dto.bangunan?.length ?? 0,
        bumi: {
          create: dto.bumi.map((b, idx) => ({
            no_bumi: idx + 1,
            luas_bumi: b.luas_bumi,
            kode_znt: b.kode_znt,
            jenis_bumi: b.jenis_bumi,
            nilai_sistem_bumi: b.nilai_sistem_bumi ?? 0,
          })),
        },
        bangunan: dto.bangunan
          ? {
              create: dto.bangunan.map((b, idx) => ({
                no_bangunan: idx + 1,
                luas_bangunan: b.luas_bangunan,
                kode_jpb: b.kode_jpb,
                tahun_dibangun: b.tahun_dibangun,
                jumlah_lantai: b.jumlah_lantai ?? 1,
                daya_listrik_watt: b.daya_listrik_watt,
                kondisi_bangunan: b.kondisi_bangunan,
                fasilitas: b.fasilitas ? { create: b.fasilitas } : undefined,
              })),
            }
          : undefined,
      },
      include: { bumi: true, bangunan: { include: { fasilitas: true } } },
    });

    return {
      success: true,
      message: 'Objek pajak berhasil ditambahkan',
      data: objek,
    };
  }

  // ─────────────────────────────────────────
  // GET BY NOP
  // ─────────────────────────────────────────

  async getByNop(nop: string) {
    const objek = await this.prisma.objekPajak.findUnique({
      where: { nop },
      include: {
        subjek_pajak: { select: { nik: true, nama_subjek: true } },
        bumi: true,
        bangunan: { include: { fasilitas: true } },
      },
    });
    if (!objek) throw new NotFoundException('Objek pajak tidak ditemukan');
    return { success: true, data: objek };
  }

  // ─────────────────────────────────────────
  // SEARCH
  // ─────────────────────────────────────────

  async search(keyword: string) {
    const results = await this.prisma.objekPajak.findMany({
      where: {
        OR: [
          { nop: { contains: keyword } },
          { jalan_op: { contains: keyword, mode: 'insensitive' } },
          {
            subjek_pajak: {
              nama_subjek: { contains: keyword, mode: 'insensitive' },
            },
          },
        ],
      },
      include: { subjek_pajak: { select: { nama_subjek: true } } },
      take: 50,
    });
    return { success: true, total: results.length, data: results };
  }

  // ─────────────────────────────────────────
  // UPDATE HEADER OBJEK PAJAK (NJOP, alamat, dll)
  // ─────────────────────────────────────────

  async update(nop: string, dto: UpdateObjekPajakDto) {
    const existing = await this.prisma.objekPajak.findUnique({ where: { nop } });
    if (!existing) throw new NotFoundException('Objek pajak tidak ditemukan');
    if (!existing.status_aktif)
      throw new BadRequestException(
        'Objek pajak nonaktif, tidak bisa diupdate',
      );

    // Hitung ulang njop_total jika njop_tanah/njop_bangunan diupdate
    const njopTanah =
      dto.njop_tanah ?? Number(existing.njop_tanah ?? 0);
    const njopBangunan =
      dto.njop_bangunan ?? Number(existing.njop_bangunan ?? 0);
    const njopTotal =
      njopTanah * Number(existing.luas_tanah) +
      njopBangunan * Number(existing.luas_bangunan);

    const updated = await this.prisma.objekPajak.update({
      where: { nop },
      data: { ...dto, njop_total: njopTotal },
      include: { bumi: true, bangunan: true },
    });

    return {
      success: true,
      message: 'Objek pajak berhasil diupdate',
      data: updated,
    };
  }

  // ─────────────────────────────────────────
  // NONAKTIFKAN NOP
  // ─────────────────────────────────────────

  async nonaktifkan(nop: string, userId: string) {
    const objek = await this.prisma.objekPajak.findUnique({ where: { nop } });
    if (!objek) throw new NotFoundException('Objek pajak tidak ditemukan');
    if (!objek.status_aktif)
      throw new BadRequestException('Objek pajak sudah nonaktif');

    const updated = await this.prisma.objekPajak.update({
      where: { nop },
      data: {
        status_aktif: false,
        nonaktif_oleh: userId,
        nonaktif_at: new Date(),
      },
    });

    return {
      success: true,
      message: 'Objek pajak berhasil dinonaktifkan',
      data: updated,
    };
  }

  // ─────────────────────────────────────────
  // UPDATE DETAIL BUMI (per record, sinkron agregat luas_tanah)
  // ─────────────────────────────────────────

  async updateBumi(idBumi: string, dto: UpdateObjekBumiDto) {
    const existing = await this.prisma.objekBumi.findUnique({
      where: { id_bumi: idBumi },
    });
    if (!existing) throw new NotFoundException('Data bumi tidak ditemukan');

    const updated = await this.prisma.objekBumi.update({
      where: { id_bumi: idBumi },
      data: dto,
    });

    // Sinkronkan agregat luas_tanah di header ObjekPajak
    const semuaBumi = await this.prisma.objekBumi.findMany({
      where: { nop: existing.nop },
    });
    const totalLuas = semuaBumi.reduce(
      (sum, b) => sum + Number(b.luas_bumi),
      0,
    );
    await this.prisma.objekPajak.update({
      where: { nop: existing.nop },
      data: { luas_tanah: totalLuas },
    });

    return {
      success: true,
      message: 'Data bumi berhasil diupdate',
      data: updated,
    };
  }

  // ─────────────────────────────────────────
  // UPDATE DETAIL BANGUNAN (per record, sinkron agregat luas_bangunan)
  // ─────────────────────────────────────────

  async updateBangunan(idBangunan: string, dto: UpdateObjekBangunanDto) {
    const existing = await this.prisma.objekBangunan.findUnique({
      where: { id_bangunan: idBangunan },
    });
    if (!existing)
      throw new NotFoundException('Data bangunan tidak ditemukan');

    const updated = await this.prisma.objekBangunan.update({
      where: { id_bangunan: idBangunan },
      data: dto,
    });

    // Sinkronkan agregat luas_bangunan di header ObjekPajak
    const semuaBangunan = await this.prisma.objekBangunan.findMany({
      where: { nop: existing.nop },
    });
    const totalLuas = semuaBangunan.reduce(
      (sum, b) => sum + Number(b.luas_bangunan),
      0,
    );
    await this.prisma.objekPajak.update({
      where: { nop: existing.nop },
      data: { luas_bangunan: totalLuas },
    });

    return {
      success: true,
      message: 'Data bangunan berhasil diupdate',
      data: updated,
    };
  }

  // ─────────────────────────────────────────
  // UPSERT FASILITAS BANGUNAN (1-to-1 dengan ObjekBangunan)
  // ─────────────────────────────────────────

  async updateFasilitasBangunan(
    idBangunan: string,
    dto: UpdateFasilitasBangunanDto,
  ) {
    const bangunan = await this.prisma.objekBangunan.findUnique({
      where: { id_bangunan: idBangunan },
    });
    if (!bangunan)
      throw new NotFoundException('Objek bangunan tidak ditemukan');

    // Pakai upsert karena fasilitas opsional — bangunan sederhana
    // mungkin belum punya record fasilitas sampai pertama kali diisi
    const updated = await this.prisma.objekBangunanFasilitas.upsert({
      where: { id_bangunan: idBangunan },
      create: { id_bangunan: idBangunan, ...dto },
      update: dto,
    });

    return {
      success: true,
      message: 'Fasilitas bangunan berhasil diupdate',
      data: updated,
    };
  }
}
