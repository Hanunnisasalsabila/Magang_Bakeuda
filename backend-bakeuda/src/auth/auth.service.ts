import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service.js';
import { ActivitiesService } from '../activities/activities.service.js';
import { LoginDto } from './dto/login.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private activitiesService: ActivitiesService,
  ) {}

  async login(dto: LoginDto) {
    const { username, password } = dto;

    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException('Username atau password salah');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Username atau password salah');
    }

    const payload = {
      userId: user.id_user,
      username: user.username,
      role: user.role,
      kode_wilayah: user.kode_wilayah,
      nip: user.nip,
    };

    const token = this.jwtService.sign(payload);

    // Log the activity asynchronously
    this.activitiesService.create(user.id_user, {
      type: 'login',
      title: 'Berhasil masuk ke sistem SIPD Purbalingga',
    }).catch(err => console.error('Failed to log activity:', err));

    return {
      success: true,
      message: 'Login berhasil',
      data: {
        token,
        user: {
          id: user.id_user,
          nama_lengkap: user.nama_lengkap,
          username: user.username,
          role: user.role,
          kode_wilayah: user.kode_wilayah,
          nip: user.nip,
        },
      },
    };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id_user: userId },
    });

    if (!user) throw new UnauthorizedException('User tidak ditemukan');

    const isValid = await bcrypt.compare(dto.old_password, user.password_hash);

    if (!isValid) {
      throw new UnauthorizedException('Password lama salah');
    }

    const hashedNewPassword = await bcrypt.hash(dto.new_password, 12);

    await this.prisma.user.update({
      where: { id_user: userId },
      data: {
        password_hash: hashedNewPassword,
      },
    });

    await this.activitiesService.logActivity(userId, 'update', 'Memperbarui kata sandi akun');

    return {
      success: true,
      message: 'Password berhasil diubah. Silakan gunakan password baru untuk login.',
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id_user: userId },
      select: {
        id_user: true,
        nama_lengkap: true,
        username: true,
        role: true,
        kode_wilayah: true,
        nip: true,
        wilayah: {
          select: {
            nama_desa: true,
            kecamatan: true,
          }
        }
      }
    });

    if (!user) throw new UnauthorizedException('User tidak ditemukan');

    return {
      success: true,
      data: user,
    };
  }

  async updateProfile(userId: string, dto: { nama_lengkap: string; nip?: string }) {
    const user = await this.prisma.user.findUnique({ where: { id_user: userId } });
    if (!user) throw new UnauthorizedException('User tidak ditemukan');

    await this.prisma.user.update({
      where: { id_user: userId },
      data: {
        nama_lengkap: dto.nama_lengkap,
        nip: dto.nip,
      },
    });

    await this.activitiesService.logActivity(userId, 'update', 'Memperbarui informasi profil akun');

    return {
      success: true,
      message: 'Profil berhasil diperbarui',
    };
  }
}
