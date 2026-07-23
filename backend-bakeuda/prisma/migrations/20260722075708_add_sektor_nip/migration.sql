-- AlterTable
ALTER TABLE "objek_bangunan" ADD COLUMN     "nip_pemeriksa" VARCHAR(25),
ALTER COLUMN "nip_pendata" SET DATA TYPE VARCHAR(25);

-- AlterTable
ALTER TABLE "objek_bumi" ADD COLUMN     "nip_pemeriksa" VARCHAR(25),
ADD COLUMN     "nip_pendata" VARCHAR(25);

-- AlterTable
ALTER TABLE "objek_pajak" ADD COLUMN     "nip_pemeriksa" VARCHAR(25),
ADD COLUMN     "nip_pendata" VARCHAR(25);

-- AlterTable
ALTER TABLE "wilayah" ADD COLUMN     "kode_sektor" VARCHAR(2);

-- CreateTable
CREATE TABLE "sektor" (
    "kode_sektor" VARCHAR(2) NOT NULL,
    "nama_sektor" VARCHAR(100) NOT NULL,

    CONSTRAINT "sektor_pkey" PRIMARY KEY ("kode_sektor")
);

-- AddForeignKey
ALTER TABLE "wilayah" ADD CONSTRAINT "wilayah_kode_sektor_fkey" FOREIGN KEY ("kode_sektor") REFERENCES "sektor"("kode_sektor") ON DELETE SET NULL ON UPDATE CASCADE;
