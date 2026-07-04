-- CreateEnum
CREATE TYPE "JenisDokumen" AS ENUM ('KTP', 'SHM', 'AJB', 'GIRIK', 'SHGB', 'IMB', 'LAINNYA');

-- CreateEnum
CREATE TYPE "JenisTanah" AS ENUM ('TANAH_BANGUNAN', 'TANAH_PERTANIAN', 'TANAH_PERKEBUNAN', 'TANAH_KEHUTANAN', 'TANAH_LAINNYA');

-- CreateEnum
CREATE TYPE "StatusBayar" AS ENUM ('BELUM_BAYAR', 'LUNAS', 'KEDALUWARSA');

-- CreateEnum
CREATE TYPE "StatusWp" AS ENUM ('PEMILIK', 'PENYEWA', 'PENGGARAP', 'PEMAKAI');

-- CreateEnum
CREATE TYPE "Pekerjaan" AS ENUM ('PNS', 'TNI_POLRI', 'PEGAWAI_SWASTA', 'WIRASWASTA', 'PETANI', 'NELAYAN', 'PENSIUNAN', 'LAINNYA');

-- CreateEnum
CREATE TYPE "JenisTransaksi" AS ENUM ('BARU', 'MUTASI', 'PECAH', 'GABUNG', 'PERUBAHAN_DATA');

-- CreateEnum
CREATE TYPE "StatusAjuan" AS ENUM ('DRAFT', 'MENUNGGU', 'DISETUJUI', 'DITOLAK', 'REVISI');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('DESA', 'BAKEUDA');

-- CreateTable
CREATE TABLE "lampiran_dokumen" (
    "id_dokumen" TEXT NOT NULL,
    "id_transaksi" TEXT NOT NULL,
    "jenis_dokumen" "JenisDokumen" NOT NULL,
    "keterangan_dokumen" VARCHAR(255),
    "url_file" VARCHAR(500) NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploaded_by" TEXT NOT NULL,

    CONSTRAINT "lampiran_dokumen_pkey" PRIMARY KEY ("id_dokumen")
);

-- CreateTable
CREATE TABLE "objek_pajak" (
    "nop" VARCHAR(18) NOT NULL,
    "kode_propinsi" VARCHAR(2) NOT NULL,
    "kode_dati2" VARCHAR(2) NOT NULL,
    "kode_kecamatan" VARCHAR(3) NOT NULL,
    "kode_kelurahan" VARCHAR(3) NOT NULL,
    "kode_blok" VARCHAR(3) NOT NULL,
    "no_urut" VARCHAR(4) NOT NULL,
    "kode_jenis_op" VARCHAR(1) NOT NULL,
    "nik_subjek" VARCHAR(16) NOT NULL,
    "no_persil" VARCHAR(20),
    "jalan_op" VARCHAR(255) NOT NULL,
    "blok_kav_no" VARCHAR(50),
    "rw_op" VARCHAR(5),
    "rt_op" VARCHAR(5),
    "kelurahan_op" VARCHAR(100) NOT NULL,
    "kecamatan_op" VARCHAR(100) NOT NULL,
    "jenis_tanah" "JenisTanah" NOT NULL,
    "luas_tanah" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "luas_bangunan" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "jumlah_bangunan" INTEGER NOT NULL DEFAULT 0,
    "njop_tanah" DECIMAL(15,2),
    "njop_bangunan" DECIMAL(15,2),
    "njop_total" DECIMAL(15,2),
    "tahun_penilaian" INTEGER,
    "status_aktif" BOOLEAN NOT NULL DEFAULT true,
    "nonaktif_oleh" TEXT,
    "nonaktif_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "objek_pajak_pkey" PRIMARY KEY ("nop")
);

-- CreateTable
CREATE TABLE "objek_bumi" (
    "id_bumi" TEXT NOT NULL,
    "nop" VARCHAR(18) NOT NULL,
    "no_bumi" INTEGER NOT NULL DEFAULT 1,
    "kode_znt" VARCHAR(2),
    "luas_bumi" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "jenis_bumi" VARCHAR(1),
    "nilai_sistem_bumi" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "status_blokir" BOOLEAN NOT NULL DEFAULT false,
    "keterangan_blokir" VARCHAR(150),
    "tahun_blokir" VARCHAR(4),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "objek_bumi_pkey" PRIMARY KEY ("id_bumi")
);

