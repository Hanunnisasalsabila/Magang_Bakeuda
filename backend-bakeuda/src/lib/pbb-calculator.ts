import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { KategoriDbkb, JenisFasilitas } from '@prisma/client';

// ─────────────────────────────────────────
// PBB Calculator Service — NJOP Bangunan (DBKB-based)
//
// Semua nilai Rupiah diambil dari tabel referensi (ReferensiDbkb
// dan ReferensiNilaiFasilitas). Tabel referensi diisi placeholder 0
// di awal, dan diisi nilai asli oleh BAKEUDA atau sync Oracle nanti.
// Kode kalkulator TIDAK PERLU DIUBAH saat nilai asli masuk.
// ─────────────────────────────────────────

@Injectable()
export class PbbCalculatorService {
  constructor(private readonly prisma: PrismaService) {}

  // ─────────────────────────────────────────
  // LOOKUP HELPERS
  // ─────────────────────────────────────────

  /** Ambil nilai DBKB untuk 1 kategori+kode, tahun berjalan */
  private async getNilaiDbkb(
    kategori: KategoriDbkb,
    kode: string | null,
    tahun: number,
  ): Promise<number> {
    if (!kode) return 0;
    const row = await this.prisma.referensiDbkb.findUnique({
      where: {
        kategori_kode_tahun_berlaku: {
          kategori,
          kode,
          tahun_berlaku: tahun,
        },
      },
    });
    return row ? Number(row.nilai_per_m2) : 0;
  }

  /** Ambil nilai tambah fasilitas untuk 1 jenis, tahun berjalan */
  private async getNilaiFasilitas(
    jenis: JenisFasilitas,
    tahun: number,
  ): Promise<number> {
    const row = await this.prisma.referensiNilaiFasilitas.findUnique({
      where: {
        jenis_fasilitas_tahun_berlaku: {
          jenis_fasilitas: jenis,
          tahun_berlaku: tahun,
        },
      },
    });
    return row ? Number(row.nilai_tambah) : 0;
  }

  // ─────────────────────────────────────────
  // PENYUSUTAN
  // ─────────────────────────────────────────

  /**
   * Faktor penyusutan sederhana berdasarkan umur bangunan.
   *
   * ⚠️ INI PLACEHOLDER — ganti sesuai Perda/Permendagri penyusutan
   *    NJOP yang berlaku di Purbalingga.
   *
   * Formula umum: susut 1% per tahun, maksimal susut 60%
   * (sisa nilai minimal 40%)
   */
  private hitungFaktorPenyusutan(
    tahunDibangun: number | null,
    tahunRenovasi: number | null,
    tahunPenilaian: number,
  ): number {
    if (!tahunDibangun) return 1; // tidak ada data, anggap tidak susut
    const tahunDasar = tahunRenovasi ?? tahunDibangun;
    const umur = Math.max(0, tahunPenilaian - tahunDasar);
    const susut = Math.min(umur * 0.01, 0.6);
    return 1 - susut;
  }

  // ─────────────────────────────────────────
  // KALKULASI UTAMA
  // ─────────────────────────────────────────

