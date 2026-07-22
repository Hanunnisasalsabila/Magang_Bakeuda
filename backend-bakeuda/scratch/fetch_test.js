const http = require('http');

const payload = JSON.stringify({
  "jenis_transaksi": "PECAH",
  "tahun_pajak": 2026,
  "tanggal_pengajuan": "2026-07-22T07:12:00.000Z",
  "detail_asal": [
    {
      "nop_asal": "330301000100900020",
      "nonaktifkan_saat_disetujui": true
    }
  ],
  "detail_tujuan": [
    {
      "nik_calon_subjek": "0000000000000000",
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
      "jenis_tanah_baru": "BUMI_BANGUNAN",
      "kelurahan_op_baru": "",
      "kecamatan_op_baru": "",
      "koordinat_polygon": []
    }
  ]
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/transaksi-spop',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': payload.length
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Response: ${data}`);
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(payload);
req.end();
