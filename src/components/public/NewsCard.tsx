import Link from "next/link";
import type { NewsPost } from "@/types";

export default function NewsCard({ post }: { post: NewsPost }) {
  return (
    <article className="card overflow-hidden p-0 transition-transform hover:-translate-y-1">
      <div className="aspect-[16/9] w-full overflow-hidden bg-masjid-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img loading="lazy" src={post.cover_url || "/placeholder.svg"} alt={post.title} className="h-full w-full object-cover" />
      </div>
      <div className="p-5">
        {post.category && (
          <p className="text-[10px] uppercase tracking-[0.18em] text-masjid-700">{post.category.name}</p>
        )}
        <h3 className="mt-1 font-display text-xl font-semibold text-masjid-900">{post.title}</h3>
        {post.excerpt && <p className="mt-2 line-clamp-3 text-sm text-masjid-800/70">{post.excerpt}</p>}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-masjid-800/60">
            {post.published_at ? new Date(post.published_at).toLocaleDateString("id-ID") : ""}
          </span>
          <Link href={`/berita/${post.slug}`} className="text-sm font-semibold text-masjid-800 hover:underline">
            Baca →
          </Link>
        </div>
      </div>
    </article>
  );
}

