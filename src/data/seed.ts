import type { GalleryItem, NewsPost, NewsCategory, Schedule, DonationProgram, HomepageSettings } from "@/types";

const now = new Date().toISOString();

export const seedHomepage: HomepageSettings = {
  id: "homepage",
  hero_image_url: "/placeholder.svg",
  hero_title: "MASJID MIFTAHUL KHOIR",
  hero_tagline: "Menebar Kebaikan, Membangun Ummah",
  hero_description:
    "Website resmi Masjid Miftahul Khoir. Pusat ibadah, pendidikan, dan kegiatan sosial masyarakat.",
  updated_at: now,
};

export const seedGallery: GalleryItem[] = [
  { id: "g1", title: "Kegiatan Sholat Jumat", description: "Dokumentasi sholat Jumat berjamaah.", category: "Ibadah", image_url: "/placeholder.svg", taken_at: now, created_at: now },
  { id: "g2", title: "Kajian Rutin", description: "Kajian rutin mingguan.", category: "Kajian", image_url: "/placeholder.svg", taken_at: now, created_at: now },
  { id: "g3", title: "Bakti Sosial", description: "Kegiatan bakti sosial masjid.", category: "Sosial", image_url: "/placeholder.svg", taken_at: now, created_at: now },
];

export const seedNewsCategories: NewsCategory[] = [
  { id: "nc1", name: "Pengumuman", slug: "pengumuman" },
  { id: "nc2", name: "Kegiatan", slug: "kegiatan" },
];

export const seedNews: NewsPost[] = [
  {
    id: "n1",
    title: "Selamat Datang di Website Resmi Masjid Miftahul Khoir",
    slug: "selamat-datang-website-resmi",
    excerpt: "Website resmi Masjid Miftahul Khoir kini hadir untuk menyajikan informasi kegiatan, galeri, berita, dan program donasi.",
    content: "<p>Assalamu'alaikum warahmatullahi wabarakatuh.</p><p>Selamat datang di website resmi Masjid Miftahul Khoir. Melalui website ini kami berharap dapat menyampaikan informasi kegiatan, dokumentasi, berita, dan program donasi dengan lebih mudah.</p><p>Semoga Allah SWT senantiasa memberkahi kita semua. Aamiin.</p>",
    cover_url: "/placeholder.svg",
    category_id: "nc1",
    status: "published",
    published_at: now,
    created_at: now,
    updated_at: now,
    category: seedNewsCategories[0],
  },
];

export const seedSchedules: Schedule[] = [
  { id: "s1", title: "Kajian Rutin Mingguan", description: "Kajian rutin setelah Maghrib.", location: "Ruang Utama Masjid", start_at: new Date(Date.now() + 86400000).toISOString(), end_at: null, status: "upcoming", created_at: now },
  { id: "s2", title: "Bakti Sosial", description: "Kegiatan sosial untuk masyarakat sekitar.", location: "Halaman Masjid", start_at: new Date(Date.now() + 3 * 86400000).toISOString(), end_at: null, status: "upcoming", created_at: now },
];

export const seedDonations: DonationProgram[] = [
  { id: "d1", title: "Infaq Jumat", description: "Infaq rutin setiap hari Jumat untuk operasional masjid.", category: "Infaq", image_url: "/placeholder.svg", bank_name: null, account_number: null, account_holder: null, qris_url: null, whatsapp: null, is_active: true, created_at: now },
  { id: "d2", title: "Wakaf Pembangunan", description: "Program wakaf untuk pengembangan fasilitas masjid.", category: "Wakaf", image_url: "/placeholder.svg", bank_name: null, account_number: null, account_holder: null, qris_url: null, whatsapp: null, is_active: true, created_at: now },
];
