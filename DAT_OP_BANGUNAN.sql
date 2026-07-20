/*
 Navicat Premium Data Transfer

 Source Server         : sismiop
 Source Server Type    : Oracle
 Source Server Version : 110200 (Oracle Database 11g Enterprise Edition Release 11.2.0.1.0 - 64bit Production
With the Partitioning, OLAP, Data Mining and Real Application Testing options)
 Source Host           : 192.168.20.52:1521
 Source Schema         : PBB

 Target Server Type    : Oracle
 Target Server Version : 110200 (Oracle Database 11g Enterprise Edition Release 11.2.0.1.0 - 64bit Production
With the Partitioning, OLAP, Data Mining and Real Application Testing options)
 File Encoding         : 65001

 Date: 24/06/2026 07:49:21
*/


-- ----------------------------
-- Table structure for DAT_OP_BANGUNAN
-- ----------------------------
DROP TABLE "PBB"."DAT_OP_BANGUNAN";
CREATE TABLE "PBB"."DAT_OP_BANGUNAN" (
  "KD_PROPINSI" CHAR(2 BYTE) NOT NULL,
  "KD_DATI2" CHAR(2 BYTE) NOT NULL,
  "KD_KECAMATAN" CHAR(3 BYTE) NOT NULL,
  "KD_KELURAHAN" CHAR(3 BYTE) NOT NULL,
  "KD_BLOK" CHAR(3 BYTE) NOT NULL,
  "NO_URUT" CHAR(4 BYTE) NOT NULL,
  "KD_JNS_OP" CHAR(1 BYTE) NOT NULL,
  "NO_BNG" NUMBER(3,0) NOT NULL,
  "KD_JPB" CHAR(2 BYTE),
  "NO_FORMULIR_LSPOP" CHAR(11 BYTE),
  "THN_DIBANGUN_BNG" CHAR(4 BYTE) DEFAULT TO_CHAR(SYSDATE,'YYYY'),
  "THN_RENOVASI_BNG" CHAR(4 BYTE),
  "LUAS_BNG" NUMBER(12,0) DEFAULT 0,
  "JML_LANTAI_BNG" NUMBER(3,0) DEFAULT 1,
  "KONDISI_BNG" CHAR(1 BYTE),
  "JNS_KONSTRUKSI_BNG" CHAR(1 BYTE),
  "JNS_ATAP_BNG" CHAR(1 BYTE),
  "KD_DINDING" CHAR(1 BYTE),
  "KD_LANTAI" CHAR(1 BYTE),
  "KD_LANGIT_LANGIT" CHAR(1 BYTE),
  "NILAI_SISTEM_BNG" NUMBER(15,0),
  "JNS_TRANSAKSI_BNG" CHAR(1 BYTE) DEFAULT '1',
  "TGL_PENDATAAN_BNG" DATE DEFAULT SYSDATE,
  "NIP_PENDATA_BNG" CHAR(9 BYTE),
  "TGL_PEMERIKSAAN_BNG" DATE DEFAULT SYSDATE,
  "NIP_PEMERIKSA_BNG" CHAR(9 BYTE),
  "TGL_PEREKAMAN_BNG" DATE DEFAULT SYSDATE,
  "NIP_PEREKAM_BNG" CHAR(9 BYTE),
  "KETERANGAN_JPB" VARCHAR2(50 BYTE)
)
LOGGING
NOCOMPRESS
PCTFREE 10
INITRANS 1
STORAGE (
  INITIAL 39845888 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
)
PARALLEL 1
NOCACHE
DISABLE ROW MOVEMENT
;

-- ----------------------------
-- Primary Key structure for table DAT_OP_BANGUNAN
-- ----------------------------
ALTER TABLE "PBB"."DAT_OP_BANGUNAN" ADD CONSTRAINT "PK_D14" PRIMARY KEY ("KD_PROPINSI", "KD_DATI2", "KD_KECAMATAN", "KD_KELURAHAN", "KD_BLOK", "NO_URUT", "KD_JNS_OP", "NO_BNG");

