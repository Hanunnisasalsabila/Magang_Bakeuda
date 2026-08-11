/**
 * Helper validasi selisih luas tanah — untuk transaksi PECAH dan GABUNG.
 *
 * Soft warning: transaksi TETAP diterima, tapi sistem memberi peringatan
 * eksplisit supaya BAKEUDA sadar saat reviu kalau ada selisih signifikan.
 */

export interface HasilValidasiLuas {
  ada_selisih: boolean;
  pesan: string | null;
  luas_asal: number;
  luas_tujuan: number;
  selisih_persen: number;
}

/** Toleransi selisih — 2% dianggap wajar dari margin pengukuran ulang lapangan */
const TOLERANSI_PERSEN = 2;

/**
 * Bandingkan luas referensi (asal) dengan luas tujuan (hasil pecah/gabung).
 * Return pesan peringatan kalau selisih > toleransi, null kalau wajar.
 *
 * - PECAH: luasAsal = luas NOP induk, totalLuasTujuan = jumlah luas semua pecahan.
 * - GABUNG: luasAsal = jumlah luas semua NOP asal, totalLuasTujuan = luas tujuan baru yang dimasukkan pengguna.
 */
export function validasiSelisihLuasPecah(
  luasAsal: number,
  totalLuasTujuan: number,
  jenisTransaksi: 'PECAH' | 'GABUNG' = 'PECAH',
): HasilValidasiLuas {
  if (luasAsal <= 0) {
    return { ada_selisih: false, pesan: null, luas_asal: luasAsal, luas_tujuan: totalLuasTujuan, selisih_persen: 0 };
  }

  const selisih = Math.abs(totalLuasTujuan - luasAsal);
  const selisihPersen = (selisih / luasAsal) * 100;

  if (selisihPersen <= TOLERANSI_PERSEN) {
    return { ada_selisih: false, pesan: null, luas_asal: luasAsal, luas_tujuan: totalLuasTujuan, selisih_persen: selisihPersen };
  }

  const arah = totalLuasTujuan > luasAsal ? 'lebih besar' : 'lebih kecil';
  const labelAsal = jenisTransaksi === 'GABUNG' ? 'total luas NOP asal' : 'luas asal';
  const labelTujuan = jenisTransaksi === 'GABUNG' ? 'luas hasil penggabungan' : 'total luas hasil pemecahan';

  return {
    ada_selisih: true,
    pesan: `Peringatan: ${labelTujuan} (${totalLuasTujuan} m²) ${arah} ${selisihPersen.toFixed(1)}% dibanding ${labelAsal} (${luasAsal} m²). Mohon diperiksa kembali sebelum disetujui.`,
    luas_asal: luasAsal,
    luas_tujuan: totalLuasTujuan,
    selisih_persen: selisihPersen,
  };
}

