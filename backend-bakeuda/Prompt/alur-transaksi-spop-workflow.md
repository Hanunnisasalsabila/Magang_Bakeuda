# Alur Lengkap Transaksi SPOP — Workflow Approval Berjenjang

Dokumen ini merancang seluruh alur `TransaksiSpop` berdasarkan schema yang sudah ada: **semua** perubahan data objek pajak (Baru, Mutasi, Pecah, Gabung, Perubahan Data, Hapus) wajib lewat alur pengajuan (DESA) → reviu (BAKEUDA) → disetujui/ditolak/revisi, **bukan** lagi lewat `POST /objek-pajak` langsung.

> ⚠️ **Perubahan arsitektur besar:** endpoint `POST /objek-pajak`, `PUT /objek-pajak/:nop`, `DELETE /objek-pajak/:nop` yang sudah dibangun sebelumnya **tidak lagi dipakai untuk alur normal DESA**. Endpoint itu tetap ada, tapi perannya berubah jadi "eksekutor teknis" yang dipanggil **secara internal** oleh service `TransaksiSpop` setelah pengajuan disetujui BAKEUDA — bukan dipanggil langsung dari frontend DESA lagi. Ini perlu dikomunikasikan ke tim frontend supaya form input DESA diarahkan ke endpoint `TransaksiSpop`, bukan endpoint `ObjekPajak` langsung.

---

## 0. Model Data Tambahan yang Belum Ada — Usulan Desain

Karena `RiwayatPelacakan` dan `LampiranDokumen` direferensikan tapi belum ada schema-nya, berikut usulan desainnya (silakan sesuaikan kalau kamu sudah punya rencana lain).

### 0.1 `RiwayatPelacakan` — Jejak Audit Setiap Perubahan Status

```prisma
model RiwayatPelacakan {
  id_riwayat    String      @id @default(uuid())
  id_transaksi  String
  status_lama   StatusAjuan?
  status_baru   StatusAjuan
  id_user       String // siapa yang melakukan aksi ini
  catatan       String?     @db.VarChar(500)
  created_at    DateTime    @default(now())

  transaksi TransaksiSpop @relation(fields: [id_transaksi], references: [id_transaksi])
  user      User          @relation(fields: [id_user], references: [id_user])

  @@index([id_transaksi])
  @@map("riwayat_pelacakan")
}
```

Setiap kali status `TransaksiSpop` berubah (submit, lock, approve, reject, revisi), 1 baris baru ditambahkan ke sini — supaya ada jejak lengkap "siapa melakukan apa, kapan" untuk keperluan audit.

### 0.2 `LampiranDokumen` — File Pendukung Transaksi

```prisma
model LampiranDokumen {
  id_lampiran   String   @id @default(uuid())
  id_transaksi  String
  nama_file     String   @db.VarChar(255)
  url_file      String   @db.VarChar(500)
  jenis_dokumen String?  @db.VarChar(50) // "KTP", "Sertifikat Tanah", "Akta Jual Beli", dst
  uploaded_by   String
  uploaded_at   DateTime @default(now())

  transaksi TransaksiSpop @relation(fields: [id_transaksi], references: [id_transaksi])
  uploader  User          @relation("UploadedByUser", fields: [uploaded_by], references: [id_user])

  @@map("lampiran_dokumen")
}
```

> Field `url_dokumen_fisik` di `TransaksiSpop` itu untuk foto formulir SPOP kertasnya sendiri; `LampiranDokumen` ini untuk dokumen pendukung lain (KTP, sertifikat, akta) yang bisa lebih dari 1 file — makanya dipisah jadi tabel sendiri (one-to-many), bukan 1 field di `TransaksiSpop`.

---

## 1. State Machine — Alur Status `StatusAjuan`

```
DRAFT ──submit──▶ MENUNGGU ──lock (BAKEUDA mulai reviu)──▶ PROSES
                                                              │
                              ┌───────────────┬───────────────┼───────────────┐
                              ▼               ▼               ▼               ▼
                          DISETUJUI        DITOLAK          REVISI       (unlock, balik ke MENUNGGU)
                              │                                │
                        (eksekusi data)                  DESA edit ──▶ DRAFT ──submit──▶ MENUNGGU (lagi)
```

