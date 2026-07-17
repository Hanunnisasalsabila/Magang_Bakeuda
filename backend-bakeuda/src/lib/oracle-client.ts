/**
 * Oracle Client Utility — Koneksi ke database Oracle lokal.
 *
 * Membutuhkan:
 *   1. Oracle Instant Client terinstall di mesin lokal
 *   2. Paket npm: oracledb (npm install oracledb)
 *   3. Environment variables: ORACLE_HOST, ORACLE_PORT, ORACLE_SERVICE, ORACLE_USER, ORACLE_PASSWORD
 *
 * ⚠️ Gunakan user Oracle READ-ONLY untuk menghindari risiko menulis balik
 *    ke database Bakeuda jika ada bug di query.
 */

/**
 * Mendapatkan koneksi ke Oracle database lokal.
 *
 * Penggunaan:
 *   const connection = await getOracleConnection();
 *   try {
 *     const result = await connection.execute('SELECT 1 FROM DUAL');
 *     console.log(result);
 *   } finally {
 *     await connection.close();
 *   }
 */
export async function getOracleConnection(): Promise<any> {
  // Dynamic import supaya tidak crash saat oracledb belum terinstall
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  let oracledb: any;
  try {
    oracledb = await (Function('return import("oracledb")')() as Promise<any>);
  } catch {
    throw new Error(
      'Paket "oracledb" belum terinstall. Jalankan: npm install oracledb\n' +
        'Pastikan juga Oracle Instant Client sudah tersedia di mesin.',
    );
  }

  const mod = oracledb.default ?? oracledb;

  return mod.getConnection({
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: `${process.env.ORACLE_HOST}:${process.env.ORACLE_PORT}/${process.env.ORACLE_SERVICE}`,
  });
}
