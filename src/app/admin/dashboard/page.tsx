"use client";

import { useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { GalleryItem, NewsPost, Schedule, DonationProgram } from "@/types";
import Link from "next/link";

export default function DashboardPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [news, setNews] = useState<NewsPost[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [donations, setDonations] = useState<DonationProgram[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) { setLoading(false); return; }
    const sb = createClient();
    Promise.all([
      sb.from("gallery").select("*"),
      sb.from("news").select("*"),
      sb.from("schedules").select("*"),
      sb.from("donation_programs").select("*"),
    ]).then(([g, n, s, d]) => {
      setGallery((g.data as GalleryItem[]) ?? []);
      setNews((n.data as NewsPost[]) ?? []);
      setSchedules((s.data as Schedule[]) ?? []);
      setDonations((d.data as DonationProgram[]) ?? []);
      setLoading(false);
    });
  }, []);

  const stats = [
    { label: "Foto Galeri", value: gallery.length },
    { label: "Berita", value: news.length },
    { label: "Jadwal", value: schedules.length },
    { label: "Program Donasi", value: donations.length },
  ];
  const recent = [...news].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

  if (!isSupabaseConfigured()) {
    return (
      <div>
        <h1 className="font-display text-3xl font-semibold text-masjid-900">Dashboard</h1>
        <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
          Supabase belum dikonfigurasi. Buka /admin/setup untuk panduan. Isi .env.local untuk mengaktifkan CMS. Data publik menggunakan seed.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-masjid-900">Dashboard</h1>
      <p className="mt-1 text-sm text-masjid-800/70">Ringkasan konten website.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card">
            <p className="text-[11px] uppercase tracking-[0.18em] text-masjid-800/60">{s.label}</p>
            <p className="mt-2 font-display text-3xl font-bold text-masjid-800">{loading ? "…" : s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="font-display text-xl font-semibold text-masjid-900">Aktivitas Terbaru</h2>
          <ul className="mt-4 space-y-3">
            {recent.length === 0 && <li className="text-sm text-masjid-800/60">Belum ada aktivitas.</li>}
            {recent.map((n) => (
              <li key={n.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate text-masjid-900">{n.title}</span>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${n.status === "published" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{n.status}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h2 className="font-display text-xl font-semibold text-masjid-900">Navigasi Cepat</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              { label: "Kelola Galeri", href: "/admin/galeri" },
              { label: "Kelola Berita", href: "/admin/berita" },
              { label: "Kelola Jadwal", href: "/admin/jadwal" },
              { label: "Kelola Beranda", href: "/admin/beranda" },
              { label: "Kelola Donasi", href: "/admin/donasi" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="rounded-xl border border-masjid-800/10 bg-masjid-50 px-4 py-3 text-sm font-medium text-masjid-800 transition-colors hover:bg-masjid-100">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

