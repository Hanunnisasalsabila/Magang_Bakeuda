import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateReferensiJpbDto } from './dto/create-referensi-jpb.dto.js';
import { UpdateReferensiJpbDto } from './dto/update-referensi-jpb.dto.js';

@Injectable()
export class ReferensiJpbService {
  constructor(private readonly prisma: PrismaService) {}

  // ─────────────────────────────────────────
  // GET aktif — untuk dropdown (semua role)
  // ─────────────────────────────────────────

  async findAllActive() {
    return this.prisma.referensiJenisPenggunaanBangunan.findMany({
      where: { is_active: true },
      orderBy: { urutan: 'asc' },
      select: { kode_jpb: true, nama_jpb: true, urutan: true },
    });
  }

  // ─────────────────────────────────────────
  // GET semua (termasuk nonaktif) — BAKEUDA
  // ─────────────────────────────────────────

  async findAll() {
    return this.prisma.referensiJenisPenggunaanBangunan.findMany({
      orderBy: { urutan: 'asc' },
    });
  }

  // ─────────────────────────────────────────
  // CREATE — BAKEUDA only
  // ─────────────────────────────────────────

  async create(dto: CreateReferensiJpbDto) {
    const existing = await this.prisma.referensiJenisPenggunaanBangunan.findUnique({
      where: { kode_jpb: dto.kode_jpb },
    });
    if (existing) throw new ConflictException(`Kode JPB "${dto.kode_jpb}" sudah terdaftar`);

    return this.prisma.referensiJenisPenggunaanBangunan.create({ data: dto });
  }

  // ─────────────────────────────────────────
  // UPDATE — BAKEUDA only
  // ─────────────────────────────────────────

  async update(kode: string, dto: UpdateReferensiJpbDto) {
    const existing = await this.prisma.referensiJenisPenggunaanBangunan.findUnique({
      where: { kode_jpb: kode },
    });
    if (!existing) throw new NotFoundException(`Kode JPB "${kode}" tidak ditemukan`);

    return this.prisma.referensiJenisPenggunaanBangunan.update({
      where: { kode_jpb: kode },
      data: dto,
    });
  }

  // ─────────────────────────────────────────
  // SOFT-DELETE (nonaktifkan) — BAKEUDA only
  // Hard delete dihindari karena ObjekBangunan lama masih referensi kode ini
  // ─────────────────────────────────────────

  async deactivate(kode: string) {
    const existing = await this.prisma.referensiJenisPenggunaanBangunan.findUnique({
      where: { kode_jpb: kode },
    });
    if (!existing) throw new NotFoundException(`Kode JPB "${kode}" tidak ditemukan`);

    if (!existing.is_active) {
      return { success: true, message: `Kode JPB "${kode}" sudah dalam status nonaktif` };
    }

    const updated = await this.prisma.referensiJenisPenggunaanBangunan.update({
      where: { kode_jpb: kode },
      data: { is_active: false },
    });

    return {
      success: true,
      message: `Kode JPB "${kode}" berhasil dinonaktifkan`,
      data: updated,
    };
  }
}
