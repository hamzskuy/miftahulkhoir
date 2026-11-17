import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import Link from "next/link";
import { getNewsBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";

export const revalidate = 60;

export default async function BeritaDetailPage({ params }: { params: { slug: string } }) {
  const post = await getNewsBySlug(params.slug);
  if (!post || post.status !== "published") notFound();

  const safeContent = DOMPurify.sanitize(post.content || "");

  return (
    <>
      <Navbar />
      <main className="py-24">
        <article className="container-narrow max-w-3xl">
          <Link href="/berita" className="inline-flex items-center gap-2 text-sm font-medium text-masjid-800/70 transition-colors hover:text-masjid-900">
            ← Kembali ke Berita
          </Link>
          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.28em] text-masjid-700">
            {post.category?.name ?? "Berita"}
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-masjid-900 md:text-5xl">{post.title}</h1>
          <p className="mt-3 text-sm text-masjid-800/60">
            {post.published_at ? new Date(post.published_at).toLocaleDateString("id-ID", { dateStyle: "long" }) : ""}
          </p>
          {post.cover_url && (
            <div className="mt-6 overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.cover_url} alt={post.title} className="w-full object-cover" />
            </div>
          )}
          {post.excerpt && <p className="mt-6 text-lg italic text-masjid-800/80">{post.excerpt}</p>}
          <div className="prose mt-6 max-w-none text-masjid-900" dangerouslySetInnerHTML={{ __html: safeContent }} />
        </article>
      </main>
      <Footer />
    </>
  );
}
