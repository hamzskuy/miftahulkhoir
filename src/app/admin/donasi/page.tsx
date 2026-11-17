"use client";

import { useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { friendlyError } from "@/lib/errors";
import type { DonationProgram } from "@/types";
import { Plus, Pencil, Trash2, X } from "lucide-react";

export default function AdminDonasiPage() {
  const [items, setItems] = useState<DonationProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<DonationProgram | null>(null);
  const [form, setForm] = useState({
    title: "", description: "", category: "Infaq", image_url: "", bank_name: "", account_number: "", account_holder: "", qris_url: "", whatsapp: "", is_active: true,
    imageFile: null as File | null, imagePreview: "",
    qrisFile: null as File | null, qrisPreview: "",
  });

  const load = async () => {
    setLoading(true);
    if (!isSupabaseConfigured()) { setLoading(false); return; }
    const sb = createClient();
    const { data } = await sb.from("donation_programs").select("*").order("created_at", { ascending: false });
    setItems((data as DonationProgram[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const reset = () => {
    setForm({ title: "", description: "", category: "Infaq", image_url: "", bank_name: "", account_number: "", account_holder: "", qris_url: "", whatsapp: "", is_active: true, imageFile: null, imagePreview: "", qrisFile: null, qrisPreview: "" });
    setEditing(null);
    setShowForm(false);
  };

  const onImage = (f: File | null) => { setForm((p) => ({ ...p, imageFile: f, imagePreview: f ? URL.createObjectURL(f) : p.imagePreview })); };
  const onQris = (f: File | null) => { setForm((p) => ({ ...p, qrisFile: f, qrisPreview: f ? URL.createObjectURL(f) : p.qrisPreview })); };

  const upload = async (sb: any, file: File, folder: string) => {
    const ext = file.name.split(".").pop();
    const path = `${folder}/${Date.now()}.${ext}`;
    const { error } = await sb.storage.from("media").upload(path, file, { upsert: true });
    if (error) throw error;
    return sb.storage.from("media").getPublicUrl(path).data.publicUrl;
  };

  const save = async () => {
    if (!isSupabaseConfigured()) { alert("Supabase belum dikonfigurasi. Buka /admin/setup untuk panduan."); return; }
    if (!form.title.trim()) { alert("Judul wajib."); return; }
    const sb = createClient();
    let image_url = form.image_url || null;
    let qris_url = form.qris_url || null;
    try {
      if (form.imageFile) image_url = await upload(sb, form.imageFile, "donations");
      if (form.qrisFile) qris_url = await upload(sb, form.qrisFile, "qris");
    } catch (e: any) { alert("Upload gagal: " + friendlyError(e?.message ?? String(e))); return; }
    const payload = {
      title: form.title,
      description: form.description || null,
      category: form.category,
      image_url,
      bank_name: form.bank_name || null,
      account_number: form.account_number || null,
      account_holder: form.account_holder || null,
      qris_url,
      whatsapp: form.whatsapp || null,
      is_active: form.is_active,
    };
    const { error } = editing
      ? await sb.from("donation_programs").update(payload).eq("id", editing.id)
      : await sb.from("donation_programs").insert(payload);
    if (error) { alert("Gagal menyimpan: " + friendlyError(error.message)); return; }
    reset(); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Hapus program donasi ini?")) return;
    if (!isSupabaseConfigured()) return;
    const sb = createClient();
    const { error } = await sb.from("donation_programs").delete().eq("id", id);
    if (error) alert(friendlyError(error.message)); else load();
  };

  const startEdit = (d: DonationProgram) => {
    setEditing(d);
    setForm({
      title: d.title, description: d.description ?? "", category: d.category, image_url: d.image_url ?? "",
      bank_name: d.bank_name ?? "", account_number: d.account_number ?? "", account_holder: d.account_holder ?? "",
      qris_url: d.qris_url ?? "", whatsapp: d.whatsapp ?? "", is_active: d.is_active,
      imageFile: null, imagePreview: d.image_url ?? "",
      qrisFile: null, qrisPreview: d.qris_url ?? "",
    });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-masjid-900">Kelola Donasi</h1>
          <p className="mt-1 text-sm text-masjid-800/70">Kelola program donasi, rekening, dan QRIS.</p>
        </div>
        <button type="button" onClick={() => { reset(); setShowForm(true); }} className="btn-primary"><Plus className="h-4 w-4" /> Tambah Program</button>
      </div>

      {showForm && (
        <div className="mt-6 rounded-2xl border border-masjid-800/10 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-masjid-900">{editing ? "Edit Program" : "Tambah Program"}</h2>
            <button type="button" onClick={reset} className="grid h-8 w-8 place-items-center rounded-full hover:bg-masjid-50"><X className="h-4 w-4" /></button>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-masjid-800/80">Judul Program</label>
              <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-masjid-800/20 px-4 py-2.5 text-sm outline-none focus:border-masjid-800" />
            </div>
            <div>
              <label className="text-xs font-medium text-masjid-800/80">Kategori</label>
              <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-masjid-800/20 px-4 py-2.5 text-sm outline-none focus:border-masjid-800">
                {["Infaq", "Sedekah", "Wakaf", "Sosial"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-masjid-800/80">Status Aktif</label>
              <select value={form.is_active ? "1" : "0"} onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.value === "1" }))} className="mt-1.5 w-full rounded-xl border border-masjid-800/20 px-4 py-2.5 text-sm outline-none focus:border-masjid-800">
                <option value="1">Aktif</option>
                <option value="0">Nonaktif</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-masjid-800/80">Deskripsi</label>
              <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} className="mt-1.5 w-full rounded-xl border border-masjid-800/20 px-4 py-2.5 text-sm outline-none focus:border-masjid-800" />
            </div>
            <div>
              <label className="text-xs font-medium text-masjid-800/80">Nama Bank</label>
              <input value={form.bank_name} onChange={(e) => setForm((p) => ({ ...p, bank_name: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-masjid-800/20 px-4 py-2.5 text-sm outline-none focus:border-masjid-800" />
            </div>
            <div>
              <label className="text-xs font-medium text-masjid-800/80">Nomor Rekening</label>
              <input value={form.account_number} onChange={(e) => setForm((p) => ({ ...p, account_number: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-masjid-800/20 px-4 py-2.5 text-sm outline-none focus:border-masjid-800" />
            </div>
            <div>
              <label className="text-xs font-medium text-masjid-800/80">Atas Nama</label>
              <input value={form.account_holder} onChange={(e) => setForm((p) => ({ ...p, account_holder: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-masjid-800/20 px-4 py-2.5 text-sm outline-none focus:border-masjid-800" />
            </div>
            <div>
              <label className="text-xs font-medium text-masjid-800/80">WhatsApp Konfirmasi</label>
              <input value={form.whatsapp} onChange={(e) => setForm((p) => ({ ...p, whatsapp: e.target.value }))} placeholder="628..." className="mt-1.5 w-full rounded-xl border border-masjid-800/20 px-4 py-2.5 text-sm outline-none focus:border-masjid-800" />
            </div>
            <div>
              <label className="text-xs font-medium text-masjid-800/80">Gambar Program</label>
              {form.imagePreview && <img src={form.imagePreview} alt="Preview" className="mt-2 h-24 rounded-lg object-cover" />}
              <input type="file" accept="image/*" onChange={(e) => onImage(e.target.files?.[0] ?? null)} className="mt-1.5 w-full text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-masjid-800/80">Gambar QRIS</label>
              {form.qrisPreview && <img src={form.qrisPreview} alt="QRIS" className="mt-2 h-24 rounded-lg object-cover" />}
              <input type="file" accept="image/*" onChange={(e) => onQris(e.target.files?.[0] ?? null)} className="mt-1.5 w-full text-sm" />
            </div>
          </div>
          <div className="mt-5 flex gap-2">
            <button type="button" onClick={save} className="btn-primary">Simpan</button>
            <button type="button" onClick={reset} className="btn-ghost">Batal</button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="mt-6 text-sm text-masjid-800/60">Memuat...</p>
      ) : items.length === 0 ? (
        <p className="mt-6 text-sm text-masjid-800/60">Belum ada program donasi.</p>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {items.map((d) => (
            <div key={d.id} className="card">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-lg font-semibold text-masjid-900">{d.title}</h3>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${d.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{d.is_active ? "Aktif" : "Nonaktif"}</span>
              </div>
              <p className="mt-1 text-xs text-masjid-800/60">{d.category}</p>
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={() => startEdit(d)} className="rounded-lg border border-masjid-800/20 px-3 py-1.5 text-xs font-medium text-masjid-800 hover:bg-masjid-50">Edit</button>
                <button type="button" onClick={() => remove(d.id)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">Hapus</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