**Penjelasan tiap transisi:**

| Dari | Ke | Siapa | Aksi |
|---|---|---|---|
| — | `DRAFT` | DESA | Buat pengajuan baru, belum final, masih bisa diedit bebas |
| `DRAFT` | `MENUNGGU` | DESA | Submit — pengajuan dikirim ke BAKEUDA, DESA tidak bisa edit lagi |
| `MENUNGGU` | `PROSES` | BAKEUDA | Mulai reviu — `locked_by`/`locked_at` diisi, mencegah verifikator lain reviu bersamaan |
| `PROSES` | `DISETUJUI` | BAKEUDA | Setujui — **di sinilah eksekusi data sebenarnya terjadi** (generate NOP, create/update/nonaktifkan `ObjekPajak`) |
| `PROSES` | `DITOLAK` | BAKEUDA | Tolak permanen — tidak ada eksekusi data, pengajuan selesai (gagal) |
| `PROSES` | `REVISI` | BAKEUDA | Minta perbaikan — `catatan_bakeuda` wajib diisi, kembali ke DESA |
| `REVISI` | `DRAFT` | DESA | DESA edit ulang datanya |
| `PROSES` | `MENUNGGU` | BAKEUDA (atau sistem otomatis) | Unlock tanpa keputusan — verifikator batal reviu, `locked_by`/`locked_at` di-null-kan lagi |

---

## 2. DTO per Jenis Transaksi

Karena tiap jenis transaksi butuh kombinasi data berbeda, dibuat DTO submit yang fleksibel tapi tervalidasi kondisional berdasarkan `jenis_transaksi`.

### 2.1 DTO Dasar (Semua Jenis)

```typescript
export class SubmitTransaksiDto {
  @IsEnum(JenisTransaksi) jenis_transaksi: JenisTransaksi;
  @IsOptional() @IsString() no_formulir?: string;
  @IsInt() tahun_pajak: number;
  @IsOptional() @IsString() no_sppt_lama?: string;
  @IsOptional() @IsString() nama_pengaju?: string;
  @IsOptional() @IsBoolean() menggunakan_kuasa?: boolean;
  @IsDateString() tanggal_pengajuan: string;

  // Detail asal — wajib untuk MUTASI, PECAH, GABUNG, HAPUS, PERUBAHAN_DATA. Kosong untuk BARU.
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => DetailAsalInputDto)
  detail_asal?: DetailAsalInputDto[];

  // Detail tujuan — wajib untuk BARU, MUTASI, PECAH, GABUNG, PERUBAHAN_DATA. Kosong untuk HAPUS.
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => DetailTujuanInputDto)
  detail_tujuan?: DetailTujuanInputDto[];
}

class DetailAsalInputDto {
  @IsString() @Length(18, 18) nop_asal: string;
  @IsOptional() @IsBoolean() nonaktifkan_saat_disetujui?: boolean; // default true
}

class DetailTujuanInputDto {
  @IsOptional() @IsString() nik_calon_subjek?: string; // kalau subjek sudah ada
  @IsOptional() @ValidateNested() @Type(() => CalonSubjekDto) calon_subjek_json?: CalonSubjekDto; // kalau subjek baru, belum terdaftar
  @IsNumber() luas_tanah_baru: number;
  @IsOptional() @IsNumber() luas_bangunan_baru?: number;
  @IsEnum(JenisTanah) jenis_tanah_baru: JenisTanah;
  @IsOptional() @IsString() jalan_op_baru?: string;
  @IsOptional() @IsString() kode_wilayah_baru?: string; // ganti pola lama kelurahan_op/kecamatan_op teks bebas
  @IsOptional() @IsString() kode_blok_baru?: string;
  @IsOptional() @IsArray() data_bangunan_json?: any[]; // array data LSPOP (bumi/bangunan/fasilitas mentah)
}

class CalonSubjekDto {
  @IsString() nik: string;
  @IsString() nama_subjek: string;
  @IsEnum(StatusWp) status_wp: StatusWp;
  @IsEnum(Pekerjaan) pekerjaan: Pekerjaan;
  // ...field subjek lain sesuai CreateSubjekPajakDto
}
```

