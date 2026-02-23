import { PortableTextBlock } from "@portabletext/react";

export interface Author {
  id: string;
  name: string;
  role: string;
  bio: PortableTextBlock[];
  avatar: string;
  social: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  postCount: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  email: string;
  website?: string;
  content: string;
  createdAt: string;
  parentId?: string;
  likes: number;
  replies?: Comment[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: Author;
  category: Category;
  tags: Tag[];
  publishedAt: string;
  updatedAt?: string;
  readingTime: number;
  viewCount: number;
  featured: boolean;
  metaTitle: string;
  metaDescription: string;
  ogImage?: string;
}

export interface BlogFilters {
  search?: string;
  category?: string;
  tag?: string;
  sortBy?: "latest" | "oldest" | "popular" | "alphabetical";
}

export interface Heading {
  id: string;
  text: string;
  level: number;
}
