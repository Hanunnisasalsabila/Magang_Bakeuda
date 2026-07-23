import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { SubmitTransaksiDto } from '../src/transaksi-spop/dto/submit-transaksi.dto.js';

async function run() {
  const payload = {
    "jenis_transaksi": "PECAH",
    "tahun_pajak": 2026,
    "tanggal_pengajuan": "2026-07-22T07:11:00.000Z",
    "detail_asal": [
      {
        "nop_asal": "330301000100900020",
        "nonaktifkan_saat_disetujui": true
      }
    ],
    "detail_tujuan": [
      {
        "calon_subjek_json": {
          "nik": "0000000000000000",
          "nama_subjek": "TANPA NAMA",
          "alamat_jalan": "TANPA ALAMAT",
          "rt": "",
          "rw": "",
          "kelurahan": "",
          "kabupaten": "Purbalingga"
        },
        "luas_tanah_baru": 0,
        "luas_bangunan_baru": 0,
        "jumlah_bangunan_baru": 0,
        "kelurahan_op_baru": "",
        "kecamatan_op_baru": "",
        "jenis_tanah_baru": "BUMI_BANGUNAN",
        "koordinat_polygon": []
      }
    ]
  };

  const dto = plainToInstance(SubmitTransaksiDto, payload);
  const errors = await validate(dto, { whitelist: true, forbidNonWhitelisted: true });
  
  if (errors.length > 0) {
    console.log(JSON.stringify(errors, null, 2));
  } else {
    console.log("Validation passed!");
  }
}

run().catch(console.error);
