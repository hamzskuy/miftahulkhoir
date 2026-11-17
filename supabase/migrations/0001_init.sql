-- Masjid Miftahul Khoir CMS schema

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

create table if not exists public.homepage_settings (
  id text primary key default 'homepage',
  hero_image_url text,
  hero_title text not null default 'MASJID MIFTAHUL KHOIR',
  hero_tagline text not null default 'Menebar Kebaikan, Membangun Ummah',
  hero_description text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null default 'Umum',
  image_url text not null,
  taken_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.news_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique
);

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null default '',
  cover_url text,
  category_id uuid references public.news_categories(id) on delete set null,
  status text not null default 'draft' check (status in ('draft','published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.schedules (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  location text,
  start_at timestamptz not null,
  end_at timestamptz,
  status text not null default 'upcoming' check (status in ('upcoming','past','cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.donation_programs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null default 'Infaq',
  image_url text,
  bank_name text,
  account_number text,
  account_holder text,
  qris_url text,
  whatsapp text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- seed homepage row
insert into public.homepage_settings (id) values ('homepage') on conflict (id) do nothing;

-- RLS
alter table public.profiles enable row level security;
alter table public.homepage_settings enable row level security;
alter table public.gallery enable row level security;
alter table public.news_categories enable row level security;
alter table public.news enable row level security;
alter table public.schedules enable row level security;
alter table public.donation_programs enable row level security;

-- Drop existing policies (idempotent) then recreate
drop policy if exists "public read homepage" on public.homepage_settings;
drop policy if exists "public read gallery" on public.gallery;
drop policy if exists "public read news categories" on public.news_categories;
drop policy if exists "public read published news" on public.news;
drop policy if exists "public read schedules" on public.schedules;
drop policy if exists "public read active donations" on public.donation_programs;
drop policy if exists "admin write homepage" on public.homepage_settings;
drop policy if exists "admin write gallery" on public.gallery;
drop policy if exists "admin write news categories" on public.news_categories;
drop policy if exists "admin write news" on public.news;
drop policy if exists "admin write schedules" on public.schedules;
drop policy if exists "admin write donations" on public.donation_programs;
drop policy if exists "admin read profiles" on public.profiles;
drop policy if exists "admin update own profile" on public.profiles;

-- public read policies
create policy "public read homepage" on public.homepage_settings for select using (true);
create policy "public read gallery" on public.gallery for select using (true);
create policy "public read news categories" on public.news_categories for select using (true);
create policy "public read published news" on public.news for select using (status = 'published');
create policy "public read schedules" on public.schedules for select using (true);
create policy "public read active donations" on public.donation_programs for select using (is_active = true);

-- admin write policies (authenticated users with profile role admin)
create or replace function public.is_admin() returns boolean language sql stable as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create policy "admin write homepage" on public.homepage_settings for all using (public.is_admin()) with check (public.is_admin());
create policy "admin write gallery" on public.gallery for all using (public.is_admin()) with check (public.is_admin());
create policy "admin write news categories" on public.news_categories for all using (public.is_admin()) with check (public.is_admin());
create policy "admin write news" on public.news for all using (public.is_admin()) with check (public.is_admin());
create policy "admin write schedules" on public.schedules for all using (public.is_admin()) with check (public.is_admin());
create policy "admin write donations" on public.donation_programs for all using (public.is_admin()) with check (public.is_admin());
create policy "admin read profiles" on public.profiles for select using (auth.uid() = id);
create policy "admin update own profile" on public.profiles for update using (auth.uid() = id);

-- Storage bucket & policies (jalankan setelah membuat bucket "media" di Storage)
-- Buat bucket via Dashboard: Storage → New bucket → name: media → Public: ON
-- Atau via SQL (butuh service role):
-- insert into storage.buckets (id, name, public) values ('media','media',true) on conflict (id) do nothing;

-- Policy: publik bisa baca file di bucket media
drop policy if exists "public read media" on storage.objects;
create policy "public read media" on storage.objects
  for select using (bucket_id = 'media');

-- Policy: user terautentikasi (admin) bisa upload
drop policy if exists "auth upload media" on storage.objects;
create policy "auth upload media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media');

-- Policy: user terautentikasi bisa update
drop policy if exists "auth update media" on storage.objects;
create policy "auth update media" on storage.objects
  for update to authenticated using (bucket_id = 'media');

-- Policy: user terautentikasi bisa hapus
drop policy if exists "auth delete media" on storage.objects;
create policy "auth delete media" on storage.objects
  for delete to authenticated using (bucket_id = 'media');
