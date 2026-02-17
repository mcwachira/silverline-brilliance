

export interface Author {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  social: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  postCount?: number;
}

export interface BlogPost {
  _id: string;
  id: string;
  title: string;
  slug: {
    current: string;
  };
  excerpt: string;
  coverImage: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime: number;
  viewCount: number;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  category: {
    name: string;
    slug: string;
  };
  categories?: Category[];
  author: Author;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  content?: any[]; // Portable Text
  mainImage?: {
    asset?: {
      url: string;
    };
  };
  ogImage?: {
    asset?: {
      url: string;
    };
  };
}

export interface BlogFilters {
  category?: string;
  sort?: 'newest' | 'oldest' | 'az';
  page?: number;
  search?: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  postsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CategoryCount {
  name: string;
  count: number;
}