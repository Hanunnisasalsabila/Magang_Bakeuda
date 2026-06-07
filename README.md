# Sistem Informasi Perpajakan Daerah (SIPD) - Bakeuda Purbalingga

Repository ini berisi kode untuk frontend dan backend proyek Magang SIPD Kabupaten Purbalingga. Proyek ini menggunakan arsitektur Monorepo.

## 🛠️ Tech Stack
* **Frontend:** React.js, Vite, Tailwind CSS v3
* **Backend:** NestJS, Prisma ORM
* **Database:** PostgreSQL

---

## ⚙️ Persyaratan Sistem (Prerequisites)
Sebelum menjalankan aplikasi, pastikan laptop kamu sudah ter-install:
1. **Node.js** (Disarankan versi LTS).
2. **PostgreSQL** (Pastikan service berjalan di port 5432) & **pgAdmin** untuk manajemen database.
3. **Git**.

---

## 🚀 Cara Menjalankan Aplikasi (Local Development)

Karena ini adalah monorepo, kamu perlu membuka **dua terminal yang berbeda** untuk menjalankan Backend dan Frontend secara bersamaan.

## 1️⃣ Jalankan Backend (Terminal 1)

Buka terminal dan arahkan ke folder backend:

```bash
cd backend-bakeuda
```

Install dependencies:

```bash
npm install
```

> **Penting:** Pastikan kamu sudah membuat database kosong di pgAdmin dan menyesuaikan isi file `.env` dengan password PostgreSQL-mu.

Sinkronisasi database dan jalankan server:

```bash
npx prisma db push
npm run start:dev
```

Biarkan terminal ini tetap terbuka dan berjalan.

---

## 2️⃣ Jalankan Frontend (Terminal 2)

Buka terminal baru, lalu arahkan ke folder frontend:

```bash
cd frontend-bakeuda
```

Install dependencies:

```bash
npm install
```

Jalankan aplikasi:

```bash
npm run dev
```

Setelah jalan, buka link berikut di browser:

```
http://localhost:5173
```