-- ----------------------------
-- Checks structure for table DAT_OP_BANGUNAN
-- ----------------------------
ALTER TABLE "PBB"."DAT_OP_BANGUNAN" ADD CONSTRAINT "SYS_C0014940" CHECK ("KD_PROPINSI" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY NOVALIDATE;
ALTER TABLE "PBB"."DAT_OP_BANGUNAN" ADD CONSTRAINT "SYS_C0014941" CHECK ("KD_DATI2" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY NOVALIDATE;
ALTER TABLE "PBB"."DAT_OP_BANGUNAN" ADD CONSTRAINT "SYS_C0014942" CHECK ("KD_KECAMATAN" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY NOVALIDATE;
ALTER TABLE "PBB"."DAT_OP_BANGUNAN" ADD CONSTRAINT "SYS_C0014943" CHECK ("KD_KELURAHAN" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY NOVALIDATE;
ALTER TABLE "PBB"."DAT_OP_BANGUNAN" ADD CONSTRAINT "SYS_C0014944" CHECK ("KD_BLOK" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY NOVALIDATE;
ALTER TABLE "PBB"."DAT_OP_BANGUNAN" ADD CONSTRAINT "SYS_C0014945" CHECK ("NO_URUT" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY NOVALIDATE;
ALTER TABLE "PBB"."DAT_OP_BANGUNAN" ADD CONSTRAINT "SYS_C0014946" CHECK ("KD_JNS_OP" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY NOVALIDATE;
ALTER TABLE "PBB"."DAT_OP_BANGUNAN" ADD CONSTRAINT "SYS_C0014947" CHECK ("NO_BNG" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY NOVALIDATE;
ALTER TABLE "PBB"."DAT_OP_BANGUNAN" ADD CONSTRAINT "SYS_C0014948" CHECK ("KD_JPB" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY NOVALIDATE;
ALTER TABLE "PBB"."DAT_OP_BANGUNAN" ADD CONSTRAINT "SYS_C0014949" CHECK ("NO_FORMULIR_LSPOP" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY NOVALIDATE;
ALTER TABLE "PBB"."DAT_OP_BANGUNAN" ADD CONSTRAINT "SYS_C0014950" CHECK ("THN_DIBANGUN_BNG" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY NOVALIDATE;
ALTER TABLE "PBB"."DAT_OP_BANGUNAN" ADD CONSTRAINT "SYS_C0014951" CHECK ("LUAS_BNG" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY NOVALIDATE;
ALTER TABLE "PBB"."DAT_OP_BANGUNAN" ADD CONSTRAINT "SYS_C0014952" CHECK ("JML_LANTAI_BNG" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY NOVALIDATE;
ALTER TABLE "PBB"."DAT_OP_BANGUNAN" ADD CONSTRAINT "SYS_C0014953" CHECK ("KONDISI_BNG" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY NOVALIDATE;
ALTER TABLE "PBB"."DAT_OP_BANGUNAN" ADD CONSTRAINT "SYS_C0014954" CHECK ("NILAI_SISTEM_BNG" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY NOVALIDATE;
ALTER TABLE "PBB"."DAT_OP_BANGUNAN" ADD CONSTRAINT "SYS_C0014955" CHECK ("JNS_TRANSAKSI_BNG" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY NOVALIDATE;
ALTER TABLE "PBB"."DAT_OP_BANGUNAN" ADD CONSTRAINT "SYS_C0014956" CHECK ("TGL_PENDATAAN_BNG" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY NOVALIDATE;
ALTER TABLE "PBB"."DAT_OP_BANGUNAN" ADD CONSTRAINT "SYS_C0014957" CHECK ("NIP_PENDATA_BNG" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY NOVALIDATE;
ALTER TABLE "PBB"."DAT_OP_BANGUNAN" ADD CONSTRAINT "SYS_C0014958" CHECK ("TGL_PEMERIKSAAN_BNG" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY NOVALIDATE;
ALTER TABLE "PBB"."DAT_OP_BANGUNAN" ADD CONSTRAINT "SYS_C0014959" CHECK ("NIP_PEMERIKSA_BNG" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY NOVALIDATE;
ALTER TABLE "PBB"."DAT_OP_BANGUNAN" ADD CONSTRAINT "SYS_C0014960" CHECK ("TGL_PEREKAMAN_BNG" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY NOVALIDATE;
ALTER TABLE "PBB"."DAT_OP_BANGUNAN" ADD CONSTRAINT "SYS_C0014961" CHECK ("NIP_PEREKAM_BNG" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY NOVALIDATE;

-- ----------------------------
-- Indexes structure for table DAT_OP_BANGUNAN
-- ----------------------------
CREATE UNIQUE INDEX "PBB"."D14_1_AK"
  ON "PBB"."DAT_OP_BANGUNAN" ("KD_JPB" ASC, "KD_PROPINSI" ASC, "KD_DATI2" ASC, "KD_KECAMATAN" ASC, "KD_KELURAHAN" ASC, "KD_BLOK" ASC, "NO_URUT" ASC, "KD_JNS_OP" ASC, "NO_BNG" ASC)
  LOGGING
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 8388608 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
);

-- ----------------------------
-- Triggers structure for table DAT_OP_BANGUNAN
-- ----------------------------
CREATE TRIGGER "PBB"."TDA_D14" AFTER DELETE ON "PBB"."DAT_OP_BANGUNAN" REFERENCING OLD AS "OLD" NEW AS "NEW" FOR EACH ROW 
declare
    integrity_error  exception;
    errno            integer;
    errmsg           char(200);
    dummy            integer;
    found            boolean;

begin
    IntegrityPackage.NextNestLevel;

    --  Delete all children in "DAT_KUNJUNGAN_KEMBALI"
    delete DAT_KUNJUNGAN_KEMBALI
    where  KD_PROPINSI = :old.KD_PROPINSI
     and   KD_DATI2 = :old.KD_DATI2
     and   KD_KECAMATAN = :old.KD_KECAMATAN
     and   KD_KELURAHAN = :old.KD_KELURAHAN
     and   KD_BLOK = :old.KD_BLOK
     and   NO_URUT = :old.NO_URUT
     and   KD_JNS_OP = :old.KD_JNS_OP
     and   NO_BNG = :old.NO_BNG;

    --  Delete all children in "DAT_NILAI_INDIVIDU"
    delete DAT_NILAI_INDIVIDU
    where  KD_PROPINSI = :old.KD_PROPINSI
     and   KD_DATI2 = :old.KD_DATI2
     and   KD_KECAMATAN = :old.KD_KECAMATAN
     and   KD_KELURAHAN = :old.KD_KELURAHAN
     and   KD_BLOK = :old.KD_BLOK
     and   NO_URUT = :old.NO_URUT
     and   KD_JNS_OP = :old.KD_JNS_OP
     and   NO_BNG = :old.NO_BNG;

    --  Delete all children in "DAT_FASILITAS_BANGUNAN"
    delete DAT_FASILITAS_BANGUNAN
    where  KD_PROPINSI = :old.KD_PROPINSI
     and   KD_DATI2 = :old.KD_DATI2
     and   KD_KECAMATAN = :old.KD_KECAMATAN
     and   KD_KELURAHAN = :old.KD_KELURAHAN
     and   KD_BLOK = :old.KD_BLOK
     and   NO_URUT = :old.NO_URUT
     and   KD_JNS_OP = :old.KD_JNS_OP
     and   NO_BNG = :old.NO_BNG;

    --  Delete all children in "HIS_OP_BNG"
    delete HIS_OP_BNG
    where  KD_PROPINSI = :old.KD_PROPINSI
     and   KD_DATI2 = :old.KD_DATI2
     and   KD_KECAMATAN = :old.KD_KECAMATAN
     and   KD_KELURAHAN = :old.KD_KELURAHAN
     and   KD_BLOK = :old.KD_BLOK
     and   NO_URUT = :old.NO_URUT
     and   KD_JNS_OP = :old.KD_JNS_OP
     and   NO_BNG = :old.NO_BNG;

    --  Delete all children in "DAT_JPB14"
    delete DAT_JPB14
    where  KD_PROPINSI = :old.KD_PROPINSI
     and   KD_DATI2 = :old.KD_DATI2
     and   KD_KECAMATAN = :old.KD_KECAMATAN
     and   KD_KELURAHAN = :old.KD_KELURAHAN
     and   KD_BLOK = :old.KD_BLOK
     and   NO_URUT = :old.NO_URUT
     and   KD_JNS_OP = :old.KD_JNS_OP
     and   NO_BNG = :old.NO_BNG;

    --  Delete all children in "DAT_JPB2"
    delete DAT_JPB2
    where  KD_PROPINSI = :old.KD_PROPINSI
     and   KD_DATI2 = :old.KD_DATI2
     and   KD_KECAMATAN = :old.KD_KECAMATAN
     and   KD_KELURAHAN = :old.KD_KELURAHAN
     and   KD_BLOK = :old.KD_BLOK
     and   NO_URUT = :old.NO_URUT
     and   KD_JNS_OP = :old.KD_JNS_OP
     and   NO_BNG = :old.NO_BNG;

    --  Delete all children in "DAT_JPB9"
    delete DAT_JPB9
    where  KD_PROPINSI = :old.KD_PROPINSI
     and   KD_DATI2 = :old.KD_DATI2
     and   KD_KECAMATAN = :old.KD_KECAMATAN
     and   KD_KELURAHAN = :old.KD_KELURAHAN
     and   KD_BLOK = :old.KD_BLOK
     and   NO_URUT = :old.NO_URUT
     and   KD_JNS_OP = :old.KD_JNS_OP
     and   NO_BNG = :old.NO_BNG;

    --  Delete all children in "DAT_JPB13"
    delete DAT_JPB13
    where  KD_PROPINSI = :old.KD_PROPINSI
     and   KD_DATI2 = :old.KD_DATI2
     and   KD_KECAMATAN = :old.KD_KECAMATAN
     and   KD_KELURAHAN = :old.KD_KELURAHAN
     and   KD_BLOK = :old.KD_BLOK
     and   NO_URUT = :old.NO_URUT
     and   KD_JNS_OP = :old.KD_JNS_OP
     and   NO_BNG = :old.NO_BNG;

    --  Delete all children in "DAT_JPB12"
    delete DAT_JPB12
    where  KD_PROPINSI = :old.KD_PROPINSI
     and   KD_DATI2 = :old.KD_DATI2
     and   KD_KECAMATAN = :old.KD_KECAMATAN
     and   KD_KELURAHAN = :old.KD_KELURAHAN
     and   KD_BLOK = :old.KD_BLOK
     and   NO_URUT = :old.NO_URUT
     and   KD_JNS_OP = :old.KD_JNS_OP
     and   NO_BNG = :old.NO_BNG;

    --  Delete all children in "DAT_JPB16"
    delete DAT_JPB16
    where  KD_PROPINSI = :old.KD_PROPINSI
     and   KD_DATI2 = :old.KD_DATI2
     and   KD_KECAMATAN = :old.KD_KECAMATAN
     and   KD_KELURAHAN = :old.KD_KELURAHAN
     and   KD_BLOK = :old.KD_BLOK
     and   NO_URUT = :old.NO_URUT
     and   KD_JNS_OP = :old.KD_JNS_OP
     and   NO_BNG = :old.NO_BNG;

    --  Delete all children in "DAT_JPB15"
    delete DAT_JPB15
    where  KD_PROPINSI = :old.KD_PROPINSI
     and   KD_DATI2 = :old.KD_DATI2
     and   KD_KECAMATAN = :old.KD_KECAMATAN
     and   KD_KELURAHAN = :old.KD_KELURAHAN
     and   KD_BLOK = :old.KD_BLOK
     and   NO_URUT = :old.NO_URUT
     and   KD_JNS_OP = :old.KD_JNS_OP
     and   NO_BNG = :old.NO_BNG;

    --  Delete all children in "DAT_JPB4"
    delete DAT_JPB4
    where  KD_PROPINSI = :old.KD_PROPINSI
     and   KD_DATI2 = :old.KD_DATI2
     and   KD_KECAMATAN = :old.KD_KECAMATAN
     and   KD_KELURAHAN = :old.KD_KELURAHAN
     and   KD_BLOK = :old.KD_BLOK
     and   NO_URUT = :old.NO_URUT
     and   KD_JNS_OP = :old.KD_JNS_OP
     and   NO_BNG = :old.NO_BNG;

    --  Delete all children in "DAT_JPB7"
    delete DAT_JPB7
    where  KD_PROPINSI = :old.KD_PROPINSI
     and   KD_DATI2 = :old.KD_DATI2
     and   KD_KECAMATAN = :old.KD_KECAMATAN
     and   KD_KELURAHAN = :old.KD_KELURAHAN
     and   KD_BLOK = :old.KD_BLOK
     and   NO_URUT = :old.NO_URUT
     and   KD_JNS_OP = :old.KD_JNS_OP
     and   NO_BNG = :old.NO_BNG;

    --  Delete all children in "DAT_JPB6"
    delete DAT_JPB6
    where  KD_PROPINSI = :old.KD_PROPINSI
     and   KD_DATI2 = :old.KD_DATI2
     and   KD_KECAMATAN = :old.KD_KECAMATAN
     and   KD_KELURAHAN = :old.KD_KELURAHAN
     and   KD_BLOK = :old.KD_BLOK
     and   NO_URUT = :old.NO_URUT
     and   KD_JNS_OP = :old.KD_JNS_OP
     and   NO_BNG = :old.NO_BNG;

    --  Delete all children in "DAT_JPB5"
    delete DAT_JPB5
    where  KD_PROPINSI = :old.KD_PROPINSI
     and   KD_DATI2 = :old.KD_DATI2
     and   KD_KECAMATAN = :old.KD_KECAMATAN
     and   KD_KELURAHAN = :old.KD_KELURAHAN
     and   KD_BLOK = :old.KD_BLOK
     and   NO_URUT = :old.NO_URUT
     and   KD_JNS_OP = :old.KD_JNS_OP
     and   NO_BNG = :old.NO_BNG;

    --  Delete all children in "DAT_JPB8"
    delete DAT_JPB8
    where  KD_PROPINSI = :old.KD_PROPINSI
     and   KD_DATI2 = :old.KD_DATI2
     and   KD_KECAMATAN = :old.KD_KECAMATAN
     and   KD_KELURAHAN = :old.KD_KELURAHAN
     and   KD_BLOK = :old.KD_BLOK
     and   NO_URUT = :old.NO_URUT
     and   KD_JNS_OP = :old.KD_JNS_OP
     and   NO_BNG = :old.NO_BNG;

    --  Delete all children in "DAT_JPB3"
    delete DAT_JPB3
    where  KD_PROPINSI = :old.KD_PROPINSI
     and   KD_DATI2 = :old.KD_DATI2
     and   KD_KECAMATAN = :old.KD_KECAMATAN
     and   KD_KELURAHAN = :old.KD_KELURAHAN
     and   KD_BLOK = :old.KD_BLOK
     and   NO_URUT = :old.NO_URUT
     and   KD_JNS_OP = :old.KD_JNS_OP
     and   NO_BNG = :old.NO_BNG;
    IntegrityPackage.PreviousNestLevel;

--  Errors handling
exception
    when integrity_error then
       begin
       IntegrityPackage.InitNestLevel;
       raise_application_error(errno, errmsg);
       end;
end;
/
CREATE TRIGGER "PBB"."TDA_DAT_OP_BANGUNAN" AFTER DELETE ON "PBB"."DAT_OP_BANGUNAN" REFERENCING OLD AS "OLD" NEW AS "NEW" FOR EACH ROW 
declare
    integrity_error  exception;
    errno            integer;
    errmsg           char(200);
    dummy            integer;
    found            boolean;

begin
    IntegrityPackage.NextNestLevel;

    --  Delete all children in "BNG_SIN_PROFILE"
    delete BNG_SIN_PROFILE
    where  KD_PROPINSI = :old.KD_PROPINSI
     and   KD_DATI2 = :old.KD_DATI2
     and   KD_KECAMATAN = :old.KD_KECAMATAN
     and   KD_KELURAHAN = :old.KD_KELURAHAN
     and   KD_BLOK = :old.KD_BLOK
     and   NO_URUT = :old.NO_URUT
     and   KD_JNS_OP = :old.KD_JNS_OP
     and   NO_BNG = :old.NO_BNG;

    --  Delete all children in "DAT_OP_BNG_KIBB"
    delete DAT_OP_BNG_KIBB
    where  KD_PROPINSI = :old.KD_PROPINSI
     and   KD_DATI2 = :old.KD_DATI2
     and   KD_KECAMATAN = :old.KD_KECAMATAN
     and   KD_KELURAHAN = :old.KD_KELURAHAN
     and   KD_BLOK = :old.KD_BLOK
     and   NO_URUT = :old.NO_URUT
     and   KD_JNS_OP = :old.KD_JNS_OP
     and   NO_BNG = :old.NO_BNG;

    --  Delete all children in "TELEPON"
    delete TELEPON
    where  KD_PROPINSI = :old.KD_PROPINSI
     and   KD_DATI2 = :old.KD_DATI2
     and   KD_KECAMATAN = :old.KD_KECAMATAN
     and   KD_KELURAHAN = :old.KD_KELURAHAN
     and   KD_BLOK = :old.KD_BLOK
     and   NO_URUT = :old.NO_URUT
     and   KD_JNS_OP = :old.KD_JNS_OP
     and   NO_BNG = :old.NO_BNG;

    --  Delete all children in "PAM"
    delete PAM
    where  KD_PROPINSI = :old.KD_PROPINSI
     and   KD_DATI2 = :old.KD_DATI2
     and   KD_KECAMATAN = :old.KD_KECAMATAN
     and   KD_KELURAHAN = :old.KD_KELURAHAN
     and   KD_BLOK = :old.KD_BLOK
     and   NO_URUT = :old.NO_URUT
     and   KD_JNS_OP = :old.KD_JNS_OP
     and   NO_BNG = :old.NO_BNG;

    --  Delete all children in "LISTRIK"
    delete LISTRIK
    where  KD_PROPINSI = :old.KD_PROPINSI
     and   KD_DATI2 = :old.KD_DATI2
     and   KD_KECAMATAN = :old.KD_KECAMATAN
     and   KD_KELURAHAN = :old.KD_KELURAHAN
     and   KD_BLOK = :old.KD_BLOK
     and   NO_URUT = :old.NO_URUT
     and   KD_JNS_OP = :old.KD_JNS_OP
     and   NO_BNG = :old.NO_BNG;

    --  Delete all children in "GAS"
    delete GAS
    where  KD_PROPINSI = :old.KD_PROPINSI
     and   KD_DATI2 = :old.KD_DATI2
     and   KD_KECAMATAN = :old.KD_KECAMATAN
     and   KD_KELURAHAN = :old.KD_KELURAHAN
     and   KD_BLOK = :old.KD_BLOK
     and   NO_URUT = :old.NO_URUT
     and   KD_JNS_OP = :old.KD_JNS_OP
     and   NO_BNG = :old.NO_BNG;
    IntegrityPackage.PreviousNestLevel;

--  Errors handling
exception
    when integrity_error then
       begin
       IntegrityPackage.InitNestLevel;
       raise_application_error(errno, errmsg);
       end;
end;
/
CREATE TRIGGER "PBB"."TUA_D14" AFTER UPDATE OF "KD_BLOK", "KD_DATI2", "KD_JNS_OP", "KD_JPB", "KD_KECAMATAN", "KD_KELURAHAN", "KD_PROPINSI", "NIP_PEMERIKSA_BNG", "NIP_PENDATA_BNG", "NIP_PEREKAM_BNG", "NO_BNG", "NO_URUT" ON "PBB"."DAT_OP_BANGUNAN" REFERENCING OLD AS "OLD" NEW AS "NEW" FOR EACH ROW 
declare
    integrity_error  exception;
    errno            integer;
    errmsg           char(200);
    dummy            integer;
    found            boolean;
begin
    IntegrityPackage.NextNestLevel;

    --  Modify parent code of "DAT_OP_BANGUNAN" for all children in "DAT_KUNJUNGAN_KEMBALI"
    if (updating('KD_PROPINSI') and :old.KD_PROPINSI != :new.KD_PROPINSI) or
       (updating('KD_DATI2') and :old.KD_DATI2 != :new.KD_DATI2) or
       (updating('KD_KECAMATAN') and :old.KD_KECAMATAN != :new.KD_KECAMATAN) or
       (updating('KD_KELURAHAN') and :old.KD_KELURAHAN != :new.KD_KELURAHAN) or
       (updating('KD_BLOK') and :old.KD_BLOK != :new.KD_BLOK) or
       (updating('NO_URUT') and :old.NO_URUT != :new.NO_URUT) or
       (updating('KD_JNS_OP') and :old.KD_JNS_OP != :new.KD_JNS_OP) or
       (updating('NO_BNG') and :old.NO_BNG != :new.NO_BNG) then
       update DAT_KUNJUNGAN_KEMBALI
        set   KD_PROPINSI = :new.KD_PROPINSI,
              KD_DATI2 = :new.KD_DATI2,
              KD_KECAMATAN = :new.KD_KECAMATAN,
              KD_KELURAHAN = :new.KD_KELURAHAN,
              KD_BLOK = :new.KD_BLOK,
              NO_URUT = :new.NO_URUT,
              KD_JNS_OP = :new.KD_JNS_OP,
              NO_BNG = :new.NO_BNG
       where  KD_PROPINSI = :old.KD_PROPINSI
        and   KD_DATI2 = :old.KD_DATI2
        and   KD_KECAMATAN = :old.KD_KECAMATAN
        and   KD_KELURAHAN = :old.KD_KELURAHAN
        and   KD_BLOK = :old.KD_BLOK
        and   NO_URUT = :old.NO_URUT
        and   KD_JNS_OP = :old.KD_JNS_OP
        and   NO_BNG = :old.NO_BNG;
    end if;

    --  Modify parent code of "DAT_OP_BANGUNAN" for all children in "DAT_NILAI_INDIVIDU"
    if (updating('KD_PROPINSI') and :old.KD_PROPINSI != :new.KD_PROPINSI) or
       (updating('KD_DATI2') and :old.KD_DATI2 != :new.KD_DATI2) or
       (updating('KD_KECAMATAN') and :old.KD_KECAMATAN != :new.KD_KECAMATAN) or
       (updating('KD_KELURAHAN') and :old.KD_KELURAHAN != :new.KD_KELURAHAN) or
       (updating('KD_BLOK') and :old.KD_BLOK != :new.KD_BLOK) or
       (updating('NO_URUT') and :old.NO_URUT != :new.NO_URUT) or
       (updating('KD_JNS_OP') and :old.KD_JNS_OP != :new.KD_JNS_OP) or
       (updating('NO_BNG') and :old.NO_BNG != :new.NO_BNG) then
       update DAT_NILAI_INDIVIDU
        set   KD_PROPINSI = :new.KD_PROPINSI,
              KD_DATI2 = :new.KD_DATI2,
              KD_KECAMATAN = :new.KD_KECAMATAN,
              KD_KELURAHAN = :new.KD_KELURAHAN,
              KD_BLOK = :new.KD_BLOK,
              NO_URUT = :new.NO_URUT,
              KD_JNS_OP = :new.KD_JNS_OP,
              NO_BNG = :new.NO_BNG
       where  KD_PROPINSI = :old.KD_PROPINSI
        and   KD_DATI2 = :old.KD_DATI2
        and   KD_KECAMATAN = :old.KD_KECAMATAN
        and   KD_KELURAHAN = :old.KD_KELURAHAN
        and   KD_BLOK = :old.KD_BLOK
        and   NO_URUT = :old.NO_URUT
        and   KD_JNS_OP = :old.KD_JNS_OP
        and   NO_BNG = :old.NO_BNG;
    end if;

    --  Modify parent code of "DAT_OP_BANGUNAN" for all children in "DAT_FASILITAS_BANGUNAN"
    if (updating('KD_PROPINSI') and :old.KD_PROPINSI != :new.KD_PROPINSI) or
       (updating('KD_DATI2') and :old.KD_DATI2 != :new.KD_DATI2) or
       (updating('KD_KECAMATAN') and :old.KD_KECAMATAN != :new.KD_KECAMATAN) or
       (updating('KD_KELURAHAN') and :old.KD_KELURAHAN != :new.KD_KELURAHAN) or
       (updating('KD_BLOK') and :old.KD_BLOK != :new.KD_BLOK) or
       (updating('NO_URUT') and :old.NO_URUT != :new.NO_URUT) or
       (updating('KD_JNS_OP') and :old.KD_JNS_OP != :new.KD_JNS_OP) or
       (updating('NO_BNG') and :old.NO_BNG != :new.NO_BNG) then
       update DAT_FASILITAS_BANGUNAN
        set   KD_PROPINSI = :new.KD_PROPINSI,
              KD_DATI2 = :new.KD_DATI2,
              KD_KECAMATAN = :new.KD_KECAMATAN,
              KD_KELURAHAN = :new.KD_KELURAHAN,
              KD_BLOK = :new.KD_BLOK,
              NO_URUT = :new.NO_URUT,
              KD_JNS_OP = :new.KD_JNS_OP,
              NO_BNG = :new.NO_BNG
       where  KD_PROPINSI = :old.KD_PROPINSI
        and   KD_DATI2 = :old.KD_DATI2
        and   KD_KECAMATAN = :old.KD_KECAMATAN
        and   KD_KELURAHAN = :old.KD_KELURAHAN
        and   KD_BLOK = :old.KD_BLOK
        and   NO_URUT = :old.NO_URUT
        and   KD_JNS_OP = :old.KD_JNS_OP
        and   NO_BNG = :old.NO_BNG;
    end if;

    --  Modify parent code of "DAT_OP_BANGUNAN" for all children in "HIS_OP_BNG"
    if (updating('KD_PROPINSI') and :old.KD_PROPINSI != :new.KD_PROPINSI) or
       (updating('KD_DATI2') and :old.KD_DATI2 != :new.KD_DATI2) or
       (updating('KD_KECAMATAN') and :old.KD_KECAMATAN != :new.KD_KECAMATAN) or
       (updating('KD_KELURAHAN') and :old.KD_KELURAHAN != :new.KD_KELURAHAN) or
       (updating('KD_BLOK') and :old.KD_BLOK != :new.KD_BLOK) or
       (updating('NO_URUT') and :old.NO_URUT != :new.NO_URUT) or
       (updating('KD_JNS_OP') and :old.KD_JNS_OP != :new.KD_JNS_OP) or
       (updating('NO_BNG') and :old.NO_BNG != :new.NO_BNG) then
       update HIS_OP_BNG
        set   KD_PROPINSI = :new.KD_PROPINSI,
              KD_DATI2 = :new.KD_DATI2,
              KD_KECAMATAN = :new.KD_KECAMATAN,
              KD_KELURAHAN = :new.KD_KELURAHAN,
              KD_BLOK = :new.KD_BLOK,
              NO_URUT = :new.NO_URUT,
              KD_JNS_OP = :new.KD_JNS_OP,
              NO_BNG = :new.NO_BNG
       where  KD_PROPINSI = :old.KD_PROPINSI
        and   KD_DATI2 = :old.KD_DATI2
        and   KD_KECAMATAN = :old.KD_KECAMATAN
        and   KD_KELURAHAN = :old.KD_KELURAHAN
        and   KD_BLOK = :old.KD_BLOK
        and   NO_URUT = :old.NO_URUT
        and   KD_JNS_OP = :old.KD_JNS_OP
        and   NO_BNG = :old.NO_BNG;
    end if;

    --  Modify parent code of "DAT_OP_BANGUNAN" for all children in "DAT_JPB14"
    if (updating('KD_PROPINSI') and :old.KD_PROPINSI != :new.KD_PROPINSI) or
       (updating('KD_DATI2') and :old.KD_DATI2 != :new.KD_DATI2) or
       (updating('KD_KECAMATAN') and :old.KD_KECAMATAN != :new.KD_KECAMATAN) or
       (updating('KD_KELURAHAN') and :old.KD_KELURAHAN != :new.KD_KELURAHAN) or
       (updating('KD_BLOK') and :old.KD_BLOK != :new.KD_BLOK) or
       (updating('NO_URUT') and :old.NO_URUT != :new.NO_URUT) or
       (updating('KD_JNS_OP') and :old.KD_JNS_OP != :new.KD_JNS_OP) or
       (updating('NO_BNG') and :old.NO_BNG != :new.NO_BNG) then
       update DAT_JPB14
        set   KD_PROPINSI = :new.KD_PROPINSI,
              KD_DATI2 = :new.KD_DATI2,
              KD_KECAMATAN = :new.KD_KECAMATAN,
              KD_KELURAHAN = :new.KD_KELURAHAN,
              KD_BLOK = :new.KD_BLOK,
              NO_URUT = :new.NO_URUT,
              KD_JNS_OP = :new.KD_JNS_OP,
              NO_BNG = :new.NO_BNG
       where  KD_PROPINSI = :old.KD_PROPINSI
        and   KD_DATI2 = :old.KD_DATI2
        and   KD_KECAMATAN = :old.KD_KECAMATAN
        and   KD_KELURAHAN = :old.KD_KELURAHAN
        and   KD_BLOK = :old.KD_BLOK
        and   NO_URUT = :old.NO_URUT
        and   KD_JNS_OP = :old.KD_JNS_OP
        and   NO_BNG = :old.NO_BNG;
    end if;

    --  Modify parent code of "DAT_OP_BANGUNAN" for all children in "DAT_JPB2"
    if (updating('KD_PROPINSI') and :old.KD_PROPINSI != :new.KD_PROPINSI) or
       (updating('KD_DATI2') and :old.KD_DATI2 != :new.KD_DATI2) or
       (updating('KD_KECAMATAN') and :old.KD_KECAMATAN != :new.KD_KECAMATAN) or
       (updating('KD_KELURAHAN') and :old.KD_KELURAHAN != :new.KD_KELURAHAN) or
       (updating('KD_BLOK') and :old.KD_BLOK != :new.KD_BLOK) or
       (updating('NO_URUT') and :old.NO_URUT != :new.NO_URUT) or
       (updating('KD_JNS_OP') and :old.KD_JNS_OP != :new.KD_JNS_OP) or
       (updating('NO_BNG') and :old.NO_BNG != :new.NO_BNG) then
       update DAT_JPB2
        set   KD_PROPINSI = :new.KD_PROPINSI,
              KD_DATI2 = :new.KD_DATI2,
              KD_KECAMATAN = :new.KD_KECAMATAN,
              KD_KELURAHAN = :new.KD_KELURAHAN,
              KD_BLOK = :new.KD_BLOK,
              NO_URUT = :new.NO_URUT,
              KD_JNS_OP = :new.KD_JNS_OP,
              NO_BNG = :new.NO_BNG
       where  KD_PROPINSI = :old.KD_PROPINSI
        and   KD_DATI2 = :old.KD_DATI2
        and   KD_KECAMATAN = :old.KD_KECAMATAN
        and   KD_KELURAHAN = :old.KD_KELURAHAN
        and   KD_BLOK = :old.KD_BLOK
        and   NO_URUT = :old.NO_URUT
        and   KD_JNS_OP = :old.KD_JNS_OP
        and   NO_BNG = :old.NO_BNG;
    end if;

    --  Modify parent code of "DAT_OP_BANGUNAN" for all children in "DAT_JPB9"
    if (updating('KD_PROPINSI') and :old.KD_PROPINSI != :new.KD_PROPINSI) or
       (updating('KD_DATI2') and :old.KD_DATI2 != :new.KD_DATI2) or
       (updating('KD_KECAMATAN') and :old.KD_KECAMATAN != :new.KD_KECAMATAN) or
       (updating('KD_KELURAHAN') and :old.KD_KELURAHAN != :new.KD_KELURAHAN) or
       (updating('KD_BLOK') and :old.KD_BLOK != :new.KD_BLOK) or
       (updating('NO_URUT') and :old.NO_URUT != :new.NO_URUT) or
       (updating('KD_JNS_OP') and :old.KD_JNS_OP != :new.KD_JNS_OP) or
       (updating('NO_BNG') and :old.NO_BNG != :new.NO_BNG) then
       update DAT_JPB9
        set   KD_PROPINSI = :new.KD_PROPINSI,
              KD_DATI2 = :new.KD_DATI2,
              KD_KECAMATAN = :new.KD_KECAMATAN,
              KD_KELURAHAN = :new.KD_KELURAHAN,
              KD_BLOK = :new.KD_BLOK,
              NO_URUT = :new.NO_URUT,
              KD_JNS_OP = :new.KD_JNS_OP,
              NO_BNG = :new.NO_BNG
       where  KD_PROPINSI = :old.KD_PROPINSI
        and   KD_DATI2 = :old.KD_DATI2
        and   KD_KECAMATAN = :old.KD_KECAMATAN
        and   KD_KELURAHAN = :old.KD_KELURAHAN
        and   KD_BLOK = :old.KD_BLOK
        and   NO_URUT = :old.NO_URUT
        and   KD_JNS_OP = :old.KD_JNS_OP
        and   NO_BNG = :old.NO_BNG;
    end if;

    --  Modify parent code of "DAT_OP_BANGUNAN" for all children in "DAT_JPB13"
    if (updating('KD_PROPINSI') and :old.KD_PROPINSI != :new.KD_PROPINSI) or
       (updating('KD_DATI2') and :old.KD_DATI2 != :new.KD_DATI2) or
       (updating('KD_KECAMATAN') and :old.KD_KECAMATAN != :new.KD_KECAMATAN) or
       (updating('KD_KELURAHAN') and :old.KD_KELURAHAN != :new.KD_KELURAHAN) or
       (updating('KD_BLOK') and :old.KD_BLOK != :new.KD_BLOK) or
       (updating('NO_URUT') and :old.NO_URUT != :new.NO_URUT) or
       (updating('KD_JNS_OP') and :old.KD_JNS_OP != :new.KD_JNS_OP) or
       (updating('NO_BNG') and :old.NO_BNG != :new.NO_BNG) then
       update DAT_JPB13
        set   KD_PROPINSI = :new.KD_PROPINSI,
              KD_DATI2 = :new.KD_DATI2,
              KD_KECAMATAN = :new.KD_KECAMATAN,
              KD_KELURAHAN = :new.KD_KELURAHAN,
              KD_BLOK = :new.KD_BLOK,
              NO_URUT = :new.NO_URUT,
              KD_JNS_OP = :new.KD_JNS_OP,
              NO_BNG = :new.NO_BNG
       where  KD_PROPINSI = :old.KD_PROPINSI
        and   KD_DATI2 = :old.KD_DATI2
        and   KD_KECAMATAN = :old.KD_KECAMATAN
        and   KD_KELURAHAN = :old.KD_KELURAHAN
        and   KD_BLOK = :old.KD_BLOK
        and   NO_URUT = :old.NO_URUT
        and   KD_JNS_OP = :old.KD_JNS_OP
        and   NO_BNG = :old.NO_BNG;
    end if;

    --  Modify parent code of "DAT_OP_BANGUNAN" for all children in "DAT_JPB12"
    if (updating('KD_PROPINSI') and :old.KD_PROPINSI != :new.KD_PROPINSI) or
       (updating('KD_DATI2') and :old.KD_DATI2 != :new.KD_DATI2) or
       (updating('KD_KECAMATAN') and :old.KD_KECAMATAN != :new.KD_KECAMATAN) or
       (updating('KD_KELURAHAN') and :old.KD_KELURAHAN != :new.KD_KELURAHAN) or
       (updating('KD_BLOK') and :old.KD_BLOK != :new.KD_BLOK) or
       (updating('NO_URUT') and :old.NO_URUT != :new.NO_URUT) or
       (updating('KD_JNS_OP') and :old.KD_JNS_OP != :new.KD_JNS_OP) or
       (updating('NO_BNG') and :old.NO_BNG != :new.NO_BNG) then
       update DAT_JPB12
        set   KD_PROPINSI = :new.KD_PROPINSI,
              KD_DATI2 = :new.KD_DATI2,
              KD_KECAMATAN = :new.KD_KECAMATAN,
              KD_KELURAHAN = :new.KD_KELURAHAN,
              KD_BLOK = :new.KD_BLOK,
              NO_URUT = :new.NO_URUT,
              KD_JNS_OP = :new.KD_JNS_OP,
              NO_BNG = :new.NO_BNG
       where  KD_PROPINSI = :old.KD_PROPINSI
        and   KD_DATI2 = :old.KD_DATI2
        and   KD_KECAMATAN = :old.KD_KECAMATAN
        and   KD_KELURAHAN = :old.KD_KELURAHAN
        and   KD_BLOK = :old.KD_BLOK
        and   NO_URUT = :old.NO_URUT
        and   KD_JNS_OP = :old.KD_JNS_OP
        and   NO_BNG = :old.NO_BNG;
    end if;

    --  Modify parent code of "DAT_OP_BANGUNAN" for all children in "DAT_JPB16"
    if (updating('KD_PROPINSI') and :old.KD_PROPINSI != :new.KD_PROPINSI) or
       (updating('KD_DATI2') and :old.KD_DATI2 != :new.KD_DATI2) or
       (updating('KD_KECAMATAN') and :old.KD_KECAMATAN != :new.KD_KECAMATAN) or
       (updating('KD_KELURAHAN') and :old.KD_KELURAHAN != :new.KD_KELURAHAN) or
       (updating('KD_BLOK') and :old.KD_BLOK != :new.KD_BLOK) or
       (updating('NO_URUT') and :old.NO_URUT != :new.NO_URUT) or
       (updating('KD_JNS_OP') and :old.KD_JNS_OP != :new.KD_JNS_OP) or
       (updating('NO_BNG') and :old.NO_BNG != :new.NO_BNG) then
       update DAT_JPB16
        set   KD_PROPINSI = :new.KD_PROPINSI,
              KD_DATI2 = :new.KD_DATI2,
              KD_KECAMATAN = :new.KD_KECAMATAN,
              KD_KELURAHAN = :new.KD_KELURAHAN,
              KD_BLOK = :new.KD_BLOK,
              NO_URUT = :new.NO_URUT,
              KD_JNS_OP = :new.KD_JNS_OP,
              NO_BNG = :new.NO_BNG
       where  KD_PROPINSI = :old.KD_PROPINSI
        and   KD_DATI2 = :old.KD_DATI2
        and   KD_KECAMATAN = :old.KD_KECAMATAN
        and   KD_KELURAHAN = :old.KD_KELURAHAN
        and   KD_BLOK = :old.KD_BLOK
        and   NO_URUT = :old.NO_URUT
        and   KD_JNS_OP = :old.KD_JNS_OP
        and   NO_BNG = :old.NO_BNG;
    end if;

    --  Modify parent code of "DAT_OP_BANGUNAN" for all children in "DAT_JPB15"
    if (updating('KD_PROPINSI') and :old.KD_PROPINSI != :new.KD_PROPINSI) or
       (updating('KD_DATI2') and :old.KD_DATI2 != :new.KD_DATI2) or
       (updating('KD_KECAMATAN') and :old.KD_KECAMATAN != :new.KD_KECAMATAN) or
       (updating('KD_KELURAHAN') and :old.KD_KELURAHAN != :new.KD_KELURAHAN) or
       (updating('KD_BLOK') and :old.KD_BLOK != :new.KD_BLOK) or
       (updating('NO_URUT') and :old.NO_URUT != :new.NO_URUT) or
       (updating('KD_JNS_OP') and :old.KD_JNS_OP != :new.KD_JNS_OP) or
       (updating('NO_BNG') and :old.NO_BNG != :new.NO_BNG) then
       update DAT_JPB15
        set   KD_PROPINSI = :new.KD_PROPINSI,
              KD_DATI2 = :new.KD_DATI2,
              KD_KECAMATAN = :new.KD_KECAMATAN,
              KD_KELURAHAN = :new.KD_KELURAHAN,
              KD_BLOK = :new.KD_BLOK,
              NO_URUT = :new.NO_URUT,
              KD_JNS_OP = :new.KD_JNS_OP,
              NO_BNG = :new.NO_BNG
       where  KD_PROPINSI = :old.KD_PROPINSI
        and   KD_DATI2 = :old.KD_DATI2
        and   KD_KECAMATAN = :old.KD_KECAMATAN
        and   KD_KELURAHAN = :old.KD_KELURAHAN
        and   KD_BLOK = :old.KD_BLOK
        and   NO_URUT = :old.NO_URUT
        and   KD_JNS_OP = :old.KD_JNS_OP
        and   NO_BNG = :old.NO_BNG;
    end if;

    --  Modify parent code of "DAT_OP_BANGUNAN" for all children in "DAT_JPB4"
    if (updating('KD_PROPINSI') and :old.KD_PROPINSI != :new.KD_PROPINSI) or
       (updating('KD_DATI2') and :old.KD_DATI2 != :new.KD_DATI2) or
       (updating('KD_KECAMATAN') and :old.KD_KECAMATAN != :new.KD_KECAMATAN) or
       (updating('KD_KELURAHAN') and :old.KD_KELURAHAN != :new.KD_KELURAHAN) or
       (updating('KD_BLOK') and :old.KD_BLOK != :new.KD_BLOK) or
       (updating('NO_URUT') and :old.NO_URUT != :new.NO_URUT) or
       (updating('KD_JNS_OP') and :old.KD_JNS_OP != :new.KD_JNS_OP) or
       (updating('NO_BNG') and :old.NO_BNG != :new.NO_BNG) then
       update DAT_JPB4
        set   KD_PROPINSI = :new.KD_PROPINSI,
              KD_DATI2 = :new.KD_DATI2,
              KD_KECAMATAN = :new.KD_KECAMATAN,
              KD_KELURAHAN = :new.KD_KELURAHAN,
              KD_BLOK = :new.KD_BLOK,
              NO_URUT = :new.NO_URUT,
              KD_JNS_OP = :new.KD_JNS_OP,
              NO_BNG = :new.NO_BNG
       where  KD_PROPINSI = :old.KD_PROPINSI
        and   KD_DATI2 = :old.KD_DATI2
        and   KD_KECAMATAN = :old.KD_KECAMATAN
        and   KD_KELURAHAN = :old.KD_KELURAHAN
        and   KD_BLOK = :old.KD_BLOK
        and   NO_URUT = :old.NO_URUT
        and   KD_JNS_OP = :old.KD_JNS_OP
        and   NO_BNG = :old.NO_BNG;
    end if;

    --  Modify parent code of "DAT_OP_BANGUNAN" for all children in "DAT_JPB7"
    if (updating('KD_PROPINSI') and :old.KD_PROPINSI != :new.KD_PROPINSI) or
       (updating('KD_DATI2') and :old.KD_DATI2 != :new.KD_DATI2) or
       (updating('KD_KECAMATAN') and :old.KD_KECAMATAN != :new.KD_KECAMATAN) or
       (updating('KD_KELURAHAN') and :old.KD_KELURAHAN != :new.KD_KELURAHAN) or
       (updating('KD_BLOK') and :old.KD_BLOK != :new.KD_BLOK) or
       (updating('NO_URUT') and :old.NO_URUT != :new.NO_URUT) or
       (updating('KD_JNS_OP') and :old.KD_JNS_OP != :new.KD_JNS_OP) or
       (updating('NO_BNG') and :old.NO_BNG != :new.NO_BNG) then
       update DAT_JPB7
        set   KD_PROPINSI = :new.KD_PROPINSI,
              KD_DATI2 = :new.KD_DATI2,
              KD_KECAMATAN = :new.KD_KECAMATAN,
              KD_KELURAHAN = :new.KD_KELURAHAN,
              KD_BLOK = :new.KD_BLOK,
              NO_URUT = :new.NO_URUT,
              KD_JNS_OP = :new.KD_JNS_OP,
              NO_BNG = :new.NO_BNG
       where  KD_PROPINSI = :old.KD_PROPINSI
        and   KD_DATI2 = :old.KD_DATI2
        and   KD_KECAMATAN = :old.KD_KECAMATAN
        and   KD_KELURAHAN = :old.KD_KELURAHAN
        and   KD_BLOK = :old.KD_BLOK
        and   NO_URUT = :old.NO_URUT
        and   KD_JNS_OP = :old.KD_JNS_OP
        and   NO_BNG = :old.NO_BNG;
    end if;

    --  Modify parent code of "DAT_OP_BANGUNAN" for all children in "DAT_JPB6"
    if (updating('KD_PROPINSI') and :old.KD_PROPINSI != :new.KD_PROPINSI) or
       (updating('KD_DATI2') and :old.KD_DATI2 != :new.KD_DATI2) or
       (updating('KD_KECAMATAN') and :old.KD_KECAMATAN != :new.KD_KECAMATAN) or
       (updating('KD_KELURAHAN') and :old.KD_KELURAHAN != :new.KD_KELURAHAN) or
       (updating('KD_BLOK') and :old.KD_BLOK != :new.KD_BLOK) or
       (updating('NO_URUT') and :old.NO_URUT != :new.NO_URUT) or
       (updating('KD_JNS_OP') and :old.KD_JNS_OP != :new.KD_JNS_OP) or
       (updating('NO_BNG') and :old.NO_BNG != :new.NO_BNG) then
       update DAT_JPB6
        set   KD_PROPINSI = :new.KD_PROPINSI,
              KD_DATI2 = :new.KD_DATI2,
              KD_KECAMATAN = :new.KD_KECAMATAN,
              KD_KELURAHAN = :new.KD_KELURAHAN,
              KD_BLOK = :new.KD_BLOK,
              NO_URUT = :new.NO_URUT,
              KD_JNS_OP = :new.KD_JNS_OP,
              NO_BNG = :new.NO_BNG
       where  KD_PROPINSI = :old.KD_PROPINSI
        and   KD_DATI2 = :old.KD_DATI2
        and   KD_KECAMATAN = :old.KD_KECAMATAN
        and   KD_KELURAHAN = :old.KD_KELURAHAN
        and   KD_BLOK = :old.KD_BLOK
        and   NO_URUT = :old.NO_URUT
        and   KD_JNS_OP = :old.KD_JNS_OP
        and   NO_BNG = :old.NO_BNG;
    end if;

    --  Modify parent code of "DAT_OP_BANGUNAN" for all children in "DAT_JPB5"
    if (updating('KD_PROPINSI') and :old.KD_PROPINSI != :new.KD_PROPINSI) or
       (updating('KD_DATI2') and :old.KD_DATI2 != :new.KD_DATI2) or
       (updating('KD_KECAMATAN') and :old.KD_KECAMATAN != :new.KD_KECAMATAN) or
       (updating('KD_KELURAHAN') and :old.KD_KELURAHAN != :new.KD_KELURAHAN) or
       (updating('KD_BLOK') and :old.KD_BLOK != :new.KD_BLOK) or
       (updating('NO_URUT') and :old.NO_URUT != :new.NO_URUT) or
       (updating('KD_JNS_OP') and :old.KD_JNS_OP != :new.KD_JNS_OP) or
       (updating('NO_BNG') and :old.NO_BNG != :new.NO_BNG) then
       update DAT_JPB5
        set   KD_PROPINSI = :new.KD_PROPINSI,
              KD_DATI2 = :new.KD_DATI2,
              KD_KECAMATAN = :new.KD_KECAMATAN,
              KD_KELURAHAN = :new.KD_KELURAHAN,
              KD_BLOK = :new.KD_BLOK,
              NO_URUT = :new.NO_URUT,
              KD_JNS_OP = :new.KD_JNS_OP,
              NO_BNG = :new.NO_BNG
       where  KD_PROPINSI = :old.KD_PROPINSI
        and   KD_DATI2 = :old.KD_DATI2
        and   KD_KECAMATAN = :old.KD_KECAMATAN
        and   KD_KELURAHAN = :old.KD_KELURAHAN
        and   KD_BLOK = :old.KD_BLOK
        and   NO_URUT = :old.NO_URUT
        and   KD_JNS_OP = :old.KD_JNS_OP
        and   NO_BNG = :old.NO_BNG;
    end if;

    --  Modify parent code of "DAT_OP_BANGUNAN" for all children in "DAT_JPB8"
    if (updating('KD_PROPINSI') and :old.KD_PROPINSI != :new.KD_PROPINSI) or
       (updating('KD_DATI2') and :old.KD_DATI2 != :new.KD_DATI2) or
       (updating('KD_KECAMATAN') and :old.KD_KECAMATAN != :new.KD_KECAMATAN) or
       (updating('KD_KELURAHAN') and :old.KD_KELURAHAN != :new.KD_KELURAHAN) or
       (updating('KD_BLOK') and :old.KD_BLOK != :new.KD_BLOK) or
       (updating('NO_URUT') and :old.NO_URUT != :new.NO_URUT) or
       (updating('KD_JNS_OP') and :old.KD_JNS_OP != :new.KD_JNS_OP) or
       (updating('NO_BNG') and :old.NO_BNG != :new.NO_BNG) then
       update DAT_JPB8
        set   KD_PROPINSI = :new.KD_PROPINSI,
              KD_DATI2 = :new.KD_DATI2,
              KD_KECAMATAN = :new.KD_KECAMATAN,
              KD_KELURAHAN = :new.KD_KELURAHAN,
              KD_BLOK = :new.KD_BLOK,
              NO_URUT = :new.NO_URUT,
              KD_JNS_OP = :new.KD_JNS_OP,
              NO_BNG = :new.NO_BNG
       where  KD_PROPINSI = :old.KD_PROPINSI
        and   KD_DATI2 = :old.KD_DATI2
        and   KD_KECAMATAN = :old.KD_KECAMATAN
        and   KD_KELURAHAN = :old.KD_KELURAHAN
        and   KD_BLOK = :old.KD_BLOK
        and   NO_URUT = :old.NO_URUT
        and   KD_JNS_OP = :old.KD_JNS_OP
        and   NO_BNG = :old.NO_BNG;
    end if;

    --  Modify parent code of "DAT_OP_BANGUNAN" for all children in "DAT_JPB3"
    if (updating('KD_PROPINSI') and :old.KD_PROPINSI != :new.KD_PROPINSI) or
       (updating('KD_DATI2') and :old.KD_DATI2 != :new.KD_DATI2) or
       (updating('KD_KECAMATAN') and :old.KD_KECAMATAN != :new.KD_KECAMATAN) or
       (updating('KD_KELURAHAN') and :old.KD_KELURAHAN != :new.KD_KELURAHAN) or
       (updating('KD_BLOK') and :old.KD_BLOK != :new.KD_BLOK) or
       (updating('NO_URUT') and :old.NO_URUT != :new.NO_URUT) or
       (updating('KD_JNS_OP') and :old.KD_JNS_OP != :new.KD_JNS_OP) or
       (updating('NO_BNG') and :old.NO_BNG != :new.NO_BNG) then
       update DAT_JPB3
        set   KD_PROPINSI = :new.KD_PROPINSI,
              KD_DATI2 = :new.KD_DATI2,
              KD_KECAMATAN = :new.KD_KECAMATAN,
              KD_KELURAHAN = :new.KD_KELURAHAN,
              KD_BLOK = :new.KD_BLOK,
              NO_URUT = :new.NO_URUT,
              KD_JNS_OP = :new.KD_JNS_OP,
              NO_BNG = :new.NO_BNG
       where  KD_PROPINSI = :old.KD_PROPINSI
        and   KD_DATI2 = :old.KD_DATI2
        and   KD_KECAMATAN = :old.KD_KECAMATAN
        and   KD_KELURAHAN = :old.KD_KELURAHAN
        and   KD_BLOK = :old.KD_BLOK
        and   NO_URUT = :old.NO_URUT
        and   KD_JNS_OP = :old.KD_JNS_OP
        and   NO_BNG = :old.NO_BNG;
    end if;
    IntegrityPackage.PreviousNestLevel;

--  Errors handling
exception
    when integrity_error then
       begin
       IntegrityPackage.InitNestLevel;
       raise_application_error(errno, errmsg);
       end;
end;
/
CREATE TRIGGER "PBB"."TUA_DAT_OP_BANGUNAN" AFTER UPDATE OF "KD_BLOK", "KD_DATI2", "KD_JNS_OP", "KD_KECAMATAN", "KD_KELURAHAN", "KD_PROPINSI", "NO_BNG", "NO_URUT" ON "PBB"."DAT_OP_BANGUNAN" REFERENCING OLD AS "OLD" NEW AS "NEW" FOR EACH ROW 
declare
    integrity_error  exception;
    errno            integer;
    errmsg           char(200);
    dummy            integer;
    found            boolean;
begin
    IntegrityPackage.NextNestLevel;

    --  Modify parent code of "DAT_OP_BANGUNAN" for all children in "BNG_SIN_PROFILE"
    if (updating('KD_PROPINSI') and :old.KD_PROPINSI != :new.KD_PROPINSI) or
       (updating('KD_DATI2') and :old.KD_DATI2 != :new.KD_DATI2) or
       (updating('KD_KECAMATAN') and :old.KD_KECAMATAN != :new.KD_KECAMATAN) or
       (updating('KD_KELURAHAN') and :old.KD_KELURAHAN != :new.KD_KELURAHAN) or
       (updating('KD_BLOK') and :old.KD_BLOK != :new.KD_BLOK) or
       (updating('NO_URUT') and :old.NO_URUT != :new.NO_URUT) or
       (updating('KD_JNS_OP') and :old.KD_JNS_OP != :new.KD_JNS_OP) or
       (updating('NO_BNG') and :old.NO_BNG != :new.NO_BNG) then
       update BNG_SIN_PROFILE
        set   KD_PROPINSI = :new.KD_PROPINSI,
              KD_DATI2 = :new.KD_DATI2,
              KD_KECAMATAN = :new.KD_KECAMATAN,
              KD_KELURAHAN = :new.KD_KELURAHAN,
              KD_BLOK = :new.KD_BLOK,
              NO_URUT = :new.NO_URUT,
              KD_JNS_OP = :new.KD_JNS_OP,
              NO_BNG = :new.NO_BNG
       where  KD_PROPINSI = :old.KD_PROPINSI
        and   KD_DATI2 = :old.KD_DATI2
        and   KD_KECAMATAN = :old.KD_KECAMATAN
        and   KD_KELURAHAN = :old.KD_KELURAHAN
        and   KD_BLOK = :old.KD_BLOK
        and   NO_URUT = :old.NO_URUT
        and   KD_JNS_OP = :old.KD_JNS_OP
        and   NO_BNG = :old.NO_BNG;
    end if;

    --  Modify parent code of "DAT_OP_BANGUNAN" for all children in "DAT_OP_BNG_KIBB"
    if (updating('KD_PROPINSI') and :old.KD_PROPINSI != :new.KD_PROPINSI) or
       (updating('KD_DATI2') and :old.KD_DATI2 != :new.KD_DATI2) or
       (updating('KD_KECAMATAN') and :old.KD_KECAMATAN != :new.KD_KECAMATAN) or
       (updating('KD_KELURAHAN') and :old.KD_KELURAHAN != :new.KD_KELURAHAN) or
       (updating('KD_BLOK') and :old.KD_BLOK != :new.KD_BLOK) or
       (updating('NO_URUT') and :old.NO_URUT != :new.NO_URUT) or
       (updating('KD_JNS_OP') and :old.KD_JNS_OP != :new.KD_JNS_OP) or
       (updating('NO_BNG') and :old.NO_BNG != :new.NO_BNG) then
       update DAT_OP_BNG_KIBB
        set   KD_PROPINSI = :new.KD_PROPINSI,
              KD_DATI2 = :new.KD_DATI2,
              KD_KECAMATAN = :new.KD_KECAMATAN,
              KD_KELURAHAN = :new.KD_KELURAHAN,
              KD_BLOK = :new.KD_BLOK,
              NO_URUT = :new.NO_URUT,
              KD_JNS_OP = :new.KD_JNS_OP,
              NO_BNG = :new.NO_BNG
       where  KD_PROPINSI = :old.KD_PROPINSI
        and   KD_DATI2 = :old.KD_DATI2
        and   KD_KECAMATAN = :old.KD_KECAMATAN
        and   KD_KELURAHAN = :old.KD_KELURAHAN
        and   KD_BLOK = :old.KD_BLOK
        and   NO_URUT = :old.NO_URUT
        and   KD_JNS_OP = :old.KD_JNS_OP
        and   NO_BNG = :old.NO_BNG;
    end if;

    --  Modify parent code of "DAT_OP_BANGUNAN" for all children in "PENDUDUK_BNG_SIN"
    if (updating('KD_PROPINSI') and :old.KD_PROPINSI != :new.KD_PROPINSI) or
       (updating('KD_DATI2') and :old.KD_DATI2 != :new.KD_DATI2) or
       (updating('KD_KECAMATAN') and :old.KD_KECAMATAN != :new.KD_KECAMATAN) or
       (updating('KD_KELURAHAN') and :old.KD_KELURAHAN != :new.KD_KELURAHAN) or
       (updating('KD_BLOK') and :old.KD_BLOK != :new.KD_BLOK) or
       (updating('NO_URUT') and :old.NO_URUT != :new.NO_URUT) or
       (updating('KD_JNS_OP') and :old.KD_JNS_OP != :new.KD_JNS_OP) or
       (updating('NO_BNG') and :old.NO_BNG != :new.NO_BNG) then
       update PENDUDUK_BNG_SIN
        set   KD_PROPINSI = :new.KD_PROPINSI,
              KD_DATI2 = :new.KD_DATI2,
              KD_KECAMATAN = :new.KD_KECAMATAN,
              KD_KELURAHAN = :new.KD_KELURAHAN,
              KD_BLOK = :new.KD_BLOK,
              NO_URUT = :new.NO_URUT,
              KD_JNS_OP = :new.KD_JNS_OP,
              NO_BNG = :new.NO_BNG
       where  KD_PROPINSI = :old.KD_PROPINSI
        and   KD_DATI2 = :old.KD_DATI2
        and   KD_KECAMATAN = :old.KD_KECAMATAN
        and   KD_KELURAHAN = :old.KD_KELURAHAN
        and   KD_BLOK = :old.KD_BLOK
        and   NO_URUT = :old.NO_URUT
        and   KD_JNS_OP = :old.KD_JNS_OP
        and   NO_BNG = :old.NO_BNG;
    end if;

    --  Modify parent code of "DAT_OP_BANGUNAN" for all children in "TELEPON"
    if (updating('KD_PROPINSI') and :old.KD_PROPINSI != :new.KD_PROPINSI) or
       (updating('KD_DATI2') and :old.KD_DATI2 != :new.KD_DATI2) or
       (updating('KD_KECAMATAN') and :old.KD_KECAMATAN != :new.KD_KECAMATAN) or
       (updating('KD_KELURAHAN') and :old.KD_KELURAHAN != :new.KD_KELURAHAN) or
       (updating('KD_BLOK') and :old.KD_BLOK != :new.KD_BLOK) or
       (updating('NO_URUT') and :old.NO_URUT != :new.NO_URUT) or
       (updating('KD_JNS_OP') and :old.KD_JNS_OP != :new.KD_JNS_OP) or
       (updating('NO_BNG') and :old.NO_BNG != :new.NO_BNG) then
       update TELEPON
        set   KD_PROPINSI = :new.KD_PROPINSI,
              KD_DATI2 = :new.KD_DATI2,
              KD_KECAMATAN = :new.KD_KECAMATAN,
              KD_KELURAHAN = :new.KD_KELURAHAN,
              KD_BLOK = :new.KD_BLOK,
              NO_URUT = :new.NO_URUT,
              KD_JNS_OP = :new.KD_JNS_OP,
              NO_BNG = :new.NO_BNG
       where  KD_PROPINSI = :old.KD_PROPINSI
        and   KD_DATI2 = :old.KD_DATI2
        and   KD_KECAMATAN = :old.KD_KECAMATAN
        and   KD_KELURAHAN = :old.KD_KELURAHAN
        and   KD_BLOK = :old.KD_BLOK
        and   NO_URUT = :old.NO_URUT
        and   KD_JNS_OP = :old.KD_JNS_OP
        and   NO_BNG = :old.NO_BNG;
    end if;

    --  Modify parent code of "DAT_OP_BANGUNAN" for all children in "PAM"
    if (updating('KD_PROPINSI') and :old.KD_PROPINSI != :new.KD_PROPINSI) or
       (updating('KD_DATI2') and :old.KD_DATI2 != :new.KD_DATI2) or
       (updating('KD_KECAMATAN') and :old.KD_KECAMATAN != :new.KD_KECAMATAN) or
       (updating('KD_KELURAHAN') and :old.KD_KELURAHAN != :new.KD_KELURAHAN) or
       (updating('KD_BLOK') and :old.KD_BLOK != :new.KD_BLOK) or
       (updating('NO_URUT') and :old.NO_URUT != :new.NO_URUT) or
       (updating('KD_JNS_OP') and :old.KD_JNS_OP != :new.KD_JNS_OP) or
       (updating('NO_BNG') and :old.NO_BNG != :new.NO_BNG) then
       update PAM
        set   KD_PROPINSI = :new.KD_PROPINSI,
              KD_DATI2 = :new.KD_DATI2,
              KD_KECAMATAN = :new.KD_KECAMATAN,
              KD_KELURAHAN = :new.KD_KELURAHAN,
              KD_BLOK = :new.KD_BLOK,
              NO_URUT = :new.NO_URUT,
              KD_JNS_OP = :new.KD_JNS_OP,
              NO_BNG = :new.NO_BNG
       where  KD_PROPINSI = :old.KD_PROPINSI
        and   KD_DATI2 = :old.KD_DATI2
        and   KD_KECAMATAN = :old.KD_KECAMATAN
        and   KD_KELURAHAN = :old.KD_KELURAHAN
        and   KD_BLOK = :old.KD_BLOK
        and   NO_URUT = :old.NO_URUT
        and   KD_JNS_OP = :old.KD_JNS_OP
        and   NO_BNG = :old.NO_BNG;
    end if;

    --  Modify parent code of "DAT_OP_BANGUNAN" for all children in "LISTRIK"
    if (updating('KD_PROPINSI') and :old.KD_PROPINSI != :new.KD_PROPINSI) or
       (updating('KD_DATI2') and :old.KD_DATI2 != :new.KD_DATI2) or
       (updating('KD_KECAMATAN') and :old.KD_KECAMATAN != :new.KD_KECAMATAN) or
       (updating('KD_KELURAHAN') and :old.KD_KELURAHAN != :new.KD_KELURAHAN) or
       (updating('KD_BLOK') and :old.KD_BLOK != :new.KD_BLOK) or
       (updating('NO_URUT') and :old.NO_URUT != :new.NO_URUT) or
       (updating('KD_JNS_OP') and :old.KD_JNS_OP != :new.KD_JNS_OP) or
       (updating('NO_BNG') and :old.NO_BNG != :new.NO_BNG) then
       update LISTRIK
        set   KD_PROPINSI = :new.KD_PROPINSI,
              KD_DATI2 = :new.KD_DATI2,
              KD_KECAMATAN = :new.KD_KECAMATAN,
              KD_KELURAHAN = :new.KD_KELURAHAN,
              KD_BLOK = :new.KD_BLOK,
              NO_URUT = :new.NO_URUT,
              KD_JNS_OP = :new.KD_JNS_OP,
              NO_BNG = :new.NO_BNG
       where  KD_PROPINSI = :old.KD_PROPINSI
        and   KD_DATI2 = :old.KD_DATI2
        and   KD_KECAMATAN = :old.KD_KECAMATAN
        and   KD_KELURAHAN = :old.KD_KELURAHAN
        and   KD_BLOK = :old.KD_BLOK
        and   NO_URUT = :old.NO_URUT
        and   KD_JNS_OP = :old.KD_JNS_OP
        and   NO_BNG = :old.NO_BNG;
    end if;

    --  Modify parent code of "DAT_OP_BANGUNAN" for all children in "GAS"
    if (updating('KD_PROPINSI') and :old.KD_PROPINSI != :new.KD_PROPINSI) or
       (updating('KD_DATI2') and :old.KD_DATI2 != :new.KD_DATI2) or
       (updating('KD_KECAMATAN') and :old.KD_KECAMATAN != :new.KD_KECAMATAN) or
       (updating('KD_KELURAHAN') and :old.KD_KELURAHAN != :new.KD_KELURAHAN) or
       (updating('KD_BLOK') and :old.KD_BLOK != :new.KD_BLOK) or
       (updating('NO_URUT') and :old.NO_URUT != :new.NO_URUT) or
       (updating('KD_JNS_OP') and :old.KD_JNS_OP != :new.KD_JNS_OP) or
       (updating('NO_BNG') and :old.NO_BNG != :new.NO_BNG) then
       update GAS
        set   KD_PROPINSI = :new.KD_PROPINSI,
              KD_DATI2 = :new.KD_DATI2,
              KD_KECAMATAN = :new.KD_KECAMATAN,
              KD_KELURAHAN = :new.KD_KELURAHAN,
              KD_BLOK = :new.KD_BLOK,
              NO_URUT = :new.NO_URUT,
              KD_JNS_OP = :new.KD_JNS_OP,
              NO_BNG = :new.NO_BNG
       where  KD_PROPINSI = :old.KD_PROPINSI
        and   KD_DATI2 = :old.KD_DATI2
        and   KD_KECAMATAN = :old.KD_KECAMATAN
        and   KD_KELURAHAN = :old.KD_KELURAHAN
        and   KD_BLOK = :old.KD_BLOK
        and   NO_URUT = :old.NO_URUT
        and   KD_JNS_OP = :old.KD_JNS_OP
        and   NO_BNG = :old.NO_BNG;
    end if;

    --  Modify parent code of "DAT_OP_BANGUNAN" for all children in "IMB"
    if (updating('KD_PROPINSI') and :old.KD_PROPINSI != :new.KD_PROPINSI) or
       (updating('KD_DATI2') and :old.KD_DATI2 != :new.KD_DATI2) or
       (updating('KD_KECAMATAN') and :old.KD_KECAMATAN != :new.KD_KECAMATAN) or
       (updating('KD_KELURAHAN') and :old.KD_KELURAHAN != :new.KD_KELURAHAN) or
       (updating('KD_BLOK') and :old.KD_BLOK != :new.KD_BLOK) or
       (updating('NO_URUT') and :old.NO_URUT != :new.NO_URUT) or
       (updating('KD_JNS_OP') and :old.KD_JNS_OP != :new.KD_JNS_OP) or
       (updating('NO_BNG') and :old.NO_BNG != :new.NO_BNG) then
       update IMB
        set   KD_PROPINSI = :new.KD_PROPINSI,
              KD_DATI2 = :new.KD_DATI2,
              KD_KECAMATAN = :new.KD_KECAMATAN,
              KD_KELURAHAN = :new.KD_KELURAHAN,
              KD_BLOK = :new.KD_BLOK,
              NO_URUT = :new.NO_URUT,
              KD_JNS_OP = :new.KD_JNS_OP,
              NO_BNG = :new.NO_BNG
       where  KD_PROPINSI = :old.KD_PROPINSI
        and   KD_DATI2 = :old.KD_DATI2
        and   KD_KECAMATAN = :old.KD_KECAMATAN
        and   KD_KELURAHAN = :old.KD_KELURAHAN
        and   KD_BLOK = :old.KD_BLOK
        and   NO_URUT = :old.NO_URUT
        and   KD_JNS_OP = :old.KD_JNS_OP
        and   NO_BNG = :old.NO_BNG;
    end if;

    --  Modify parent code of "DAT_OP_BANGUNAN" for all children in "KENDARAAN"
    if (updating('KD_PROPINSI') and :old.KD_PROPINSI != :new.KD_PROPINSI) or
       (updating('KD_DATI2') and :old.KD_DATI2 != :new.KD_DATI2) or
       (updating('KD_KECAMATAN') and :old.KD_KECAMATAN != :new.KD_KECAMATAN) or
       (updating('KD_KELURAHAN') and :old.KD_KELURAHAN != :new.KD_KELURAHAN) or
       (updating('KD_BLOK') and :old.KD_BLOK != :new.KD_BLOK) or
       (updating('NO_URUT') and :old.NO_URUT != :new.NO_URUT) or
       (updating('KD_JNS_OP') and :old.KD_JNS_OP != :new.KD_JNS_OP) or
       (updating('NO_BNG') and :old.NO_BNG != :new.NO_BNG) then
       update KENDARAAN
        set   KD_PROPINSI = :new.KD_PROPINSI,
              KD_DATI2 = :new.KD_DATI2,
              KD_KECAMATAN = :new.KD_KECAMATAN,
              KD_KELURAHAN = :new.KD_KELURAHAN,
              KD_BLOK = :new.KD_BLOK,
              NO_URUT = :new.NO_URUT,
              KD_JNS_OP = :new.KD_JNS_OP,
              NO_BNG = :new.NO_BNG
       where  KD_PROPINSI = :old.KD_PROPINSI
        and   KD_DATI2 = :old.KD_DATI2
        and   KD_KECAMATAN = :old.KD_KECAMATAN
        and   KD_KELURAHAN = :old.KD_KELURAHAN
        and   KD_BLOK = :old.KD_BLOK
        and   NO_URUT = :old.NO_URUT
        and   KD_JNS_OP = :old.KD_JNS_OP
        and   NO_BNG = :old.NO_BNG;
    end if;
    IntegrityPackage.PreviousNestLevel;

--  Errors handling
exception
    when integrity_error then
       begin
       IntegrityPackage.InitNestLevel;
       raise_application_error(errno, errmsg);
       end;
end;
/
CREATE TRIGGER "PBB"."TUB_D14" BEFORE UPDATE OF "KD_BLOK", "KD_DATI2", "KD_JNS_OP", "KD_JPB", "KD_KECAMATAN", "KD_KELURAHAN", "KD_PROPINSI", "NIP_PEMERIKSA_BNG", "NIP_PENDATA_BNG", "NIP_PEREKAM_BNG", "NO_BNG", "NO_URUT" ON "PBB"."DAT_OP_BANGUNAN" REFERENCING OLD AS "OLD" NEW AS "NEW" FOR EACH ROW 
declare
    integrity_error  exception;
    errno            integer;
    errmsg           char(200);
    dummy            integer;
    found            boolean;
    seq NUMBER;

    --  Declaration of UpdateChildParentExist constraint for the parent "DAT_OBJEK_PAJAK"
    cursor cpk1_dat_op_bangunan(var_kd_propinsi varchar,
                                var_kd_dati2 varchar,
                                var_kd_kecamatan varchar,
                                var_kd_kelurahan varchar,
                                var_kd_blok varchar,
                                var_no_urut varchar,
                                var_kd_jns_op varchar) is
       select 1
       from   DAT_OBJEK_PAJAK
       where  KD_PROPINSI = var_kd_propinsi
        and   KD_DATI2 = var_kd_dati2
        and   KD_KECAMATAN = var_kd_kecamatan
        and   KD_KELURAHAN = var_kd_kelurahan
        and   KD_BLOK = var_kd_blok
        and   NO_URUT = var_no_urut
        and   KD_JNS_OP = var_kd_jns_op
        and   var_kd_propinsi is not null
        and   var_kd_dati2 is not null
        and   var_kd_kecamatan is not null
        and   var_kd_kelurahan is not null
        and   var_kd_blok is not null
        and   var_no_urut is not null
        and   var_kd_jns_op is not null;

    --  Declaration of UpdateChildParentExist constraint for the parent "REF_JPB"
    cursor cpk2_dat_op_bangunan(var_kd_jpb varchar) is
       select 1
       from   REF_JPB
       where  KD_JPB = var_kd_jpb
        and   var_kd_jpb is not null;

    --  Declaration of UpdateChildParentExist constraint for the parent "PEGAWAI"
    cursor cpk3_dat_op_bangunan(var_nip_pemeriksa_bng varchar) is
       select 1
       from   PEGAWAI
       where  NIP = var_nip_pemeriksa_bng
        and   var_nip_pemeriksa_bng is not null;

    --  Declaration of UpdateChildParentExist constraint for the parent "PEGAWAI"
    cursor cpk4_dat_op_bangunan(var_nip_perekam_bng varchar) is
       select 1
       from   PEGAWAI
       where  NIP = var_nip_perekam_bng
        and   var_nip_perekam_bng is not null;

    --  Declaration of UpdateChildParentExist constraint for the parent "PEGAWAI"
    cursor cpk5_dat_op_bangunan(var_nip_pendata_bng varchar) is
       select 1
       from   PEGAWAI
       where  NIP = var_nip_pendata_bng
        and   var_nip_pendata_bng is not null;

begin
    seq := IntegrityPackage.GetNestLevel;

    --  Parent "DAT_OBJEK_PAJAK" must exist when updating a child in "DAT_OP_BANGUNAN"
    if (:new.KD_PROPINSI is not null) and
       (:new.KD_DATI2 is not null) and
       (:new.KD_KECAMATAN is not null) and
       (:new.KD_KELURAHAN is not null) and
       (:new.KD_BLOK is not null) and
       (:new.NO_URUT is not null) and
       (:new.KD_JNS_OP is not null) and (seq = 0) then
       open  cpk1_dat_op_bangunan(:new.KD_PROPINSI,
                                  :new.KD_DATI2,
                                  :new.KD_KECAMATAN,
                                  :new.KD_KELURAHAN,
                                  :new.KD_BLOK,
                                  :new.NO_URUT,
                                  :new.KD_JNS_OP);
       fetch cpk1_dat_op_bangunan into dummy;
       found := cpk1_dat_op_bangunan%FOUND;
       close cpk1_dat_op_bangunan;
       if not found then
          errno  := -20003;
          errmsg := 'Parent does not exist in "DAT_OBJEK_PAJAK". Cannot update child in "DAT_OP_BANGUNAN".';
          raise integrity_error;
       end if;
    end if;

    --  Parent "REF_JPB" must exist when updating a child in "DAT_OP_BANGUNAN"
    if (:new.KD_JPB is not null) and (seq = 0) then
       open  cpk2_dat_op_bangunan(:new.KD_JPB);
       fetch cpk2_dat_op_bangunan into dummy;
       found := cpk2_dat_op_bangunan%FOUND;
       close cpk2_dat_op_bangunan;
       if not found then
          errno  := -20003;
          errmsg := 'Parent does not exist in "REF_JPB". Cannot update child in "DAT_OP_BANGUNAN".';
          raise integrity_error;
       end if;
    end if;

    --  Parent "PEGAWAI" must exist when updating a child in "DAT_OP_BANGUNAN"
    if (:new.NIP_PEMERIKSA_BNG is not null) and (seq = 0) then
       open  cpk3_dat_op_bangunan(:new.NIP_PEMERIKSA_BNG);
       fetch cpk3_dat_op_bangunan into dummy;
       found := cpk3_dat_op_bangunan%FOUND;
       close cpk3_dat_op_bangunan;
       if not found then
          errno  := -20003;
          errmsg := 'Parent does not exist in "PEGAWAI". Cannot update child in "DAT_OP_BANGUNAN".';
          raise integrity_error;
       end if;
    end if;

    --  Parent "PEGAWAI" must exist when updating a child in "DAT_OP_BANGUNAN"
    if (:new.NIP_PEREKAM_BNG is not null) and (seq = 0) then
       open  cpk4_dat_op_bangunan(:new.NIP_PEREKAM_BNG);
       fetch cpk4_dat_op_bangunan into dummy;
       found := cpk4_dat_op_bangunan%FOUND;
       close cpk4_dat_op_bangunan;
       if not found then
          errno  := -20003;
          errmsg := 'Parent does not exist in "PEGAWAI". Cannot update child in "DAT_OP_BANGUNAN".';
          raise integrity_error;
       end if;
    end if;

    --  Parent "PEGAWAI" must exist when updating a child in "DAT_OP_BANGUNAN"
    if (:new.NIP_PENDATA_BNG is not null) and (seq = 0) then
       open  cpk5_dat_op_bangunan(:new.NIP_PENDATA_BNG);
       fetch cpk5_dat_op_bangunan into dummy;
       found := cpk5_dat_op_bangunan%FOUND;
       close cpk5_dat_op_bangunan;
       if not found then
          errno  := -20003;
          errmsg := 'Parent does not exist in "PEGAWAI". Cannot update child in "DAT_OP_BANGUNAN".';
          raise integrity_error;
       end if;
    end if;

--  Errors handling
exception
    when integrity_error then
       raise_application_error(errno, errmsg);
end;
/

-- ----------------------------
-- Foreign Keys structure for table DAT_OP_BANGUNAN
-- ----------------------------
