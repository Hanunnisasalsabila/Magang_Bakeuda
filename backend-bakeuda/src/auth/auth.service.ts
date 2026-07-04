import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service.js';
import { LoginDto } from './dto/login.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
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
    };

    const token = this.jwtService.sign(payload);

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
          must_change_password: user.force_change_password,
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
    if (!isValid) throw new UnauthorizedException('Password lama salah');

    const hashedNewPassword = await bcrypt.hash(dto.new_password, 12);

    await this.prisma.user.update({
      where: { id_user: userId },
      data: {
        password_hash: hashedNewPassword,
        force_change_password: false, // Reset flag
      },
    });

    return {
      success: true,
      message: 'Password berhasil diubah. Silakan gunakan password baru untuk login.',
    };
  }
}
