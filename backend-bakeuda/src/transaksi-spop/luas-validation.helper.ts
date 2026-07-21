/**
 * Helper validasi selisih luas tanah — khusus transaksi PECAH.
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
 * Bandingkan total luas hasil pemecahan dengan luas asal.
 * Return pesan peringatan kalau selisih > toleransi, null kalau wajar.
 *
 * Khusus PECAH saja — GABUNG tidak perlu karena luas dihitung otomatis dari total NOP asal.
 */
export function validasiSelisihLuasPecah(
  luasAsal: number,
  totalLuasTujuan: number,
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

  return {
    ada_selisih: true,
    pesan: `Peringatan: total luas hasil pemecahan (${totalLuasTujuan} m²) ${arah} ${selisihPersen.toFixed(1)}% dibanding luas asal (${luasAsal} m²). Mohon diperiksa kembali sebelum disetujui.`,
    luas_asal: luasAsal,
    luas_tujuan: totalLuasTujuan,
    selisih_persen: selisihPersen,
  };
}
