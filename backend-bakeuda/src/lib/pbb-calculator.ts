export interface PbbCalculationInput {
  njopTanah: number; // Rp per m2
  luasTanah: number; // m2
  njopBangunan: number; // Rp per m2
  luasBangunan: number; // m2
  njoptkp: number; // Nilai Jual Objek Pajak Tidak Kena Pajak
  tarifPbb: number; // dalam persen (misal 0.1 = 0.1%)
}

export interface PbbCalculationResult {
  njopTanahTotal: number;
  njopBangunanTotal: number;
  njopTotal: number;
  njopKenaPajak: number;
  pbbTerutang: number;
}

export function calculatePbb(
  input: PbbCalculationInput,
): PbbCalculationResult {
  const { njopTanah, luasTanah, njopBangunan, luasBangunan, njoptkp, tarifPbb } =
    input;

  const njopTanahTotal = njopTanah * luasTanah;
  const njopBangunanTotal = njopBangunan * luasBangunan;
  const njopTotal = njopTanahTotal + njopBangunanTotal;

  // NJOP Kena Pajak = NJOP Total - NJOPTKP (tidak boleh negatif)
  const njopKenaPajak = Math.max(njopTotal - njoptkp, 0);

  // PBB Terutang = NJOP Kena Pajak x Tarif PBB
  const pbbTerutang = njopKenaPajak * (tarifPbb / 100);

  return {
    njopTanahTotal,
    njopBangunanTotal,
    njopTotal,
    njopKenaPajak,
    pbbTerutang: Math.round(pbbTerutang),
  };
}
