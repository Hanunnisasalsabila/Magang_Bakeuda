import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ReferensiBlokService {
  constructor(private readonly prisma: PrismaService) {}

  // GET /referensi-blok?kode_wilayah=xxx — untuk isi dropdown
  async findByWilayah(kodeWilayah: string) {
    const data = await this.prisma.referensiBlok.findMany({
      where: { kode_wilayah: kodeWilayah },
      orderBy: { kode_blok: 'asc' },
    });

    // Ambil blok yang sudah ada di tabel objek_pajak tapi belum didaftarkan ke referensi_blok
    const existingOpBlocks = await this.prisma.objekPajak.findMany({
      where: { kode_wilayah: kodeWilayah },
      select: { kode_blok: true },
      distinct: ['kode_blok'],
    });

    const combinedBlocks = [...data];
    const registeredCodes = new Set(data.map(d => d.kode_blok));

    for (const op of existingOpBlocks) {
      if (op.kode_blok && !registeredCodes.has(op.kode_blok)) {
        combinedBlocks.push({
          kode_wilayah: kodeWilayah,
          kode_blok: op.kode_blok,
          keterangan: '',
          sumber_data: 'AUTO_OP',
        } as any);
        registeredCodes.add(op.kode_blok);
      }
    }

    combinedBlocks.sort((a, b) => a.kode_blok.localeCompare(b.kode_blok));

    return { success: true, total: combinedBlocks.length, data: combinedBlocks };
  }

  // POST /referensi-blok — BAKEUDA tambah blok manual (jarang dipakai, karena biasanya auto-terisi dari transaksi)
  async create(kodeWilayah: string, kodeBlok: string, keterangan?: string) {
    const wilayah = await this.prisma.wilayah.findUnique({ where: { kode_wilayah: kodeWilayah } });
    if (!wilayah) throw new NotFoundException('Kode wilayah tidak ditemukan');

    const existing = await this.prisma.referensiBlok.findUnique({
      where: { kode_wilayah_kode_blok: { kode_wilayah: kodeWilayah, kode_blok: kodeBlok } },
    });
    if (existing) throw new ConflictException('Kode blok ini sudah terdaftar untuk wilayah tersebut');

    const created = await this.prisma.referensiBlok.create({
      data: { kode_wilayah: kodeWilayah, kode_blok: kodeBlok, keterangan, sumber_data: 'MANUAL' },
    });
    return { success: true, message: 'Blok berhasil ditambahkan', data: created };
  }
}
