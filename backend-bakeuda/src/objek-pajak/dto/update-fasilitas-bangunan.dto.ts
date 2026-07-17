import {
  IsOptional,
  IsInt,
  IsBoolean,
  IsNumber,
  IsString,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { BahanPagar } from '@prisma/client';

/**
 * DTO untuk update/upsert fasilitas bangunan.
 * Dipakai di endpoint: PUT /objek-pajak/bangunan/:idBangunan/fasilitas
 * Semua field optional — hanya kirim field yang ingin diubah.
 */
export class UpdateFasilitasBangunanDto {
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
