import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ReferensiNilaiFasilitasService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const data = await this.prisma.referensiNilaiFasilitas.findMany({
      orderBy: { jenis_fasilitas: 'asc' },
    });
    return { success: true, total: data.length, data };
  }

  async update(id: string, dto: { nilai_tambah: number }) {
    const existing = await this.prisma.referensiNilaiFasilitas.findUnique({ where: { id_nilai_fasilitas: id } });
    if (!existing) throw new NotFoundException('Data nilai fasilitas tidak ditemukan');

    const updated = await this.prisma.referensiNilaiFasilitas.update({
      where: { id_nilai_fasilitas: id },
      data: { nilai_tambah: dto.nilai_tambah, sumber_data: 'MANUAL' },
    });
    return { success: true, message: 'Nilai fasilitas berhasil diupdate', data: updated };
  }
}
