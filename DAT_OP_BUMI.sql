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

 Date: 24/06/2026 07:48:36
*/


-- ----------------------------
-- Table structure for DAT_OP_BUMI
-- ----------------------------
DROP TABLE "PBB"."DAT_OP_BUMI";
CREATE TABLE "PBB"."DAT_OP_BUMI" (
  "KD_PROPINSI" CHAR(2 BYTE) NOT NULL,
  "KD_DATI2" CHAR(2 BYTE) NOT NULL,
  "KD_KECAMATAN" CHAR(3 BYTE) NOT NULL,
  "KD_KELURAHAN" CHAR(3 BYTE) NOT NULL,
  "KD_BLOK" CHAR(3 BYTE) NOT NULL,
  "NO_URUT" CHAR(4 BYTE) NOT NULL,
  "KD_JNS_OP" CHAR(1 BYTE) NOT NULL,
  "NO_BUMI" NUMBER(2,0) DEFAULT 1 NOT NULL,
  "KD_ZNT" CHAR(2 BYTE),
  "LUAS_BUMI" NUMBER(12,0) DEFAULT 0,
  "JNS_BUMI" CHAR(1 BYTE) DEFAULT '1',
  "NILAI_SISTEM_BUMI" NUMBER(15,0) DEFAULT 0,
  "STATUS_BLOKIR" CHAR(1 BYTE) DEFAULT 0,
  "KETERANGAN_BLOKIR" VARCHAR2(150 BYTE),
  "THN_BLOKIR" CHAR(4 BYTE),
  "TGL_UPDATE" DATE,
  "NIP_REKAM_BLOKIR" CHAR(18 BYTE)
)
LOGGING
NOCOMPRESS
PCTFREE 10
INITRANS 1
STORAGE (
  INITIAL 92274688 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
)
PARALLEL 1
NOCACHE
DISABLE ROW MOVEMENT
;
COMMENT ON COLUMN "PBB"."DAT_OP_BUMI"."STATUS_BLOKIR" IS '0 = NOP AKTIF / 1 = NOP DIBLOKIR';

-- ----------------------------
-- Primary Key structure for table DAT_OP_BUMI
-- ----------------------------
ALTER TABLE "PBB"."DAT_OP_BUMI" ADD CONSTRAINT "PK_D6" PRIMARY KEY ("KD_PROPINSI", "KD_DATI2", "KD_KECAMATAN", "KD_KELURAHAN", "KD_BLOK", "NO_URUT", "KD_JNS_OP", "NO_BUMI");

