# Masjid Miftahul Khoir — Website + CMS

Website resmi Masjid Miftahul Khoir dengan CMS admin (galeri, berita, jadwal, beranda, donasi).

## Menjalankan

```powershell
cd "C:\Users\ASUS\OneDrive\kodingan ilham\miftahulkhoir_web"
npm install
npm run dev
```

Buka http://localhost:3000. Tanpa Supabase, website menampilkan data seed dan admin menampilkan peringatan konfigurasi.

## Setup Supabase (wajib untuk CMS aktif)

1. Buat project di Supabase (https://supabase.com/dashboard) — atau gunakan project yang sudah ada.
2. Salin `.env.example` → `.env.local` dan isi:
   - `NEXT_PUBLIC_SUPABASE_URL` = Project URL (Settings → API → Project URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon/public key (Settings → API → anon key)
   - (Opsional) `SUPABASE_SERVICE_ROLE_KEY` = service role key (jangan pernah diekspos ke frontend)
3. Restart dev server: `npm run dev`.
4. Jalankan migration: buka Supabase Dashboard → **SQL Editor** → **New query** → paste isi file `supabase/migrations/0001_init.sql` → **Run**.
   - Migration lanjutan (mis. fitur baru): jalankan juga `supabase/migrations/0002_profile_image.sql` (kolom foto profil masjid). File migration bersifat idempotent, aman diulang.
5. Buat storage bucket: Storage → **New bucket** → nama `media` → centang **Public**.
6. Buat user admin: Authentication → Users → **Add user** (email + password) → lalu di SQL Editor jalankan:
   ```sql
   insert into public.profiles (id, email, full_name, role)
   values ('<user-uuid-dari-auth>', 'admin@example.com', 'Admin', 'admin');
   ```
7. Buka `/admin/setup` di website untuk verifikasi koneksi (harus "✓ Terhubung").

Catatan: Supabase memakai **PostgreSQL** (database bernama `postgres`), bukan MySQL. File `database/db_miftahulkhoir.sql` disediakan sebagai alternatif skema MySQL (memerlukan penulisan ulang data layer). Untuk CMS yang sudah dibangun, gunakan Supabase.

Kredensial yang sudah dikonfigurasi di project ini:
- URL: https://bfwecdfebwnnoyaiyhww.supabase.co
- Key: sb_publishable_... (anon/publishable)

## Struktur

```
src/
  app/
    page.tsx, galeri/, berita/, berita/[slug]/, donasi/
    admin/ (login, dashboard, galeri, berita, jadwal, beranda, donasi)
  components/public/ ... components/admin/ ...
  lib/supabase/ (client, server, middleware)
  lib/data.ts
  data/seed.ts
  types/
supabase/migrations/0001_init.sql
```

## Catatan

- Semua halaman admin dilindungi middleware (redirect ke /admin/login jika belum login).
- RLS: publik hanya baca konten published/aktif; admin terautentikasi dapat CRUD.
- Upload gambar disimpan di Supabase Storage (bucket `media`), bukan blob browser.
- Informasi rekening/QRIS tidak diarang — diisi admin via CMS.
- Foto hero masjid diberikan kemudian; gunakan placeholder + ganti via CMS beranda.
