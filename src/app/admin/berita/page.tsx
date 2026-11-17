"use client";

import { useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { friendlyError } from "@/lib/errors";
import type { NewsPost, NewsCategory } from "@/types";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function AdminBeritaPage() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "form">("list");
  const [editing, setEditing] = useState<NewsPost | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "<p></p>",
    cover_url: "",
    category_id: "",
    status: "draft" as "draft" | "published",
    coverFile: null as File | null,
    coverPreview: "",
  });

  const load = async () => {
    setLoading(true);
    if (!isSupabaseConfigured()) { setLoading(false); return; }
    const sb = createClient();
    const [{ data: p }, { data: c }] = await Promise.all([
      sb.from("news").select("*, category:news_categories(*)").order("created_at", { ascending: false }),
      sb.from("news_categories").select("*").order("name"),
    ]);
    setPosts((p as NewsPost[]) ?? []);
    setCategories((c as NewsCategory[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const reset = () => {
    setForm({ title: "", slug: "", excerpt: "", content: "<p></p>", cover_url: "", category_id: "", status: "draft", coverFile: null, coverPreview: "" });
    setEditing(null);
    setView("list");
  };

  const startCreate = () => { reset(); setView("form"); };
  const startEdit = (p: NewsPost) => {
    setEditing(p);
    setForm({
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt ?? "",
      content: p.content || "<p></p>",
      cover_url: p.cover_url ?? "",
      category_id: p.category_id ?? "",
      status: p.status,
      coverFile: null,
      coverPreview: p.cover_url ?? "",
    });
    setView("form");
  };

  const onCoverFile = (f: File | null) => {
    setForm((p) => ({ ...p, coverFile: f }));
    if (f) setForm((p) => ({ ...p, coverPreview: URL.createObjectURL(f) }));
  };

  const save = async (publish?: boolean) => {
    if (!isSupabaseConfigured()) { alert("Supabase belum dikonfigurasi. Buka /admin/setup untuk panduan."); return; }
    if (!form.title.trim()) { alert("Judul wajib diisi."); return; }
    setSaving(true);
    const sb = createClient();
    const status = publish ? "published" : form.status;
    let cover_url = form.cover_url || null;
    if (form.coverFile) {
      const ext = form.coverFile.name.split(".").pop();
      const path = `news/${Date.now()}.${ext}`;
      const { error: upErr } = await sb.storage.from("media").upload(path, form.coverFile, { upsert: true });
      if (upErr) { alert("Upload gagal: " + friendlyError(upErr.message)); setSaving(false); return; }
      const { data: pub } = sb.storage.from("media").getPublicUrl(path);
      cover_url = pub.publicUrl;
    }
    const slug = form.slug.trim() || slugify(form.title);
    const payload: any = {
      title: form.title,
      slug,
      excerpt: form.excerpt || null,
      content: DOMPurify.sanitize(form.content),
      cover_url,
      category_id: form.category_id || null,
      status,
      published_at: status === "published" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    };
    const { error } = editing
      ? await sb.from("news").update(payload).eq("id", editing.id)
      : await sb.from("news").insert(payload);
    setSaving(false);
    if (error) { alert("Gagal menyimpan: " + friendlyError(error.message)); return; }
    reset();
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Hapus berita ini?")) return;
    if (!isSupabaseConfigured()) return;
    const sb = createClient();
    const { error } = await sb.from("news").delete().eq("id", id);
    if (error) alert(friendlyError(error.message)); else load();
  };

  const toggleStatus = async (p: NewsPost) => {
    if (!isSupabaseConfigured()) return;
    const sb = createClient();
    const next = p.status === "published" ? "draft" : "published";
    await sb.from("news").update({ status: next, published_at: next === "published" ? new Date().toISOString() : null, updated_at: new Date().toISOString() }).eq("id", p.id);
    load();
  };

  if (view === "form") {
    return (
      <div>
        <div className="flex items-center justify-between gap-3">
          <h1 className="font-display text-3xl font-semibold text-masjid-900">{editing ? "Edit Berita" : "Tambah Berita"}</h1>
          <button type="button" onClick={reset} className="btn-ghost"><X className="h-4 w-4" /> Batal</button>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-masjid-800/80">Judul Berita</label>
              <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value, slug: p.slug || slugify(e.target.value) }))} className="mt-1.5 w-full rounded-xl border border-masjid-800/20 px-4 py-2.5 text-sm outline-none focus:border-masjid-800" />
            </div>
            <div>
              <label className="text-xs font-medium text-masjid-800/80">Slug (URL)</label>
              <input value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-masjid-800/20 px-4 py-2.5 text-sm outline-none focus:border-masjid-800" />
            </div>
            <div>
              <label className="text-xs font-medium text-masjid-800/80">Ringkasan</label>
              <textarea value={form.excerpt} onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))} rows={2} className="mt-1.5 w-full rounded-xl border border-masjid-800/20 px-4 py-2.5 text-sm outline-none focus:border-masjid-800" />
            </div>
            <div>
              <label className="text-xs font-medium text-masjid-800/80">Isi Berita</label>
              <div className="mt-1.5">
                <RichTextEditor value={form.content} onChange={(html) => setForm((p) => ({ ...p, content: html }))} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="card">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-masjid-800/60">Foto Utama</p>
              {form.coverPreview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.coverPreview} alt="Cover" className="mt-3 h-40 w-full rounded-xl object-cover" />
              )}
              <input type="file" accept="image/*" onChange={(e) => onCoverFile(e.target.files?.[0] ?? null)} className="mt-3 w-full text-sm" />
            </div>
            <div className="card">
              <label className="text-xs font-medium text-masjid-800/80">Kategori</label>
              <select value={form.category_id} onChange={(e) => setForm((p) => ({ ...p, category_id: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-masjid-800/20 px-4 py-2.5 text-sm outline-none focus:border-masjid-800">
                <option value="">Tanpa kategori</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="card">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-masjid-800/60">Status</p>
              <div className="mt-2 flex gap-2">
                <button type="button" onClick={() => setForm((p) => ({ ...p, status: "draft" }))} className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium ${form.status === "draft" ? "bg-amber-100 text-amber-800" : "bg-masjid-50 text-masjid-800"}`}>Draft</button>
                <button type="button" onClick={() => setForm((p) => ({ ...p, status: "published" }))} className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium ${form.status === "published" ? "bg-green-100 text-green-800" : "bg-masjid-50 text-masjid-800"}`}>Publikasi</button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button type="button" onClick={() => save(false)} disabled={saving} className="btn-ghost disabled:opacity-60">{saving ? "Menyimpan..." : "Simpan Draft"}</button>
              <button type="button" onClick={() => save(true)} disabled={saving} className="btn-primary disabled:opacity-60">{saving ? "Menerbitkan..." : "Publikasikan"}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-masjid-900">Kelola Berita</h1>
          <p className="mt-1 text-sm text-masjid-800/70">Buat, edit, dan publikasikan berita.</p>
        </div>
        <button type="button" onClick={startCreate} className="btn-primary"><Plus className="h-4 w-4" /> Tambah Berita</button>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-masjid-800/60">Memuat...</p>
      ) : posts.length === 0 ? (
        <p className="mt-6 text-sm text-masjid-800/60">Belum ada berita.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-masjid-800/10 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-masjid-50 text-left text-xs uppercase tracking-wider text-masjid-800/60">
              <tr>
                <th className="px-4 py-3">Judul</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-t border-masjid-800/10">
                  <td className="px-4 py-3 font-medium text-masjid-900">{p.title}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${p.status === "published" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3 text-masjid-800/60">{p.published_at ? new Date(p.published_at).toLocaleDateString("id-ID") : "-"}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <button type="button" onClick={() => startEdit(p)} className="rounded-lg border border-masjid-800/20 px-3 py-1.5 text-xs font-medium text-masjid-800 hover:bg-masjid-50">Edit</button>
                      <button type="button" onClick={() => toggleStatus(p)} className="rounded-lg border border-masjid-800/20 px-3 py-1.5 text-xs font-medium text-masjid-800 hover:bg-masjid-50">{p.status === "published" ? "Jadikan Draft" : "Publikasikan"}</button>
                      <button type="button" onClick={() => remove(p.id)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

