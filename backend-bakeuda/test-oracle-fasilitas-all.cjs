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
      let result = await conn.execute("SELECT KD_FASILITAS, NM_FASILITAS FROM FASILITAS ORDER BY KD_FASILITAS");
      console.log("FASILITAS:");
      result.rows.forEach(r => console.log(`'${r[0]}': '${r[1]}'`));
    } catch(e) {}

    await conn.close();
  } catch(e) {
    console.log("Connection error:", e.message);
  }
}
run();
