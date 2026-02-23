import { PortableTextBlock } from "@portabletext/react";

// ✅ Shared
export interface SanityImage {
  _type: "image";
  asset: {
    _id?: string;
    url?: string;
    _type?: "reference" | "sanity.imageAsset";
    _ref?: string;
  };
  alt?: string;
}

export interface Slug {
  _type: "slug";
  current: string;
}

// ✅ Portable Text
export type BlockContent = Array<Block | ImageBlock>;

export interface Block {
  _key: string;
  _type: "block";
  style?: "normal" | "h1" | "h2" | "h3" | "h4" | "blockquote";
  listItem?: "bullet";
  children: Span[];
  markDefs: LinkAnnotation[];
}

export interface Span {
  _key: string;
  _type: "span";
  text: string;
  marks: string[];
}

export interface LinkAnnotation {
  _key: string;
  _type: "link";
  href: string;
}

export interface ImageBlock {
  _key: string;
  _type: "image";
  asset: {
    _type: "reference";
    _ref: string;
  };
  alt?: string;
}

// ✅ Blog
export interface BlogPost {
  _id: string;
  _type?: "blogPost";
  title: string;
  slug: { current: string };
  excerpt?: string;
  publishedAt?: string;
  mainImage?: {
    asset: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
  categories?: {
    _id: string;
    title: string;
    slug: { current: string };
  }[];
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: {
    asset: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
  content?: PortableTextBlock[]; // You can replace `any` with PortableText type if needed
  author: {
    name: string;
    slug: { current: string };
    image?: {
      asset: {
        _id: string;
        url: string;
      };
      alt?: string;
    };
    bio?: PortableTextBlock[]; // Replace with a PortableText type if needed
  };
}

export interface Author {
  _id: string;
  _type: "author";
  name: string;
  slug?: Slug;
  image?: SanityImage;
  bio?: BlockContent;
}

// ✅ Category
export interface Category {
  _id: string;
  _type: "category";
  name: string;
  slug: Slug;
  description?: string;
}

// ✅ Gallery
export interface Gallery {
  _type: "gallery";
  images: GalleryImage[];
}

export interface GalleryImage extends SanityImage {
  _key?: string;
  alt: string; // required alt per schema
}

// ✅ Product
export interface Product {
  _id: string;
  _type: "product";
  name: string;
  slug: {
    _type: "slug";
    current: string;
  };
  image: SanityImage;
  images: SanityImage[];
  description?: string;
  price: number;
  category?: {
    _id: string;
    name: string;
    slug: {
      current: string;
    };
  };
  stock?: number;
  inStock?: boolean;
  roastLevel?: "Light" | "Medium" | "Dark";
  origin?: string;
  featured?: boolean;
  tags?: string[];
  specifications?: Specification[];

  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaImage?: SanityImage;
    openGraph?: {
      ogTitle?: string;
      ogDescription?: string;
      ogImage?: SanityImage;
    };
  };
}

export interface Specification {
  label: string;
  value: string;
}

// ✅ Cart
export interface CartItem {
  product: Product;
  quantity: number;
}

// ✅ User
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

// ✅ Review
export interface Review {
  _id: string;
  product: {
    _type: "reference";
    _ref: string;
  };
  user: User;
  rating: number;
  comment: string;
  createdAt: string;
}
