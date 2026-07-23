-- AlterTable
ALTER TABLE "objek_bangunan" ADD COLUMN     "oracle_synced_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "objek_bumi" ADD COLUMN     "oracle_synced_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "objek_pajak" ADD COLUMN     "oracle_source" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "oracle_synced_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "subjek_pajak" ADD COLUMN     "oracle_source" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "oracle_synced_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "sync_log" (
    "id" TEXT NOT NULL,
    "table_name" VARCHAR(50) NOT NULL,
    "sync_type" VARCHAR(20) NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "rows_synced" INTEGER NOT NULL DEFAULT 0,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "error_message" TEXT,
    "triggered_by" TEXT NOT NULL DEFAULT 'SYSTEM',

    CONSTRAINT "sync_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sync_log_table_name_started_at_idx" ON "sync_log"("table_name", "started_at");
