"use client";

import { useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { friendlyError } from "@/lib/errors";
import type { HomepageSettings } from "@/types";

type Stat = { label: string; value: string };

const DEFAULT_STATS: Stat[] = [
  { label: "Ibadah", value: "Harian" },
  { label: "Kajian", value: "Rutin" },
  { label: "Sosial", value: "Aktif" },
  { label: "Donasi", value: "Terbuka" },
];

export default function AdminBerandaPage() {
  const [form, setForm] = useState({
    hero_title: "",
    hero_tagline: "",
    hero_description: "",
    profile_label: "Profil Singkat",
    profile_heading: "Masjid Miftahul Khoir",
    profile_description:
      "Masjid Miftahul Khoir merupakan pusat ibadah, pendidikan, dan kegiatan sosial masyarakat. Melalui website ini, jamaah dapat mengakses informasi kegiatan, galeri dokumentasi, berita, dan program donasi secara mudah.",
  });
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [profileStats, setProfileStats] = useState<Stat[]>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) { setLoading(false); return; }
    const sb = createClient();
    sb.from("homepage_settings").select("*").eq("id", "homepage").single().then(({ data }) => {
      const h = (data as HomepageSettings) ?? null;
      if (h) {
        setForm({
          hero_title: h.hero_title,
          hero_tagline: h.hero_tagline,
          hero_description: h.hero_description,
          profile_label: h.profile_label ?? "Profil Singkat",
          profile_heading: h.profile_heading ?? "Masjid Miftahul Khoir",
          profile_description: h.profile_description ?? form.profile_description,
        });
        setHeroImage(h.hero_image_url);
        setProfileImage(h.profile_image_url ?? null);
        setProfileStats(h.profile_stats && h.profile_stats.length ? h.profile_stats : DEFAULT_STATS);
      }
      setLoading(false);
    });
  }, []);

  const pick = (file: File | null, setFile: (f: File | null) => void, setPreview: (p: string | null) => void) => {
    setFile(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const save = async () => {
    if (!isSupabaseConfigured()) { alert("Supabase belum dikonfigurasi. Buka /admin/setup untuk panduan."); return; }
    setSaving(true);
    const sb = createClient();

    let hero_image_url = heroImage;
    if (heroFile) {
      const ext = heroFile.name.split(".").pop();
      const path = `homepage/hero-${Date.now()}.${ext}`;
      const { error: upErr } = await sb.storage.from("media").upload(path, heroFile, { upsert: true });
      if (upErr) { alert("Upload foto hero gagal: " + friendlyError(upErr.message)); setSaving(false); return; }
      const { data: pub } = sb.storage.from("media").getPublicUrl(path);
      hero_image_url = pub.publicUrl;
    }

    let profile_image_url = profileImage;
    if (profileFile) {
      const ext = profileFile.name.split(".").pop();
      const path = `homepage/profile-${Date.now()}.${ext}`;
      const { error: upErr } = await sb.storage.from("media").upload(path, profileFile, { upsert: true });
      if (upErr) { alert("Upload foto profil gagal: " + friendlyError(upErr.message)); setSaving(false); return; }
      const { data: pub } = sb.storage.from("media").getPublicUrl(path);
      profile_image_url = pub.publicUrl;
    }

    const { error } = await sb.from("homepage_settings").upsert({
      id: "homepage",
      hero_image_url,
      profile_image_url,
      hero_title: form.hero_title,
      hero_tagline: form.hero_tagline,
      hero_description: form.hero_description,
      profile_label: form.profile_label,
      profile_heading: form.profile_heading,
      profile_description: form.profile_description,
      profile_stats: profileStats,
      updated_at: new Date().toISOString(),
    });
    setSaving(false);
    if (error) { alert("Gagal menyimpan: " + friendlyError(error.message)); return; }
    setHeroImage(hero_image_url);
    setHeroFile(null);
    setHeroPreview(null);
    setProfileImage(profile_image_url);
    setProfileFile(null);
    setProfilePreview(null);
    alert("Beranda diperbarui.");
  };

  if (loading) return <p className="text-sm text-masjid-800/60">Memuat...</p>;

  const setStat = (i: number, key: keyof Stat, val: string) => {
    setProfileStats((prev) => prev.map((s, idx) => (idx === i ? { ...s, [key]: val } : s)));
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-masjid-900">Kelola Beranda</h1>
      <p className="mt-1 text-sm text-masjid-800/70">Atur foto hero, foto profil masjid, teks utama, dan bagian Profil Singkat.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="card">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-masjid-800/60">Preview Foto Hero</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroPreview || heroImage || "/placeholder.svg"} alt="Hero" className="mt-3 aspect-[16/9] w-full rounded-xl object-cover" />
            <input type="file" accept="image/*" onChange={(e) => pick(e.target.files?.[0] ?? null, setHeroFile, setHeroPreview)} className="mt-3 w-full text-sm" />
          </div>

          <div className="card">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-masjid-800/60">Foto Profil Masjid</p>
            <p className="mt-1 text-xs text-masjid-800/60">Dipakai sebagai logo di navbar dan foto pada bagian Profil. Disarankan gambar persegi (logo/foto masjid).</p>
            <div className="mt-3 flex items-start gap-4">
              <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-2xl border border-masjid-800/10 bg-masjid-50">
                {profilePreview || profileImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profilePreview || profileImage || undefined} alt="Foto profil" className="h-full w-full object-cover" />
                ) : (
                  <span className="font-display text-3xl font-bold text-masjid-800/40">M</span>
                )}
              </div>
              <input type="file" accept="image/*" onChange={(e) => pick(e.target.files?.[0] ?? null, setProfileFile, setProfilePreview)} className="w-full text-sm" />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="card space-y-3">
            <div>
              <label className="text-xs font-medium text-masjid-800/80">Judul Utama</label>
              <input value={form.hero_title} onChange={(e) => setForm((p) => ({ ...p, hero_title: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-masjid-800/20 px-4 py-2.5 text-sm outline-none focus:border-masjid-800" />
            </div>
            <div>
              <label className="text-xs font-medium text-masjid-800/80">Tagline</label>
              <input value={form.hero_tagline} onChange={(e) => setForm((p) => ({ ...p, hero_tagline: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-masjid-800/20 px-4 py-2.5 text-sm outline-none focus:border-masjid-800" />
            </div>
            <div>
              <label className="text-xs font-medium text-masjid-800/80">Deskripsi Singkat</label>
              <textarea value={form.hero_description} onChange={(e) => setForm((p) => ({ ...p, hero_description: e.target.value }))} rows={4} className="mt-1.5 w-full rounded-xl border border-masjid-800/20 px-4 py-2.5 text-sm outline-none focus:border-masjid-800" />
            </div>
            <button type="button" onClick={save} disabled={saving} className="btn-primary w-full disabled:opacity-60">{saving ? "Menyimpan..." : "Simpan Perubahan"}</button>
          </div>
        </div>
      </div>

      <div className="mt-6 card space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-masjid-800/60">Profil Singkat (bagian Profil di beranda)</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-masjid-800/80">Label Kecil (atas judul)</label>
            <input value={form.profile_label} onChange={(e) => setForm((p) => ({ ...p, profile_label: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-masjid-800/20 px-4 py-2.5 text-sm outline-none focus:border-masjid-800" />
          </div>
          <div>
            <label className="text-xs font-medium text-masjid-800/80">Judul Bagian</label>
            <input value={form.profile_heading} onChange={(e) => setForm((p) => ({ ...p, profile_heading: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-masjid-800/20 px-4 py-2.5 text-sm outline-none focus:border-masjid-800" />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-masjid-800/80">Deskripsi Profil</label>
          <textarea value={form.profile_description} onChange={(e) => setForm((p) => ({ ...p, profile_description: e.target.value }))} rows={4} className="mt-1.5 w-full rounded-xl border border-masjid-800/20 px-4 py-2.5 text-sm outline-none focus:border-masjid-800" />
        </div>
        <div>
          <p className="text-xs font-medium text-masjid-800/80">Kartu Statistik (4 kartu)</p>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {profileStats.map((s, i) => (
              <div key={i} className="flex gap-2">
                <input value={s.label} onChange={(e) => setStat(i, "label", e.target.value)} placeholder="Label" className="w-1/2 rounded-xl border border-masjid-800/20 px-3 py-2 text-sm outline-none focus:border-masjid-800" />
                <input value={s.value} onChange={(e) => setStat(i, "value", e.target.value)} placeholder="Nilai" className="w-1/2 rounded-xl border border-masjid-800/20 px-3 py-2 text-sm outline-none focus:border-masjid-800" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
