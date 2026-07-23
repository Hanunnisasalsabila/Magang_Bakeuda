/**
 * Mapper: DAT_OP_BANGUNAN (Oracle) → ObjekBangunan (Prisma/PostgreSQL)
 */

const KONDISI_MAP: Record<string, string> = {
  '1': 'SANGAT_BAIK',
  '2': 'BAIK',
  '3': 'SEDANG',
  '4': 'JELEK',
};

const KONSTRUKSI_MAP: Record<string, string> = {
  '1': 'BAJA',
  '2': 'BETON',
  '3': 'BATU_BATA',
  '4': 'KAYU',
};

const ATAP_MAP: Record<string, string> = {
  '1': 'DECRABON_BETON_GLAZUR',
  '2': 'GENTENG_BETON_ALUMINIUM',
  '3': 'GENTENG_BIASA_SIRAP',
  '4': 'ASBES',
  '5': 'SENG',
};

const DINDING_MAP: Record<string, string> = {
  '1': 'KACA_ALUMINIUM',
  '2': 'BETON',
  '3': 'BATU_BATA_CONBLOK',
  '4': 'KAYU',
  '5': 'SENG',
  '6': 'TIDAK_ADA_DINDING',
};

const LANTAI_MAP: Record<string, string> = {
  '1': 'MARMER',
  '2': 'KERAMIK',
  '3': 'TERASO',
  '4': 'UBIN_PC_PAPAN',
  '5': 'SEMEN',
};

const LANGIT_LANGIT_MAP: Record<string, string> = {
  '1': 'AKUSTIK_JATI',
  '2': 'TRIPLEK_ASBES_BAMBU',
  '3': 'TIDAK_ADA',
};


export interface OracleObjekBangunan {
  KD_PROPINSI: string;
  KD_DATI2: string;
  KD_KECAMATAN: string;
  KD_KELURAHAN: string;
  KD_BLOK: string;
  NO_URUT: string;
  KD_JNS_OP: string;
  NO_BNG: number;
  KD_JPB: string | null;
  NO_FORMULIR_LSPOP: string | null;
  THN_DIBANGUN_BNG: string | null;
  THN_RENOVASI_BNG: string | null;
  LUAS_BNG: number | null;
  JML_LANTAI_BNG: number | null;
  KONDISI_BNG: string | null;
  JNS_KONSTRUKSI_BNG: string | null;
  JNS_ATAP_BNG: string | null;
  KD_DINDING: string | null;
  KD_LANTAI: string | null;
  KD_LANGIT_LANGIT: string | null;
  NILAI_SISTEM_BNG: number | null;
  NIP_PENDATA_BNG: string | null;
  NIP_PEMERIKSA_BNG: string | null;
  KETERANGAN_JPB: string | null;
}

export interface PrismaObjekBangunanUpsert {
  nop: string;
  no_bangunan: number;
  kode_jpb: string | null;
  no_formulir_lspop: string | null;
  tahun_dibangun: number | null;
  tahun_renovasi: number | null;
  luas_bangunan: number;
  jumlah_lantai: number;
  kondisi_bangunan: any;
  jenis_konstruksi: any;
  jenis_atap: any;
  kode_dinding: any;
  kode_lantai: any;
  kode_langit_langit: any;
  nilai_sistem_bangunan: number | null;
  nip_pendata: string | null;
  nip_pemeriksa: string | null;
  keterangan_jpb: string | null;
  oracle_synced_at: Date;
}

