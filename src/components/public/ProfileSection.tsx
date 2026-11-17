export default function ProfileSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container-narrow">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-masjid-700">Profil Singkat</p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-[1.05] text-masjid-900">Masjid Miftahul Khoir</h2>
            <p className="mt-4 text-base leading-relaxed text-masjid-800/80">
              Masjid Miftahul Khoir merupakan pusat ibadah, pendidikan, dan kegiatan sosial masyarakat. Melalui website ini, jamaah dapat mengakses informasi kegiatan, galeri dokumentasi, berita, dan program donasi secara mudah.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Ibadah", value: "Harian" },
              { label: "Kajian", value: "Rutin" },
              { label: "Sosial", value: "Aktif" },
              { label: "Donasi", value: "Terbuka" },
            ].map((s) => (
              <div key={s.label} className="card text-center">
                <p className="font-display text-2xl font-bold text-masjid-800">{s.value}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-masjid-800/60">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
