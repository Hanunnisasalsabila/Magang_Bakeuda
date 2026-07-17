import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateReferensiDbkbDto } from './dto/update-referensi-dbkb.dto.js';

@Injectable()
export class ReferensiDbkbService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const data = await this.prisma.referensiDbkb.findMany({
      orderBy: [{ kategori: 'asc' }, { kode: 'asc' }],
    });
    return { success: true, total: data.length, data };
  }

  async findByKategori(kategori: string) {
    const data = await this.prisma.referensiDbkb.findMany({
      where: { kategori: kategori as any },
      orderBy: { kode: 'asc' },
    });
    return { success: true, total: data.length, data };
  }

  async update(id: string, dto: UpdateReferensiDbkbDto) {
    const existing = await this.prisma.referensiDbkb.findUnique({ where: { id_dbkb: id } });
    if (!existing) throw new NotFoundException('Data DBKB tidak ditemukan');

    const updated = await this.prisma.referensiDbkb.update({
      where: { id_dbkb: id },
      data: {
        nilai_per_m2: dto.nilai_per_m2,
        sumber_data: 'MANUAL', // ditandai manual, beda dari hasil sync Oracle
      },
    });
    return { success: true, message: 'Nilai DBKB berhasil diupdate', data: updated };
  }
}