function trimOrNull(val: string | null | undefined): string | null {
  if (val == null) return null;
  const trimmed = val.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function mapOracleBangunanToPrisma(
  row: OracleObjekBangunan
): PrismaObjekBangunanUpsert {
  const nop = `${row.KD_PROPINSI}${row.KD_DATI2}${row.KD_KECAMATAN}${row.KD_KELURAHAN}${row.KD_BLOK}${row.NO_URUT}${row.KD_JNS_OP}`;
  
  const thnDibangun = trimOrNull(row.THN_DIBANGUN_BNG);
  const thnRenovasi = trimOrNull(row.THN_RENOVASI_BNG);

  return {
    nop,
    no_bangunan: row.NO_BNG,
    kode_jpb: trimOrNull(row.KD_JPB),
    no_formulir_lspop: trimOrNull(row.NO_FORMULIR_LSPOP),
    tahun_dibangun: thnDibangun ? parseInt(thnDibangun, 10) : null,
    tahun_renovasi: thnRenovasi ? parseInt(thnRenovasi, 10) : null,
    luas_bangunan: row.LUAS_BNG ?? 0,
    jumlah_lantai: row.JML_LANTAI_BNG ?? 1,
    kondisi_bangunan: KONDISI_MAP[trimOrNull(row.KONDISI_BNG) ?? ''] || null,
    jenis_konstruksi: KONSTRUKSI_MAP[trimOrNull(row.JNS_KONSTRUKSI_BNG) ?? ''] || null,
    jenis_atap: ATAP_MAP[trimOrNull(row.JNS_ATAP_BNG) ?? ''] || null,
    kode_dinding: DINDING_MAP[trimOrNull(row.KD_DINDING) ?? ''] || null,
    kode_lantai: LANTAI_MAP[trimOrNull(row.KD_LANTAI) ?? ''] || null,
    kode_langit_langit: LANGIT_LANGIT_MAP[trimOrNull(row.KD_LANGIT_LANGIT) ?? ''] || null,
    nilai_sistem_bangunan: row.NILAI_SISTEM_BNG,
    nip_pendata: trimOrNull(row.NIP_PENDATA_BNG),
    nip_pemeriksa: trimOrNull(row.NIP_PEMERIKSA_BNG),
    keterangan_jpb: trimOrNull(row.KETERANGAN_JPB),
    oracle_synced_at: new Date(),
  };
}

export function mapPrismaBangunanToOracle(prismaData: {
  nop: string;
  no_bangunan: number;
  kode_jpb?: string | null;
  no_formulir_lspop?: string | null;
  tahun_dibangun?: number | null;
  tahun_renovasi?: number | null;
  luas_bangunan: number;
  jumlah_lantai: number;
  kondisi_bangunan?: string | null;
  jenis_konstruksi?: string | null;
  jenis_atap?: string | null;
  kode_dinding?: string | null;
  kode_lantai?: string | null;
  kode_langit_langit?: string | null;
  nilai_sistem_bangunan?: number | null;
  nip_pendata?: string | null;
  nip_pemeriksa?: string | null;
  keterangan_jpb?: string | null;
}): Record<string, unknown> {
  const kodeWilayah = prismaData.nop.substring(0, 10);
  
  // Reverse maps
  const KONDISI_REV: Record<string, string> = { SANGAT_BAIK: '1', BAIK: '2', SEDANG: '3', JELEK: '4' };
  const KONSTRUKSI_REV: Record<string, string> = { BAJA: '1', BETON: '2', BATU_BATA: '3', KAYU: '4' };
  const ATAP_REV: Record<string, string> = { DECRABON_BETON_GLAZUR: '1', GENTENG_BETON_ALUMINIUM: '2', GENTENG_BIASA_SIRAP: '3', ASBES: '4', SENG: '5' };
  const DINDING_REV: Record<string, string> = { KACA_ALUMINIUM: '1', BETON: '2', BATU_BATA_CONBLOK: '3', KAYU: '4', SENG: '5', TIDAK_ADA_DINDING: '6' };
  const LANTAI_REV: Record<string, string> = { MARMER: '1', KERAMIK: '2', TERASO: '3', UBIN_PC_PAPAN: '4', SEMEN: '5' };
  const LANGIT_LANGIT_REV: Record<string, string> = { AKUSTIK_JATI: '1', TRIPLEK_ASBES_BAMBU: '2', TIDAK_ADA: '3' };


  return {
    KD_PROPINSI: kodeWilayah.substring(0, 2),
    KD_DATI2: kodeWilayah.substring(2, 4),
    KD_KECAMATAN: kodeWilayah.substring(4, 7),
    KD_KELURAHAN: kodeWilayah.substring(7, 10),
    KD_BLOK: prismaData.nop.substring(10, 13),
    NO_URUT: prismaData.nop.substring(13, 17),
    KD_JNS_OP: prismaData.nop.substring(17, 18),
    NO_BNG: prismaData.no_bangunan,
    KD_JPB: prismaData.kode_jpb ?? null,
    NO_FORMULIR_LSPOP: prismaData.no_formulir_lspop ?? null,
    THN_DIBANGUN_BNG: prismaData.tahun_dibangun ? prismaData.tahun_dibangun.toString() : null,
    THN_RENOVASI_BNG: prismaData.tahun_renovasi ? prismaData.tahun_renovasi.toString() : null,
    LUAS_BNG: prismaData.luas_bangunan,
    JML_LANTAI_BNG: prismaData.jumlah_lantai,
    KONDISI_BNG: prismaData.kondisi_bangunan ? (KONDISI_REV[prismaData.kondisi_bangunan] || null) : null,
    JNS_KONSTRUKSI_BNG: prismaData.jenis_konstruksi ? (KONSTRUKSI_REV[prismaData.jenis_konstruksi] || null) : null,
    JNS_ATAP_BNG: prismaData.jenis_atap ? (ATAP_REV[prismaData.jenis_atap] || null) : null,
    KD_DINDING: prismaData.kode_dinding ? (DINDING_REV[prismaData.kode_dinding] || null) : null,
    KD_LANTAI: prismaData.kode_lantai ? (LANTAI_REV[prismaData.kode_lantai] || null) : null,
    KD_LANGIT_LANGIT: prismaData.kode_langit_langit ? (LANGIT_LANGIT_REV[prismaData.kode_langit_langit] || null) : null,
    NILAI_SISTEM_BNG: prismaData.nilai_sistem_bangunan ?? null,
    NIP_PENDATA_BNG: prismaData.nip_pendata ?? null,
    NIP_PEMERIKSA_BNG: prismaData.nip_pemeriksa ?? null,
    KETERANGAN_JPB: prismaData.keterangan_jpb ?? null,
  };
}
