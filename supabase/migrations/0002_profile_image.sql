-- Tambah kolom foto profil masjid di homepage_settings
-- (dipakai di halaman Profil dan logo navbar; dikelola dari /admin/beranda)

alter table public.homepage_settings
  add column if not exists profile_image_url text;

-- Catatan: policy "public read homepage" (SELECT untuk semua kolom) sudah menutup kolom ini.
