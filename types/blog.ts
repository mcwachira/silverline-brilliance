export interface BlogPost {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  author?: {
    name: string;
    image?: any;
  };
  mainImage?: any;
  categories?: Array<{
    title: string;
  }>;
  tags?: string[];
  excerpt?: string;
  body?: any;
  publishedAt?: string;
  status: 'draft' | 'published' | 'scheduled';
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    focusKeyword?: string;
  };
}

export interface BlogCategory {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  description?: string;
  parent?: {
    title: string;
  };
}
