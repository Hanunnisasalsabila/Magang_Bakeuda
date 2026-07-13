const fs = require('fs');
const https = require('https');

const KECAMATAN_CODES = [
  "01", "02", "03", "04", "05", "06", "07", "08", "09",
  "10", "11", "12", "13", "14", "15", "16", "17", "18"
];

async function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function main() {
  let allVillages = [];
  console.log('Fetching data...');
  for (const kodeKec of KECAMATAN_CODES) {
    try {
      const url = `https://ibnux.github.io/data-indonesia/kelurahan/3303${kodeKec}.json`;
      const data = await fetchJson(url);
      data.forEach(kel => {
        // kel.id is like "3303012001"
        // kel.nama is like "KEMANGKON"
        allVillages.push({
          kode_wilayah: kel.id,
          nama_desa: kel.nama,
          kode_kel: kel.id.substring(6, 10) || kel.id.substring(6), // Last 4 digits (or however long it is)
          kode_kec: kodeKec,
          kecamatan: "Unknown", // Will map later or we don't strictly need it if we fetch kecamatans too
          kabupaten: 'Purbalingga',
          kode_kab: '3303'
        });
      });
      console.log(`Fetched ${data.length} villages for kec ${kodeKec}`);
    } catch (e) {
      console.error(`Failed to fetch for ${kodeKec}`, e.message);
    }
  }

  // Also fetch kecamatans to get names
  const kecamatans = await fetchJson('https://ibnux.github.io/data-indonesia/kecamatan/3303.json');
  const kecMap = {};
  kecamatans.forEach(k => {
    // k.id is like "330301"
    const kode = k.id.substring(4, 6);
    kecMap[kode] = k.nama;
  });

  allVillages = allVillages.map(v => ({
    ...v,
    kecamatan: kecMap[v.kode_kec] || v.kecamatan
  }));

  console.log(`Total villages: ${allVillages.length}`);
  fs.writeFileSync('prisma/seed_wilayah.json', JSON.stringify(allVillages, null, 2));
  console.log('Done writing to prisma/seed_wilayah.json');
}

main();