> **Catatan penting soal `kelurahan_op_baru`/`kecamatan_op_baru`:** field ini di schema `DetailTransaksiTujuan` masih teks bebas — sebaiknya diselaraskan dengan perbaikan `kode_wilayah` yang sudah kamu terapkan di `ObjekPajak` (section `perbaikan-wilayah-nop-scoping.md`). Kalau schema `DetailTransaksiTujuan` belum diubah, minimal di level DTO/service tetap lakukan validasi lookup ke tabel `Wilayah` sebelum data ini dipakai generate NOP nanti.

### 2.2 Validasi Kondisional per Jenis — Dilakukan di Service, Bukan Cuma DTO

| Jenis | `detail_asal` | `detail_tujuan` |
|---|---|---|
| `BARU` | Kosong/tidak diisi | Wajib tepat **1** baris |
| `MUTASI` | Wajib tepat **1** baris | Wajib tepat **1** baris (isi minimal `nik_calon_subjek`, field lain boleh sama seperti data lama) |
| `PECAH` | Wajib tepat **1** baris | Wajib **≥2** baris |
| `GABUNG` | Wajib **≥2** baris | Wajib tepat **1** baris |
| `PERUBAHAN_DATA` | Wajib tepat **1** baris | Wajib tepat **1** baris (data baru untuk field yang diubah, subjek tetap sama) |
| `HAPUS` | Wajib tepat **1** baris | Kosong/tidak diisi |

---

## 3. Service — `TransaksiSpopService`

### 3.1 Submit Pengajuan (DESA)

```typescript
async submitPengajuan(dto: SubmitTransaksiDto, currentUser: CurrentUser, asDraft: boolean) {
  this.validateJumlahDetail(dto.jenis_transaksi, dto.detail_asal, dto.detail_tujuan);

  // Kalau ada detail_asal, pastikan semua NOP asal itu ada dan di wilayah user (kalau DESA)
  if (dto.detail_asal?.length) {
    for (const asal of dto.detail_asal) {
      const objek = await this.prisma.objekPajak.findUnique({ where: { nop: asal.nop_asal } });
      if (!objek) throw new BadRequestException(`NOP asal ${asal.nop_asal} tidak ditemukan`);
      if (!objek.status_aktif) throw new BadRequestException(`NOP asal ${asal.nop_asal} sudah nonaktif, tidak bisa diajukan transaksi`);
      assertWilayahAccess(currentUser, objek.kode_wilayah);
    }
  }

  const transaksi = await this.prisma.transaksiSpop.create({
    data: {
      id_user: currentUser.id_user,
      tahun_pajak: dto.tahun_pajak,
      jenis_transaksi: dto.jenis_transaksi,
      no_sppt_lama: dto.no_sppt_lama,
      nama_pengaju: dto.nama_pengaju,
      menggunakan_kuasa: dto.menggunakan_kuasa ?? false,
      tanggal_pengajuan: new Date(dto.tanggal_pengajuan),
      status_ajuan: asDraft ? 'DRAFT' : 'MENUNGGU',
      detail_asal: dto.detail_asal ? { create: dto.detail_asal.map((a) => ({ nop_asal: a.nop_asal, nonaktifkan_saat_disetujui: a.nonaktifkan_saat_disetujui ?? true })) } : undefined,
      detail_tujuan: dto.detail_tujuan ? { create: dto.detail_tujuan.map((t) => ({ ...t, calon_subjek_json: t.calon_subjek_json as any })) } : undefined,
    },
    include: { detail_asal: true, detail_tujuan: true },
  });

  await this.catatRiwayat(transaksi.id_transaksi, null, transaksi.status_ajuan, currentUser.id_user, 'Pengajuan dibuat');

  return { success: true, message: 'Pengajuan berhasil dibuat', data: transaksi };
}

private validateJumlahDetail(jenis: JenisTransaksi, asal?: any[], tujuan?: any[]) {
  const rules: Record<JenisTransaksi, { asal: [number, number]; tujuan: [number, number] }> = {
    BARU: { asal: [0, 0], tujuan: [1, 1] },
    MUTASI: { asal: [1, 1], tujuan: [1, 1] },
    PECAH: { asal: [1, 1], tujuan: [2, Infinity] },
    GABUNG: { asal: [2, Infinity], tujuan: [1, 1] },
    PERUBAHAN_DATA: { asal: [1, 1], tujuan: [1, 1] },
    HAPUS: { asal: [1, 1], tujuan: [0, 0] },
  };
  const rule = rules[jenis];
  const jumlahAsal = asal?.length ?? 0;
  const jumlahTujuan = tujuan?.length ?? 0;
  if (jumlahAsal < rule.asal[0] || jumlahAsal > rule.asal[1]) {
    throw new BadRequestException(`Jumlah detail asal tidak sesuai untuk transaksi ${jenis}`);
  }
  if (jumlahTujuan < rule.tujuan[0] || jumlahTujuan > rule.tujuan[1]) {
    throw new BadRequestException(`Jumlah detail tujuan tidak sesuai untuk transaksi ${jenis}`);
  }
}
```