-- CreateTable
CREATE TABLE "objek_bangunan" (
    "id_bangunan" TEXT NOT NULL,
    "nop" VARCHAR(18) NOT NULL,
    "no_bangunan" INTEGER NOT NULL,
    "kode_jpb" VARCHAR(2),
    "no_formulir_lspop" VARCHAR(11),
    "tahun_dibangun" INTEGER,
    "tahun_renovasi" INTEGER,
    "luas_bangunan" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "jumlah_lantai" INTEGER NOT NULL DEFAULT 1,
    "kondisi_bangunan" VARCHAR(1),
    "jenis_konstruksi" VARCHAR(1),
    "jenis_atap" VARCHAR(1),
    "kode_dinding" VARCHAR(1),
    "kode_lantai" VARCHAR(1),
    "kode_langit_langit" VARCHAR(1),
    "nilai_sistem_bangunan" DECIMAL(15,2),
    "tanggal_pendataan" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nip_pendata" VARCHAR(20),
    "keterangan_jpb" VARCHAR(50),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "objek_bangunan_pkey" PRIMARY KEY ("id_bangunan")
);

-- CreateTable
CREATE TABLE "sppt" (
    "id_sppt" TEXT NOT NULL,
    "nop" VARCHAR(18) NOT NULL,
    "tahun_pajak" INTEGER NOT NULL,
    "njop_kena_pajak" DECIMAL(15,2) NOT NULL,
    "njoptkp" DECIMAL(15,2) NOT NULL,
    "tarif_pbb" DECIMAL(5,4) NOT NULL,
    "pbb_terutang" DECIMAL(15,2) NOT NULL,
    "tgl_jatuh_tempo" TIMESTAMP(3) NOT NULL,
    "status_bayar" "StatusBayar" NOT NULL DEFAULT 'BELUM_BAYAR',
    "tgl_bayar" TIMESTAMP(3),
    "generated_by" TEXT NOT NULL,
    "generated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_transaksi_asal" TEXT,

    CONSTRAINT "sppt_pkey" PRIMARY KEY ("id_sppt")
);

-- CreateTable
CREATE TABLE "subjek_pajak" (
    "nik" VARCHAR(16) NOT NULL,
    "legacy_subjek_id" VARCHAR(30),
    "nama_subjek" VARCHAR(100) NOT NULL,
    "status_wp" "StatusWp" NOT NULL,
    "pekerjaan" "Pekerjaan" NOT NULL,
    "npwp" VARCHAR(20),
    "npwpd" VARCHAR(50),
    "no_hp" VARCHAR(15),
    "email" VARCHAR(100),
    "alamat_jalan" VARCHAR(255) NOT NULL,
    "blok_kav_no_subjek" VARCHAR(50),
    "rw" VARCHAR(5),
    "rt" VARCHAR(5),
    "kelurahan" VARCHAR(100) NOT NULL,
    "kecamatan" VARCHAR(100),
    "kabupaten" VARCHAR(100) NOT NULL,
    "kode_pos" VARCHAR(5),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,

    CONSTRAINT "subjek_pajak_pkey" PRIMARY KEY ("nik")
);

-- CreateTable
CREATE TABLE "transaksi_spop" (
    "id_transaksi" TEXT NOT NULL,
    "no_formulir" VARCHAR(20),
    "id_user" TEXT NOT NULL,
    "tahun_pajak" INTEGER NOT NULL,
    "jenis_transaksi" "JenisTransaksi" NOT NULL,
    "nop_bersama" VARCHAR(18),
    "no_sppt_lama" VARCHAR(20),
    "nama_pengaju" VARCHAR(100),
    "menggunakan_kuasa" BOOLEAN NOT NULL DEFAULT false,
    "tanggal_pengajuan" TIMESTAMP(3) NOT NULL,
    "status_ajuan" "StatusAjuan" NOT NULL DEFAULT 'DRAFT',
    "id_verifikator" TEXT,
    "verified_at" TIMESTAMP(3),
    "catatan_bakeuda" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transaksi_spop_pkey" PRIMARY KEY ("id_transaksi")
);

-- CreateTable
CREATE TABLE "detail_transaksi_asal" (
    "id_detail_asal" TEXT NOT NULL,
    "id_transaksi" TEXT NOT NULL,
    "nop_asal" VARCHAR(18),
    "nonaktifkan_saat_disetujui" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "detail_transaksi_asal_pkey" PRIMARY KEY ("id_detail_asal")
);

-- CreateTable
CREATE TABLE "detail_transaksi_tujuan" (
    "id_detail_tujuan" TEXT NOT NULL,
    "id_transaksi" TEXT NOT NULL,
    "nik_calon_subjek" VARCHAR(16) NOT NULL,
    "luas_tanah_baru" DECIMAL(10,2) NOT NULL,
    "luas_bangunan_baru" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "jumlah_bangunan_baru" INTEGER NOT NULL DEFAULT 0,
    "jenis_tanah_baru" "JenisTanah" NOT NULL,
    "no_persil_baru" VARCHAR(20),
    "nop_generated" VARCHAR(18),

    CONSTRAINT "detail_transaksi_tujuan_pkey" PRIMARY KEY ("id_detail_tujuan")
);

