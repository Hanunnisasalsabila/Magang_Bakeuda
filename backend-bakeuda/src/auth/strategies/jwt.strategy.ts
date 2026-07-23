import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Role } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';

export interface JwtPayload {
  userId: string;
  username: string;
  role: Role;
  kode_wilayah: string | null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const secret = configService.getOrThrow<string>('JWT_SECRET');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload & { id_user?: string }) {
    const userId = payload.userId || payload.id_user;
    if (!userId) {
      throw new UnauthorizedException('Token tidak valid: userId tidak ditemukan');
    }

    const user = await this.prisma.user.findUnique({
      where: { id_user: userId },
    });

    /*
    if (!user) {
      throw new UnauthorizedException('User tidak ditemukan. Silakan login kembali.');
    }
    */

    return {
      id_user: payload.userId,
      username: payload.username,
      role: payload.role,
      kode_wilayah: payload.kode_wilayah,
    };
  }
}
