/**
 * Mapper: DAT_OP_BUMI (Oracle) → ObjekBumi (Prisma/PostgreSQL)
 */

export interface OracleObjekBumi {
  KD_PROPINSI: string;
  KD_DATI2: string;
  KD_KECAMATAN: string;
  KD_KELURAHAN: string;
  KD_BLOK: string;
  NO_URUT: string;
  KD_JNS_OP: string;
  NO_BUMI: number;
  KD_ZNT: string | null;
  LUAS_BUMI: number | null;
  JNS_BUMI: string | null;
  NILAI_SISTEM_BUMI: number | null;
  STATUS_BLOKIR: string | null;
  KETERANGAN_BLOKIR: string | null;
  THN_BLOKIR: string | null;
  NIP_REKAM_BLOKIR: string | null;
}

export interface PrismaObjekBumiUpsert {
  nop: string;
  no_bumi: number;
  kode_znt: string | null;
  luas_bumi: number;
  jenis_bumi: string | null;
  nilai_sistem_bumi: number;
  status_blokir: boolean;
  keterangan_blokir: string | null;
  tahun_blokir: string | null;
  oracle_synced_at: Date;
}

function trimOrNull(val: string | null | undefined): string | null {
  if (val == null) return null;
  const trimmed = val.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function mapOracleBumiToPrisma(
  row: OracleObjekBumi
): PrismaObjekBumiUpsert {
  const nop = `${row.KD_PROPINSI}${row.KD_DATI2}${row.KD_KECAMATAN}${row.KD_KELURAHAN}${row.KD_BLOK}${row.NO_URUT}${row.KD_JNS_OP}`;
  
  return {
    nop,
    no_bumi: row.NO_BUMI,
    kode_znt: trimOrNull(row.KD_ZNT),
    luas_bumi: row.LUAS_BUMI ?? 0,
    jenis_bumi: trimOrNull(row.JNS_BUMI),
    nilai_sistem_bumi: row.NILAI_SISTEM_BUMI ?? 0,
    status_blokir: row.STATUS_BLOKIR === '1',
    keterangan_blokir: trimOrNull(row.KETERANGAN_BLOKIR),
    tahun_blokir: trimOrNull(row.THN_BLOKIR),
    oracle_synced_at: new Date(),
  };
}

export function mapPrismaBumiToOracle(prismaData: {
  nop: string;
  no_bumi: number;
  kode_znt?: string | null;
  luas_bumi: number;
  jenis_bumi?: string | null;
  nilai_sistem_bumi: number;
  status_blokir: boolean;
  keterangan_blokir?: string | null;
  tahun_blokir?: string | null;
}): Record<string, unknown> {
  const kodeWilayah = prismaData.nop.substring(0, 10);
  
  return {
    KD_PROPINSI: kodeWilayah.substring(0, 2),
    KD_DATI2: kodeWilayah.substring(2, 4),
    KD_KECAMATAN: kodeWilayah.substring(4, 7),
    KD_KELURAHAN: kodeWilayah.substring(7, 10),
    KD_BLOK: prismaData.nop.substring(10, 13),
    NO_URUT: prismaData.nop.substring(13, 17),
    KD_JNS_OP: prismaData.nop.substring(17, 18),
    NO_BUMI: prismaData.no_bumi,
    KD_ZNT: prismaData.kode_znt ?? null,
    LUAS_BUMI: prismaData.luas_bumi,
    JNS_BUMI: prismaData.jenis_bumi ?? null,
    NILAI_SISTEM_BUMI: prismaData.nilai_sistem_bumi,
    STATUS_BLOKIR: prismaData.status_blokir ? '1' : '0',
    KETERANGAN_BLOKIR: prismaData.keterangan_blokir ?? null,
    THN_BLOKIR: prismaData.tahun_blokir ?? null,
  };
}
