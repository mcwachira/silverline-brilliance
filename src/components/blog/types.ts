export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category?: string;
  author?: { name: string; image?: any };
  publishedAt: string;
  mainImage?: any;
  readTime?: number;
}
