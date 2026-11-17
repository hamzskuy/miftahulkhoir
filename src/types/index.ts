export type GalleryItem = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  image_url: string;
  taken_at: string | null;
  created_at: string;
};

export type NewsCategory = {
  id: string;
  name: string;
  slug: string;
};

export type NewsPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string; // HTML from rich text editor
  cover_url: string | null;
  category_id: string | null;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
  category?: NewsCategory | null;
};

export type Schedule = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  start_at: string;
  end_at: string | null;
  status: "upcoming" | "past" | "cancelled";
  created_at: string;
};

export type DonationProgram = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  image_url: string | null;
  bank_name: string | null;
  account_number: string | null;
  account_holder: string | null;
  qris_url: string | null;
  whatsapp: string | null;
  is_active: boolean;
  created_at: string;
};

export type HomepageSettings = {
  id: string;
  hero_image_url: string | null;
  profile_image_url: string | null;
  hero_title: string;
  hero_tagline: string;
  hero_description: string;
  updated_at: string;
};

export type AdminProfile = {
  id: string;
  email: string;
  full_name: string | null;
  role: "admin";
};
