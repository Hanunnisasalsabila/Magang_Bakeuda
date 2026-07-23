/**
 * Mapper: DAT_SUBJEK_PAJAK (Oracle) → SubjekPajak (Prisma/PostgreSQL)
 *
 * Menangani konversi tipe data, trim whitespace dari CHAR Oracle,
 * dan pemetaan kode angka ke enum Prisma.
 */

// ── Enum Maps ──

const PEKERJAAN_MAP: Record<string, string> = {
  '1': 'PNS',
  '2': 'ABRI',
  '3': 'PENSIUNAN',
  '4': 'BADAN',
  '5': 'LAINNYA',
};

const STATUS_WP_MAP: Record<string, string> = {
  '1': 'PEMILIK',
  '2': 'PENYEWA',
  '3': 'PENGELOLA',
  '4': 'PEMAKAI',
  '5': 'SENGKETA',
};

// ── Types ──

export interface OracleSubjekPajak {
  SUBJEK_PAJAK_ID: string;
  NM_WP: string | null;
  JALAN_WP: string | null;
  BLOK_KAV_NO_WP: string | null;
  RW_WP: string | null;
  RT_WP: string | null;
  KELURAHAN_WP: string | null;
  KOTA_WP: string | null;
  KD_POS_WP: string | null;
  TELP_WP: string | null;
  NPWP: string | null;
  STATUS_PEKERJAAN_WP: string | null;
  KECAMATAN_WP: string | null;
  NPWPD: string | null;
  EMAIL: string | null;
}

export interface PrismaSubjekPajakUpsert {
  nik: string;
  legacy_subjek_id: string;
  nama_subjek: string;
  status_wp: any;
  pekerjaan: any;
  npwp: string | null;
  npwpd: string | null;
  no_hp: string | null;
  email: string | null;
  alamat_jalan: string;
  blok_kav_no_subjek: string | null;
  rw: string | null;
  rt: string | null;
  kode_wilayah: string;
  kode_pos: string | null;
  created_by: string;
  oracle_synced_at: Date;
  oracle_source: boolean;
}

// ── Helper ──

/** Trim whitespace dari CHAR Oracle (CHAR selalu di-pad dengan spasi) */
function trimOrNull(val: string | null | undefined): string | null {
  if (val == null) return null;
  const trimmed = val.trim();
  return trimmed.length > 0 ? trimmed : null;
}

// ── Mapper Function ──

/**
 * Transform 1 row Oracle DAT_SUBJEK_PAJAK ke format Prisma SubjekPajak upsert.
 *
 * @param row     — Row dari Oracle query
 * @param kodeWilayahFallback — Kode wilayah fallback jika tidak bisa di-resolve dari alamat
 */
export function mapOracleSubjekToPrisma(
  row: OracleSubjekPajak,
  kodeWilayahFallback: string,
  fallbackUserId: string,
): PrismaSubjekPajakUpsert {
  const subjekId = trimOrNull(row.SUBJEK_PAJAK_ID) ?? '';

  // NIK: jika SUBJEK_PAJAK_ID 16 digit angka, pakai langsung. Selainnya, pakai as-is (max 30 char).
  // Karena nik di Prisma VarChar(16), kita truncate jika lebih dari 16.
  const nik = subjekId.length <= 16 ? subjekId : subjekId.substring(0, 16);

  return {
    nik,
    legacy_subjek_id: subjekId,
    nama_subjek: trimOrNull(row.NM_WP) ?? 'TANPA NAMA',
    status_wp: STATUS_WP_MAP[trimOrNull(row.STATUS_PEKERJAAN_WP) ?? ''] ?? 'PEMILIK',
    pekerjaan: PEKERJAAN_MAP[trimOrNull(row.STATUS_PEKERJAAN_WP) ?? ''] ?? 'LAINNYA',
    npwp: trimOrNull(row.NPWP),
    npwpd: trimOrNull(row.NPWPD),
    no_hp: trimOrNull(row.TELP_WP),
    email: trimOrNull(row.EMAIL),
    alamat_jalan: trimOrNull(row.JALAN_WP) ?? '-',
    blok_kav_no_subjek: trimOrNull(row.BLOK_KAV_NO_WP),
    rw: trimOrNull(row.RW_WP),
    rt: trimOrNull(row.RT_WP),
    kode_wilayah: kodeWilayahFallback,
    kode_pos: trimOrNull(row.KD_POS_WP),
    created_by: fallbackUserId,
    oracle_synced_at: new Date(),
    oracle_source: true,
  };
}

/**
 * Reverse mapper: Prisma SubjekPajak → format Oracle INSERT/UPDATE.
 * Dipakai untuk Write-Through (menulis ke Oracle).
 */
export function mapPrismaSubjekToOracle(prismaData: {
  nik: string;
  legacy_subjek_id?: string | null;
  nama_subjek: string;
  pekerjaan: string;
  npwp?: string | null;
  npwpd?: string | null;
  no_hp?: string | null;
  email?: string | null;
  alamat_jalan: string;
  blok_kav_no_subjek?: string | null;
  rw?: string | null;
  rt?: string | null;
  kode_pos?: string | null;
}): Record<string, unknown> {
  // Reverse enum map
  const PEKERJAAN_REVERSE: Record<string, string> = {
    PNS: '1',
    ABRI: '2',
    PENSIUNAN: '3',
    BADAN: '4',
    LAINNYA: '5',
  };

  return {
    SUBJEK_PAJAK_ID: prismaData.legacy_subjek_id ?? prismaData.nik,
    NM_WP: prismaData.nama_subjek,
    JALAN_WP: prismaData.alamat_jalan,
    BLOK_KAV_NO_WP: prismaData.blok_kav_no_subjek ?? null,
    RW_WP: prismaData.rw ?? null,
    RT_WP: prismaData.rt ?? null,
    KD_POS_WP: prismaData.kode_pos ?? null,
    TELP_WP: prismaData.no_hp ?? null,
    NPWP: prismaData.npwp ?? null,
    STATUS_PEKERJAAN_WP: PEKERJAAN_REVERSE[prismaData.pekerjaan] ?? '5',
    NPWPD: prismaData.npwpd ?? null,
    EMAIL: prismaData.email ?? null,
  };
}
