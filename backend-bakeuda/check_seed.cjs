const fs = require('fs');

const data = JSON.parse(fs.readFileSync('d:/Kuliah/magang/Magang_Bakeuda/backend-bakeuda/prisma/seed_wilayah.json', 'utf8'));

console.log("Total entries:", data.length);
console.log("First 5 entries:");
console.log(data.slice(0, 5));

// check lengths of kode_kec and kode_kel
const kecLengths = new Set(data.map(d => d.kode_kec.length));
const kelLengths = new Set(data.map(d => d.kode_kel.length));

console.log("Kode Kec lengths:", Array.from(kecLengths));
console.log("Kode Kel lengths:", Array.from(kelLengths));
