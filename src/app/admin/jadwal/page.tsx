"use client";

import { useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { friendlyError } from "@/lib/errors";
import type { Schedule } from "@/types";
import { Plus, Pencil, Trash2, X } from "lucide-react";

export default function AdminJadwalPage() {
  const [items, setItems] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Schedule | null>(null);
  const [form, setForm] = useState({ title: "", description: "", location: "", start_at: "", end_at: "", status: "upcoming" as Schedule["status"] });

  const load = async () => {
    setLoading(true);
    if (!isSupabaseConfigured()) { setLoading(false); return; }
    const sb = createClient();
    const { data } = await sb.from("schedules").select("*").order("start_at", { ascending: true });
    setItems((data as Schedule[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const reset = () => { setForm({ title: "", description: "", location: "", start_at: "", end_at: "", status: "upcoming" }); setEditing(null); setShowForm(false); };

  const save = async () => {
    if (!isSupabaseConfigured()) { alert("Supabase belum dikonfigurasi. Buka /admin/setup untuk panduan."); return; }
    if (!form.title.trim() || !form.start_at) { alert("Judul dan waktu mulai wajib."); return; }
    const sb = createClient();
    const payload = {
      title: form.title,
      description: form.description || null,
      location: form.location || null,
      start_at: new Date(form.start_at).toISOString(),
      end_at: form.end_at ? new Date(form.end_at).toISOString() : null,
      status: form.status,
    };
    const { error } = editing
      ? await sb.from("schedules").update(payload).eq("id", editing.id)
      : await sb.from("schedules").insert(payload);
    if (error) alert(friendlyError(error.message)); else { reset(); load(); }
  };

  const remove = async (id: string) => {
    if (!confirm("Hapus jadwal ini?")) return;
    if (!isSupabaseConfigured()) return;
    const sb = createClient();
    const { error } = await sb.from("schedules").delete().eq("id", id);
    if (error) alert(friendlyError(error.message)); else load();
  };

  const startEdit = (s: Schedule) => {
    setEditing(s);
    setForm({
      title: s.title,
      description: s.description ?? "",
      location: s.location ?? "",
      start_at: s.start_at.slice(0, 16),
      end_at: s.end_at ? s.end_at.slice(0, 16) : "",
      status: s.status,
    });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-masjid-900">Kelola Jadwal</h1>
          <p className="mt-1 text-sm text-masjid-800/70">Tambah, ubah, hapus jadwal kegiatan.</p>
        </div>
        <button type="button" onClick={() => { reset(); setShowForm(true); }} className="btn-primary"><Plus className="h-4 w-4" /> Tambah Jadwal</button>
      </div>

      {showForm && (
        <div className="mt-6 rounded-2xl border border-masjid-800/10 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-masjid-900">{editing ? "Edit Jadwal" : "Tambah Jadwal"}</h2>
            <button type="button" onClick={reset} className="grid h-8 w-8 place-items-center rounded-full hover:bg-masjid-50"><X className="h-4 w-4" /></button>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-masjid-800/80">Nama Kegiatan</label>
              <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-masjid-800/20 px-4 py-2.5 text-sm outline-none focus:border-masjid-800" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-masjid-800/80">Deskripsi</label>
              <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={2} className="mt-1.5 w-full rounded-xl border border-masjid-800/20 px-4 py-2.5 text-sm outline-none focus:border-masjid-800" />
            </div>
            <div>
              <label className="text-xs font-medium text-masjid-800/80">Lokasi</label>
              <input value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-masjid-800/20 px-4 py-2.5 text-sm outline-none focus:border-masjid-800" />
            </div>
            <div>
              <label className="text-xs font-medium text-masjid-800/80">Status</label>
              <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as Schedule["status"] }))} className="mt-1.5 w-full rounded-xl border border-masjid-800/20 px-4 py-2.5 text-sm outline-none focus:border-masjid-800">
                <option value="upcoming">Mendatang</option>
                <option value="past">Selesai</option>
                <option value="cancelled">Dibatalkan</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-masjid-800/80">Waktu Mulai</label>
              <input type="datetime-local" value={form.start_at} onChange={(e) => setForm((p) => ({ ...p, start_at: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-masjid-800/20 px-4 py-2.5 text-sm outline-none focus:border-masjid-800" />
            </div>
            <div>
              <label className="text-xs font-medium text-masjid-800/80">Waktu Selesai</label>
              <input type="datetime-local" value={form.end_at} onChange={(e) => setForm((p) => ({ ...p, end_at: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-masjid-800/20 px-4 py-2.5 text-sm outline-none focus:border-masjid-800" />
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
        <p className="mt-6 text-sm text-masjid-800/60">Belum ada jadwal.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((s) => (
            <div key={s.id} className="flex flex-col gap-3 rounded-2xl border border-masjid-800/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-masjid-900">{s.title}</p>
                <p className="text-xs text-masjid-800/60">{new Date(s.start_at).toLocaleString("id-ID")} {s.location ? "• " + s.location : ""}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => startEdit(s)} className="rounded-lg border border-masjid-800/20 px-3 py-1.5 text-xs font-medium text-masjid-800 hover:bg-masjid-50">Edit</button>
                <button type="button" onClick={() => remove(s.id)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">Hapus</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

