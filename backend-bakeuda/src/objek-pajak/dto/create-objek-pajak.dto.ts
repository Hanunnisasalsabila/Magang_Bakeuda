import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
  IsInt,
  IsBoolean,
  IsPositive,
  Length,
  MaxLength,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  JenisTanah,
  KondisiBangunan,
  JenisKonstruksi,
  JenisAtap,
  JenisDinding,
  JenisLantai,
  JenisLangitLangit,
  BahanPagar,
} from '@prisma/client';

// ─────────────────────────────────────────
// FASILITAS BANGUNAN (opsional, sesuai SPOP Lampiran B field 17–27)
// ─────────────────────────────────────────
export class FasilitasBangunanDto {
  // 17. AC
  @IsOptional() @IsInt() jumlah_ac_split?: number;
  @IsOptional() @IsInt() jumlah_ac_window?: number;

  // 18. AC Sentral
  @IsOptional() @IsBoolean() ac_sentral?: boolean;

  // 19. Kolam Renang
  @IsOptional() @IsNumber() luas_kolam_renang?: number;
  @IsOptional() @IsBoolean() kolam_diplester?: boolean;
  @IsOptional() @IsBoolean() kolam_dengan_pelapis?: boolean;

  // 20. Perkerasan Halaman
  @IsOptional() @IsNumber() perkerasan_ringan?: number;
  @IsOptional() @IsNumber() perkerasan_sedang?: number;
  @IsOptional() @IsNumber() perkerasan_berat?: number;
  @IsOptional() @IsNumber() perkerasan_dengan_penutup?: number;

  // 21. Lapangan Tenis
  @IsOptional() @IsInt() tenis_beton_dgn_lampu?: number;
  @IsOptional() @IsInt() tenis_beton_tanpa_lampu?: number;
  @IsOptional() @IsInt() tenis_aspal_dgn_lampu?: number;
  @IsOptional() @IsInt() tenis_aspal_tanpa_lampu?: number;
  @IsOptional() @IsInt() tenis_tanah_rumput_dgn_lampu?: number;
  @IsOptional() @IsInt() tenis_tanah_rumput_tanpa_lampu?: number;

  // 22. Lift
  @IsOptional() @IsInt() lift_penumpang?: number;
  @IsOptional() @IsInt() lift_kapsul?: number;
  @IsOptional() @IsInt() lift_barang?: number;

  // 23. Tangga Berjalan
  @IsOptional() @IsInt() tangga_berjalan_lbr_kurang_080m?: number;
  @IsOptional() @IsInt() tangga_berjalan_lbr_lebih_080m?: number;

  // 24. Pagar
  @IsOptional() @IsNumber() panjang_pagar_m?: number;
  @IsOptional() @IsEnum(BahanPagar) bahan_pagar?: BahanPagar;

  // 25. Pemadam Kebakaran
  @IsOptional() @IsBoolean() hydrant_ada?: boolean;
  @IsOptional() @IsBoolean() sprinkler_ada?: boolean;
  @IsOptional() @IsBoolean() fire_alarm_ada?: boolean;

  // 26. Saluran PABX
  @IsOptional() @IsInt() jumlah_saluran_pabx?: number;

  // 27. Sumur Artesis
  @IsOptional() @IsNumber() kedalaman_sumur_artesis_m?: number;
}

// ─────────────────────────────────────────
// BANGUNAN — 1 item per bangunan dalam 1 NOP
// ─────────────────────────────────────────
export class BumiDto {
  @IsNumber()
  @IsPositive()
  luas_bumi: number;

  @IsString()
  @IsOptional()
  @MaxLength(2)
  kode_znt?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1)
  jenis_bumi?: string;

  @IsNumber()
  @IsOptional()
  nilai_sistem_bumi?: number;
}

export class BangunanDto {
  @IsNumber()
  @IsPositive()
  luas_bangunan: number;

  @IsString()
  @IsOptional()
  @MaxLength(2)
  kode_jpb?: string;

  @IsNumber()
  @IsOptional()
  tahun_dibangun?: number;

  @IsNumber()
  @IsOptional()
  jumlah_lantai?: number;

  @IsInt()
  @IsOptional()
  daya_listrik_watt?: number; // BARU — SPOP Lampiran field 10

  @IsOptional()
  @IsEnum(KondisiBangunan)
  kondisi_bangunan?: KondisiBangunan;

  @IsOptional()
  @IsEnum(JenisKonstruksi)
  jenis_konstruksi?: JenisKonstruksi;

  @IsOptional()
  @IsEnum(JenisAtap)
  jenis_atap?: JenisAtap;

  @IsOptional()
  @IsEnum(JenisDinding)
  kode_dinding?: JenisDinding;

  @IsOptional()
  @IsEnum(JenisLantai)
  kode_lantai?: JenisLantai;

  @IsOptional()
  @IsEnum(JenisLangitLangit)
  kode_langit_langit?: JenisLangitLangit;

  @IsOptional()
  @ValidateNested()
  @Type(() => FasilitasBangunanDto)
  fasilitas?: FasilitasBangunanDto; // BARU — SPOP Lampiran B field 17–27
}

// ─────────────────────────────────────────
// MAIN DTO
// ─────────────────────────────────────────
export class CreateObjekPajakDto {
  @IsString()
  @IsNotEmpty()
  @Length(10, 10)
  kode_wilayah?: string; // Diberi opsional di DTO karena bisa diisi otomatis di Service (untuk DESA)

  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  kode_blok: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 1)
  kode_jenis_op: string;

  @IsString()
  @IsNotEmpty()
  @Length(16, 16)
  nik_subjek: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  no_persil?: string;

  @IsString()
  @IsNotEmpty()
  jalan_op: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  blok_kav_no?: string;

  @IsString()
  @IsOptional()
  @MaxLength(5)
  rw_op?: string;

  @IsString()
  @IsOptional()
  @MaxLength(5)
  rt_op?: string;



  @IsEnum(JenisTanah)
  jenis_tanah: JenisTanah;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1, { message: 'Minimal 1 data bumi diperlukan' })
  @Type(() => BumiDto)
  bumi: BumiDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => BangunanDto)
  bangunan?: BangunanDto[];
}
