import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

const BUCKET = process.env.NEXT_PUBLIC_STORAGE_BUCKET || "media";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const status = {
    urlSet: Boolean(url),
    anonSet: Boolean(anon),
    connected: false,
    authSession: false,
    authEmail: null as string | null,
    profileRole: null as string | null,
    bucketExists: false,
    bucketWritable: false,
    bucketPublicRead: false,
    tables: [] as string[],
    storagePolicies: [] as string[],
    error: null as string | null,
  };

  if (!url || !anon) {
    status.error = "NEXT_PUBLIC_SUPABASE_URL atau NEXT_PUBLIC_SUPABASE_ANON_KEY belum diisi di .env.local.";
    return NextResponse.json(status);
  }

  try {
    const sb = createServerSupabase();

    // Sesi Supabase (di-set saat login admin)
    const { data: userData } = await sb.auth.getUser();
    status.authSession = !!userData?.user;
    status.authEmail = userData?.user?.email ?? null;

    if (userData?.user) {
      const { data: prof } = await sb.from("profiles").select("role").eq("id", userData.user.id).maybeSingle();
      status.profileRole = prof?.role ?? null;
    }

    // Koneksi + tabel
    const { error } = await sb.from("homepage_settings").select("*").limit(1);
    if (error) {
      status.error = `Koneksi gagal: ${error.message}. Pastikan migration sudah dijalankan.`;
      return NextResponse.json(status);
    }
    status.connected = true;

    for (const t of ["homepage_settings", "gallery", "news", "schedules", "donation_programs", "news_categories", "profiles"]) {
      const { error: e } = await sb.from(t).select("id").limit(1);
      status.tables.push(e ? `${t}: ${e.message}` : `${t}: ok`);
    }

    // Bucket diuji dengan upload file kecil (listBuckets dibatasi RLS sehingga tidak akurat)
    if (!status.authSession) {
      status.tables.push(
        `storage bucket '${BUCKET}': belum bisa diuji (login ulang di /admin/login agar sesi Supabase aktif)`,
      );
      status.storagePolicies = ["Login ulang sebagai admin, lalu klik Uji Ulang untuk memeriksa bucket & policy storage."];
      return NextResponse.json(status);
    }

    const probePath = `_probe/${Date.now()}.txt`;
    const { error: upErr } = await sb.storage
      .from(BUCKET)
      .upload(probePath, new Blob(["ok"], { type: "text/plain" }), { contentType: "text/plain", upsert: true });

    if (upErr) {
      const msg = upErr.message || "";
      if (/not found/i.test(msg)) {
        status.bucketExists = false;
        status.tables.push(`storage bucket '${BUCKET}': TIDAK DITEMUKAN (Storage → New bucket → '${BUCKET}' → Public)`);
      } else if (/row-level security|permission|not authorized|403/i.test(msg)) {
        status.bucketExists = true;
        status.bucketWritable = false;
        status.tables.push(`storage bucket '${BUCKET}': ada, tapi upload ditolak (policy storage belum lengkap)`);
      } else {
        status.tables.push(`storage bucket '${BUCKET}': ${msg}`);
      }
    } else {
      status.bucketExists = true;
      status.bucketWritable = true;

      const { data: pub } = sb.storage.from(BUCKET).getPublicUrl(probePath);
      try {
        const r = await fetch(pub.publicUrl, { cache: "no-store" });
        status.bucketPublicRead = r.ok;
      } catch {
        status.bucketPublicRead = false;
      }
      await sb.storage.from(BUCKET).remove([probePath]);
      status.tables.push(`storage bucket '${BUCKET}': ok (upload berhasil, baca publik: ${status.bucketPublicRead ? "ok" : "GAGAL"})`);
    }

    if (status.bucketWritable && status.bucketPublicRead) {
      status.storagePolicies = ["Storage siap dipakai: upload admin dan baca publik berfungsi."];
    } else {
      status.storagePolicies = [
        "Pastikan bucket 'media' berstatus Public (Storage → bucket → Settings → Public bucket).",
        "Jalankan ulang bagian storage policy di supabase/migrations/0001_init.sql bila upload ditolak.",
      ];
    }

    return NextResponse.json(status);
  } catch (err) {
    status.error = `Error: ${String(err)}`;
    return NextResponse.json(status);
  }
}
