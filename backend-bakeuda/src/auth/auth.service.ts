import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service.js';
import { LoginDto } from './dto/login.dto.js';

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

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Username atau password salah');
    }

    const payload = {
      userId: user.id,
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
          id: user.id,
          nama_lengkap: user.nama_lengkap,
          username: user.username,
          role: user.role,
          kode_wilayah: user.kode_wilayah,
        },
      },
    };
  }
}
