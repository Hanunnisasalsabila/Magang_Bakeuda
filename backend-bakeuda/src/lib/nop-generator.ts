import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '@prisma/client';

export interface GenerateNopInput {
  kode_wilayah: string; // WAJIB sudah tervalidasi ada di tabel Wilayah
  kode_blok: string; // 3 digit
  kode_jenis_op: string; // 1 digit
}

/**
 * NOP 18 digit = kode_wilayah(10) + blok(3) + no_urut(4) + jenis_op(1)
 */
@Injectable()
export class NopGeneratorService {
  constructor(private readonly prisma: PrismaService) {}

  async generateNop(
    input: GenerateNopInput,
    tx: Prisma.TransactionClient = this.prisma,
  ): Promise<string> {
    const { kode_wilayah, kode_blok, kode_jenis_op } = input;

    // Validasi wilayah benar-benar ada — mencegah NOP dengan kode wilayah palsu
    const wilayah = await tx.wilayah.findUnique({ where: { kode_wilayah } });
    if (!wilayah) throw new BadRequestException('Kode wilayah tidak valid/tidak terdaftar');

    // Cari no_urut terakhir untuk kombinasi wilayah + blok ini
    const lastObjek = await tx.objekPajak.findFirst({
      where: {
        kode_wilayah,
        kode_blok,
      },
      orderBy: { no_urut: 'desc' },
    });

    const nextUrut = lastObjek ? parseInt(lastObjek.no_urut, 10) + 1 : 1;
    const noUrutStr = nextUrut.toString().padStart(4, '0');

    const nop =
      kode_wilayah +
      kode_blok.padStart(3, '0') +
      noUrutStr +
      kode_jenis_op;

    return nop;
  }

  /** Pecah NOP 18 digit jadi komponen-komponennya */
  parseNop(nop: string) {
    if (nop.length !== 18) throw new Error('NOP harus 18 digit');
    return {
      kode_wilayah: nop.substring(0, 10),
      kode_blok: nop.substring(10, 13),
      no_urut: nop.substring(13, 17),
      kode_jenis_op: nop.substring(17, 18),
    };
  }
}
