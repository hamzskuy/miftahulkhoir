import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import NewsCard from "@/components/public/NewsCard";
import Link from "next/link";
import { getNews } from "@/lib/data";

export const revalidate = 60;

export default async function BeritaPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams?.q ?? "";
  const posts = await getNews({ status: "published", q });

  return (
    <>
      <Navbar />
      <main className="py-24">
        <div className="container-narrow">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-masjid-800/70 transition-colors hover:text-masjid-900">
            ← Kembali ke Beranda
          </Link>
          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.28em] text-masjid-700">Berita</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-masjid-900 md:text-5xl">Berita & Pengumuman</h1>
          <form className="mt-6 flex gap-2" action="/berita" method="get">
            <input name="q" defaultValue={q} placeholder="Cari berita..." className="flex-1 rounded-full border border-masjid-800/20 bg-white px-5 py-2.5 text-sm outline-none focus:border-masjid-800" />
            <button type="submit" className="btn-primary">Cari</button>
          </form>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.length === 0 && <p className="text-sm text-masjid-800/60">Belum ada berita.</p>}
            {posts.map((p) => <NewsCard key={p.id} post={p} />)}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
