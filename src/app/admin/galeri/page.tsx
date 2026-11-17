"use client";

import { useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { friendlyError } from "@/lib/errors";
import type { GalleryItem } from "@/types";
import { Plus, Trash2, Pencil, X } from "lucide-react";

const CATEGORIES = ["Ibadah", "Kajian", "Sosial", "Pembangunan", "Umum"];

export default function AdminGaleriPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [form, setForm] = useState({ title: "", description: "", category: "Umum", taken_at: "", file: null as File | null });
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    if (!isSupabaseConfigured()) { setLoading(false); return; }
    const sb = createClient();
    const { data } = await sb.from("gallery").select("*").order("taken_at", { ascending: false });
    setItems((data as GalleryItem[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const reset = () => {
    setForm({ title: "", description: "", category: "Umum", taken_at: "", file: null });
    setPreview(null);
    setEditing(null);
    setShowForm(false);
  };

  const onFile = (f: File | null) => {
    setForm((p) => ({ ...p, file: f }));
    if (f) setPreview(URL.createObjectURL(f));
    else setPreview(null);
  };

  const save = async () => {
    if (!isSupabaseConfigured()) { alert("Supabase belum dikonfigurasi. Buka /admin/setup untuk panduan."); return; }
    if (!form.title.trim()) { alert("Judul wajib diisi."); return; }
    setSaving(true);
    const sb = createClient();
    let image_url = editing?.image_url ?? "";
    if (form.file) {
      const ext = form.file.name.split(".").pop();
      const path = `gallery/${Date.now()}.${ext}`;
      const { error: upErr } = await sb.storage.from("media").upload(path, form.file, { upsert: true });
      if (upErr) { alert("Upload gagal: " + friendlyError(upErr.message)); setSaving(false); return; }
      const { data: pub } = sb.storage.from("media").getPublicUrl(path);
      image_url = pub.publicUrl;
    }
    if (!image_url) { alert("Foto wajib diupload."); setSaving(false); return; }

    const payload = {
      title: form.title,
      description: form.description || null,
      category: form.category,
      image_url,
      taken_at: form.taken_at ? new Date(form.taken_at).toISOString() : null,
    };
    const { error } = editing
      ? await sb.from("gallery").update(payload).eq("id", editing.id)
      : await sb.from("gallery").insert(payload);
    setSaving(false);
    if (error) { alert("Gagal menyimpan: " + friendlyError(error.message)); return; }
    reset();
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Hapus foto ini?")) return;
    if (!isSupabaseConfigured()) return;
    const sb = createClient();
    const { error } = await sb.from("gallery").delete().eq("id", id);
    if (error) alert(friendlyError(error.message));
    else load();
  };

  const startEdit = (g: GalleryItem) => {
    setEditing(g);
    setForm({ title: g.title, description: g.description ?? "", category: g.category, taken_at: g.taken_at ? g.taken_at.slice(0, 10) : "", file: null });
    setPreview(g.image_url);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-masjid-900">Kelola Galeri</h1>
          <p className="mt-1 text-sm text-masjid-800/70">Tambah, edit, dan hapus foto dokumentasi.</p>
        </div>
        <button type="button" onClick={() => { reset(); setShowForm(true); }} className="btn-primary">
          <Plus className="h-4 w-4" /> Tambah Foto
        </button>
      </div>

      {showForm && (
        <div className="mt-6 rounded-2xl border border-masjid-800/10 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-masjid-900">{editing ? "Edit Foto" : "Tambah Foto"}</h2>
            <button type="button" onClick={reset} aria-label="Tutup" className="grid h-8 w-8 place-items-center rounded-full hover:bg-masjid-50"><X className="h-4 w-4" /></button>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-masjid-800/80">Judul</label>
              <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-masjid-800/20 px-4 py-2.5 text-sm outline-none focus:border-masjid-800" />
            </div>
            <div>
              <label className="text-xs font-medium text-masjid-800/80">Kategori</label>
              <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-masjid-800/20 px-4 py-2.5 text-sm outline-none focus:border-masjid-800">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-masjid-800/80">Tanggal Dokumentasi</label>
              <input type="date" value={form.taken_at} onChange={(e) => setForm((p) => ({ ...p, taken_at: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-masjid-800/20 px-4 py-2.5 text-sm outline-none focus:border-masjid-800" />
            </div>
            <div>
              <label className="text-xs font-medium text-masjid-800/80">Foto</label>
              <input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0] ?? null)} className="mt-1.5 w-full text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-masjid-800/80">Deskripsi</label>
              <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} className="mt-1.5 w-full rounded-xl border border-masjid-800/20 px-4 py-2.5 text-sm outline-none focus:border-masjid-800" />
            </div>
          </div>
          {preview && (
            <div className="mt-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Preview" className="h-40 rounded-xl border border-masjid-800/10 object-cover" />
            </div>
          )}
          <div className="mt-5 flex gap-2">
            <button type="button" onClick={save} disabled={saving} className="btn-primary disabled:opacity-60">{saving ? "Menyimpan..." : "Simpan"}</button>
            <button type="button" onClick={reset} className="btn-ghost">Batal</button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="mt-6 text-sm text-masjid-800/60">Memuat...</p>
      ) : items.length === 0 ? (
        <p className="mt-6 text-sm text-masjid-800/60">Belum ada foto. Klik &quot;Tambah Foto&quot;.</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((g) => (
            <div key={g.id} className="overflow-hidden rounded-2xl border border-masjid-800/10 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.image_url} alt={g.title} className="aspect-[4/3] w-full object-cover" />
              <div className="p-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-masjid-700">{g.category}</p>
                <p className="mt-1 font-medium text-masjid-900">{g.title}</p>
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={() => startEdit(g)} className="inline-flex items-center gap-1 rounded-lg border border-masjid-800/20 px-3 py-1.5 text-xs font-medium text-masjid-800 hover:bg-masjid-50">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button type="button" onClick={() => remove(g.id)} className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">
                    <Trash2 className="h-3.5 w-3.5" /> Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

