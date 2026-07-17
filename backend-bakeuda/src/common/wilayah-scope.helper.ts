import { ForbiddenException, BadRequestException } from '@nestjs/common';

export interface CurrentUser {
  id_user: string;
  role: 'DESA' | 'BAKEUDA';
  kode_wilayah: string | null;
}

/** Bangun filter `where` tambahan berdasarkan role user */
export function buildWilayahScope(user: CurrentUser): { kode_wilayah?: string } {
  if (user.role === 'BAKEUDA') return {}; // tidak ada batasan
  if (!user.kode_wilayah) {
    throw new ForbiddenException('User DESA belum terikat ke wilayah manapun');
  }
  return { kode_wilayah: user.kode_wilayah };
}

/** Cek apakah user boleh akses 1 record spesifik berdasarkan kode_wilayah record itu */
export function assertWilayahAccess(user: CurrentUser, recordKodeWilayah: string) {
  if (user.role === 'BAKEUDA') return;
  if (user.kode_wilayah !== recordKodeWilayah) {
    throw new ForbiddenException('Anda tidak memiliki akses ke data wilayah ini');
  }
}

/** Helper: petugas DESA dipaksa pakai wilayahnya sendiri, tidak boleh pilih wilayah lain */
export function resolveWilayahForCreate(
  dtoKodeWilayah: string | undefined,
  user: CurrentUser,
): string {
  if (user.role === 'DESA') {
    if (!user.kode_wilayah) {
      throw new BadRequestException(
        'User DESA belum terikat ke wilayah manapun — hubungi BAKEUDA',
      );
    }
    return user.kode_wilayah; // abaikan input dto, paksa pakai wilayah sendiri
  }
  // BAKEUDA boleh pilih wilayah manapun
  if (!dtoKodeWilayah) throw new BadRequestException('kode_wilayah wajib diisi');
  return dtoKodeWilayah;
}
