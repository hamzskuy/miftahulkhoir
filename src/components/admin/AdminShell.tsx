"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Menu, X, LogOut, Globe } from "@/utils/icons";

const menu = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Galeri", href: "/admin/galeri" },
  { label: "Berita", href: "/admin/berita" },
  { label: "Jadwal", href: "/admin/jadwal" },
  { label: "Beranda", href: "/admin/beranda" },
  { label: "Donasi", href: "/admin/donasi" },
  { label: "Setup", href: "/admin/setup" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [supabaseOk, setSupabaseOk] = useState<boolean | null>(null);

  useEffect(() => {
    if (isLogin) { setChecked(true); return; }
    setChecked(true);
    if (!isSupabaseConfigured()) { setSupabaseOk(false); return; }
    const sb = createClient();
    sb.auth.getUser().then(({ data }) => {
      setSupabaseOk(!!data.user);
    });
  }, [isLogin]);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  if (isLogin) return <>{children}</>;
  if (!checked) return <div className="flex min-h-screen items-center justify-center text-masjid-800">Memuat...</div>;

  return (
    <div className="flex min-h-screen bg-masjid-50">
      {/* Sidebar desktop */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-masjid-800/10 bg-white lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-masjid-800/10 px-5">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-masjid-800 font-display text-sm font-bold text-white">M</span>
          <span className="font-display text-lg font-semibold text-masjid-900">Admin CMS</span>
        </div>
        <nav className="p-3 space-y-1">
          {menu.map((m) => (
            <Link key={m.href} href={m.href} className={`flex min-h-[40px] items-center rounded-xl px-3 text-sm font-medium transition-colors ${pathname === m.href ? "bg-masjid-800 text-white" : "text-masjid-800 hover:bg-masjid-50"}`}>
              {m.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto space-y-1 border-t border-masjid-800/10 p-3">
          <Link href="/" className="flex w-full min-h-[40px] items-center gap-2 rounded-xl px-3 text-sm font-medium text-masjid-800 hover:bg-masjid-50">
            <Globe className="h-4 w-4" /> Lihat Situs
          </Link>
          <button type="button" onClick={logout} className="flex w-full min-h-[40px] items-center gap-2 rounded-xl px-3 text-sm font-medium text-masjid-800 hover:bg-red-50 hover:text-red-700">
            <LogOut className="h-4 w-4" /> Keluar
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`}>
        <div className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} onClick={() => setOpen(false)} />
        <aside className={`absolute left-0 top-0 h-full w-72 bg-white shadow-xl transition-transform ${open ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex h-16 items-center justify-between border-b border-masjid-800/10 px-5">
            <span className="font-display text-lg font-semibold text-masjid-900">Admin CMS</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Tutup" className="grid h-9 w-9 place-items-center rounded-full hover:bg-masjid-50">
              <X className="h-4 w-4" />
            </button>
          </div>
          <nav className="p-3 space-y-1">
            {menu.map((m) => (
              <Link key={m.href} href={m.href} onClick={() => setOpen(false)} className={`flex min-h-[40px] items-center rounded-xl px-3 text-sm font-medium transition-colors ${pathname === m.href ? "bg-masjid-800 text-white" : "text-masjid-800 hover:bg-masjid-50"}`}>
                {m.label}
              </Link>
            ))}
          </nav>
          <div className="space-y-1 border-t border-masjid-800/10 p-3">
            <Link href="/" onClick={() => setOpen(false)} className="flex w-full min-h-[40px] items-center gap-2 rounded-xl px-3 text-sm font-medium text-masjid-800 hover:bg-masjid-50">
              <Globe className="h-4 w-4" /> Lihat Situs
            </Link>
            <button type="button" onClick={logout} className="flex w-full min-h-[40px] items-center gap-2 rounded-xl px-3 text-sm font-medium text-masjid-800 hover:bg-red-50 hover:text-red-700">
              <LogOut className="h-4 w-4" /> Keluar
            </button>
          </div>
        </aside>
      </div>

      <div className="flex-1 min-w-0">
        <header className="flex h-16 items-center gap-3 border-b border-masjid-800/10 bg-white px-5">
          <button type="button" onClick={() => setOpen(true)} aria-label="Buka menu" className="grid h-9 w-9 place-items-center rounded-full hover:bg-masjid-50 lg:hidden">
            <Menu className="h-5 w-5 text-masjid-800" />
          </button>
          <p className="font-display text-lg font-semibold text-masjid-900">Dashboard</p>
          <div className="ml-auto flex items-center gap-3">
            <Link href="/" title="Kembali ke halaman utama" className="flex min-h-[40px] items-center gap-2 rounded-full border border-masjid-800/15 px-3 text-sm font-semibold text-masjid-800 transition-colors hover:bg-masjid-50">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Lihat Situs</span>
            </Link>
            <div className="hidden text-xs text-masjid-800/60 md:block">miftahulkhoir123</div>
          </div>
        </header>
        <div className="p-5 md:p-8">
          {supabaseOk === false && (
            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <p className="font-semibold">CMS belum terhubung ke Supabase.</p>
              <p className="mt-1">
                Data tidak dapat disimpan. Pastikan akun <code className="rounded bg-amber-100 px-1.5 py-0.5">admin@miftahulkhoir.id</code> dibuat di Supabase Auth (password: <code className="rounded bg-amber-100 px-1.5 py-0.5">123456</code>) dan migration dijalankan. Lihat <a href="/admin/setup" className="font-semibold underline">/admin/setup</a>.
              </p>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
