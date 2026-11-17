import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  seedHomepage,
  seedGallery,
  seedNews,
  seedNewsCategories,
  seedSchedules,
  seedDonations,
} from "@/data/seed";
import type {
  GalleryItem,
  NewsPost,
  NewsCategory,
  Schedule,
  DonationProgram,
  HomepageSettings,
} from "@/types";

function supabaseOrNull() {
  if (!isSupabaseConfigured()) return null;
  try {
    return createServerSupabase();
  } catch {
    return null;
  }
}

export async function getHomepage(): Promise<HomepageSettings> {
  const sb = supabaseOrNull();
  if (!sb) return seedHomepage;
  const { data } = await sb.from("homepage_settings").select("*").limit(1).single();
  return (data as HomepageSettings) ?? seedHomepage;
}

export async function getGallery(category?: string): Promise<GalleryItem[]> {
  const sb = supabaseOrNull();
  if (!sb) return category && category !== "Semua" ? seedGallery.filter((g) => g.category === category) : seedGallery;
  let q = sb.from("gallery").select("*").order("taken_at", { ascending: false });
  if (category && category !== "Semua") q = q.eq("category", category);
  const { data } = await q;
  return (data as GalleryItem[]) ?? [];
}

export async function getGalleryCategories(): Promise<string[]> {
  const items = await getGallery();
  return ["Semua", ...Array.from(new Set(items.map((g) => g.category)))];
}

export async function getNews(opts?: { status?: "published" | "draft" | "all"; q?: string }): Promise<NewsPost[]> {
  const sb = supabaseOrNull();
  const status = opts?.status ?? "published";
  if (!sb) {
    let list = seedNews;
    if (status !== "all") list = list.filter((n) => n.status === status);
    if (opts?.q) {
      const q = opts.q.toLowerCase();
      list = list.filter((n) => n.title.toLowerCase().includes(q) || (n.excerpt ?? "").toLowerCase().includes(q));
    }
    return list;
  }
  let q = sb.from("news").select("*, category:news_categories(*)").order("published_at", { ascending: false });
  if (status !== "all") q = q.eq("status", status);
  if (opts?.q) q = q.ilike("title", `%${opts.q}%`);
  const { data } = await q;
  return (data as NewsPost[]) ?? [];
}

export async function getNewsBySlug(slug: string): Promise<NewsPost | null> {
  const sb = supabaseOrNull();
  if (!sb) return seedNews.find((n) => n.slug === slug) ?? null;
  const { data } = await sb.from("news").select("*, category:news_categories(*)").eq("slug", slug).single();
  return (data as NewsPost) ?? null;
}

export async function getNewsCategories(): Promise<NewsCategory[]> {
  const sb = supabaseOrNull();
  if (!sb) return seedNewsCategories;
  const { data } = await sb.from("news_categories").select("*").order("name");
  return (data as NewsCategory[]) ?? seedNewsCategories;
}

export async function getSchedules(): Promise<Schedule[]> {
  const sb = supabaseOrNull();
  if (!sb) return seedSchedules;
  const { data } = await sb.from("schedules").select("*").order("start_at", { ascending: true });
  return (data as Schedule[]) ?? [];
}

export async function getDonations(activeOnly = true): Promise<DonationProgram[]> {
  const sb = supabaseOrNull();
  if (!sb) return activeOnly ? seedDonations.filter((d) => d.is_active) : seedDonations;
  let q = sb.from("donation_programs").select("*").order("created_at", { ascending: false });
  if (activeOnly) q = q.eq("is_active", true);
  const { data } = await q;
  return (data as DonationProgram[]) ?? [];
}
