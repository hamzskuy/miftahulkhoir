"use client";

import { useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { friendlyError } from "@/lib/errors";
import type { HomepageSettings } from "@/types";

export default function AdminBerandaPage() {
  const [form, setForm] = useState({ hero_title: "", hero_tagline: "", hero_description: "" });
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) { setLoading(false); return; }
    const sb = createClient();
    sb.from("homepage_settings").select("*").eq("id", "homepage").single().then(({ data }) => {
      const h = (data as HomepageSettings) ?? null;
      if (h) {
        setForm({ hero_title: h.hero_title, hero_tagline: h.hero_tagline, hero_description: h.hero_description });
        setCurrentImage(h.hero_image_url);
      }
      setLoading(false);
    });
  }, []);

  const onFile = (f: File | null) => {
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f)); else setPreview(null);
  };

  const save = async () => {
    if (!isSupabaseConfigured()) { alert("Supabase belum dikonfigurasi. Buka /admin/setup untuk panduan."); return; }
    setSaving(true);
    const sb = createClient();
    let hero_image_url = currentImage;
    if (file) {
      const ext = file.name.split(".").pop();
      const path = `homepage/hero-${Date.now()}.${ext}`;
      const { error: upErr } = await sb.storage.from("media").upload(path, file, { upsert: true });
      if (upErr) { alert("Upload gagal: " + friendlyError(upErr.message)); setSaving(false); return; }
      const { data: pub } = sb.storage.from("media").getPublicUrl(path);
      hero_image_url = pub.publicUrl;
    }
    const { error } = await sb.from("homepage_settings").upsert({
      id: "homepage",
      hero_image_url,
      hero_title: form.hero_title,
      hero_tagline: form.hero_tagline,
      hero_description: form.hero_description,
      updated_at: new Date().toISOString(),
    });
    setSaving(false);
    if (error) { alert("Gagal menyimpan: " + friendlyError(error.message)); return; }
    setCurrentImage(hero_image_url);
    setFile(null);
    setPreview(null);
    alert("Beranda diperbarui.");
  };

  if (loading) return <p className="text-sm text-masjid-800/60">Memuat...</p>;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-masjid-900">Kelola Beranda</h1>
      <p className="mt-1 text-sm text-masjid-800/70">Atur foto hero dan teks utama halaman beranda.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="card">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-masjid-800/60">Preview Foto Hero</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview || currentImage || "/placeholder.svg"} alt="Hero" className="mt-3 aspect-[16/9] w-full rounded-xl object-cover" />
            <input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0] ?? null)} className="mt-3 w-full text-sm" />
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
    </div>
  );
}

