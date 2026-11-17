"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "Username atau password salah.");
        setLoading(false);
        return;
      }
      if (data?.warning) alert(data.warning);
      setTimeout(() => {
        window.location.href = "/admin/dashboard";
      }, 0);
    } catch {
      setError("Gagal terhubung.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-masjid-50 px-5">
      <div className="w-full max-w-md rounded-3xl border border-masjid-800/10 bg-white p-8 shadow-lg">
        <div className="text-center">
          <span className="grid h-12 w-12 mx-auto place-items-center rounded-full bg-masjid-800 font-display text-xl font-bold text-white">M</span>
          <h1 className="mt-4 font-display text-2xl font-semibold text-masjid-900">Login Admin</h1>
          <p className="mt-1 text-sm text-masjid-800/70">Masjid Miftahul Khoir CMS</p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); submit(); }}>
          <div>
            <label className="text-xs font-medium text-masjid-800/80">Username</label>
            <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") submit(); }} autoComplete="username" className="mt-1.5 w-full rounded-xl border border-masjid-800/20 bg-white px-4 py-2.5 text-sm outline-none focus:border-masjid-800" />
          </div>
          <div>
            <label className="text-xs font-medium text-masjid-800/80">Password</label>
            <div className="relative mt-1.5">
              <input type={showPw ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") submit(); }} autoComplete="current-password" className="w-full rounded-xl border border-masjid-800/20 bg-white px-4 py-2.5 pr-10 text-sm outline-none focus:border-masjid-800" />
              <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-masjid-800/60" aria-label={showPw ? "Sembunyikan" : "Tampilkan"}>
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="button" onClick={submit} disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-masjid-800/60">
          Demo: username <code className="rounded bg-masjid-50 px-1.5 py-0.5">miftahulkhoir123</code>, password <code className="rounded bg-masjid-50 px-1.5 py-0.5">123456</code>
        </p>
      </div>
    </div>
  );
}
