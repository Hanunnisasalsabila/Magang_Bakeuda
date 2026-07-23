import { Prisma } from '@prisma/client';

export interface OracleRefJpb {
  KD_JPB: string;
  NM_JPB: string;
}

export function mapOracleRefJpbToPrisma(
  row: OracleRefJpb,
): Prisma.ReferensiJenisPenggunaanBangunanUpsertArgs['create'] {
  const kode = (row.KD_JPB || '').trim();
  const nama = (row.NM_JPB || '').trim();
  
  return {
    kode_jpb: kode,
    nama_jpb: nama,
    is_active: true,
  };
}