### 3.2 Lock untuk Reviu (BAKEUDA)

```typescript
async lockForReview(idTransaksi: string, currentUser: CurrentUser) {
  const transaksi = await this.prisma.transaksiSpop.findUnique({ where: { id_transaksi: idTransaksi } });
  if (!transaksi) throw new NotFoundException('Transaksi tidak ditemukan');
  if (transaksi.status_ajuan !== 'MENUNGGU') {
    throw new BadRequestException('Transaksi tidak dalam status MENUNGGU, tidak bisa dikunci untuk reviu');
  }
  if (transaksi.locked_by) {
    throw new ConflictException('Transaksi sedang direviu oleh verifikator lain');
  }

  const updated = await this.prisma.transaksiSpop.update({
    where: { id_transaksi: idTransaksi },
    data: { status_ajuan: 'PROSES', locked_by: currentUser.id_user, locked_at: new Date() },
  });

  await this.catatRiwayat(idTransaksi, 'MENUNGGU', 'PROSES', currentUser.id_user, 'Mulai direviu');
  return { success: true, data: updated };
}

async unlockReview(idTransaksi: string, currentUser: CurrentUser) {
  const transaksi = await this.prisma.transaksiSpop.findUnique({ where: { id_transaksi: idTransaksi } });
  if (!transaksi) throw new NotFoundException('Transaksi tidak ditemukan');
  if (transaksi.locked_by !== currentUser.id_user) {
    throw new ForbiddenException('Hanya verifikator yang mengunci transaksi ini yang bisa melepaskannya');
  }

  const updated = await this.prisma.transaksiSpop.update({
    where: { id_transaksi: idTransaksi },
    data: { status_ajuan: 'MENUNGGU', locked_by: null, locked_at: null },
  });

  await this.catatRiwayat(idTransaksi, 'PROSES', 'MENUNGGU', currentUser.id_user, 'Reviu dibatalkan/dilepas');
  return { success: true, data: updated };
}
```

> ⚠️ **Lock yang "nyangkut"** — kalau verifikator lupa unlock (browser ditutup tanpa aksi), transaksi bisa terkunci selamanya. Disarankan tambahkan **auto-unlock** kalau `locked_at` sudah lebih dari misal 30 menit — bisa dicek setiap kali endpoint list transaksi dipanggil (lazy check), tidak perlu cron job terpisah untuk kasus sederhana ini.

### 3.3 Approve — Titik Paling Kompleks, Dispatch per Jenis

