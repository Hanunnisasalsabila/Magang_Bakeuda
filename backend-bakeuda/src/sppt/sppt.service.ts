import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { calculatePbb } from '../lib/pbb-calculator.js';

const NJOPTKP_DEFAULT = 12_000_000; // sesuai regulasi daerah, sesuaikan
const TARIF_PBB_DEFAULT = 0.1; // 0.1%

@Injectable()
export class SpptService {
  constructor(private readonly prisma: PrismaService) {}

  // ─────────────────────────────────────────
  // GENERATE SPPT — Satuan
  // ─────────────────────────────────────────

  async generateSatuan(
    nop: string,
    tahunPajak: number,
    generatedBy: string,
  ) {
    const objek = await this.prisma.objekPajak.findUnique({ where: { nop } });
    if (!objek) throw new NotFoundException('Objek pajak tidak ditemukan');
    if (!objek.status_aktif)
      throw new BadRequestException(
        'Objek pajak nonaktif, tidak bisa diterbitkan SPPT',
      );

    const existing = await this.prisma.sppt.findFirst({
      where: { nop, tahun_pajak: tahunPajak },
    });
    if (existing)
      throw new BadRequestException(
        `SPPT tahun ${tahunPajak} sudah pernah diterbitkan untuk NOP ini`,
      );

    const hasil = calculatePbb({
      njopTanah: Number(objek.njop_tanah ?? 0),
      luasTanah: Number(objek.luas_tanah),
      njopBangunan: Number(objek.njop_bangunan ?? 0),
      luasBangunan: Number(objek.luas_bangunan),
      njoptkp: NJOPTKP_DEFAULT,
      tarifPbb: TARIF_PBB_DEFAULT,
    });

    const sppt = await this.prisma.sppt.create({
      data: {
        nop,
        tahun_pajak: tahunPajak,
        njop_kena_pajak: hasil.njopKenaPajak,
        njoptkp: NJOPTKP_DEFAULT,
        tarif_pbb: TARIF_PBB_DEFAULT,
        pbb_terutang: hasil.pbbTerutang,
        tgl_jatuh_tempo: new Date(tahunPajak, 8, 30), // 30 September
        generated_by: generatedBy,
      },
    });

    return { success: true, message: 'SPPT berhasil diterbitkan', data: sppt };
  }

  // ─────────────────────────────────────────
  // GENERATE SPPT — Massal (semua objek aktif)
  // ─────────────────────────────────────────

  async generateMassal(tahunPajak: number, generatedBy: string) {
    const objekAktif = await this.prisma.objekPajak.findMany({
      where: { status_aktif: true },
    });

    const hasil = { berhasil: 0, dilewati: 0, error: [] as string[] };

    for (const objek of objekAktif) {
      try {
        await this.generateSatuan(objek.nop, tahunPajak, generatedBy);
        hasil.berhasil++;
      } catch (err: any) {
        hasil.dilewati++;
        hasil.error.push(`${objek.nop}: ${err.message}`);
      }
    }

    return {
      success: true,
      message: 'Proses generate massal selesai',
      data: hasil,
    };
  }

  // ─────────────────────────────────────────
  // UPDATE STATUS BAYAR → LUNAS
  // ─────────────────────────────────────────

  async updateStatusBayar(idSppt: string, tglBayar: Date) {
    const sppt = await this.prisma.sppt.findUnique({
      where: { id_sppt: idSppt },
    });
    if (!sppt) throw new NotFoundException('SPPT tidak ditemukan');
    if (sppt.status_bayar === 'LUNAS')
      throw new BadRequestException('SPPT sudah lunas');

    const updated = await this.prisma.sppt.update({
      where: { id_sppt: idSppt },
      data: { status_bayar: 'LUNAS', tgl_bayar: tglBayar },
    });

    return {
      success: true,
      message: 'Status pembayaran berhasil diupdate',
      data: updated,
    };
  }

  // ─────────────────────────────────────────
  // SEARCH SPPT
  // ─────────────────────────────────────────

  async search(filters: {
    nop?: string;
    tahun_pajak?: number;
    status_bayar?: string;
  }) {
    const results = await this.prisma.sppt.findMany({
      where: {
        nop: filters.nop,
        tahun_pajak: filters.tahun_pajak,
        status_bayar: filters.status_bayar as
          | 'BELUM_BAYAR'
          | 'LUNAS'
          | 'KEDALUWARSA'
          | undefined,
      },
      include: {
        objek_pajak: {
          select: {
            jalan_op: true,
            subjek_pajak: { select: { nama_subjek: true } },
          },
        },
      },
      orderBy: { generated_at: 'desc' },
      take: 100,
    });
    return { success: true, total: results.length, data: results };
  }
}
