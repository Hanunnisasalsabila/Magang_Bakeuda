import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateSubjekPajakDto } from './dto/create-subjek-pajak.dto.js';
import { UpdateSubjekPajakDto } from './dto/update-subjek-pajak.dto.js';
import {
  CurrentUser,
  resolveWilayahForCreate,
  buildWilayahScope,
  assertWilayahAccess,
} from '../common/wilayah-scope.helper.js';

@Injectable()
export class SubjekPajakService {
  constructor(private readonly prisma: PrismaService) {}

  // ─────────────────────────────────────────
  // CREATE
  // ─────────────────────────────────────────

  async create(dto: CreateSubjekPajakDto, currentUser: CurrentUser) {
    const kodeWilayah = resolveWilayahForCreate(dto.kode_wilayah, currentUser);

    const existing = await this.prisma.subjekPajak.findUnique({
      where: { nik: dto.nik },
    });

    if (existing) {
      throw new ConflictException('NIK sudah terdaftar');
    }

    const subjek = await this.prisma.subjekPajak.create({
      data: {
        ...dto,
        kode_wilayah: kodeWilayah,
        created_by: currentUser.id_user,
      },
      include: {
        user: {
          select: {
            nama_lengkap: true,
          },
        },
      },
    });

    return {
      success: true,
      message: 'Subjek pajak berhasil ditambahkan',
      data: {
        nik: subjek.nik,
        legacy_subjek_id: subjek.legacy_subjek_id,
        nama_subjek: subjek.nama_subjek,
        status_wp: subjek.status_wp,
        pekerjaan: subjek.pekerjaan,
        npwp: subjek.npwp,
        npwpd: subjek.npwpd,
        no_hp: subjek.no_hp,
        email: subjek.email,
        alamat_jalan: subjek.alamat_jalan,
        blok_kav_no_subjek: subjek.blok_kav_no_subjek,
        rw: subjek.rw,
        rt: subjek.rt,
        kode_wilayah: subjek.kode_wilayah,
        kode_pos: subjek.kode_pos,
        created_at: subjek.created_at,
        updated_at: subjek.updated_at,

        dibuat_oleh: subjek.user.nama_lengkap,
      },
    };
  }

  // ─────────────────────────────────────────
  // GET BY NIK
  // ─────────────────────────────────────────

  async getByNik(nik: string, currentUser: CurrentUser) {
    const subjek = await this.prisma.subjekPajak.findUnique({
      where: { nik },
      include: {
        user: { select: { nama_lengkap: true } },
        objek_pajak: {
          select: { 
            nop: true, 
            jalan_op: true, 
            status_aktif: true,
            jenis_tanah: true,
            luas_tanah: true,
            luas_bangunan: true,
            jumlah_bangunan: true,
            rt_op: true,
            rw_op: true,
            wilayah: { select: { nama_desa: true, kecamatan: true } }
          },
        },
        wilayah: true,
      },
    });
    if (!subjek) throw new NotFoundException('Subjek pajak tidak ditemukan');
    
    assertWilayahAccess(currentUser, subjek.kode_wilayah);

    const { user, created_by, ...rest } = subjek;

    return {
      success: true,
      data: {
        ...rest,
        dibuat_oleh: user?.nama_lengkap ?? null,
      },
    };
  }

  // ─────────────────────────────────────────
  // SEARCH
  // ─────────────────────────────────────────

  async search(keyword: string, currentUser: CurrentUser) {
    const scope = buildWilayahScope(currentUser);

    const results = await this.prisma.subjekPajak.findMany({
      where: {
        ...scope,
        OR: [
          { nik: { contains: keyword } },
          { nama_subjek: { contains: keyword, mode: 'insensitive' } },
          { alamat_jalan: { contains: keyword, mode: 'insensitive' } },
        ],
      },
      include: {
        user: {
          select: { nama_lengkap: true },
        },
        wilayah: true,
      },
      take: 50,
      orderBy: { nama_subjek: 'asc' },
    });

    return results.map(({ user, created_by, ...rest }) => ({
      ...rest,
      dibuat_oleh: user?.nama_lengkap ?? null,
    }));
  }

  // ─────────────────────────────────────────
  // UPDATE
  // ─────────────────────────────────────────

  async update(nik: string, dto: UpdateSubjekPajakDto, currentUser: CurrentUser) {
    const existing = await this.prisma.subjekPajak.findUnique({
      where: { nik },
    });
    if (!existing) throw new NotFoundException('Subjek pajak tidak ditemukan');

    assertWilayahAccess(currentUser, existing.kode_wilayah);

    // Hapus field 'nik' dari dto agar tidak bisa diubah
    const { nik: _nik, ...updateData } = dto as any;
    
    const updated = await this.prisma.subjekPajak.update({
      where: { nik },
      data: updateData,
      include: { user: { select: { nama_lengkap: true } }, wilayah: true },
    });

    const { user, created_by, ...rest } = updated;
    return {
      success: true,
      message: 'Subjek pajak berhasil diupdate',
      data: { ...rest, dibuat_oleh: user?.nama_lengkap ?? null },
    };
  }

  // ─────────────────────────────────────────
  // DELETE
  // ─────────────────────────────────────────

  async delete(nik: string, currentUser: CurrentUser) {
    const existing = await this.prisma.subjekPajak.findUnique({
      where: { nik },
      include: { objek_pajak: { select: { nop: true } } },
    });
    if (!existing) throw new NotFoundException('Subjek pajak tidak ditemukan');

    assertWilayahAccess(currentUser, existing.kode_wilayah);

    if (existing.objek_pajak.length > 0) {
      throw new BadRequestException(
        `Tidak bisa dihapus — masih memiliki ${existing.objek_pajak.length} objek pajak aktif`,
      );
    }

    await this.prisma.subjekPajak.delete({ where: { nik } });
    return { success: true, message: 'Subjek pajak berhasil dihapus' };
  }
}