```typescript
async approve(idTransaksi: string, currentUser: CurrentUser) {
  const transaksi = await this.prisma.transaksiSpop.findUnique({
    where: { id_transaksi: idTransaksi },
    include: { detail_asal: true, detail_tujuan: true },
  });
  if (!transaksi) throw new NotFoundException('Transaksi tidak ditemukan');
  if (transaksi.status_ajuan !== 'PROSES') throw new BadRequestException('Transaksi harus berstatus PROSES untuk disetujui');
  if (transaksi.locked_by !== currentUser.id_user) throw new ForbiddenException('Hanya verifikator yang mengunci transaksi ini yang bisa menyetujuinya');

  const hasil = await this.prisma.$transaction(async (tx) => {
    switch (transaksi.jenis_transaksi) {
      case 'BARU':
        return this.eksekusiBaru(tx, transaksi, currentUser);
      case 'MUTASI':
        return this.eksekusiMutasi(tx, transaksi);
      case 'PERUBAHAN_DATA':
        return this.eksekusiPerubahanData(tx, transaksi);
      case 'PECAH':
        return this.eksekusiPecah(tx, transaksi, currentUser);
      case 'GABUNG':
        return this.eksekusiGabung(tx, transaksi, currentUser);
      case 'HAPUS':
        return this.eksekusiHapus(tx, transaksi, currentUser);
    }
  }, { isolationLevel: 'Serializable' });

  await this.prisma.transaksiSpop.update({
    where: { id_transaksi: idTransaksi },
    data: { status_ajuan: 'DISETUJUI', id_verifikator: currentUser.id_user, verified_at: new Date() },
  });
  await this.catatRiwayat(idTransaksi, 'PROSES', 'DISETUJUI', currentUser.id_user, 'Disetujui, data dieksekusi');

  return { success: true, message: 'Transaksi disetujui dan data berhasil diproses', data: hasil };
}
```

### 3.4 Eksekusi per Jenis — Memakai Ulang Fungsi yang Sudah Ada

