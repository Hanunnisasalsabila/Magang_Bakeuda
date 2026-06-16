-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'petugas');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nama_lengkap" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "kode_wilayah" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
