import { getHomepage } from "@/lib/data";
import Link from "next/link";

export default async function Hero() {
  const home = await getHomepage();

  const tagline = home.hero_tagline ?? "";
  const commaIdx = tagline.indexOf(",");
  const lineA = commaIdx >= 0 ? tagline.slice(0, commaIdx + 1) : tagline;
  const lineB = commaIdx >= 0 ? tagline.slice(commaIdx + 1).trim() : "";

  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[calc(100svh-var(--nav-h))] w-full">
        <img
          src={home.hero_image_url || "/placeholder.svg"}
          alt="Foto utama Masjid Miftahul Khoir"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-masjid-950/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-masjid-950/70 via-transparent to-transparent" />
        <div className="relative z-10 flex min-h-[calc(100svh-var(--nav-h))] items-center">
          <div className="container-narrow w-full">
            <div className="max-w-3xl">
              <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-gold-400">
                <span className="h-[2px] w-8 bg-gold-400" />
                Website Resmi
              </p>
              <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] tracking-tight text-white md:text-7xl">
                {home.hero_title || "Masjid Miftahul Khoir"}
                {lineA && (
                  <>
                    <br />
                    <span className="text-gold-400">{lineA}</span>
                  </>
                )}
                {lineB && (
                  <>
                    <br />
                    <span className="text-white/90">{lineB}</span>
                  </>
                )}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
                {home.hero_description || home.hero_tagline}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#layanan" className="btn-primary">
                  Eksplorasi Layanan <span className="ml-1">→</span>
                </a>
                <Link href="/galeri" className="btn-ghost border-white/30 text-white hover:bg-white/10">
                  Lihat Galeri
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
