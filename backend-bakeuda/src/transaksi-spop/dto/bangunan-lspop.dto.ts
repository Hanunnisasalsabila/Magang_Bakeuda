import { IsString, IsNumber, IsOptional, Min, Max, Matches } from 'class-validator';

export class BangunanLspopDto {
  @IsOptional() @IsString() noFormulir?: string;
  @IsOptional() @IsString() jenisTransaksi?: string;
  @IsOptional() @IsString() jumlahBng?: string;
  @IsOptional() @IsString() bangunanM2?: string;

  // A. Rincian
  @IsOptional() @IsString() jenisPenggunaan?: string;
  @IsOptional() @IsNumber() @Min(0) luasBangunan?: number;
  @IsOptional() @IsNumber() @Min(1) @Max(99) jumlahLantai?: number;
  @IsOptional() @IsString() @Matches(/^\d{4}$/, { message: 'Tahun dibangun harus 4 digit' }) tahunDibangun?: string;
  @IsOptional() @IsString() @Matches(/^\d{4}$/, { message: 'Tahun direnovasi harus 4 digit' }) tahunDirenovasi?: string;
  @IsOptional() @IsNumber() @Min(0) dayaListrik?: number;
  @IsOptional() @IsString() kondisi?: string;
  @IsOptional() @IsString() konstruksi?: string;
  @IsOptional() @IsString() atap?: string;
  @IsOptional() @IsString() dinding?: string;
  @IsOptional() @IsString() lantai?: string;
  @IsOptional() @IsString() langitLangit?: string;

  // B. Fasilitas
  @IsOptional() @IsNumber() @Min(0) acSplit?: number;
  @IsOptional() @IsNumber() @Min(0) acWindow?: number;
  @IsOptional() @IsString() acSentral?: string;
  @IsOptional() @IsNumber() @Min(0) kolamRenangLuas?: number;
  @IsOptional() @IsString() kolamRenangFinishing?: string;
  @IsOptional() @IsNumber() @Min(0) halamanRingan?: number;
  @IsOptional() @IsNumber() @Min(0) halamanSedang?: number;
  @IsOptional() @IsNumber() @Min(0) halamanBerat?: number;
  @IsOptional() @IsNumber() @Min(0) halamanPenutupLantai?: number;
  @IsOptional() @IsNumber() @Min(0) lapanganTenisLampuBeton?: number;
  @IsOptional() @IsNumber() @Min(0) lapanganTenisLampuAspal?: number;
  @IsOptional() @IsNumber() @Min(0) lapanganTenisLampuTanah?: number;
  @IsOptional() @IsNumber() @Min(0) lapanganTenisTanpaLampuBeton?: number;
  @IsOptional() @IsNumber() @Min(0) lapanganTenisTanpaLampuAspal?: number;
  @IsOptional() @IsNumber() @Min(0) lapanganTenisTanpaLampuTanah?: number;
  @IsOptional() @IsNumber() @Min(0) liftPenumpang?: number;
  @IsOptional() @IsNumber() @Min(0) liftKapsul?: number;
  @IsOptional() @IsNumber() @Min(0) liftBarang?: number;
  @IsOptional() @IsNumber() @Min(0) tanggaBerjalanKecil?: number;
  @IsOptional() @IsNumber() @Min(0) tanggaBerjalanBesar?: number;
  @IsOptional() @IsNumber() @Min(0) panjangPagar?: number;
  @IsOptional() @IsString() bahanPagar?: string;
  @IsOptional() @IsNumber() @Min(0) pemadamHydrant?: number;
  @IsOptional() @IsNumber() @Min(0) pemadamSprinkler?: number;
  @IsOptional() @IsNumber() @Min(0) pemadamFireAl?: number;
  @IsOptional() @IsNumber() @Min(0) saluranPabx?: number;
  @IsOptional() @IsNumber() @Min(0) sumurArtesis?: number;
}
