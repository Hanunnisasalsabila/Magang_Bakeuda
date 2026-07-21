/*
  Warnings:

  - You are about to drop the column `keterangan` on the `riwayat_pelacakan` table. All the data in the column will be lost.
  - You are about to drop the column `status_riwayat` on the `riwayat_pelacakan` table. All the data in the column will be lost.
  - You are about to drop the column `waktu_kejadian` on the `riwayat_pelacakan` table. All the data in the column will be lost.
  - Added the required column `id_user` to the `riwayat_pelacakan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status_baru` to the `riwayat_pelacakan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "detail_transaksi_tujuan" ADD COLUMN     "kode_blok_baru" VARCHAR(3),
ADD COLUMN     "kode_wilayah_baru" VARCHAR(10),
ADD COLUMN     "koordinat_polygon" JSONB;

-- AlterTable
ALTER TABLE "objek_pajak" ADD COLUMN     "koordinat_polygon" JSONB;

-- AlterTable
ALTER TABLE "riwayat_pelacakan" DROP COLUMN "keterangan",
DROP COLUMN "status_riwayat",
DROP COLUMN "waktu_kejadian",
ADD COLUMN     "catatan" VARCHAR(500),
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id_user" TEXT NOT NULL,
ADD COLUMN     "status_baru" "StatusAjuan" NOT NULL,
ADD COLUMN     "status_lama" "StatusAjuan";

-- AlterTable
ALTER TABLE "transaksi_spop" ADD COLUMN     "peringatan_validasi" VARCHAR(500);

-- CreateIndex
CREATE INDEX "riwayat_pelacakan_id_transaksi_idx" ON "riwayat_pelacakan"("id_transaksi");

-- AddForeignKey
ALTER TABLE "riwayat_pelacakan" ADD CONSTRAINT "riwayat_pelacakan_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;
