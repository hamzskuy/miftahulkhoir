-- Tambah kolom konten "Profil Singkat" di homepage_settings
-- (dikelola dari /admin/beranda, ditampilkan di bagian Profil)

alter table public.homepage_settings
  add column if not exists profile_label text not null default 'Profil Singkat';

alter table public.homepage_settings
  add column if not exists profile_heading text not null default 'Masjid Miftahul Khoir';

alter table public.homepage_settings
  add column if not exists profile_description text not null default 'Masjid Miftahul Khoir merupakan pusat ibadah, pendidikan, dan kegiatan sosial masyarakat. Melalui website ini, jamaah dapat mengakses informasi kegiatan, galeri dokumentasi, berita, dan program donasi secara mudah.';

alter table public.homepage_settings
  add column if not exists profile_stats jsonb not null default '[{"label":"Ibadah","value":"Harian"},{"label":"Kajian","value":"Rutin"},{"label":"Sosial","value":"Aktif"},{"label":"Donasi","value":"Terbuka"}]'::jsonb;
