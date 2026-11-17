export default function Footer() {
  return (
    <footer className="border-t border-masjid-800/10 bg-masjid-50 py-12">
      <div className="container-narrow">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="font-display text-2xl font-semibold text-masjid-900">Masjid Miftahul Khoir</p>
            <p className="mt-2 text-sm text-masjid-800/70">Pusat ibadah, pendidikan, dan kegiatan sosial masyarakat.</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-masjid-800/60">Kontak</p>
            <ul className="mt-3 space-y-1 text-sm text-masjid-800/80">
              <li>Alamat: (isi alamat masjid)</li>
              <li>Email: (isi email masjid)</li>
              <li>Telepon: (isi nomor telepon)</li>
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-masjid-800/60">Media Sosial</p>
            <ul className="mt-3 space-y-1 text-sm text-masjid-800/80">
              <li>Instagram: (placeholder)</li>
              <li>Facebook: (placeholder)</li>
              <li>YouTube: (placeholder)</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-masjid-800/10 pt-6 text-xs text-masjid-800/60">
          © {new Date().getFullYear()} Masjid Miftahul Khoir. Seluruh hak cipta dilindungi.
        </div>
      </div>
    </footer>
  );
}
