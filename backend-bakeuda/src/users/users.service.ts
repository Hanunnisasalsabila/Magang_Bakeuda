import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePetugasDto } from './dto/create-petugas.dto.js';
import { UpdatePetugasDto } from './dto/update-petugas.dto.js';
import { Role } from '@prisma/client';

// SELECT field yang aman (tanpa password)
const safeUserSelect = {
  id_user: true,
  nama_lengkap: true,
  username: true,
  role: true,
  kode_wilayah: true,
  nip: true,
  created_at: true,
} as const;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // ─────────────────────────────────────────
  // Create Petugas
  // ─────────────────────────────────────────

  async createPetugas(dto: CreatePetugasDto) {
    const { nama_lengkap, username, password, kode_wilayah, nip } = dto;

    const existing = await this.prisma.user.findUnique({
      where: { username },
    });

    if (existing) {
      throw new ConflictException('Username sudah digunakan');
    }

    const SALT_ROUNDS = 12;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        nama_lengkap,
        username,
        password_hash: hashedPassword,
        role: Role.DESA,
        kode_wilayah,
        nip,
      },
      select: safeUserSelect,
    });

    return {
      success: true,
      message: 'Petugas berhasil ditambahkan',
      data: user,
    };
  }

  // ─────────────────────────────────────────
  // Search by ID
  // ─────────────────────────────────────────

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id_user: id },
      select: safeUserSelect,
    });

    if (!user) {
      throw new NotFoundException('Petugas tidak ditemukan');
    }

    if (user.role !== Role.DESA) {
      throw new BadRequestException('User ini bukan role DESA');
    }

    return { success: true, data: user };
  }

  // ─────────────────────────────────────────
  // Search by Username (case-insensitive, contains)
  // ─────────────────────────────────────────

  async searchByUsername(username: string) {
    const users = await this.prisma.user.findMany({
      where: {
        username: {
          contains: username,
          mode: 'insensitive',
        },
        role: Role.DESA,
      },
      select: safeUserSelect,
      orderBy: { created_at: 'desc' },
    });

    return {
      success: true,
      total: users.length,
      data: users,
    };
  }

  // ─────────────────────────────────────────
  // Update Petugas
  // ─────────────────────────────────────────

  async updatePetugas(id: string, dto: UpdatePetugasDto) {
    // Cek minimal 1 field dikirim
    const fieldsToUpdate = Object.keys(dto).filter(
      (key) => dto[key as keyof UpdatePetugasDto] !== undefined,
    );
    if (fieldsToUpdate.length === 0) {
      throw new BadRequestException(
        'Minimal satu field harus diisi untuk update',
      );
    }

    // Cek apakah petugas exist
    const existing = await this.prisma.user.findUnique({
      where: { id_user: id },
      select: { id_user: true, role: true },
    });

    if (!existing) {
      throw new NotFoundException('Petugas tidak ditemukan');
    }

    if (existing.role !== Role.DESA) {
      throw new BadRequestException('Hanya user DESA yang bisa diupdate');
    }

    // Cek apakah username baru sudah dipakai user lain
    if (dto.username) {
      const usernameConflict = await this.prisma.user.findFirst({
        where: {
          username: dto.username,
          NOT: { id_user: id },
        },
        select: { id_user: true },
      });

      if (usernameConflict) {
        throw new ConflictException('Username sudah digunakan');
      }
    }

    // Hash password baru jika ada
    const dataToUpdate: Record<string, unknown> = { ...dto };
    if (dto.password) {
      dataToUpdate.password_hash = await bcrypt.hash(dto.password, 12);
      delete dataToUpdate.password;
    }

    const updated = await this.prisma.user.update({
      where: { id_user: id },
      data: dataToUpdate,
      select: safeUserSelect,
    });

    return {
      success: true,
      message: 'Petugas berhasil diupdate',
      data: updated,
    };
  }

  // ─────────────────────────────────────────
  // Delete Petugas
  // ─────────────────────────────────────────

  async deletePetugas(id: string) {
    const existing = await this.prisma.user.findUnique({
      where: { id_user: id },
      select: { id_user: true, role: true, username: true },
    });

    if (!existing) {
      throw new NotFoundException('Petugas tidak ditemukan');
    }

    if (existing.role !== Role.DESA) {
      throw new BadRequestException('Hanya user DESA yang bisa dihapus');
    }

    await this.prisma.user.delete({ where: { id_user: id } });

    return {
      success: true,
      message: `Petugas '${existing.username}' berhasil dihapus`,
    };
  }
}
