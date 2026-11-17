import Link from "next/link";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import GalleryGrid from "@/components/public/GalleryGrid";
import { getGallery, getGalleryCategories } from "@/lib/data";

export const revalidate = 60;

export default async function GaleriPage() {
  const [items, categories] = await Promise.all([getGallery(), getGalleryCategories()]);
  return (
    <>
      <Navbar />
      <main className="py-24">
        <div className="container-narrow">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-masjid-800/70 transition-colors hover:text-masjid-900">
            ← Kembali ke Beranda
          </Link>
          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.28em] text-masjid-700">Galeri</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-masjid-900 md:text-5xl">Dokumentasi Kegiatan</h1>
          <p className="mt-3 max-w-2xl text-masjid-800/70">Kumpulan foto dokumentasi kegiatan Masjid Miftahul Khoir.</p>
          <div className="mt-8">
            <GalleryGrid items={items} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
