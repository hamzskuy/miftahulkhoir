"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "@/utils/icons";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Galeri", href: "/galeri" },
  { label: "Berita", href: "/berita" },
  { label: "Jadwal", href: "/#jadwal" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const sb = createClient();
    sb.from("homepage_settings").select("profile_image_url").eq("id", "homepage").single().then(({ data }) => {
      setLogo((data as { profile_image_url: string | null } | null)?.profile_image_url ?? null);
    });
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const onResize = () => { if (window.innerWidth >= 1024) setOpen(false); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <header className="sticky top-0 z-50 flex justify-center px-3 pt-3 md:px-6 md:pt-4">
      <div className={`flex w-full max-w-6xl items-center justify-between gap-3 rounded-full border border-masjid-800/10 bg-white/95 px-4 py-2.5 shadow-lg backdrop-blur-xl transition-all duration-300 md:px-6 ${scrolled ? "shadow-xl" : ""}`}>
        <Link href="/" className="flex items-center gap-2">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt="Logo Masjid Miftahul Khoir" className="h-9 w-9 rounded-full object-cover" />
          ) : (
            <span className="grid h-9 w-9 place-items-center rounded-full bg-masjid-800 font-display text-lg font-bold text-white">M</span>
          )}
          <span className="font-display text-base font-semibold text-masjid-900 md:text-lg">Miftahul Khoir</span>
        </Link>

        <nav id="primary-navigation" aria-label="Navigasi utama" className={`${open ? "visible pointer-events-auto translate-y-0 opacity-100" : "invisible pointer-events-none -translate-y-2 opacity-0"} absolute inset-x-3 top-[calc(100%+8px)] max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-3xl border border-masjid-800/10 bg-white p-3 shadow-xl transition-all duration-300 lg:static lg:visible lg:pointer-events-auto lg:flex lg:max-h-none lg:translate-y-0 lg:items-center lg:gap-1 lg:overflow-visible lg:border-0 lg:bg-transparent lg:p-0 lg:opacity-100 lg:shadow-none`}>
          {navLinks.map((l) => (
            <Link key={l.label} href={l.href} onClick={() => setOpen(false)} className="flex min-h-[40px] items-center rounded-full px-4 text-sm font-medium text-masjid-800/80 transition-colors hover:bg-masjid-50 hover:text-masjid-900">
              {l.label}
            </Link>
          ))}
          <Link href="/donasi" onClick={() => setOpen(false)} className="mt-2 flex min-h-[40px] items-center justify-center gap-2 rounded-full bg-masjid-800 px-5 text-sm font-semibold text-white transition-colors hover:bg-masjid-900 lg:mt-0 lg:ml-2">
            <span className="text-gold-400">♥</span> Donasi
          </Link>
          <Link href="/admin/login" onClick={() => setOpen(false)} className="flex min-h-[40px] items-center rounded-full px-3 text-xs font-medium text-masjid-800/50 transition-colors hover:text-masjid-800 lg:ml-1">
            Admin
          </Link>
        </nav>

        <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="primary-navigation" aria-label={open ? "Tutup menu" : "Buka menu"} className="grid h-10 w-10 place-items-center rounded-full border border-masjid-800/20 text-masjid-800 transition-colors hover:border-masjid-800 lg:hidden">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
    </header>
  );
}
