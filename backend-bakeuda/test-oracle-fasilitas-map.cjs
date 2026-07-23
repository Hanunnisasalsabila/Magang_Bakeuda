const oracledb = require('oracledb');
require('dotenv').config();
async function run() {
  try {
    oracledb.initOracleClient({ libDir: '/home/afifhnrstwn/oracle/instantclient_19_24' });
    const connectString = `${process.env.ORACLE_HOST}:${process.env.ORACLE_PORT}/${process.env.ORACLE_SERVICE}`;
    const conn = await oracledb.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: connectString
    });
    try {
      let result = await conn.execute("SELECT KD_FASILITAS, COUNT(*) FROM DAT_FASILITAS_BANGUNAN GROUP BY KD_FASILITAS");
      console.log("Fasilitas codes:", result.rows);
    } catch(e) {
      console.log("Error:", e.message);
    }
    
    // Check if there is a reference table for Fasilitas
    try {
      let result = await conn.execute("SELECT * FROM REF_FASILITAS");
      console.log("REF_FASILITAS:", result.rows);
    } catch(e) {}
    
    await conn.close();
  } catch(e) {
    console.log("Connection error:", e.message);
  }
}
run();
