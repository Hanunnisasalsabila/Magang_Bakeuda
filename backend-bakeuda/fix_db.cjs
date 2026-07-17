
const { Client } = require('pg');
require('dotenv').config();

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const res = await client.query('UPDATE wilayah SET kode_kec = SUBSTRING(kode_wilayah FROM 5 FOR 3), kode_kel = SUBSTRING(kode_wilayah FROM 8 FOR 3)');
  console.log('Fixed DB successfully', res.rowCount);
  await client.end();
}

main().catch(console.error);

