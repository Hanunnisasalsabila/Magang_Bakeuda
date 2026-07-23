/**
 * Mapper: DAT_OBJEK_PAJAK (Oracle) → ObjekPajak (Prisma/PostgreSQL)
 */

export interface OracleObjekPajak {
  KD_PROPINSI: string;
  KD_DATI2: string;
  KD_KECAMATAN: string;
  KD_KELURAHAN: string;
  KD_BLOK: string;
  NO_URUT: string;
  KD_JNS_OP: string;
  SUBJEK_PAJAK_ID: string | null;
  NO_PERSIL: string | null;
  JALAN_OP: string | null;
  BLOK_KAV_NO_OP: string | null;
  RW_OP: string | null;
  RT_OP: string | null;
  TOTAL_LUAS_BUMI: number | null;
  TOTAL_LUAS_BNG: number | null;
  NJOP_BUMI: number | null;
  NJOP_BNG: number | null;
  NIP_PENDATA: string | null;
  NIP_PEMERIKSA_OP: string | null;
}

export interface PrismaObjekPajakUpsert {
  nop: string;
  kode_wilayah: string;
  kode_blok: string;
  no_urut: string;
  kode_jenis_op: string;
  nik_subjek: string;
  no_persil: string | null;
  jalan_op: string;
  blok_kav_no: string | null;
  rw_op: string | null;
  rt_op: string | null;
  jenis_tanah: any;
  luas_tanah: number;
  luas_bangunan: number;
  njop_tanah: number | null;
  njop_bangunan: number | null;
  njop_total: number | null;
  nip_pendata: string | null;
  nip_pemeriksa: string | null;
  oracle_synced_at: Date;
  oracle_source: boolean;
}

function trimOrNull(val: string | null | undefined): string | null {
  if (val == null) return null;
  const trimmed = val.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function mapOracleObjekToPrisma(
  row: OracleObjekPajak,
  nikSubjekFallback: string,
): PrismaObjekPajakUpsert {
  const kodeWilayah = `${row.KD_PROPINSI}${row.KD_DATI2}${row.KD_KECAMATAN}${row.KD_KELURAHAN}`;
  const nop = `${kodeWilayah}${row.KD_BLOK}${row.NO_URUT}${row.KD_JNS_OP}`;
  
  const subjekId = trimOrNull(row.SUBJEK_PAJAK_ID) ?? '';
  const nikSubjek = subjekId.length <= 16 ? subjekId : (subjekId.substring(0, 16) || nikSubjekFallback);

  const njopBumi = row.NJOP_BUMI ?? 0;
  const njopBng = row.NJOP_BNG ?? 0;

  return {
    nop,
    kode_wilayah: kodeWilayah,
    kode_blok: row.KD_BLOK,
    no_urut: row.NO_URUT,
    kode_jenis_op: row.KD_JNS_OP,
    nik_subjek: nikSubjek,
    no_persil: trimOrNull(row.NO_PERSIL),
    jalan_op: trimOrNull(row.JALAN_OP) ?? '-',
    blok_kav_no: trimOrNull(row.BLOK_KAV_NO_OP),
    rw_op: trimOrNull(row.RW_OP),
    rt_op: trimOrNull(row.RT_OP),
    jenis_tanah: 'TANAH_BANGUNAN', // Default, bisa disesuaikan logicnya
    luas_tanah: row.TOTAL_LUAS_BUMI ?? 0,
    luas_bangunan: row.TOTAL_LUAS_BNG ?? 0,
    njop_tanah: row.NJOP_BUMI,
    njop_bangunan: row.NJOP_BNG,
    njop_total: njopBumi + njopBng,
    nip_pendata: trimOrNull(row.NIP_PENDATA),
    nip_pemeriksa: trimOrNull(row.NIP_PEMERIKSA_OP),
    oracle_synced_at: new Date(),
    oracle_source: true,
  };
}

export function mapPrismaObjekToOracle(prismaData: {
  nop: string;
  kode_wilayah: string;
  kode_blok: string;
  no_urut: string;
  kode_jenis_op: string;
  legacy_subjek_id?: string | null;
  nik_subjek: string;
  no_persil?: string | null;
  jalan_op: string;
  blok_kav_no?: string | null;
  rw_op?: string | null;
  rt_op?: string | null;
  luas_tanah: number;
  luas_bangunan: number;
  njop_tanah?: number | null;
  njop_bangunan?: number | null;
  nip_pendata?: string | null;
  nip_pemeriksa?: string | null;
}): Record<string, unknown> {
  return {
    KD_PROPINSI: prismaData.kode_wilayah.substring(0, 2),
    KD_DATI2: prismaData.kode_wilayah.substring(2, 4),
    KD_KECAMATAN: prismaData.kode_wilayah.substring(4, 7),
    KD_KELURAHAN: prismaData.kode_wilayah.substring(7, 10),
    KD_BLOK: prismaData.kode_blok,
    NO_URUT: prismaData.no_urut,
    KD_JNS_OP: prismaData.kode_jenis_op,
    SUBJEK_PAJAK_ID: prismaData.legacy_subjek_id ?? prismaData.nik_subjek,
    NO_PERSIL: prismaData.no_persil ?? null,
    JALAN_OP: prismaData.jalan_op,
    BLOK_KAV_NO_OP: prismaData.blok_kav_no ?? null,
    RW_OP: prismaData.rw_op ? prismaData.rw_op.replace(/^0+/, '').padStart(2, '0').substring(0, 2) : null,
    RT_OP: prismaData.rt_op ? prismaData.rt_op.replace(/^0+/, '').padStart(2, '0').substring(0, 2) : null,
    TOTAL_LUAS_BUMI: Number(prismaData.luas_tanah || 0),
    TOTAL_LUAS_BNG: Number(prismaData.luas_bangunan || 0),
    NJOP_BUMI: Number(prismaData.njop_tanah || 0),
    NJOP_BNG: Number(prismaData.njop_bangunan || 0),
    NO_FORMULIR_SPOP: '00000000000',
    TGL_PENDATAAN_OP: new Date(),
    TGL_PEMERIKSAAN_OP: new Date(),
    NIP_PENDATA: prismaData.nip_pendata ? prismaData.nip_pendata.substring(0, 9) : '000000000',
    NIP_PEMERIKSA_OP: prismaData.nip_pemeriksa ? prismaData.nip_pemeriksa.substring(0, 9) : '000000000',
    NIP_PEREKAM_OP: '000000000',
    TGL_PEREKAMAN_OP: new Date(),
  };
}
