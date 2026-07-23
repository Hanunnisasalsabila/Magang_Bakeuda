import http from 'http';

const payload = {
  jenis_transaksi: "BARU",
  tahun_pajak: 2026,
  tanggal_pengajuan: new Date().toISOString(),
  menggunakan_kuasa: false,
  detail_tujuan: [{
    luas_tanah_baru: 100,
    luas_bangunan_baru: 0,
    jumlah_bangunan_baru: 0,
    jenis_tanah_baru: "TANAH_KOSONG",
    rt_op_baru: "01",
    rw_op_baru: "02",
    kelurahan_op_baru: "Kelurahan",
    kecamatan_op_baru: "Kecamatan",
    latitude: "-7.3",
    longitude: "109.3",
    koordinat_polygon: [{"lat": -7.3, "lng": 109.3}]
  }]
};

const data = JSON.stringify(payload);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/transaksi-spop/draft',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => console.log('Response:', res.statusCode, body));
});

req.on('error', (e) => console.error(e));
req.write(data);
req.end();
