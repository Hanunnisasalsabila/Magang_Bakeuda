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
      let result = await conn.execute("SELECT TABLE_NAME FROM ALL_TABLES WHERE TABLE_NAME LIKE '%FASILITAS%'");
      console.log("Fasilitas tables:", result.rows);
    } catch(e) {}
    
    try {
      let result = await conn.execute("SELECT TABLE_NAME FROM ALL_TABLES WHERE TABLE_NAME LIKE '%DBKB%' AND TABLE_NAME LIKE '%FASILITAS%'");
      console.log("DBKB Fasilitas tables:", result.rows);
    } catch(e) {}

    await conn.close();
  } catch(e) {
    console.log("Connection error:", e.message);
  }
}
run();
