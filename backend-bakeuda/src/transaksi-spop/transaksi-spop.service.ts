import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTransaksiDto } from './dto/create-transaksi.dto.js';
import { VerifikasiTransaksiDto } from './dto/verifikasi-transaksi.dto.js';

@Injectable()
export class TransaksiSpopService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTransaksiDto, userId: string) {
    return this.prisma.transaksiSpop.create({
      data: {
        id_user: userId,
        tahun_pajak: dto.tahun_pajak,
        jenis_transaksi: dto.jenis_transaksi as any,
        nop_bersama: dto.nop_bersama,
        no_sppt_lama: dto.no_sppt_lama,
        nama_pengaju: dto.nama_pengaju,
        menggunakan_kuasa: dto.menggunakan_kuasa,
        tanggal_pengajuan: new Date(),
        status_ajuan: 'MENUNGGU',
        detail_asal: dto.detail_asal?.length
          ? {
              create: dto.detail_asal.map((d) => ({
                nop_asal: d.nop_asal,
              })),
            }
          : undefined,
        detail_tujuan: {
          create: dto.detail_tujuan.map((d) => ({
            nik_calon_subjek: d.nik_calon_subjek,
            luas_tanah_baru: d.luas_tanah_baru,
            luas_bangunan_baru: d.luas_bangunan_baru || 0,
            jumlah_bangunan_baru: d.jumlah_bangunan_baru || 0,
            jenis_tanah_baru: d.jenis_tanah_baru as any,
            no_persil_baru: d.no_persil_baru,
            nop_generated: d.nop_generated,
          })),
        },
      },
      include: {
        detail_asal: true,
        detail_tujuan: true,
      },
    });
  }

  async findAll(query: { status?: string; role: string; userId: string; search?: string }) {
    const where: any = {};
    if (query.role === 'DESA') {
      where.id_user = query.userId;
    }
    if (query.status) {
      where.status_ajuan = query.status;
    }
    if (query.search) {
      where.OR = [
        { nama_pengaju: { contains: query.search, mode: 'insensitive' } },
        { no_formulir: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    return this.prisma.transaksiSpop.findMany({
      where,
      orderBy: { created_at: 'desc' },
      include: {
        pengaju: {
          select: { nama_lengkap: true, nip: true },
        },
        detail_tujuan: true,
      },
    });
  }

  async getStats(role: string, userId: string) {
    const where: any = {};
    if (role === 'DESA') {
      where.id_user = userId;
    }

    const [totalDikirim, menunggu, disetujui, perluPerbaikan, totalObjek] = await Promise.all([
      this.prisma.transaksiSpop.count({ where }),
      this.prisma.transaksiSpop.count({ where: { ...where, status_ajuan: 'MENUNGGU' } }),
      this.prisma.transaksiSpop.count({ where: { ...where, status_ajuan: 'DISETUJUI' } }),
      this.prisma.transaksiSpop.count({ where: { ...where, status_ajuan: 'REVISI' } }),
      this.prisma.objekPajak.count(),
    ]);

    return {
      totalDikirim,
      menunggu,
      disetujui,
      perluPerbaikan,
      totalObjek,
      kepatuhan: 85.4, // Static for now, can be computed based on business rules
    };
  }

  async verifikasi(id: string, dto: VerifikasiTransaksiDto, verifikatorId: string) {
    const transaksi = await this.prisma.transaksiSpop.findUnique({ where: { id_transaksi: id } });
    if (!transaksi) throw new NotFoundException('Transaksi tidak ditemukan');

    return this.prisma.transaksiSpop.update({
      where: { id_transaksi: id },
      data: {
        status_ajuan: dto.status_ajuan as any,
        catatan_bakeuda: dto.catatan_bakeuda,
        id_verifikator: verifikatorId,
        verified_at: new Date(),
      },
    });
  }
}
