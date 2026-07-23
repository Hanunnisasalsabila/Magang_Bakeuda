import oracledb from 'oracledb';

async function run() {
  try {
    oracledb.initOracleClient({ libDir: process.env.LD_LIBRARY_PATH });
    const connection = await oracledb.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: process.env.ORACLE_CONN_STRING,
    });
    const result = await connection.execute("SELECT * FROM DAT_FASILITAS_BANGUNAN WHERE ROWNUM = 1", [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    console.log(result.rows[0]);
    await connection.close();
  } catch (err) {
    console.error(err);
  }
}
run();
