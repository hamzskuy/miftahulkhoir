import Navbar from "@/components/public/Navbar";
import Hero from "@/components/public/Hero";
import ProfileSection from "@/components/public/ProfileSection";
import LayananSection from "@/components/public/LayananSection";
import GalleryGrid from "@/components/public/GalleryGrid";
import NewsCard from "@/components/public/NewsCard";
import DonationCard from "@/components/public/DonationCard";
import ScheduleSection from "@/components/public/ScheduleSection";
import Footer from "@/components/public/Footer";
import Link from "next/link";
import { getHomepage, getGallery, getNews, getSchedules, getDonations } from "@/lib/data";

export const revalidate = 60;

export default async function HomePage() {
  const [home, gallery, news, schedules, donations] = await Promise.all([
    getHomepage(),
    getGallery(),
    getNews({ status: "published" }),
    getSchedules(),
    getDonations(true),
  ]);

  const previewGallery = gallery.slice(0, 6);
  const previewNews = news.slice(0, 3);
  const previewDonations = donations.slice(0, 3);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProfileSection profileImage={home.profile_image_url} />
        <LayananSection />

        <section className="py-16 md:py-24">
          <div className="container-narrow">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-masjid-700">Galeri</p>
                <h2 className="mt-2 font-display text-3xl font-semibold text-masjid-900 md:text-4xl">Dokumentasi Terbaru</h2>
              </div>
              <Link href="/galeri" className="text-sm font-semibold text-masjid-800 hover:underline">Lihat Semua →</Link>
            </div>
            <div className="mt-8">
              {previewGallery.length === 0 ? <p className="text-sm text-masjid-800/60">Belum ada foto.</p> : <GalleryGrid items={previewGallery} />}
            </div>
          </div>
        </section>

        <section className="bg-masjid-50 py-16 md:py-24">
          <div className="container-narrow">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-masjid-700">Berita</p>
                <h2 className="mt-2 font-display text-3xl font-semibold text-masjid-900 md:text-4xl">Berita Terbaru</h2>
              </div>
              <Link href="/berita" className="text-sm font-semibold text-masjid-800 hover:underline">Lihat Semua →</Link>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-4 md:grid-rows-2">
              {previewNews.length === 0 && <p className="text-sm text-masjid-800/60">Belum ada berita.</p>}
              {previewNews[0] && (
                <div className="md:col-span-2 md:row-span-2">
                  <NewsCard post={previewNews[0]} />
                </div>
              )}
              {previewNews.slice(1).map((p) => (
                <NewsCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container-narrow">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-masjid-700">Donasi</p>
                <h2 className="mt-2 font-display text-3xl font-semibold text-masjid-900 md:text-4xl">Program Donasi</h2>
              </div>
              <Link href="/donasi" className="text-sm font-semibold text-masjid-800 hover:underline">Lihat Semua →</Link>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {previewDonations.length === 0 && <p className="text-sm text-masjid-800/60">Belum ada program donasi.</p>}
              {previewDonations.map((d) => <DonationCard key={d.id} program={d} />)}
            </div>
          </div>
        </section>

        <ScheduleSection items={schedules} />
      </main>
      <Footer />
    </>
  );
}
