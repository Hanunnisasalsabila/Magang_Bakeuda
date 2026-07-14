import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateSubjekPajakDto } from './dto/create-subjek-pajak.dto.js';
import { UpdateSubjekPajakDto } from './dto/update-subjek-pajak.dto.js';

@Injectable()
export class SubjekPajakService {
  constructor(private readonly prisma: PrismaService) {}

  // ─────────────────────────────────────────
  // CREATE
  // ─────────────────────────────────────────

async create(dto: CreateSubjekPajakDto, createdBy: string) {
  const existing = await this.prisma.subjekPajak.findUnique({
    where: { nik: dto.nik },
  });

  if (existing) {
    throw new ConflictException('NIK sudah terdaftar');
  }

  const subjek = await this.prisma.subjekPajak.create({
    data: {
      ...dto,
      created_by: createdBy,
    },
    include: {
      user: {
        select: {
          nama_lengkap: true,
        },
      },
    },
  });

  return {
    success: true,
    message: 'Subjek pajak berhasil ditambahkan',
    data: {
      nik: subjek.nik,
      legacy_subjek_id: subjek.legacy_subjek_id,
      nama_subjek: subjek.nama_subjek,
      status_wp: subjek.status_wp,
      pekerjaan: subjek.pekerjaan,
      npwp: subjek.npwp,
      npwpd: subjek.npwpd,
      no_hp: subjek.no_hp, 
      email: subjek.email,
      alamat_jalan: subjek.alamat_jalan,
      blok_kav_no_subjek: subjek.blok_kav_no_subjek,
      rw: subjek.rw,
      rt: subjek.rt,
      kelurahan: subjek.kelurahan,
      kecamatan: subjek.kecamatan,
      kabupaten: subjek.kabupaten,
      kode_pos: subjek.kode_pos,
      created_at: subjek.created_at,
      updated_at: subjek.updated_at,

      dibuat_oleh: subjek.user.nama_lengkap,
    },
  };
}
  // ─────────────────────────────────────────
  // GET BY NIK
  // ─────────────────────────────────────────

  async getByNik(nik: string) {
    const subjek = await this.prisma.subjekPajak.findUnique({
      where: { nik },
      include: {
        user: { select: { nama_lengkap: true } },
        objek_pajak: {
          select: { nop: true, jalan_op: true, status_aktif: true },
        },
      },
    });
    if (!subjek) throw new NotFoundException('Subjek pajak tidak ditemukan');
      const { user, created_by, ...rest } = subjek;

  return {
    success: true,
    data: {
      ...rest,
      dibuat_oleh: user?.nama_lengkap ?? null,
    },
  };
  }

  // ─────────────────────────────────────────
  // SEARCH
  // ─────────────────────────────────────────

  async search(keyword: string) {
    const results = await this.prisma.subjekPajak.findMany({
      where: {
        OR: [
          { nik: { contains: keyword } },
          { nama_subjek: { contains: keyword, mode: 'insensitive' } },
          { alamat_jalan: { contains: keyword, mode: 'insensitive' } },
        ],
      },
      include: {
      user: {
        select: { nama_lengkap: true },
      },
    },
      take: 50,
      orderBy: { nama_subjek: 'asc' },
    });
    return results.map(({ user, created_by, ...rest }) => ({
    ...rest,
    dibuat_oleh: user?.nama_lengkap ?? null,
  }));
  }

  // ─────────────────────────────────────────
  // UPDATE
  // ─────────────────────────────────────────

  async update(nik: string, dto: UpdateSubjekPajakDto) {
    const existing = await this.prisma.subjekPajak.findUnique({
      where: { nik },
    });
    if (!existing) throw new NotFoundException('Subjek pajak tidak ditemukan');

    // Hapus field 'nik' dari dto agar tidak bisa diubah
    const { nik: _nik, ...updateData } = dto as any;
    const updated = await this.prisma.subjekPajak.update({
      where: { nik },
      data: updateData,
      include: { user: { select: { nama_lengkap: true } } },
    });

    const { user, created_by, ...rest } = updated;
    return {
      success: true,
      message: 'Subjek pajak berhasil diupdate',
      data: { ...rest, dibuat_oleh: user?.nama_lengkap ?? null },
    };
  }

  // ─────────────────────────────────────────
  // DELETE
  // ─────────────────────────────────────────

  async delete(nik: string) {
    const existing = await this.prisma.subjekPajak.findUnique({
      where: { nik },
      include: { objek_pajak: { select: { nop: true } } },
    });
    if (!existing) throw new NotFoundException('Subjek pajak tidak ditemukan');

    if (existing.objek_pajak.length > 0) {
      throw new BadRequestException(
        `Tidak bisa dihapus — masih memiliki ${existing.objek_pajak.length} objek pajak aktif`,
      );
    }

    await this.prisma.subjekPajak.delete({ where: { nik } });
    return { success: true, message: 'Subjek pajak berhasil dihapus' };
  }
}
