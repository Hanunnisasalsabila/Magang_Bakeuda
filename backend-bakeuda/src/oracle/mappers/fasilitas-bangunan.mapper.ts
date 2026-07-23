import { Prisma } from '@prisma/client';

export interface OracleFasilitasRow {
  KD_PROPINSI: string;
  KD_DATI2: string;
  KD_KECAMATAN: string;
  KD_KELURAHAN: string;
  KD_BLOK: string;
  NO_URUT: string;
  KD_JNS_OP: string;
  NO_BNG: number;
  KD_FASILITAS: string;
  JML_SATUAN: number;
}

export function mapOracleFasilitasToPrisma(
  idBangunan: string,
  rows: OracleFasilitasRow[],
): Prisma.ObjekBangunanFasilitasUpsertArgs['create'] {
  const result: any = {
    id_bangunan: idBangunan,
    jumlah_ac_split: 0,
    jumlah_ac_window: 0,
    ac_sentral: false,
    luas_kolam_renang: 0,
    kolam_diplester: false,
    kolam_dengan_pelapis: false,
    perkerasan_ringan: 0,
    perkerasan_sedang: 0,
    perkerasan_berat: 0,
    perkerasan_dengan_penutup: 0,
    tenis_beton_dgn_lampu: 0,
    tenis_beton_tanpa_lampu: 0,
    tenis_aspal_dgn_lampu: 0,
    tenis_aspal_tanpa_lampu: 0,
    tenis_tanah_rumput_dgn_lampu: 0,
    tenis_tanah_rumput_tanpa_lampu: 0,
    lift_penumpang: 0,
    lift_kapsul: 0,
    lift_barang: 0,
    tangga_berjalan_lbr_kurang_080m: 0,
    tangga_berjalan_lbr_lebih_080m: 0,
    panjang_pagar_m: 0,
    hydrant_ada: false,
    sprinkler_ada: false,
    fire_alarm_ada: false,
    jumlah_saluran_pabx: 0,
    kedalaman_sumur_artesis_m: 0,
  };

  for (const row of rows) {
    const qty = Number(row.JML_SATUAN) || 0;
    const kode = row.KD_FASILITAS?.trim();
    
    switch (kode) {
      case '01': result.jumlah_ac_split += qty; break;
      case '02': result.jumlah_ac_window += qty; break;
      case '03':
      case '04':
      case '05':
      case '06':
      case '07':
      case '08':
      case '09':
      case '10':
      case '11': result.ac_sentral = true; break;
      case '12': 
        result.luas_kolam_renang += qty; 
        result.kolam_diplester = true; 
        break;
      case '13': 
        result.luas_kolam_renang += qty; 
        result.kolam_dengan_pelapis = true; 
        break;
      case '14': result.perkerasan_ringan += qty; break;
      case '15': result.perkerasan_sedang += qty; break;
      case '16': result.perkerasan_berat += qty; break;
      case '17': result.perkerasan_dengan_penutup += qty; break;
      case '18':
      case '24': result.tenis_beton_dgn_lampu += qty; break;
      case '21':
      case '27': result.tenis_beton_tanpa_lampu += qty; break;
      case '19':
      case '25': result.tenis_aspal_dgn_lampu += qty; break;
      case '22':
      case '28': result.tenis_aspal_tanpa_lampu += qty; break;
      case '20':
      case '26': result.tenis_tanah_rumput_dgn_lampu += qty; break;
      case '23':
      case '29': result.tenis_tanah_rumput_tanpa_lampu += qty; break;
      case '30': result.lift_penumpang += qty; break;
      case '31': result.lift_kapsul += qty; break;
      case '32': result.lift_barang += qty; break;
      case '33': result.tangga_berjalan_lbr_kurang_080m += qty; break;
      case '34': result.tangga_berjalan_lbr_lebih_080m += qty; break;
      case '35': 
        result.panjang_pagar_m += qty; 
        result.bahan_pagar = 'BESI';
        break;
      case '36': 
        result.panjang_pagar_m += qty; 
        result.bahan_pagar = 'BATA_BATAKO';
        break;
      case '37': result.hydrant_ada = true; break;
      case '38': result.fire_alarm_ada = true; break;
      case '39': result.sprinkler_ada = true; break;
      case '41': result.jumlah_saluran_pabx += qty; break;
      case '42': result.kedalaman_sumur_artesis_m += qty; break;
    }
  }

  return result;
}