  /**
   * Hitung NJOP Bangunan untuk 1 unit bangunan.
   *
   * Formula:
   *   1. Nilai dasar JPB (per m2)
   *   2. + Nilai komponen klasifikasi (kondisi, konstruksi, atap, dinding, lantai, langit-langit)
   *   3. × Faktor penyusutan
   *   4. × Luas bangunan
   *   5. + Nilai fasilitas (AC, kolam, lift, pagar, dll)
   *
   * ⚠️ Formula di atas masih ASUMSI UMUM — cara akumulasi (dijumlah vs dikali)
   *    dan formula penyusutan perlu divalidasi dengan dokumen resmi Bakeuda.
   */
  async hitungNjopBangunan(
    idBangunan: string,
    tahunPenilaian: number,
  ): Promise<number> {
    const bangunan = await this.prisma.objekBangunan.findUnique({
      where: { id_bangunan: idBangunan },
      include: { fasilitas: true },
    });
    if (!bangunan)
      throw new NotFoundException('Data bangunan tidak ditemukan');

    // 1. Nilai dasar dari basis JPB (kelas penggunaan bangunan)
    const nilaiDasarJpb = await this.getNilaiDbkb(
      'JENIS_PENGGUNAAN_BANGUNAN',
      bangunan.kode_jpb,
      tahunPenilaian,
    );

    // 2. Nilai tambahan dari kualitas konstruksi (dijumlah — sesuai pola DBKB standar)
    const nilaiKondisi = await this.getNilaiDbkb(
      'KONDISI_BANGUNAN',
      bangunan.kondisi_bangunan,
      tahunPenilaian,
    );
    const nilaiKonstruksi = await this.getNilaiDbkb(
      'JENIS_KONSTRUKSI',
      bangunan.jenis_konstruksi,
      tahunPenilaian,
    );
    const nilaiAtap = await this.getNilaiDbkb(
      'JENIS_ATAP',
      bangunan.jenis_atap,
      tahunPenilaian,
    );
    const nilaiDinding = await this.getNilaiDbkb(
      'JENIS_DINDING',
      bangunan.kode_dinding,
      tahunPenilaian,
    );
    const nilaiLantai = await this.getNilaiDbkb(
      'JENIS_LANTAI',
      bangunan.kode_lantai,
      tahunPenilaian,
    );
    const nilaiLangitLangit = await this.getNilaiDbkb(
      'JENIS_LANGIT_LANGIT',
      bangunan.kode_langit_langit,
      tahunPenilaian,
    );

    const nilaiPerM2SebelumSusut =
      nilaiDasarJpb +
      nilaiKondisi +
      nilaiKonstruksi +
      nilaiAtap +
      nilaiDinding +
      nilaiLantai +
      nilaiLangitLangit;

    // 3. Faktor penyusutan berdasarkan umur bangunan
    const faktorSusut = this.hitungFaktorPenyusutan(
      bangunan.tahun_dibangun,
      bangunan.tahun_renovasi,
      tahunPenilaian,
    );
    const nilaiPerM2SetelahSusut = nilaiPerM2SebelumSusut * faktorSusut;

    // 4. Total dari luas × nilai per m2
    let total = Number(bangunan.luas_bangunan) * nilaiPerM2SetelahSusut;

    // 5. Tambahkan nilai fasilitas (kalau ada)
    if (bangunan.fasilitas) {
      const f = bangunan.fasilitas;

      // AC
      total +=
        Number(f.jumlah_ac_split) *
        (await this.getNilaiFasilitas('AC_SPLIT', tahunPenilaian));
      total +=
        Number(f.jumlah_ac_window) *
        (await this.getNilaiFasilitas('AC_WINDOW', tahunPenilaian));
      if (f.ac_sentral)
        total += await this.getNilaiFasilitas('AC_SENTRAL', tahunPenilaian);

      // Kolam Renang
      total +=
        Number(f.luas_kolam_renang) *
        (await this.getNilaiFasilitas(
          'KOLAM_RENANG_PER_M2',
          tahunPenilaian,
        ));

      // Perkerasan Halaman
      total +=
        Number(f.perkerasan_ringan) *
        (await this.getNilaiFasilitas(
          'PERKERASAN_RINGAN_PER_M2',
          tahunPenilaian,
        ));
      total +=
        Number(f.perkerasan_sedang) *
        (await this.getNilaiFasilitas(
          'PERKERASAN_SEDANG_PER_M2',
          tahunPenilaian,
        ));
      total +=
        Number(f.perkerasan_berat) *
        (await this.getNilaiFasilitas(
          'PERKERASAN_BERAT_PER_M2',
          tahunPenilaian,
        ));
      total +=
        Number(f.perkerasan_dengan_penutup) *
        (await this.getNilaiFasilitas(
          'PERKERASAN_DENGAN_PENUTUP_PER_M2',
          tahunPenilaian,
        ));

      // Lapangan Tenis (dgn lampu + tanpa lampu digabung per tipe permukaan)
      total +=
        (Number(f.tenis_beton_dgn_lampu) +
          Number(f.tenis_beton_tanpa_lampu)) *
        (await this.getNilaiFasilitas(
          'LAPANGAN_TENIS_BETON',
          tahunPenilaian,
        ));
      total +=
        (Number(f.tenis_aspal_dgn_lampu) +
          Number(f.tenis_aspal_tanpa_lampu)) *
        (await this.getNilaiFasilitas(
          'LAPANGAN_TENIS_ASPAL',
          tahunPenilaian,
        ));
      total +=
        (Number(f.tenis_tanah_rumput_dgn_lampu) +
          Number(f.tenis_tanah_rumput_tanpa_lampu)) *
        (await this.getNilaiFasilitas(
          'LAPANGAN_TENIS_TANAH_RUMPUT',
          tahunPenilaian,
        ));

      // Lift
      total +=
        Number(f.lift_penumpang) *
        (await this.getNilaiFasilitas('LIFT_PENUMPANG', tahunPenilaian));
      total +=
        Number(f.lift_kapsul) *
        (await this.getNilaiFasilitas('LIFT_KAPSUL', tahunPenilaian));
      total +=
        Number(f.lift_barang) *
        (await this.getNilaiFasilitas('LIFT_BARANG', tahunPenilaian));

      // Tangga Berjalan (kedua lebar digabung)
      total +=
        (Number(f.tangga_berjalan_lbr_kurang_080m) +
          Number(f.tangga_berjalan_lbr_lebih_080m)) *
        (await this.getNilaiFasilitas(
          'TANGGA_BERJALAN',
          tahunPenilaian,
        ));

      // Pagar
      total +=
        Number(f.panjang_pagar_m) *
        (await this.getNilaiFasilitas('PAGAR_PER_M', tahunPenilaian));

      // Pemadam Kebakaran
      if (f.hydrant_ada)
        total += await this.getNilaiFasilitas('HYDRANT', tahunPenilaian);
      if (f.sprinkler_ada)
        total += await this.getNilaiFasilitas('SPRINKLER', tahunPenilaian);
      if (f.fire_alarm_ada)
        total += await this.getNilaiFasilitas(
          'FIRE_ALARM',
          tahunPenilaian,
        );

      // PABX
      total +=
        Number(f.jumlah_saluran_pabx) *
        (await this.getNilaiFasilitas('SALURAN_PABX', tahunPenilaian));

      // Sumur Artesis
      total +=
        Number(f.kedalaman_sumur_artesis_m) *
        (await this.getNilaiFasilitas(
          'SUMUR_ARTESIS_PER_M',
          tahunPenilaian,
        ));
    }

    return Math.round(total);
  }
}

// ─────────────────────────────────────────
// LEGACY — Pure function PBB calculator (tetap dipertahankan untuk backward compat)
// ─────────────────────────────────────────

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