```typescript
// BARU — pakai NopGeneratorService + create ObjekPajak, sama seperti ObjekPajakService.create()
private async eksekusiBaru(tx: Prisma.TransactionClient, transaksi: TransaksiSpopWithDetail, currentUser: CurrentUser) {
  const t = transaksi.detail_tujuan[0];

  // Kalau calon_subjek_json ada isinya → subjek baru, create dulu
  let nikSubjek = t.nik_calon_subjek;
  if (!nikSubjek && t.calon_subjek_json) {
    const subjekBaru = t.calon_subjek_json as any;
    const subjek = await tx.subjekPajak.create({ data: { ...subjekBaru, created_by: transaksi.id_user } });
    nikSubjek = subjek.nik;
  }

  const kodeWilayah = t.kode_wilayah_baru; // sudah divalidasi ada di tabel Wilayah saat submit
  const nop = await this.nopGenerator.generateNop({ kode_wilayah: kodeWilayah, kode_blok: t.kode_blok_baru, kode_jenis_op: '1' }, tx);

  const objek = await tx.objekPajak.create({
    data: {
      nop, kode_wilayah: kodeWilayah, kode_blok: t.kode_blok_baru, no_urut: nop.substring(13, 17), kode_jenis_op: '1',
      nik_subjek: nikSubjek, jalan_op: t.jalan_op_baru ?? '', jenis_tanah: t.jenis_tanah_baru,
      luas_tanah: t.luas_tanah_baru, luas_bangunan: t.luas_bangunan_baru ?? 0,
      // ...bumi/bangunan dari data_bangunan_json kalau ada
    },
  });

  await tx.detailTransaksiTujuan.update({ where: { id_detail_tujuan: t.id_detail_tujuan }, data: { nop_generated: nop } });
  return { nop_baru: nop };
}

// MUTASI — cuma ganti nik_subjek, NOP tetap
private async eksekusiMutasi(tx: Prisma.TransactionClient, transaksi: TransaksiSpopWithDetail) {
  const nopAsal = transaksi.detail_asal[0].nop_asal;
  const t = transaksi.detail_tujuan[0];

  let nikBaru = t.nik_calon_subjek;
  if (!nikBaru && t.calon_subjek_json) {
    const subjekBaru = t.calon_subjek_json as any;
    const subjek = await tx.subjekPajak.create({ data: { ...subjekBaru, created_by: transaksi.id_user } });
    nikBaru = subjek.nik;
  }

  await tx.objekPajak.update({ where: { nop: nopAsal }, data: { nik_subjek: nikBaru } });
  await tx.detailTransaksiTujuan.update({ where: { id_detail_tujuan: t.id_detail_tujuan }, data: { nop_generated: nopAsal } });
  return { nop: nopAsal, subjek_baru: nikBaru };
}

// PERUBAHAN_DATA — update field fisik objek, subjek tetap sama
private async eksekusiPerubahanData(tx: Prisma.TransactionClient, transaksi: TransaksiSpopWithDetail) {
  const nopAsal = transaksi.detail_asal[0].nop_asal;
  const t = transaksi.detail_tujuan[0];

  await tx.objekPajak.update({
    where: { nop: nopAsal },
    data: {
      luas_tanah: t.luas_tanah_baru, luas_bangunan: t.luas_bangunan_baru ?? undefined,
      jenis_tanah: t.jenis_tanah_baru, jalan_op: t.jalan_op_baru ?? undefined,
    },
  });
  await tx.detailTransaksiTujuan.update({ where: { id_detail_tujuan: t.id_detail_tujuan }, data: { nop_generated: nopAsal } });
  return { nop: nopAsal };
}

// PECAH — 1 asal dinonaktifkan, banyak tujuan dibuat
private async eksekusiPecah(tx: Prisma.TransactionClient, transaksi: TransaksiSpopWithDetail, currentUser: CurrentUser) {
  const asal = transaksi.detail_asal[0];
  await tx.objekPajak.update({
    where: { nop: asal.nop_asal },
    data: { status_aktif: false, nonaktif_oleh: currentUser.id_user, nonaktif_at: new Date() },
  });

  const hasilNop: string[] = [];
  for (const t of transaksi.detail_tujuan) {
    let nikSubjek = t.nik_calon_subjek;
    if (!nikSubjek && t.calon_subjek_json) {
      const subjek = await tx.subjekPajak.create({ data: { ...(t.calon_subjek_json as any), created_by: transaksi.id_user } });
      nikSubjek = subjek.nik;
    }
    const nop = await this.nopGenerator.generateNop({ kode_wilayah: t.kode_wilayah_baru, kode_blok: t.kode_blok_baru, kode_jenis_op: '1' }, tx);
    await tx.objekPajak.create({
      data: {
        nop, kode_wilayah: t.kode_wilayah_baru, kode_blok: t.kode_blok_baru, no_urut: nop.substring(13, 17), kode_jenis_op: '1',
        nik_subjek: nikSubjek, jalan_op: t.jalan_op_baru ?? '', jenis_tanah: t.jenis_tanah_baru,
        luas_tanah: t.luas_tanah_baru, luas_bangunan: t.luas_bangunan_baru ?? 0,
      },
    });
    await tx.detailTransaksiTujuan.update({ where: { id_detail_tujuan: t.id_detail_tujuan }, data: { nop_generated: nop } });
    hasilNop.push(nop);
  }
  return { nop_asal_dinonaktifkan: asal.nop_asal, nop_baru: hasilNop };
}

// GABUNG — banyak asal dinonaktifkan, 1 tujuan dibuat
private async eksekusiGabung(tx: Prisma.TransactionClient, transaksi: TransaksiSpopWithDetail, currentUser: CurrentUser) {
  for (const asal of transaksi.detail_asal) {
    await tx.objekPajak.update({
      where: { nop: asal.nop_asal },
      data: { status_aktif: false, nonaktif_oleh: currentUser.id_user, nonaktif_at: new Date() },
    });
  }

  const t = transaksi.detail_tujuan[0];
  let nikSubjek = t.nik_calon_subjek;
  if (!nikSubjek && t.calon_subjek_json) {
    const subjek = await tx.subjekPajak.create({ data: { ...(t.calon_subjek_json as any), created_by: transaksi.id_user } });
    nikSubjek = subjek.nik;
  }
  const nop = await this.nopGenerator.generateNop({ kode_wilayah: t.kode_wilayah_baru, kode_blok: t.kode_blok_baru, kode_jenis_op: '1' }, tx);
  await tx.objekPajak.create({
    data: {
      nop, kode_wilayah: t.kode_wilayah_baru, kode_blok: t.kode_blok_baru, no_urut: nop.substring(13, 17), kode_jenis_op: '1',
      nik_subjek: nikSubjek, jalan_op: t.jalan_op_baru ?? '', jenis_tanah: t.jenis_tanah_baru,
      luas_tanah: t.luas_tanah_baru, // sudah dijumlahkan manual oleh DESA saat submit, atau dihitung otomatis dari total detail_asal
      luas_bangunan: t.luas_bangunan_baru ?? 0,
    },
  });
  await tx.detailTransaksiTujuan.update({ where: { id_detail_tujuan: t.id_detail_tujuan }, data: { nop_generated: nop } });
  return { nop_asal_dinonaktifkan: transaksi.detail_asal.map((a) => a.nop_asal), nop_baru: nop };
}

// HAPUS — nonaktifkan saja, tidak ada objek baru
private async eksekusiHapus(tx: Prisma.TransactionClient, transaksi: TransaksiSpopWithDetail, currentUser: CurrentUser) {
  const asal = transaksi.detail_asal[0];
  await tx.objekPajak.update({
    where: { nop: asal.nop_asal },
    data: { status_aktif: false, nonaktif_oleh: currentUser.id_user, nonaktif_at: new Date() },
  });
  return { nop_dihapus: asal.nop_asal };
}
```

