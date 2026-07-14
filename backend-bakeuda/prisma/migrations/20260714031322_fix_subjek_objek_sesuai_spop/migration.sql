/*
  Warnings:

  - The values [TANAH_PERTANIAN,TANAH_PERKEBUNAN,TANAH_KEHUTANAN,TANAH_LAINNYA] on the enum `JenisTanah` will be removed. If these variants are still used in the database, this will fail.
  - The values [PENGGARAP] on the enum `StatusWp` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `force_change_password` on the `users` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "JenisTanah_new" AS ENUM ('TANAH_BANGUNAN', 'KAVLING_SIAP_BANGUN', 'TANAH_KOSONG', 'FASILITAS_UMUM');
ALTER TABLE "objek_pajak" ALTER COLUMN "jenis_tanah" TYPE "JenisTanah_new" USING ("jenis_tanah"::text::"JenisTanah_new");
ALTER TABLE "detail_transaksi_tujuan" ALTER COLUMN "jenis_tanah_baru" TYPE "JenisTanah_new" USING ("jenis_tanah_baru"::text::"JenisTanah_new");
ALTER TYPE "JenisTanah" RENAME TO "JenisTanah_old";
ALTER TYPE "JenisTanah_new" RENAME TO "JenisTanah";
DROP TYPE "public"."JenisTanah_old";
COMMIT;

-- AlterEnum
ALTER TYPE "Pekerjaan" ADD VALUE 'BADAN';

-- AlterEnum
BEGIN;
CREATE TYPE "StatusWp_new" AS ENUM ('PEMILIK', 'PENYEWA', 'PENGELOLA', 'PEMAKAI', 'SENGKETA');
ALTER TABLE "subjek_pajak" ALTER COLUMN "status_wp" TYPE "StatusWp_new" USING ("status_wp"::text::"StatusWp_new");
ALTER TYPE "StatusWp" RENAME TO "StatusWp_old";
ALTER TYPE "StatusWp_new" RENAME TO "StatusWp";
DROP TYPE "public"."StatusWp_old";
COMMIT;

-- AlterTable
ALTER TABLE "objek_bangunan" ADD COLUMN     "daya_listrik_watt" INTEGER;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "force_change_password";

-- CreateTable
CREATE TABLE "objek_bangunan_fasilitas" (
    "id_fasilitas" TEXT NOT NULL,
    "id_bangunan" VARCHAR(36) NOT NULL,
    "jumlah_ac_split" INTEGER NOT NULL DEFAULT 0,
    "jumlah_ac_window" INTEGER NOT NULL DEFAULT 0,
    "ac_sentral" BOOLEAN NOT NULL DEFAULT false,
    "luas_kolam_renang" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "kolam_diplester" BOOLEAN NOT NULL DEFAULT false,
    "kolam_dengan_pelapis" BOOLEAN NOT NULL DEFAULT false,
    "perkerasan_ringan" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "perkerasan_sedang" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "perkerasan_berat" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "perkerasan_dengan_penutup" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "tenis_beton_dgn_lampu" INTEGER NOT NULL DEFAULT 0,
    "tenis_beton_tanpa_lampu" INTEGER NOT NULL DEFAULT 0,
    "tenis_aspal_dgn_lampu" INTEGER NOT NULL DEFAULT 0,
    "tenis_aspal_tanpa_lampu" INTEGER NOT NULL DEFAULT 0,
    "tenis_tanah_rumput_dgn_lampu" INTEGER NOT NULL DEFAULT 0,
    "tenis_tanah_rumput_tanpa_lampu" INTEGER NOT NULL DEFAULT 0,
    "lift_penumpang" INTEGER NOT NULL DEFAULT 0,
    "lift_kapsul" INTEGER NOT NULL DEFAULT 0,
    "lift_barang" INTEGER NOT NULL DEFAULT 0,
    "tangga_berjalan_lbr_kurang_080m" INTEGER NOT NULL DEFAULT 0,
    "tangga_berjalan_lbr_lebih_080m" INTEGER NOT NULL DEFAULT 0,
    "panjang_pagar_m" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "bahan_pagar" VARCHAR(1),
    "hydrant_ada" BOOLEAN NOT NULL DEFAULT false,
    "sprinkler_ada" BOOLEAN NOT NULL DEFAULT false,
    "fire_alarm_ada" BOOLEAN NOT NULL DEFAULT false,
    "jumlah_saluran_pabx" INTEGER NOT NULL DEFAULT 0,
    "kedalaman_sumur_artesis_m" DECIMAL(6,2) NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "objek_bangunan_fasilitas_pkey" PRIMARY KEY ("id_fasilitas")
);

-- CreateTable
CREATE TABLE "referensi_jenis_penggunaan_bangunan" (
    "kode_jpb" VARCHAR(2) NOT NULL,
    "nama_jpb" VARCHAR(50) NOT NULL,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "keterangan" VARCHAR(150),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "referensi_jenis_penggunaan_bangunan_pkey" PRIMARY KEY ("kode_jpb")
);

-- CreateIndex
CREATE UNIQUE INDEX "objek_bangunan_fasilitas_id_bangunan_key" ON "objek_bangunan_fasilitas"("id_bangunan");

-- CreateIndex
CREATE INDEX "objek_bangunan_kode_jpb_idx" ON "objek_bangunan"("kode_jpb");

-- AddForeignKey
ALTER TABLE "objek_bangunan" ADD CONSTRAINT "objek_bangunan_kode_jpb_fkey" FOREIGN KEY ("kode_jpb") REFERENCES "referensi_jenis_penggunaan_bangunan"("kode_jpb") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objek_bangunan_fasilitas" ADD CONSTRAINT "objek_bangunan_fasilitas_id_bangunan_fkey" FOREIGN KEY ("id_bangunan") REFERENCES "objek_bangunan"("id_bangunan") ON DELETE CASCADE ON UPDATE CASCADE;
