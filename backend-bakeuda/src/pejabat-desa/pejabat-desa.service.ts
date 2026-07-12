import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class PejabatDesaService {
  constructor(private readonly prisma: PrismaService) {}

  async getByKodeWilayah(kode_wilayah: string) {
    const pejabatList = await this.prisma.pejabatDesa.findMany({
      where: {
        kode_wilayah,
      },
    });

    if (!pejabatList || pejabatList.length === 0) {
      throw new NotFoundException('Data Pejabat Desa tidak ditemukan untuk wilayah ini.');
    }

    return {
      message: 'Berhasil mengambil daftar Pejabat Desa',
      data: pejabatList,
    };
  }
}
