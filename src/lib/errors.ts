/**
 * Terjemahkan pesan error Supabase/Postgres menjadi pesan yang bisa ditindaklanjuti.
 */
export function friendlyError(message: string): string {
  const m = message || "";

  if (/row-level security/i.test(m)) {
    return "Akses ditolak (RLS). Sesi login Supabase kemungkinan kedaluwarsa — keluar lalu login ulang, kemudian coba lagi. Jika masih gagal, buka /admin/setup.";
  }
  if (/bucket.*not found|bucket not found/i.test(m)) {
    return "Bucket 'media' tidak ditemukan di Supabase Storage. Buat bucket bernama 'media' dengan status Public, lalu coba lagi.";
  }
  if (/exceeded the maximum allowed size|payload too large|too large/i.test(m)) {
    return "Ukuran file terlalu besar. Kompres gambar terlebih dahulu (disarankan di bawah 2 MB).";
  }
  if (/duplicate key|already exists/i.test(m)) {
    return "Data dengan nilai unik yang sama sudah ada (mis. slug atau nama). Gunakan nilai lain.";
  }
  if (/invalid input syntax|invalid uuid/i.test(m)) {
    return "Format data tidak valid (ID/tanggal). Periksa kembali isian formulir.";
  }
  if (/jwt expired|invalid jwt|refresh token/i.test(m)) {
    return "Sesi login kedaluwarsa. Keluar lalu login ulang di /admin/login.";
  }

  return m;
}
