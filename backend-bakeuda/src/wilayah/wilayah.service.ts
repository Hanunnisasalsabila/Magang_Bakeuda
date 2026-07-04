import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateWilayahDto } from './dto/create-wilayah.dto.js';
import { UpdateWilayahDto } from './dto/update-wilayah.dto.js';

@Injectable()
export class WilayahService {
  constructor(private readonly prisma: PrismaService) {}

  // ─────────────────────────────────────────
  // GET ALL — dengan filter kecamatan/kabupaten
  // ─────────────────────────────────────────

  async getAll(filters?: { kecamatan?: string; kabupaten?: string }) {
    const wilayah = await this.prisma.wilayah.findMany({
      where: {
        kecamatan: filters?.kecamatan
          ? { contains: filters.kecamatan, mode: 'insensitive' }
          : undefined,
        kabupaten: filters?.kabupaten
          ? { contains: filters.kabupaten, mode: 'insensitive' }
          : undefined,
      },
      orderBy: { nama_desa: 'asc' },
    });
    return { success: true, total: wilayah.length, data: wilayah };
  }

  // ─────────────────────────────────────────
  // GET BY KODE
  // ─────────────────────────────────────────

  async getByKode(kode_wilayah: string) {
    const wilayah = await this.prisma.wilayah.findUnique({
      where: { kode_wilayah },
    });
    if (!wilayah) throw new NotFoundException('Wilayah tidak ditemukan');
    return { success: true, data: wilayah };
  }

  // ─────────────────────────────────────────
  // CREATE
  // ─────────────────────────────────────────

  async create(dto: CreateWilayahDto) {
    const existing = await this.prisma.wilayah.findUnique({
      where: { kode_wilayah: dto.kode_wilayah },
    });
    if (existing) throw new ConflictException('Kode wilayah sudah digunakan');

    const wilayah = await this.prisma.wilayah.create({ data: dto });
    return {
      success: true,
      message: 'Wilayah berhasil ditambahkan',
      data: wilayah,
    };
  }

  // ─────────────────────────────────────────
  // UPDATE
  // ─────────────────────────────────────────

  async update(kode_wilayah: string, dto: UpdateWilayahDto) {
    const existing = await this.prisma.wilayah.findUnique({
      where: { kode_wilayah },
    });
    if (!existing) throw new NotFoundException('Wilayah tidak ditemukan');

    const updated = await this.prisma.wilayah.update({
      where: { kode_wilayah },
      data: dto,
    });
    return {
      success: true,
      message: 'Wilayah berhasil diupdate',
      data: updated,
    };
  }

  // ─────────────────────────────────────────
  // DELETE
  // ─────────────────────────────────────────

  async delete(kode_wilayah: string) {
    const existing = await this.prisma.wilayah.findUnique({
      where: { kode_wilayah },
    });
    if (!existing) throw new NotFoundException('Wilayah tidak ditemukan');

    await this.prisma.wilayah.delete({ where: { kode_wilayah } });
    return { success: true, message: 'Wilayah berhasil dihapus' };
  }
}
