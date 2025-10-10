// types.ts

export interface Post {
  id: number;
  created_at: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  cover_image_url: string | null;
  category: string | null;
  is_published: boolean;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
}
