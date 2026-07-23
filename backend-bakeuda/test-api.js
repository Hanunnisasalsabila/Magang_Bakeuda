import jwt from 'jsonwebtoken';

const token = jwt.sign({ userId: 'admin', role: 'BAKEUDA', username: 'admin' }, 'pbb_bakeuda_123');

const payload = {
  "jenis_transaksi": "BARU",
  "menggunakan_kuasa": false,
  "tahun_pajak": 2026,
  "detail_asal": undefined,
  "detail_tujuan": [
    {
      "nik_calon_subjek": "0000000000000000",
      "calon_subjek_json": {
        "nik": "0000000000000000",
        "nama_subjek": "TANPA NAMA",
        "status_wp": "PEMILIK",
        "pekerjaan": "LAINNYA",
        "alamat_jalan": "TANPA ALAMAT",
        "rt": "",
        "rw": "",
        "kelurahan": "",
        "kecamatan": undefined,
        "kabupaten": "Purbalingga"
      },
      "luas_tanah_baru": 0,
      "luas_bangunan_baru": 0,
      "jumlah_bangunan_baru": 0,
      "jenis_tanah_baru": "TANAH_BANGUNAN",
      "jalan_op_baru": "",
      "kode_wilayah_baru": undefined,
      "blok_kav_no_baru": "Blok A No 12",
      "rt_op_baru": undefined,
      "rw_op_baru": undefined,
      "kelurahan_op_baru": "",
      "kecamatan_op_baru": "",
      "latitude": undefined,
      "longitude": undefined,
      "koordinat_polygon": [],
      "batas_utara": undefined,
      "batas_selatan": undefined,
      "batas_timur": undefined,
      "batas_barat": undefined,
      "data_bangunan_json": undefined
    }
  ],
  "lampiran": []
};

async function test() {
  const res = await fetch(`http://localhost:3000/api/transaksi-spop`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  
  const text = await res.text();
  console.log('STATUS:', res.status);
  console.log('RESPONSE:', text);
}

test();
