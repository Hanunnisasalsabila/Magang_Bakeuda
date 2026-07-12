import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class VerifikasiDesaDto {
  @IsNotEmpty({ message: 'NIP Pemeriksa tidak boleh kosong.' })
  @IsString()
  nipPemeriksaDesa: string;

  @IsNotEmpty({ message: 'Dokumen fisik harus diunggah.' })
  @IsString() // Using IsString for base64 or relative urls for now
  urlDokumenFisik: string;
}
