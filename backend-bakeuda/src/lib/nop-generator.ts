import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

export interface GenerateNopInput {
  kode_propinsi: string; // 2 digit
  kode_dati2: string; // 2 digit
  kode_kecamatan: string; // 3 digit
  kode_kelurahan: string; // 3 digit
  kode_blok: string; // 3 digit
  kode_jenis_op: string; // 1 digit
}

/**
 * NOP 18 digit = propinsi(2) + dati2(2) + kecamatan(3) + kelurahan(3)
 *              + blok(3) + no_urut(4) + jenis_op(1)
 */
@Injectable()
export class NopGeneratorService {
  constructor(private readonly prisma: PrismaService) {}

  async generateNop(input: GenerateNopInput): Promise<string> {
    const {
      kode_propinsi,
      kode_dati2,
      kode_kecamatan,
      kode_kelurahan,
      kode_blok,
      kode_jenis_op,
    } = input;

    // Cari no_urut terakhir untuk kombinasi wilayah + blok ini
    const lastObjek = await this.prisma.objekPajak.findFirst({
      where: {
        kode_propinsi,
        kode_dati2,
        kode_kecamatan,
        kode_kelurahan,
        kode_blok,
      },
      orderBy: { no_urut: 'desc' },
    });

    const nextUrut = lastObjek ? parseInt(lastObjek.no_urut, 10) + 1 : 1;
    const noUrutStr = nextUrut.toString().padStart(4, '0');

    const nop =
      kode_propinsi.padStart(2, '0') +
      kode_dati2.padStart(2, '0') +
      kode_kecamatan.padStart(3, '0') +
      kode_kelurahan.padStart(3, '0') +
      kode_blok.padStart(3, '0') +
      noUrutStr +
      kode_jenis_op;

    return nop;
  }

  /** Pecah NOP 18 digit jadi komponen-komponennya */
  parseNop(nop: string) {
    if (nop.length !== 18) throw new Error('NOP harus 18 digit');
    return {
      kode_propinsi: nop.substring(0, 2),
      kode_dati2: nop.substring(2, 4),
      kode_kecamatan: nop.substring(4, 7),
      kode_kelurahan: nop.substring(7, 10),
      kode_blok: nop.substring(10, 13),
      no_urut: nop.substring(13, 17),
      kode_jenis_op: nop.substring(17, 18),
    };
  }
}
