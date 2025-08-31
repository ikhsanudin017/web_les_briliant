# Bimbingan Belajar Brilliant

Aplikasi web LES (bimbingan belajar) built with Next.js 14 (App Router), Tailwind CSS, Prisma (PostgreSQL), NextAuth, dan TypeScript.

## Teknologi
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (shadcn-style UI components)
- Prisma ORM + PostgreSQL
- NextAuth.js (Credentials)
- Optional: Uploadthing untuk file upload
- Deployment: Vercel

## Fitur
- Landing page publik
- Autentikasi (login/daftar siswa)
- RBAC: Admin vs Siswa
- Admin: kelola siswa, mata pelajaran, materi, tryout, import CSV soal, laporan ringkas
- Siswa: materi (viewer PDF/video), tryout ber-timer + auto-submit, riwayat nilai, profil
- Ekspor CSV (admin/students)
- Rate limiting API (sederhana, in-memory)
- SEO: sitemap, robots; PWA manifest

## Struktur Folder
- `app/` App Router routes (public, auth, admin, student, api)
- `components/` UI components (shadcn-style) + test runner
- `lib/` prisma client, auth, rbac, validators, rate-limit, email util
- `prisma/` Prisma schema dan seed
- `public/` aset statis (manifest, icon)

## Setup Lokal
1. Salin `.env.example` menjadi `.env.local` dan isi variabel:
   - `DATABASE_URL` (PostgreSQL, mis. Supabase/Neon)
   - `NEXTAUTH_SECRET` (generate: `openssl rand -base64 32`)
   - Optional: Uploadthing & SMTP
2. Install dependencies:
   - `pnpm i` atau `npm i`
3. Prisma migrate & generate:
   - `npx prisma migrate dev` (buat skema DB)
   - `npx prisma generate`
4. Seed admin + data awal (opsional):
   - Jalankan: `npm run prisma:seed`
   - Variabel opsional: `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`
   - Default: admin@brilliant-les.id / admin123
5. Jalankan dev server:
   - `pnpm dev` atau `npm run dev`

## Skema Database (Prisma)
- Termasuk model pengguna/role, profil siswa, subject, material, test, question, testResult, serta model NextAuth (Account, Session, VerificationToken).

## Upload File
- Saat ini form materi menerima `fileUrl` langsung. Untuk upload terintegrasi:
  - Pilih Uploadthing dan isi `UPLOADTHING_APP_ID` dan `UPLOADTHING_SECRET`.
  - Tambahkan router Uploadthing dan komponen Dropzone (lihat dokumentasi Uploadthing) lalu ganti form `fileUrl` menjadi hasil upload.
  - Validasi size/mime, kompresi gambar (mis. `browser-image-compression`) bila perlu.

## Security
- Rate limiting sederhana pada `middleware.ts` untuk semua `/api/*`.
- Validasi input via Zod (lihat `lib/validators.ts`) dan server actions memverifikasi field wajib.
- RBAC lewat `middleware.ts` dan helper `requireRole`.

## Deployment ke Vercel
1. Push repo ke GitHub/GitLab.
2. Buat project di Vercel, pilih repo.
3. Konfigurasi Environment Variables di Vercel:
   - `NEXTAUTH_URL` (contoh: https://brilliant-les.vercel.app)
   - `NEXTAUTH_SECRET`
   - `DATABASE_URL` (postgre dari Supabase/Neon)
   - Optional: UPLOADTHING_* dan SMTP_*
4. Jalankan `Prisma migrate` di DB produksi:
   - Vercel: gunakan `prisma migrate deploy` (set sebagai postinstall atau lewat CLI lokal)
5. Build & Deploy otomatis di Vercel.
6. Domain kustom: tambahkan domain di Vercel dan arahkan DNS.

## Catatan
- Untuk analytics chart, bisa tambahkan `chart.js`/`recharts` dan query agregasi dari Prisma.
- Rate limit in-memory cocok untuk dev; di produksi gunakan Upstash Ratelimit.
- Untuk impor Excel (.xlsx), gunakan `xlsx` library dan parser di server action/API.
- Toasts/notifications dapat ditambahkan dengan `sonner`/`react-hot-toast`.

## Roadmap Lanjutan
- Integrasi Uploadthing lengkap (drag & drop, progress, preview)
- Advanced data tables (sorting, server-side pagination, bulk actions)
- Email template yang lebih baik + verifikasi email
- PWA offline + service worker
