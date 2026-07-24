const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: 'postgresql://postgres:Aiszr131004@localhost:5432/bakeuda_db?schema=public' });
  await client.connect();
  const res = await client.query("UPDATE users SET nip = NULL WHERE role = 'DESA'");
  console.log('Rows updated:', res.rowCount);
  await client.end();
}

main().catch(console.error);
