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

 Date: 24/06/2026 07:49:06
*/


-- ----------------------------
-- Table structure for DAT_SUBJEK_PAJAK
-- ----------------------------
DROP TABLE "PBB"."DAT_SUBJEK_PAJAK";
CREATE TABLE "PBB"."DAT_SUBJEK_PAJAK" (
  "SUBJEK_PAJAK_ID" CHAR(30 BYTE) NOT NULL,
  "NM_WP" VARCHAR2(30 BYTE) DEFAULT 'PEMILIK',
  "JALAN_WP" VARCHAR2(30 BYTE),
  "BLOK_KAV_NO_WP" VARCHAR2(15 BYTE),
  "RW_WP" CHAR(2 BYTE),
  "RT_WP" CHAR(3 BYTE),
  "KELURAHAN_WP" VARCHAR2(30 BYTE),
  "KOTA_WP" VARCHAR2(30 BYTE),
  "KD_POS_WP" VARCHAR2(5 BYTE),
  "TELP_WP" VARCHAR2(30 BYTE),
  "NPWP" VARCHAR2(30 BYTE),
  "STATUS_PEKERJAAN_WP" CHAR(1 BYTE) DEFAULT '0',
  "KECAMATAN_WP" VARCHAR2(50 BYTE),
  "NPWPD" VARCHAR2(50 BYTE),
  "EMAIL" VARCHAR2(100 BYTE)
)
LOGGING
NOCOMPRESS
PCTFREE 10
INITRANS 1
STORAGE (
  INITIAL 209715200 
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
-- Primary Key structure for table DAT_SUBJEK_PAJAK
-- ----------------------------
ALTER TABLE "PBB"."DAT_SUBJEK_PAJAK" ADD CONSTRAINT "PK_D11" PRIMARY KEY ("SUBJEK_PAJAK_ID");

-- ----------------------------
-- Checks structure for table DAT_SUBJEK_PAJAK
-- ----------------------------
ALTER TABLE "PBB"."DAT_SUBJEK_PAJAK" ADD CONSTRAINT "SYS_C0015066" CHECK ("SUBJEK_PAJAK_ID" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY NOVALIDATE;
ALTER TABLE "PBB"."DAT_SUBJEK_PAJAK" ADD CONSTRAINT "SYS_C0015067" CHECK ("NM_WP" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY NOVALIDATE;
ALTER TABLE "PBB"."DAT_SUBJEK_PAJAK" ADD CONSTRAINT "SYS_C0015068" CHECK ("JALAN_WP" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY NOVALIDATE;
ALTER TABLE "PBB"."DAT_SUBJEK_PAJAK" ADD CONSTRAINT "SYS_C0015069" CHECK ("STATUS_PEKERJAAN_WP" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY NOVALIDATE;

-- ----------------------------
-- Indexes structure for table DAT_SUBJEK_PAJAK
-- ----------------------------
CREATE UNIQUE INDEX "PBB"."D11_1_AK"
  ON "PBB"."DAT_SUBJEK_PAJAK" ("NM_WP" ASC, "SUBJEK_PAJAK_ID" ASC)
  LOGGING
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 41943040 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
);
CREATE UNIQUE INDEX "PBB"."D11_2_AK"
  ON "PBB"."DAT_SUBJEK_PAJAK" ("JALAN_WP" ASC, "BLOK_KAV_NO_WP" ASC, "RW_WP" ASC, "RT_WP" ASC, "SUBJEK_PAJAK_ID" ASC)
  LOGGING
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 55574528 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
);
CREATE UNIQUE INDEX "PBB"."D11_3_AK"
  ON "PBB"."DAT_SUBJEK_PAJAK" ("STATUS_PEKERJAAN_WP" ASC, "SUBJEK_PAJAK_ID" ASC)
  LOGGING
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 35651584 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
);
CREATE UNIQUE INDEX "PBB"."D11_4_AK"
  ON "PBB"."DAT_SUBJEK_PAJAK" ("NPWP" ASC, "SUBJEK_PAJAK_ID" ASC)
  LOGGING
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 35651584 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
);

-- ----------------------------
-- Triggers structure for table DAT_SUBJEK_PAJAK
-- ----------------------------
CREATE TRIGGER "PBB"."TDA_D11" AFTER DELETE ON "PBB"."DAT_SUBJEK_PAJAK" REFERENCING OLD AS "OLD" NEW AS "NEW" FOR EACH ROW 
declare
    integrity_error  exception;
    errno            integer;
    errmsg           char(200);
    dummy            integer;
    found            boolean;

begin
    IntegrityPackage.NextNestLevel;

    --  Delete all children in "DAT_OBJEK_PAJAK"
    delete DAT_OBJEK_PAJAK
    where  SUBJEK_PAJAK_ID = :old.SUBJEK_PAJAK_ID;

    --  Delete all children in "HIS_OBJEK_PAJAK"
    delete HIS_OBJEK_PAJAK
    where  SUBJEK_PAJAK_ID = :old.SUBJEK_PAJAK_ID;

    --  Delete all children in "DAT_SUBJEK_PAJAK_NJOPTKP"
    delete DAT_SUBJEK_PAJAK_NJOPTKP
    where  SUBJEK_PAJAK_ID = :old.SUBJEK_PAJAK_ID;
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
CREATE TRIGGER "PBB"."TUA_D11" AFTER UPDATE OF "SUBJEK_PAJAK_ID" ON "PBB"."DAT_SUBJEK_PAJAK" REFERENCING OLD AS "OLD" NEW AS "NEW" FOR EACH ROW 
declare
    integrity_error  exception;
    errno            integer;
    errmsg           char(200);
    dummy            integer;
    found            boolean;
begin
    IntegrityPackage.NextNestLevel;

    --  Modify parent code of "DAT_SUBJEK_PAJAK" for all children in "DAT_OBJEK_PAJAK"
    if (updating('SUBJEK_PAJAK_ID') and :old.SUBJEK_PAJAK_ID != :new.SUBJEK_PAJAK_ID) then
       update DAT_OBJEK_PAJAK
        set   SUBJEK_PAJAK_ID = :new.SUBJEK_PAJAK_ID
       where  SUBJEK_PAJAK_ID = :old.SUBJEK_PAJAK_ID;
    end if;

    --  Modify parent code of "DAT_SUBJEK_PAJAK" for all children in "HIS_OBJEK_PAJAK"
    if (updating('SUBJEK_PAJAK_ID') and :old.SUBJEK_PAJAK_ID != :new.SUBJEK_PAJAK_ID) then
       update HIS_OBJEK_PAJAK
        set   SUBJEK_PAJAK_ID = :new.SUBJEK_PAJAK_ID
       where  SUBJEK_PAJAK_ID = :old.SUBJEK_PAJAK_ID;
    end if;

    --  Modify parent code of "DAT_SUBJEK_PAJAK" for all children in "DAT_SUBJEK_PAJAK_NJOPTKP"
    if (updating('SUBJEK_PAJAK_ID') and :old.SUBJEK_PAJAK_ID != :new.SUBJEK_PAJAK_ID) then
       update DAT_SUBJEK_PAJAK_NJOPTKP
        set   SUBJEK_PAJAK_ID = :new.SUBJEK_PAJAK_ID
       where  SUBJEK_PAJAK_ID = :old.SUBJEK_PAJAK_ID;
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