-- CreateTable
CREATE TABLE "users" (
    "id_user" TEXT NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "nama_lengkap" VARCHAR(100) NOT NULL,
    "role" "Role" NOT NULL,
    "kode_wilayah" VARCHAR(10),
    "nip" VARCHAR(25),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "wilayah" (
    "kode_wilayah" VARCHAR(10) NOT NULL,
    "nama_desa" VARCHAR(100) NOT NULL,
    "kode_kel" VARCHAR(5) NOT NULL,
    "kecamatan" VARCHAR(100) NOT NULL,
    "kode_kec" VARCHAR(5) NOT NULL,
    "kabupaten" VARCHAR(100) NOT NULL,
    "kode_kab" VARCHAR(5) NOT NULL,

    CONSTRAINT "wilayah_pkey" PRIMARY KEY ("kode_wilayah")
);

-- CreateIndex
CREATE INDEX "objek_pajak_nik_subjek_idx" ON "objek_pajak"("nik_subjek");

-- CreateIndex
CREATE UNIQUE INDEX "objek_pajak_kode_propinsi_kode_dati2_kode_kecamatan_kode_ke_key" ON "objek_pajak"("kode_propinsi", "kode_dati2", "kode_kecamatan", "kode_kelurahan", "kode_blok", "no_urut", "kode_jenis_op");

-- CreateIndex
CREATE UNIQUE INDEX "objek_bumi_nop_no_bumi_key" ON "objek_bumi"("nop", "no_bumi");

-- CreateIndex
CREATE UNIQUE INDEX "objek_bangunan_nop_no_bangunan_key" ON "objek_bangunan"("nop", "no_bangunan");

-- CreateIndex
CREATE UNIQUE INDEX "subjek_pajak_legacy_subjek_id_key" ON "subjek_pajak"("legacy_subjek_id");

-- CreateIndex
CREATE INDEX "subjek_pajak_nama_subjek_idx" ON "subjek_pajak"("nama_subjek");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "lampiran_dokumen" ADD CONSTRAINT "lampiran_dokumen_id_transaksi_fkey" FOREIGN KEY ("id_transaksi") REFERENCES "transaksi_spop"("id_transaksi") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lampiran_dokumen" ADD CONSTRAINT "lampiran_dokumen_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "users"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objek_pajak" ADD CONSTRAINT "objek_pajak_nik_subjek_fkey" FOREIGN KEY ("nik_subjek") REFERENCES "subjek_pajak"("nik") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objek_pajak" ADD CONSTRAINT "objek_pajak_nonaktif_oleh_fkey" FOREIGN KEY ("nonaktif_oleh") REFERENCES "users"("id_user") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objek_bumi" ADD CONSTRAINT "objek_bumi_nop_fkey" FOREIGN KEY ("nop") REFERENCES "objek_pajak"("nop") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objek_bangunan" ADD CONSTRAINT "objek_bangunan_nop_fkey" FOREIGN KEY ("nop") REFERENCES "objek_pajak"("nop") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sppt" ADD CONSTRAINT "sppt_nop_fkey" FOREIGN KEY ("nop") REFERENCES "objek_pajak"("nop") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sppt" ADD CONSTRAINT "sppt_generated_by_fkey" FOREIGN KEY ("generated_by") REFERENCES "users"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sppt" ADD CONSTRAINT "sppt_id_transaksi_asal_fkey" FOREIGN KEY ("id_transaksi_asal") REFERENCES "transaksi_spop"("id_transaksi") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjek_pajak" ADD CONSTRAINT "subjek_pajak_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaksi_spop" ADD CONSTRAINT "transaksi_spop_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaksi_spop" ADD CONSTRAINT "transaksi_spop_id_verifikator_fkey" FOREIGN KEY ("id_verifikator") REFERENCES "users"("id_user") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaksi_spop" ADD CONSTRAINT "transaksi_spop_nop_bersama_fkey" FOREIGN KEY ("nop_bersama") REFERENCES "objek_pajak"("nop") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_transaksi_asal" ADD CONSTRAINT "detail_transaksi_asal_id_transaksi_fkey" FOREIGN KEY ("id_transaksi") REFERENCES "transaksi_spop"("id_transaksi") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_transaksi_asal" ADD CONSTRAINT "detail_transaksi_asal_nop_asal_fkey" FOREIGN KEY ("nop_asal") REFERENCES "objek_pajak"("nop") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_transaksi_tujuan" ADD CONSTRAINT "detail_transaksi_tujuan_id_transaksi_fkey" FOREIGN KEY ("id_transaksi") REFERENCES "transaksi_spop"("id_transaksi") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_transaksi_tujuan" ADD CONSTRAINT "detail_transaksi_tujuan_nik_calon_subjek_fkey" FOREIGN KEY ("nik_calon_subjek") REFERENCES "subjek_pajak"("nik") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_kode_wilayah_fkey" FOREIGN KEY ("kode_wilayah") REFERENCES "wilayah"("kode_wilayah") ON DELETE SET NULL ON UPDATE CASCADE;