### 3.5 Tolak & Minta Revisi

```typescript
async tolak(idTransaksi: string, catatan: string, currentUser: CurrentUser) {
  await this.pastikanSedangDireviuOleh(idTransaksi, currentUser);
  const updated = await this.prisma.transaksiSpop.update({
    where: { id_transaksi: idTransaksi },
    data: { status_ajuan: 'DITOLAK', catatan_bakeuda: catatan, id_verifikator: currentUser.id_user, verified_at: new Date() },
  });
  await this.catatRiwayat(idTransaksi, 'PROSES', 'DITOLAK', currentUser.id_user, catatan);
  return { success: true, data: updated };
}

async mintaRevisi(idTransaksi: string, catatan: string, currentUser: CurrentUser) {
  await this.pastikanSedangDireviuOleh(idTransaksi, currentUser);
  const updated = await this.prisma.transaksiSpop.update({
    where: { id_transaksi: idTransaksi },
    data: { status_ajuan: 'REVISI', catatan_bakeuda: catatan, locked_by: null, locked_at: null },
  });
  await this.catatRiwayat(idTransaksi, 'PROSES', 'REVISI', currentUser.id_user, catatan);
  return { success: true, data: updated };
}

// Dipakai DESA setelah dapat status REVISI, kembali jadi DRAFT untuk diedit
async kembalikanKeDraft(idTransaksi: string, currentUser: CurrentUser) {
  const transaksi = await this.prisma.transaksiSpop.findUnique({ where: { id_transaksi: idTransaksi } });
  if (!transaksi) throw new NotFoundException('Transaksi tidak ditemukan');
  if (transaksi.id_user !== currentUser.id_user) throw new ForbiddenException('Hanya pengaju yang bisa mengedit ulang pengajuannya');
  if (transaksi.status_ajuan !== 'REVISI') throw new BadRequestException('Transaksi tidak dalam status REVISI');

  const updated = await this.prisma.transaksiSpop.update({ where: { id_transaksi: idTransaksi }, data: { status_ajuan: 'DRAFT' } });
  await this.catatRiwayat(idTransaksi, 'REVISI', 'DRAFT', currentUser.id_user, 'Dikembalikan ke draft untuk diedit ulang');
  return { success: true, data: updated };
}
```

---

## 4. Controller — `TransaksiSpopController`

```typescript
@Controller('transaksi-spop')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TransaksiSpopController {
  constructor(private readonly service: TransaksiSpopService) {}

  @Post()
  async submitDraft(@Body() dto: SubmitTransaksiDto, @Request() req: any) {
    return this.service.submitPengajuan(dto, req.user, true); // simpan sebagai DRAFT
  }

  @Post(':id/submit')
  async submitFinal(@Param('id') id: string, @Request() req: any) {
    return this.service.finalisasiSubmit(id, req.user); // DRAFT → MENUNGGU
  }

  @Get()
  async list(@Query() query: any, @Request() req: any) {
    return this.service.list(query, req.user); // filter status, jenis, dst — DESA lihat punya sendiri, BAKEUDA lihat semua
  }

  @Get(':id')
  async detail(@Param('id') id: string, @Request() req: any) {
    return this.service.getDetail(id, req.user);
  }

  @Post(':id/lock')
  @Roles('BAKEUDA')
  async lock(@Param('id') id: string, @Request() req: any) {
    return this.service.lockForReview(id, req.user);
  }

  @Post(':id/unlock')
  @Roles('BAKEUDA')
  async unlock(@Param('id') id: string, @Request() req: any) {
    return this.service.unlockReview(id, req.user);
  }

  @Post(':id/approve')
  @Roles('BAKEUDA')
  async approve(@Param('id') id: string, @Request() req: any) {
    return this.service.approve(id, req.user);
  }

  @Post(':id/tolak')
  @Roles('BAKEUDA')
  async tolak(@Param('id') id: string, @Body('catatan') catatan: string, @Request() req: any) {
    return this.service.tolak(id, catatan, req.user);
  }

  @Post(':id/revisi')
  @Roles('BAKEUDA')
  async revisi(@Param('id') id: string, @Body('catatan') catatan: string, @Request() req: any) {
    return this.service.mintaRevisi(id, catatan, req.user);
  }

  @Post(':id/kembalikan-draft')
  async kembalikanDraft(@Param('id') id: string, @Request() req: any) {
    return this.service.kembalikanKeDraft(id, req.user);
  }
}
```

