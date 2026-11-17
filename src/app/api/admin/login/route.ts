import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const ADMIN_USER = process.env.ADMIN_USERNAME || "miftahulkhoir123";
const ADMIN_PASS = process.env.ADMIN_PASSWORD || "123456";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const username = String(body?.username ?? "").trim();
  const password = String(body?.password ?? "");

  if (username !== ADMIN_USER || password !== ADMIN_PASS) {
    return NextResponse.json({ error: "Username atau password salah." }, { status: 401 });
  }

  // Authenticate with Supabase (server-side) so RLS writes work.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const adminEmail = process.env.ADMIN_EMAIL || "admin@miftahulkhoir.id";
  const adminPassword = process.env.ADMIN_PASSWORD_SUPABASE || process.env.ADMIN_PASSWORD || "123456";

  const cookieStore = cookies();

  if (!url || !anon) {
    cookieStore.set("mk_admin", "1", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    return NextResponse.json({ ok: true, supabaseOk: false, warning: "Supabase belum dikonfigurasi (.env.local). CMS tidak dapat menyimpan data." });
  }
  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
      },
    },
  });

  const { error: authError } = await supabase.auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword,
  });

  let supabaseOk = !authError;
  let warning: string | null = null;
  if (authError) {
    warning = `Supabase Auth gagal: ${authError.message}. CMS (simpan data) tidak akan berfungsi sampai akun ${adminEmail} dibuat di Supabase Auth. Login panel tetap berjalan.`;
  }

  // Set app-level session cookie for middleware (always, so admin UI accessible)
  cookieStore.set("mk_admin", "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return NextResponse.json({ ok: true, supabaseOk, warning });
}
