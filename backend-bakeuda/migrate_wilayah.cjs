const fs = require('fs');
const path = require('path');

const seedWilayahPath = path.join(__dirname, 'prisma', 'seed_wilayah.json');
const wilayahDataPath = path.join(__dirname, '..', 'frontend-bakeuda', 'src', 'utils', 'wilayahData.json');

function transformData(filePath) {
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const updatedData = data.map(d => {
      // Avoid re-processing if already in NOP format
      if (d.kode_wilayah.length === 10 && d.kode_kec.length === 3) return d;
      
      const newKodeKec = d.kode_kec.padEnd(3, '0'); // '01' -> '010'
      const newKodeKel = d.kode_kel.length === 4 ? d.kode_kel.substring(1) : d.kode_kel; // '2007' -> '007'
      const newKodeWilayah = d.kode_kab + newKodeKec + newKodeKel;
      return {
        ...d,
        kode_kec: newKodeKec,
        kode_kel: newKodeKel,
        kode_wilayah: newKodeWilayah
      };
    });
    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));
    console.log(`Updated ${filePath}`);
  } else {
    console.log(`File not found: ${filePath}`);
  }
}

transformData(seedWilayahPath);
transformData(wilayahDataPath);
