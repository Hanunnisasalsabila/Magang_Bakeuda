import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Client } = pg;
const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function main() {
  await client.connect();
  const res = await client.query(`
    SELECT id_transaksi, jenis_transaksi, 
           (SELECT t.calon_subjek_json 
            FROM detail_transaksi_tujuan t 
            WHERE t.id_transaksi = transaksi_spop.id_transaksi 
            LIMIT 1) as calon_subjek_json
    FROM transaksi_spop
    WHERE status_ajuan = 'DRAFT' AND nama_pengaju IS NULL
  `);

  for (const draft of res.rows) {
    let name = null;
    const subjekJson = draft.calon_subjek_json;
    if (subjekJson) {
       if (typeof subjekJson === 'object') {
          name = subjekJson.nama_subjek;
       } else if (typeof subjekJson === 'string') {
          try { name = JSON.parse(subjekJson).nama_subjek; } catch(e){}
       }
    }
    
    if (name && name !== 'TANPA NAMA') {
      await client.query('UPDATE transaksi_spop SET nama_pengaju = $1 WHERE id_transaksi = $2', [name, draft.id_transaksi]);
      console.log(`Updated draft ${draft.id_transaksi} with name: ${name}`);
    }
  }
}

main().catch(console.error).finally(() => client.end());