-- ----------------------------
-- Checks structure for table DAT_OP_BUMI
-- ----------------------------
ALTER TABLE "PBB"."DAT_OP_BUMI" ADD CONSTRAINT "SYS_C0014976" CHECK ("KD_PROPINSI" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY NOVALIDATE;
ALTER TABLE "PBB"."DAT_OP_BUMI" ADD CONSTRAINT "SYS_C0014977" CHECK ("KD_DATI2" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY NOVALIDATE;
ALTER TABLE "PBB"."DAT_OP_BUMI" ADD CONSTRAINT "SYS_C0014978" CHECK ("KD_KECAMATAN" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY NOVALIDATE;
ALTER TABLE "PBB"."DAT_OP_BUMI" ADD CONSTRAINT "SYS_C0014979" CHECK ("KD_KELURAHAN" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY NOVALIDATE;
ALTER TABLE "PBB"."DAT_OP_BUMI" ADD CONSTRAINT "SYS_C0014980" CHECK ("KD_BLOK" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY NOVALIDATE;
ALTER TABLE "PBB"."DAT_OP_BUMI" ADD CONSTRAINT "SYS_C0014981" CHECK ("NO_URUT" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY NOVALIDATE;
ALTER TABLE "PBB"."DAT_OP_BUMI" ADD CONSTRAINT "SYS_C0014982" CHECK ("KD_JNS_OP" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY NOVALIDATE;
ALTER TABLE "PBB"."DAT_OP_BUMI" ADD CONSTRAINT "SYS_C0014983" CHECK ("NO_BUMI" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY NOVALIDATE;
ALTER TABLE "PBB"."DAT_OP_BUMI" ADD CONSTRAINT "SYS_C0014984" CHECK ("KD_ZNT" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY NOVALIDATE;
ALTER TABLE "PBB"."DAT_OP_BUMI" ADD CONSTRAINT "SYS_C0014985" CHECK ("LUAS_BUMI" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY NOVALIDATE;
ALTER TABLE "PBB"."DAT_OP_BUMI" ADD CONSTRAINT "SYS_C0014986" CHECK ("JNS_BUMI" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY NOVALIDATE;
ALTER TABLE "PBB"."DAT_OP_BUMI" ADD CONSTRAINT "SYS_C0014987" CHECK ("NILAI_SISTEM_BUMI" IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY NOVALIDATE;

-- ----------------------------
-- Indexes structure for table DAT_OP_BUMI
-- ----------------------------
CREATE UNIQUE INDEX "PBB"."D6_1_AK"
  ON "PBB"."DAT_OP_BUMI" ("KD_ZNT" ASC, "KD_PROPINSI" ASC, "KD_DATI2" ASC, "KD_KECAMATAN" ASC, "KD_KELURAHAN" ASC, "KD_BLOK" ASC, "NO_URUT" ASC, "KD_JNS_OP" ASC, "NO_BUMI" ASC)
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
-- Triggers structure for table DAT_OP_BUMI
-- ----------------------------
CREATE TRIGGER "PBB"."TDA_D6" AFTER DELETE ON "PBB"."DAT_OP_BUMI" REFERENCING OLD AS "OLD" NEW AS "NEW" FOR EACH ROW 
declare
    integrity_error  exception;
    errno            integer;
    errmsg           char(200);
    dummy            integer;
    found            boolean;

begin
    IntegrityPackage.NextNestLevel;

    --  Delete all children in "HIS_OP_BUMI"
    delete HIS_OP_BUMI
    where  KD_PROPINSI = :old.KD_PROPINSI
     and   KD_DATI2 = :old.KD_DATI2
     and   KD_KECAMATAN = :old.KD_KECAMATAN
     and   KD_KELURAHAN = :old.KD_KELURAHAN
     and   KD_BLOK = :old.KD_BLOK
     and   NO_URUT = :old.NO_URUT
     and   KD_JNS_OP = :old.KD_JNS_OP
     and   NO_BUMI = :old.NO_BUMI;
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
CREATE TRIGGER "PBB"."TDA_DAT_OP_BUMI" AFTER DELETE ON "PBB"."DAT_OP_BUMI" REFERENCING OLD AS "OLD" NEW AS "NEW" FOR EACH ROW 
declare
    integrity_error  exception;
    errno            integer;
    errmsg           char(200);
    dummy            integer;
    found            boolean;

begin
    IntegrityPackage.NextNestLevel;

    --  Delete all children in "SERTIFIKAT"
    delete SERTIFIKAT
    where  KD_PROPINSI = :old.KD_PROPINSI
     and   KD_DATI2 = :old.KD_DATI2
     and   KD_KECAMATAN = :old.KD_KECAMATAN
     and   KD_KELURAHAN = :old.KD_KELURAHAN
     and   KD_BLOK = :old.KD_BLOK
     and   NO_URUT = :old.NO_URUT
     and   KD_JNS_OP = :old.KD_JNS_OP
     and   NO_BUMI = :old.NO_BUMI;

    --  Delete all children in "DAT_OP_BUMI_KIBT"
    delete DAT_OP_BUMI_KIBT
    where  KD_PROPINSI = :old.KD_PROPINSI
     and   KD_DATI2 = :old.KD_DATI2
     and   KD_KECAMATAN = :old.KD_KECAMATAN
     and   KD_KELURAHAN = :old.KD_KELURAHAN
     and   KD_BLOK = :old.KD_BLOK
     and   NO_URUT = :old.NO_URUT
     and   KD_JNS_OP = :old.KD_JNS_OP
     and   NO_BUMI = :old.NO_BUMI;
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
CREATE TRIGGER "PBB"."TUA_D6" AFTER UPDATE OF "KD_BLOK", "KD_DATI2", "KD_JNS_OP", "KD_KECAMATAN", "KD_KELURAHAN", "KD_PROPINSI", "KD_ZNT", "NO_BUMI", "NO_URUT" ON "PBB"."DAT_OP_BUMI" REFERENCING OLD AS "OLD" NEW AS "NEW" FOR EACH ROW 
declare
    integrity_error  exception;
    errno            integer;
    errmsg           char(200);
    dummy            integer;
    found            boolean;
begin
    IntegrityPackage.NextNestLevel;

    --  Modify parent code of "DAT_OP_BUMI" for all children in "HIS_OP_BUMI"
    if (updating('KD_PROPINSI') and :old.KD_PROPINSI != :new.KD_PROPINSI) or
       (updating('KD_DATI2') and :old.KD_DATI2 != :new.KD_DATI2) or
       (updating('KD_KECAMATAN') and :old.KD_KECAMATAN != :new.KD_KECAMATAN) or
       (updating('KD_KELURAHAN') and :old.KD_KELURAHAN != :new.KD_KELURAHAN) or
       (updating('KD_BLOK') and :old.KD_BLOK != :new.KD_BLOK) or
       (updating('NO_URUT') and :old.NO_URUT != :new.NO_URUT) or
       (updating('KD_JNS_OP') and :old.KD_JNS_OP != :new.KD_JNS_OP) or
       (updating('NO_BUMI') and :old.NO_BUMI != :new.NO_BUMI) then
       update HIS_OP_BUMI
        set   KD_PROPINSI = :new.KD_PROPINSI,
              KD_DATI2 = :new.KD_DATI2,
              KD_KECAMATAN = :new.KD_KECAMATAN,
              KD_KELURAHAN = :new.KD_KELURAHAN,
              KD_BLOK = :new.KD_BLOK,
              NO_URUT = :new.NO_URUT,
              KD_JNS_OP = :new.KD_JNS_OP,
              NO_BUMI = :new.NO_BUMI
       where  KD_PROPINSI = :old.KD_PROPINSI
        and   KD_DATI2 = :old.KD_DATI2
        and   KD_KECAMATAN = :old.KD_KECAMATAN
        and   KD_KELURAHAN = :old.KD_KELURAHAN
        and   KD_BLOK = :old.KD_BLOK
        and   NO_URUT = :old.NO_URUT
        and   KD_JNS_OP = :old.KD_JNS_OP
        and   NO_BUMI = :old.NO_BUMI;
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
CREATE TRIGGER "PBB"."TUA_DAT_OP_BUMI" AFTER UPDATE OF "KD_BLOK", "KD_DATI2", "KD_JNS_OP", "KD_KECAMATAN", "KD_KELURAHAN", "KD_PROPINSI", "NO_BUMI", "NO_URUT" ON "PBB"."DAT_OP_BUMI" REFERENCING OLD AS "OLD" NEW AS "NEW" FOR EACH ROW 
declare
    integrity_error  exception;
    errno            integer;
    errmsg           char(200);
    dummy            integer;
    found            boolean;
begin
    IntegrityPackage.NextNestLevel;

    --  Modify parent code of "DAT_OP_BUMI" for all children in "SERTIFIKAT"
    if (updating('KD_PROPINSI') and :old.KD_PROPINSI != :new.KD_PROPINSI) or
       (updating('KD_DATI2') and :old.KD_DATI2 != :new.KD_DATI2) or
       (updating('KD_KECAMATAN') and :old.KD_KECAMATAN != :new.KD_KECAMATAN) or
       (updating('KD_KELURAHAN') and :old.KD_KELURAHAN != :new.KD_KELURAHAN) or
       (updating('KD_BLOK') and :old.KD_BLOK != :new.KD_BLOK) or
       (updating('NO_URUT') and :old.NO_URUT != :new.NO_URUT) or
       (updating('KD_JNS_OP') and :old.KD_JNS_OP != :new.KD_JNS_OP) or
       (updating('NO_BUMI') and :old.NO_BUMI != :new.NO_BUMI) then
       update SERTIFIKAT
        set   KD_PROPINSI = :new.KD_PROPINSI,
              KD_DATI2 = :new.KD_DATI2,
              KD_KECAMATAN = :new.KD_KECAMATAN,
              KD_KELURAHAN = :new.KD_KELURAHAN,
              KD_BLOK = :new.KD_BLOK,
              NO_URUT = :new.NO_URUT,
              KD_JNS_OP = :new.KD_JNS_OP,
              NO_BUMI = :new.NO_BUMI
       where  KD_PROPINSI = :old.KD_PROPINSI
        and   KD_DATI2 = :old.KD_DATI2
        and   KD_KECAMATAN = :old.KD_KECAMATAN
        and   KD_KELURAHAN = :old.KD_KELURAHAN
        and   KD_BLOK = :old.KD_BLOK
        and   NO_URUT = :old.NO_URUT
        and   KD_JNS_OP = :old.KD_JNS_OP
        and   NO_BUMI = :old.NO_BUMI;
    end if;

    --  Modify parent code of "DAT_OP_BUMI" for all children in "DAT_OP_BUMI_KIBT"
    if (updating('KD_PROPINSI') and :old.KD_PROPINSI != :new.KD_PROPINSI) or
       (updating('KD_DATI2') and :old.KD_DATI2 != :new.KD_DATI2) or
       (updating('KD_KECAMATAN') and :old.KD_KECAMATAN != :new.KD_KECAMATAN) or
       (updating('KD_KELURAHAN') and :old.KD_KELURAHAN != :new.KD_KELURAHAN) or
       (updating('KD_BLOK') and :old.KD_BLOK != :new.KD_BLOK) or
       (updating('NO_URUT') and :old.NO_URUT != :new.NO_URUT) or
       (updating('KD_JNS_OP') and :old.KD_JNS_OP != :new.KD_JNS_OP) or
       (updating('NO_BUMI') and :old.NO_BUMI != :new.NO_BUMI) then
       update DAT_OP_BUMI_KIBT
        set   KD_PROPINSI = :new.KD_PROPINSI,
              KD_DATI2 = :new.KD_DATI2,
              KD_KECAMATAN = :new.KD_KECAMATAN,
              KD_KELURAHAN = :new.KD_KELURAHAN,
              KD_BLOK = :new.KD_BLOK,
              NO_URUT = :new.NO_URUT,
              KD_JNS_OP = :new.KD_JNS_OP,
              NO_BUMI = :new.NO_BUMI
       where  KD_PROPINSI = :old.KD_PROPINSI
        and   KD_DATI2 = :old.KD_DATI2
        and   KD_KECAMATAN = :old.KD_KECAMATAN
        and   KD_KELURAHAN = :old.KD_KELURAHAN
        and   KD_BLOK = :old.KD_BLOK
        and   NO_URUT = :old.NO_URUT
        and   KD_JNS_OP = :old.KD_JNS_OP
        and   NO_BUMI = :old.NO_BUMI;
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
CREATE TRIGGER "PBB"."TUB_D6" BEFORE UPDATE OF "KD_BLOK", "KD_DATI2", "KD_JNS_OP", "KD_KECAMATAN", "KD_KELURAHAN", "KD_PROPINSI", "KD_ZNT", "NO_BUMI", "NO_URUT" ON "PBB"."DAT_OP_BUMI" REFERENCING OLD AS "OLD" NEW AS "NEW" FOR EACH ROW 
declare
    integrity_error  exception;
    errno            integer;
    errmsg           char(200);
    dummy            integer;
    found            boolean;
    seq NUMBER;

    --  Declaration of UpdateChildParentExist constraint for the parent "DAT_PETA_ZNT"
    cursor cpk1_dat_op_bumi(var_kd_znt varchar,
                            var_kd_propinsi varchar,
                            var_kd_dati2 varchar,
                            var_kd_kecamatan varchar,
                            var_kd_kelurahan varchar,
                            var_kd_blok varchar) is
       select 1
       from   DAT_PETA_ZNT
       where  KD_ZNT = var_kd_znt
        and   KD_PROPINSI = var_kd_propinsi
        and   KD_DATI2 = var_kd_dati2
        and   KD_KECAMATAN = var_kd_kecamatan
        and   KD_KELURAHAN = var_kd_kelurahan
        and   KD_BLOK = var_kd_blok
        and   var_kd_znt is not null
        and   var_kd_propinsi is not null
        and   var_kd_dati2 is not null
        and   var_kd_kecamatan is not null
        and   var_kd_kelurahan is not null
        and   var_kd_blok is not null;

    --  Declaration of UpdateChildParentExist constraint for the parent "DAT_OBJEK_PAJAK"
    cursor cpk2_dat_op_bumi(var_kd_propinsi varchar,
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

begin
    seq := IntegrityPackage.GetNestLevel;

    --  Parent "DAT_PETA_ZNT" must exist when updating a child in "DAT_OP_BUMI"
    if (:new.KD_ZNT is not null) and
       (:new.KD_PROPINSI is not null) and
       (:new.KD_DATI2 is not null) and
       (:new.KD_KECAMATAN is not null) and
       (:new.KD_KELURAHAN is not null) and
       (:new.KD_BLOK is not null) and (seq = 0) then
       open  cpk1_dat_op_bumi(:new.KD_ZNT,
                              :new.KD_PROPINSI,
                              :new.KD_DATI2,
                              :new.KD_KECAMATAN,
                              :new.KD_KELURAHAN,
                              :new.KD_BLOK);
       fetch cpk1_dat_op_bumi into dummy;
       found := cpk1_dat_op_bumi%FOUND;
       close cpk1_dat_op_bumi;
       if not found then
          errno  := -20003;
          errmsg := 'Parent does not exist in "DAT_PETA_ZNT". Cannot update child in "DAT_OP_BUMI".';
          raise integrity_error;
       end if;
    end if;

    --  Parent "DAT_OBJEK_PAJAK" must exist when updating a child in "DAT_OP_BUMI"
    if (:new.KD_PROPINSI is not null) and
       (:new.KD_DATI2 is not null) and
       (:new.KD_KECAMATAN is not null) and
       (:new.KD_KELURAHAN is not null) and
       (:new.KD_BLOK is not null) and
       (:new.NO_URUT is not null) and
       (:new.KD_JNS_OP is not null) and (seq = 0) then
       open  cpk2_dat_op_bumi(:new.KD_PROPINSI,
                              :new.KD_DATI2,
                              :new.KD_KECAMATAN,
                              :new.KD_KELURAHAN,
                              :new.KD_BLOK,
                              :new.NO_URUT,
                              :new.KD_JNS_OP);
       fetch cpk2_dat_op_bumi into dummy;
       found := cpk2_dat_op_bumi%FOUND;
       close cpk2_dat_op_bumi;
       if not found then
          errno  := -20003;
          errmsg := 'Parent does not exist in "DAT_OBJEK_PAJAK". Cannot update child in "DAT_OP_BUMI".';
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
-- Foreign Keys structure for table DAT_OP_BUMI
-- ----------------------------
