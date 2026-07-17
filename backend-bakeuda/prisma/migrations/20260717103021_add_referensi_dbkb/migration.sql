/*
  Warnings:

  - The values [TNI_POLRI,PEGAWAI_SWASTA,WIRASWASTA,PETANI,NELAYAN] on the enum `Pekerjaan` will be removed. If these variants are still used in the database, this will fail.
  - The `kondisi_bangunan` column on the `objek_bangunan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `jenis_konstruksi` column on the `objek_bangunan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `jenis_atap` column on the `objek_bangunan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `kode_dinding` column on the `objek_bangunan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `kode_lantai` column on the `objek_bangunan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `kode_langit_langit` column on the `objek_bangunan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `bahan_pagar` column on the `objek_bangunan_fasilitas` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `jenis_dokumen` on the `lampiran_dokumen` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "KondisiBangunan" AS ENUM ('SANGAT_BAIK', 'BAIK', 'SEDANG', 'JELEK');

-- CreateEnum
CREATE TYPE "JenisKonstruksi" AS ENUM ('BAJA', 'BETON', 'BATU_BATA', 'KAYU');

-- CreateEnum
CREATE TYPE "JenisAtap" AS ENUM ('DECRABON_BETON_GLAZUR', 'GENTENG_BETON_ALUMINIUM', 'GENTENG_BIASA_SIRAP', 'ASBES', 'SENG');

-- CreateEnum
CREATE TYPE "JenisDinding" AS ENUM ('KACA_ALUMINIUM', 'BETON', 'BATU_BATA_CONBLOK', 'KAYU', 'SENG', 'TIDAK_ADA_DINDING');

-- CreateEnum
CREATE TYPE "JenisLantai" AS ENUM ('MARMER', 'KERAMIK', 'TERASO', 'UBIN_PC_PAPAN', 'SEMEN');

-- CreateEnum
CREATE TYPE "JenisLangitLangit" AS ENUM ('AKUSTIK_JATI', 'TRIPLEK_ASBES_BAMBU', 'TIDAK_ADA');

-- CreateEnum
CREATE TYPE "BahanPagar" AS ENUM ('BAJA_BESI', 'BATA_BATAKO');

-- CreateEnum
CREATE TYPE "KategoriDbkb" AS ENUM ('KONDISI_BANGUNAN', 'JENIS_KONSTRUKSI', 'JENIS_ATAP', 'JENIS_DINDING', 'JENIS_LANTAI', 'JENIS_LANGIT_LANGIT', 'JENIS_PENGGUNAAN_BANGUNAN');

-- CreateEnum
CREATE TYPE "JenisFasilitas" AS ENUM ('AC_SPLIT', 'AC_WINDOW', 'AC_SENTRAL', 'KOLAM_RENANG_PER_M2', 'PERKERASAN_RINGAN_PER_M2', 'PERKERASAN_SEDANG_PER_M2', 'PERKERASAN_BERAT_PER_M2', 'PERKERASAN_DENGAN_PENUTUP_PER_M2', 'LAPANGAN_TENIS_BETON', 'LAPANGAN_TENIS_ASPAL', 'LAPANGAN_TENIS_TANAH_RUMPUT', 'LIFT_PENUMPANG', 'LIFT_KAPSUL', 'LIFT_BARANG', 'TANGGA_BERJALAN', 'PAGAR_PER_M', 'HYDRANT', 'SPRINKLER', 'FIRE_ALARM', 'SALURAN_PABX', 'SUMUR_ARTESIS_PER_M');

-- AlterEnum
ALTER TYPE "JenisTanah" ADD VALUE 'TANAH_LAINNYA';

-- AlterEnum
ALTER TYPE "JenisTransaksi" ADD VALUE 'HAPUS';

-- AlterEnum
BEGIN;
CREATE TYPE "Pekerjaan_new" AS ENUM ('PNS', 'ABRI', 'PENSIUNAN', 'BADAN', 'LAINNYA');
ALTER TABLE "subjek_pajak" ALTER COLUMN "pekerjaan" TYPE "Pekerjaan_new" USING ("pekerjaan"::text::"Pekerjaan_new");
ALTER TYPE "Pekerjaan" RENAME TO "Pekerjaan_old";
ALTER TYPE "Pekerjaan_new" RENAME TO "Pekerjaan";
DROP TYPE "public"."Pekerjaan_old";
COMMIT;

-- AlterEnum
ALTER TYPE "StatusAjuan" ADD VALUE 'PROSES';

-- DropForeignKey
ALTER TABLE "detail_transaksi_tujuan" DROP CONSTRAINT "detail_transaksi_tujuan_nik_calon_subjek_fkey";

-- DropForeignKey
ALTER TABLE "lampiran_dokumen" DROP CONSTRAINT "lampiran_dokumen_id_transaksi_fkey";

-- AlterTable
ALTER TABLE "detail_transaksi_tujuan" ADD COLUMN     "batas_barat" VARCHAR(50),
ADD COLUMN     "batas_selatan" VARCHAR(50),
ADD COLUMN     "batas_timur" VARCHAR(50),
ADD COLUMN     "batas_utara" VARCHAR(50),
ADD COLUMN     "blok_kav_no_baru" VARCHAR(50),
ADD COLUMN     "calon_subjek_json" JSONB,
ADD COLUMN     "data_bangunan_json" JSONB,
ADD COLUMN     "jalan_op_baru" VARCHAR(255),
ADD COLUMN     "kecamatan_op_baru" VARCHAR(100),
ADD COLUMN     "kelurahan_op_baru" VARCHAR(100),
ADD COLUMN     "latitude" VARCHAR(50),
ADD COLUMN     "longitude" VARCHAR(50),
ADD COLUMN     "rt_op_baru" VARCHAR(5),
ADD COLUMN     "rw_op_baru" VARCHAR(5),
ALTER COLUMN "nik_calon_subjek" DROP NOT NULL;

-- AlterTable
ALTER TABLE "lampiran_dokumen" DROP COLUMN "jenis_dokumen",
ADD COLUMN     "jenis_dokumen" VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE "objek_bangunan" DROP COLUMN "kondisi_bangunan",
ADD COLUMN     "kondisi_bangunan" "KondisiBangunan",
DROP COLUMN "jenis_konstruksi",
ADD COLUMN     "jenis_konstruksi" "JenisKonstruksi",
DROP COLUMN "jenis_atap",
ADD COLUMN     "jenis_atap" "JenisAtap",
DROP COLUMN "kode_dinding",
ADD COLUMN     "kode_dinding" "JenisDinding",
DROP COLUMN "kode_lantai",
ADD COLUMN     "kode_lantai" "JenisLantai",
DROP COLUMN "kode_langit_langit",
ADD COLUMN     "kode_langit_langit" "JenisLangitLangit";

-- AlterTable
ALTER TABLE "objek_bangunan_fasilitas" DROP COLUMN "bahan_pagar",
ADD COLUMN     "bahan_pagar" "BahanPagar";

-- AlterTable
ALTER TABLE "transaksi_spop" ADD COLUMN     "locked_at" TIMESTAMP(3),
ADD COLUMN     "locked_by" TEXT,
ADD COLUMN     "nip_pemeriksa_desa" VARCHAR(25),
ADD COLUMN     "url_dokumen_fisik" VARCHAR(500);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "force_change_password" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "JenisDokumen";

-- CreateTable
CREATE TABLE "user_activities" (
    "id_activity" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_activities_pkey" PRIMARY KEY ("id_activity")
);

-- CreateTable
CREATE TABLE "pejabat_desa" (
    "nip" VARCHAR(25) NOT NULL,
    "nama_pejabat" VARCHAR(100) NOT NULL,
    "jabatan" VARCHAR(100) NOT NULL,
    "kode_wilayah" VARCHAR(10) NOT NULL,

    CONSTRAINT "pejabat_desa_pkey" PRIMARY KEY ("nip")
);

-- CreateTable
CREATE TABLE "referensi_dbkb" (
    "id_dbkb" TEXT NOT NULL,
    "kategori" "KategoriDbkb" NOT NULL,
    "kode" VARCHAR(50) NOT NULL,
    "nilai_per_m2" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "tahun_berlaku" INTEGER NOT NULL,
    "sumber_data" TEXT NOT NULL DEFAULT 'MANUAL',
    "synced_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "referensi_dbkb_pkey" PRIMARY KEY ("id_dbkb")
);

-- CreateTable
CREATE TABLE "referensi_nilai_fasilitas" (
    "id_nilai_fasilitas" TEXT NOT NULL,
    "jenis_fasilitas" "JenisFasilitas" NOT NULL,
    "nilai_tambah" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "tahun_berlaku" INTEGER NOT NULL,
    "sumber_data" TEXT NOT NULL DEFAULT 'MANUAL',
    "synced_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "referensi_nilai_fasilitas_pkey" PRIMARY KEY ("id_nilai_fasilitas")
);

-- CreateTable
CREATE TABLE "riwayat_pelacakan" (
    "id_riwayat" TEXT NOT NULL,
    "id_transaksi" TEXT NOT NULL,
    "status_riwayat" "StatusAjuan" NOT NULL,
    "keterangan" VARCHAR(500),
    "waktu_kejadian" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "riwayat_pelacakan_pkey" PRIMARY KEY ("id_riwayat")
);

-- CreateIndex
CREATE UNIQUE INDEX "referensi_dbkb_kategori_kode_tahun_berlaku_key" ON "referensi_dbkb"("kategori", "kode", "tahun_berlaku");

-- CreateIndex
CREATE UNIQUE INDEX "referensi_nilai_fasilitas_jenis_fasilitas_tahun_berlaku_key" ON "referensi_nilai_fasilitas"("jenis_fasilitas", "tahun_berlaku");

-- AddForeignKey
ALTER TABLE "user_activities" ADD CONSTRAINT "user_activities_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lampiran_dokumen" ADD CONSTRAINT "lampiran_dokumen_id_transaksi_fkey" FOREIGN KEY ("id_transaksi") REFERENCES "transaksi_spop"("id_transaksi") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pejabat_desa" ADD CONSTRAINT "pejabat_desa_kode_wilayah_fkey" FOREIGN KEY ("kode_wilayah") REFERENCES "wilayah"("kode_wilayah") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "riwayat_pelacakan" ADD CONSTRAINT "riwayat_pelacakan_id_transaksi_fkey" FOREIGN KEY ("id_transaksi") REFERENCES "transaksi_spop"("id_transaksi") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaksi_spop" ADD CONSTRAINT "transaksi_spop_locked_by_fkey" FOREIGN KEY ("locked_by") REFERENCES "users"("id_user") ON DELETE SET NULL ON UPDATE CASCADE;
