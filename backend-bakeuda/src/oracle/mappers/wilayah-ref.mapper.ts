/**
 * Mapper: REF_KELURAHAN, REF_KECAMATAN, dll (Oracle) → Wilayah (Prisma/PostgreSQL)
 */

export interface OracleWilayahRow {
  KODE_WILAYAH: string;
  KODE_PROPINSI: string;
  KODE_DATI2: string;
  KODE_KECAMATAN: string;
  KODE_KELURAHAN: string;
  NM_PROPINSI: string;
  NM_DATI2: string;
  NM_KECAMATAN: string;
  NM_KELURAHAN: string;
  KD_SEKTOR: string | null;
}

export interface PrismaWilayahUpsert {
  kode_wilayah: string;
  kode_propinsi: string;
  nama_propinsi: string;
  kode_dati2: string;
  kabupaten: string;
  kode_kecamatan: string;
  kecamatan: string;
  kode_kelurahan: string;
  nama_desa: string;
  kode_sektor: string | null;
}

function trimOrNull(val: string | null | undefined): string | null {
  if (val == null) return null;
  const trimmed = val.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function mapOracleWilayahToPrisma(
  row: OracleWilayahRow
): PrismaWilayahUpsert {
  return {
    kode_wilayah: row.KODE_WILAYAH,
    kode_propinsi: row.KODE_PROPINSI,
    nama_propinsi: trimOrNull(row.NM_PROPINSI) ?? 'Jawa Tengah',
    kode_dati2: row.KODE_DATI2,
    kabupaten: trimOrNull(row.NM_DATI2) ?? 'Purbalingga',
    kode_kecamatan: row.KODE_KECAMATAN,
    kecamatan: trimOrNull(row.NM_KECAMATAN) ?? 'Kecamatan',
    kode_kelurahan: row.KODE_KELURAHAN,
    nama_desa: trimOrNull(row.NM_KELURAHAN) ?? 'Desa',
    kode_sektor: trimOrNull(row.KD_SEKTOR),
  };
}
