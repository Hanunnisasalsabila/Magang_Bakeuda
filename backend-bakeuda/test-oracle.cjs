const oracledb = require('oracledb');
require('dotenv').config();
async function run() {
  try {
    oracledb.initOracleClient({ libDir: '/home/afifhnrstwn/oracle/instantclient_19_24' });
    const connectString = `${process.env.ORACLE_HOST}:${process.env.ORACLE_PORT}/${process.env.ORACLE_SERVICE}`;
    console.log('Connecting to:', connectString);
    const conn = await oracledb.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: connectString
    });
    try {
      let result = await conn.execute("SELECT * FROM REFF_JPB WHERE ROWNUM <= 1");
      console.log("REFF_JPB columns:", result.metaData.map(m => m.name));
    } catch(e) {
      console.log("REFF_JPB table error:", e.message);
    }
    
    try {
      let result = await conn.execute("SELECT * FROM REF_JPB WHERE ROWNUM <= 1");
      console.log("REF_JPB columns:", result.metaData.map(m => m.name));
    } catch(e) {
      console.log("REF_JPB table error:", e.message);
    }
    await conn.close();
  } catch(e) {
    console.log("Connection error:", e.message);
  }
}
run();
