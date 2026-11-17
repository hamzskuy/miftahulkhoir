"use client";

import { useEffect, useState } from "react";

type Status = {
  urlSet: boolean;
  anonSet: boolean;
  connected: boolean;
  authSession: boolean;
  authEmail: string | null;
  profileRole: string | null;
  bucketExists: boolean;
  bucketWritable: boolean;
  bucketPublicRead: boolean;
  tables: string[];
  storagePolicies: string[];
  error: string | null;
};

export default function SetupPage() {
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);

  const check = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/setup-check");
      const data = await res.json();
      setStatus(data);
    } catch (e) {
      setStatus({ urlSet: false, anonSet: false, connected: false, authSession: false, authEmail: null, profileRole: null, bucketExists: false, bucketWritable: false, bucketPublicRead: false, tables: [], storagePolicies: [], error: String(e) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { check(); }, []);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-3xl font-semibold text-masjid-900">Setup Supabase</h1>
      <p className="mt-1 text-sm text-masjid-800/70">Diagnosis koneksi CMS ke Supabase.</p>

      <div className="mt-6 rounded-2xl border border-masjid-800/10 bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-masjid-900">Status Environment Variable</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${status?.urlSet ? "bg-green-500" : "bg-red-500"}`} />
            NEXT_PUBLIC_SUPABASE_URL: {status?.urlSet ? "terisi" : "BELUM diisi"}
          </li>
          <li className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${status?.anonSet ? "bg-green-500" : "bg-red-500"}`} />
            NEXT_PUBLIC_SUPABASE_ANON_KEY: {status?.anonSet ? "terisi" : "BELUM diisi"}
          </li>
        </ul>

        <h2 className="mt-6 font-display text-lg font-semibold text-masjid-900">Status Koneksi</h2>
        {loading ? (
          <p className="mt-2 text-sm text-masjid-800/60">Menguji koneksi...</p>
        ) : status?.connected ? (
          <p className="mt-2 text-sm text-green-700">✓ Terhubung ke Supabase.</p>
        ) : (
          <p className="mt-2 text-sm text-red-600">{status?.error}</p>
        )}

        {status?.tables && status.tables.length > 0 && (
          <ul className="mt-3 space-y-1 text-xs text-masjid-800/70">
            {status.tables.map((t) => <li key={t}>• {t}</li>)}
          </ul>
        )}

        <h2 className="mt-6 font-display text-lg font-semibold text-masjid-900">Status Autentikasi Supabase</h2>
        {loading ? (
          <p className="mt-2 text-sm text-masjid-800/60">Memeriksa...</p>
        ) : status?.authSession ? (
          <div className="mt-2 space-y-1 text-sm">
            <p className="text-green-700">✓ Login Supabase aktif ({status.authEmail}).</p>
            {status.profileRole === "admin" ? (
              <p className="text-green-700">✓ Profil admin terdaftar (role: admin).</p>
            ) : (
              <p className="text-amber-700">
                ⚠ Profil admin belum terdaftar (role: {status.profileRole ?? "tidak ada"}). Jalankan insert profil di bawah.
              </p>
            )}
          </div>
        ) : (
          <p className="mt-2 text-sm text-red-600">
            ✗ Belum login ke Supabase Auth. Login ulang di <a href="/admin/login" className="font-semibold underline">/admin/login</a> agar sesi Supabase dibuat.
          </p>
        )}

        <h2 className="mt-6 font-display text-lg font-semibold text-masjid-900">Status Storage Bucket</h2>
        {loading ? (
          <p className="mt-2 text-sm text-masjid-800/60">Memeriksa...</p>
        ) : status?.bucketWritable && status.bucketPublicRead ? (
          <p className="mt-2 text-sm text-green-700">✓ Bucket &apos;media&apos; siap: upload &amp; baca publik berfungsi.</p>
        ) : !status?.bucketExists ? (
          <p className="mt-2 text-sm text-red-600">✗ Bucket &apos;media&apos; tidak ditemukan. Buat di Storage → New bucket → nama &apos;media&apos; → Public.</p>
        ) : (
          <p className="mt-2 text-sm text-amber-700">
            ⚠ Bucket &apos;media&apos; ada, tetapi {status?.bucketWritable ? "baca publik" : "upload admin"} belum berfungsi. Cek status Public dan policy storage.
          </p>
        )}

        {status?.storagePolicies && status.storagePolicies.length > 0 && (
          <ul className="mt-2 space-y-1 text-xs text-masjid-800/70">
            {status.storagePolicies.map((t) => <li key={t}>• {t}</li>)}
          </ul>
        )}

        <button type="button" onClick={check} className="btn-primary mt-5">Uji Ulang</button>
      </div>

      <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
        <h2 className="font-display text-lg font-semibold">Cara mendapatkan kredensial Supabase</h2>
        <ol className="mt-3 list-decimal space-y-1 pl-5">
          <li>Buka https://supabase.com/dashboard dan login.</li>
          <li>Pilih project Anda (atau buat baru).</li>
          <li>Buka <strong>Project Settings → API</strong>.</li>
          <li>Salin <strong>Project URL</strong> → isi <code>NEXT_PUBLIC_SUPABASE_URL</code>.</li>
          <li>Salin <strong>anon / public key</strong> → isi <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.</li>
          <li>Buat file <code>.env.local</code> di root project (salin dari <code>.env.example</code>).</li>
          <li>Restart dev server (<code>npm run dev</code>).</li>
          <li>Jalankan migration <code>supabase/migrations/0001_init.sql</code> di SQL Editor Supabase.</li>
          <li>Buat storage bucket <code>media</code> (public).</li>
          <li>Buat user admin di Authentication, lalu daftarkan profilnya di tabel <code>profiles</code> (role <code>admin</code>).</li>
        </ol>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-white/70 p-3 text-xs text-amber-900">{`insert into public.profiles (id, email, full_name, role)
select id, email, 'Admin', 'admin'
from auth.users where email = 'admin@miftahulkhoir.id'
on conflict (id) do update set role = 'admin';`}</pre>
        <p className="mt-3 text-xs">
          Catatan: Supabase memakai PostgreSQL, bukan MySQL. Database utama bernama <code>postgres</code>. Jika Anda membutuhkan MySQL dengan nama <code>db_miftahulkhoir</code>, gunakan file <code>database/db_miftahulkhoir.sql</code> (memerlukan penulisan ulang data layer).
        </p>
      </div>
    </div>
  );
}