---

## 5. Endpoint Ringkas

| Method | Endpoint | Role | Fungsi |
|---|---|---|---|
| POST | `/transaksi-spop` | DESA | Buat pengajuan (status DRAFT) |
| POST | `/transaksi-spop/:id/submit` | DESA | DRAFT → MENUNGGU |
| GET | `/transaksi-spop` | Semua (scoped) | List pengajuan |
| GET | `/transaksi-spop/:id` | Semua (scoped) | Detail 1 pengajuan |
| POST | `/transaksi-spop/:id/lock` | BAKEUDA | MENUNGGU → PROSES, kunci untuk reviu |
| POST | `/transaksi-spop/:id/unlock` | BAKEUDA | PROSES → MENUNGGU, lepas kunci |
| POST | `/transaksi-spop/:id/approve` | BAKEUDA | PROSES → DISETUJUI, eksekusi data |
| POST | `/transaksi-spop/:id/tolak` | BAKEUDA | PROSES → DITOLAK |
| POST | `/transaksi-spop/:id/revisi` | BAKEUDA | PROSES → REVISI |
| POST | `/transaksi-spop/:id/kembalikan-draft` | DESA | REVISI → DRAFT |

---

## 6. Yang Masih Perlu Diputuskan / Dicek Ulang

1. **`ObjekPajakController` lama** — apakah endpoint `POST/PUT/DELETE /objek-pajak` langsung mau **ditutup total** dari akses DESA (cuma dipanggil internal oleh `TransaksiSpopService`), atau tetap dibuka sebagai jalur cepat khusus BAKEUDA (misal untuk koreksi data darurat)? Saran: batasi `@Roles('BAKEUDA')` di endpoint itu supaya DESA wajib lewat alur pengajuan.
2. **Auto-unlock timeout** — perlu diputuskan berapa lama batas waktu sebelum lock otomatis lepas (saran 30 menit), dan mekanismenya lazy-check atau cron job.
3. **`GABUNG` — total luas tanah tujuan** — apakah dihitung otomatis dari penjumlahan `luas_tanah` semua NOP asal, atau tetap input manual oleh DESA saat submit (rawan human error kalau manual)? Saran: hitung otomatis di `eksekusiGabung()`, bukan percaya input DESA.
4. **`RiwayatPelacakan` dan `LampiranDokumen`** — schema di section 0 masih usulan saya, perlu dicek/disesuaikan sebelum dieksekusi ke migrasi.

---

## 7. Urutan Eksekusi

1. Konfirmasi 4 poin di section 6
2. Tambahkan schema `RiwayatPelacakan` & `LampiranDokumen` (section 0) — sesuaikan dulu kalau ada revisi
3. Migrasi database
4. Buat DTO (section 2)
5. Buat `TransaksiSpopService` lengkap (section 3) — termasuk fungsi eksekusi per jenis
6. Buat `TransaksiSpopController` (section 4)
7. Batasi endpoint `ObjekPajak` langsung sesuai keputusan poin 6.1
8. Buat checklist testing Postman untuk seluruh state machine (submit draft → submit final → lock → approve/tolak/revisi, untuk keenam jenis transaksi)
