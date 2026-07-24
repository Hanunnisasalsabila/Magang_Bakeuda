const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:postgres@localhost:5432/bakeuda_magang?schema=public' });
async function main() {
  await client.connect();
  const res = await client.query("SELECT rt_op, rw_op, jalan_op FROM objek_pajak WHERE nop = '330307001200300040'");
  console.log(res.rows);
  await client.end();
}
main().catch(console.error);
