type ProfileStats = { label: string; value: string };

export default function ProfileSection({
  profileImage,
  profileLabel,
  profileHeading,
  profileDescription,
  profileStats,
}: {
  profileImage?: string | null;
  profileLabel?: string | null;
  profileHeading?: string | null;
  profileDescription?: string | null;
  profileStats?: ProfileStats[] | null;
}) {
  const label = profileLabel || "Profil Singkat";
  const heading = profileHeading || "Masjid Miftahul Khoir";
  const description =
    profileDescription ||
    "Masjid Miftahul Khoir merupakan pusat ibadah, pendidikan, dan kegiatan sosial masyarakat. Melalui website ini, jamaah dapat mengakses informasi kegiatan, galeri dokumentasi, berita, dan program donasi secara mudah.";
  const stats = (profileStats && profileStats.length ? profileStats : [
    { label: "Ibadah", value: "Harian" },
    { label: "Kajian", value: "Rutin" },
    { label: "Sosial", value: "Aktif" },
    { label: "Donasi", value: "Terbuka" },
  ]);

  return (
    <section className="py-16 md:py-24">
      <div className="container-narrow">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="overflow-hidden rounded-3xl border border-masjid-800/10 bg-masjid-50">
            {profileImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profileImage} alt="Foto Masjid Miftahul Khoir" className="aspect-[4/3] w-full object-cover" />
            ) : (
              <div className="grid aspect-[4/3] w-full place-items-center">
                <span className="font-display text-6xl font-bold text-masjid-800/20">M</span>
              </div>
            )}
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-masjid-700">{label}</p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-[1.05] text-masjid-900">{heading}</h2>
            <p className="mt-4 text-base leading-relaxed text-masjid-800/80">{description}</p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {stats.map((s, i) => (
                <div key={`${s.label}-${i}`} className="card text-center">
                  <p className="font-display text-2xl font-bold text-masjid-800">{s.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-masjid-800/60">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
