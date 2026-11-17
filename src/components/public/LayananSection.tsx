const services = [
  { icon: "📖", title: "Kajian & Dakwah", desc: "Kajian rutin dan ceramah untuk meningkatkan pemahaman agama." },
  { icon: "🤝", title: "Bakti Sosial", desc: "Kegiatan sosial untuk membantu masyarakat sekitar masjid." },
  { icon: "💰", title: "Donasi & Wakaf", desc: "Pengelolaan infaq, sedekah, dan wakaf secara amanah." },
];

export default function LayananSection() {
  return (
    <section id="layanan" className="bg-masjid-50 py-16 md:py-24">
      <div className="container-narrow">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-masjid-700">Layanan</p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-masjid-900">Layanan Publik Masjid</h2>
          <p className="mt-3 text-masjid-800/70">Berbagai layanan yang tersedia untuk jamaah dan masyarakat.</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.title} className="card flex h-full flex-col rounded-3xl">
              <div className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-masjid-100 text-2xl">{s.icon}</div>
              <h4 className="font-display text-lg font-semibold text-masjid-900">{s.title}</h4>
              <p className="mt-2 flex-1 text-sm text-masjid-800/70">{s.desc}</p>
              <a href="#donasi" className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-masjid-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-masjid-900">
                Pelajari
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
