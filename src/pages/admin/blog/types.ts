export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  featured_image: string | null;
  excerpt: string | null;
  full_body: string | null;
  author_id: string | null;
  publish_date: string;
  published: boolean;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  author?: { id: string; full_name: string } | null;
}

export type BlogDraft = Omit<BlogPost, 'id' | 'created_at' | 'author'>;

export const EMPTY_POST: BlogDraft = {
  title: '',
  slug: '',
  category: null,
  featured_image: null,
  excerpt: null,
  full_body: null,
  author_id: null,
  publish_date: new Date().toISOString().split('T')[0],
  published: false,
  seo_title: null,
  seo_description: null,
};

export const BLOG_CATEGORIES = [
  'Market Insights',
  'Buying Guide',
  'Renting Guide',
  'Investment',
  'Neighborhood Spotlight',
  'Design & Lifestyle',
  'News & Updates',
  'Tips & Advice',
];
