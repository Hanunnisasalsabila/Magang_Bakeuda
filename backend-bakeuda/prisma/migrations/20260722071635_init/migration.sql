-- AlterTable
ALTER TABLE "detail_transaksi_asal" ALTER COLUMN "nonaktifkan_saat_disetujui" SET DEFAULT false;

-- AlterTable
ALTER TABLE "transaksi_spop" ADD COLUMN     "catatan_pengaju" VARCHAR(500);
