import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { apiVersion, dataset, projectId, useCdn } from "../env";
import type { PortableTextBlock } from "@portabletext/react";

interface CreateBlogPostInput {
  title: string;
  slug: string;
  authorId: string;
  excerpt?: string;
  content?: PortableTextBlock[];
  categoryIds?: string[];
  tags?: string[];
  publishedAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  mainImage?: {
    _type: "image";
    asset: {
      _type: "reference";
      _ref: string;
    };
    alt?: string;
  };
  ogImage?: {
    _type: "image";
    asset: {
      _type: "reference";
      _ref: string;
    };
    alt?: string;
  };
}

// ─────────────────────────────────────────────────────────────
// CLIENTS
// ─────────────────────────────────────────────────────────────

// Read-only client — used in your public site (CDN-cached, fast)
export const client = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn,
});

// Write client — used in admin dashboard mutations only
// Requires SANITY_API_WRITE_TOKEN in your .env.local
// Never prefix with NEXT_PUBLIC_ — server-side only
export const sanityClient = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn: false, // always fresh for admin
  token: process.env.SANITY_API_WRITE_TOKEN,
});

// ─────────────────────────────────────────────────────────────
// IMAGE BUILDER
// ─────────────────────────────────────────────────────────────

const builder = imageUrlBuilder(client);

export const urlFor = (source: SanityImageSource) => builder.image(source);

// ─────────────────────────────────────────────────────────────
// GROQ QUERIES — unchanged from your original
// ─────────────────────────────────────────────────────────────

export const queries = {
  // 🏷 All Categories
  categories: `*[_type == "category"]{
    _id,
    name,
    slug,
    description
  }`,

  // 📰 All Blog Posts
  blogPosts: `*[_type == "blogPost"] | order(_createdAt desc){
    _id,
     _createdAt,
    _updatedAt,
    title,
    slug,
    excerpt,
    publishedAt,
    mainImage {
      asset->{
        _id,
        url
      },
      alt
    },
    "categories": categories[]->{
       _id,
  name,
  slug,
  description
      },
    tags,
    metaTitle,
    metaDescription,
    ogImage {
      asset->{
        _id,
        url
      },
      alt
    },
    "author": author->{
      name,
      slug,
      image {
        asset->{
          _id,
          url
        },
        alt
      }
    }
  }`,

  // 📰 Blog Post by Slug
  blogPostBySlug: (
    slug: string,
  ) => `*[_type == "blogPost" && slug.current == "${slug}"][0]{
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    mainImage {
      asset->{
        _id,
        url
      },
      alt
    },
    "categories": categories[]->{
        _id,
  name,
  slug,
  description
      },
    tags,
    metaTitle,
    metaDescription,
    ogImage {
      asset->{
        _id,
        url
      },
      alt
    },
    content,
    "author": author->{
      name,
      slug,
      image {
        asset->{
          _id,
          url
        },
        alt
      },
      bio
    }
  }`,

  // 👤 Author by Slug
  authorBySlug: (
    slug: string,
  ) => `*[_type == "author" && slug.current == "${slug}"][0]{
    _id,
    name,
    slug,
    image {
      asset->,
      alt
    },
    bio
  }`,

  // 📸 All Galleries
  galleries: `*[_type == "gallery"]{
    images[]{
      asset->{
        _id,
        url
      },
      alt
    }
  }`,
};

// ─────────────────────────────────────────────────────────────
// ADMIN QUERIES — used only in the dashboard
// These use the same GROQ structure but fetched via sanityClient
// ─────────────────────────────────────────────────────────────

// Lightweight list query for the blog management table
export const BLOG_POSTS_ADMIN_QUERY = `
  *[_type == "blogPost"] | order(_createdAt desc) {
    _id,
    _createdAt,
    _updatedAt,
    title,
    slug,
    excerpt,
    publishedAt,
    tags,
    mainImage {
      asset->,
      alt
    },
    author-> {
      _id,
      name,
      slug,
      image { asset-> }
    },
    categories[]-> {
      _id,
      name,
      slug
    },
    metaTitle,
    metaDescription
  }
`;

// Full post including content — for the edit page
export const BLOG_POST_BY_ID_QUERY = `
  *[_type == "blogPost" && _id == $id][0] {
    _id,
    _createdAt,
    _updatedAt,
    title,
    slug,
    excerpt,
    publishedAt,
    tags,
    content,
    mainImage {
      asset->,
      alt
    },
    author-> {
      _id,
      name,
      slug,
      image { asset-> },
      bio
    },
    categories[]-> {
      _id,
      name,
      slug
    },
    metaTitle,
    metaDescription,
    ogImage { asset-> }
  }
`;

export const CATEGORIES_QUERY = `
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description,
  }
`;

export const TAGS_QUERY = `array::unique(*[_type == "blogPost"].tags[])`;

export const AUTHORS_QUERY = `
  *[_type == "author"] | order(name asc) {
    _id,
    name,
    slug,
    image { asset-> },
    bio
  }
`;

// ─────────────────────────────────────────────────────────────
// MUTATIONS — dashboard admin actions only
// All use sanityClient (write token) — never call from public pages
// ─────────────────────────────────────────────────────────────

export async function createBlogPost(data: CreateBlogPostInput) {
  return sanityClient.create({
    _type: "blogPost",

    title: data.title,

    slug: {
      _type: "slug",
      current: data.slug,
    },

    author: {
      _type: "reference",
      _ref: data.authorId,
    },

    excerpt: data.excerpt ?? "",
    content: data.content ?? [],
    tags: data.tags ?? [],

    publishedAt: data.publishedAt ?? undefined,

    categories:
      data.categoryIds?.map((id) => ({
        _type: "reference",
        _ref: id,
      })) ?? [],

    metaTitle: data.metaTitle ?? "",
    metaDescription: data.metaDescription ?? "",

    mainImage: data.mainImage,
    ogImage: data.ogImage,
  });
}

/** Publish: set publishedAt to now */
export async function publishBlogPost(id: string) {
  return sanityClient
    .patch(id)
    .set({ publishedAt: new Date().toISOString() })
    .commit();
}

/** Unpublish: remove publishedAt — post becomes a draft */
export async function unpublishBlogPost(id: string) {
  return sanityClient.patch(id).unset(["publishedAt"]).commit();
}

/** Duplicate as a new draft — copies all fields except _id and publishedAt */
export async function duplicateBlogPost(id: string) {
  const post = await sanityClient.fetch(BLOG_POST_BY_ID_QUERY, { id });
  if (!post) throw new Error("Post not found");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, _createdAt, _updatedAt, publishedAt, slug, ...rest } = post;

  return sanityClient.create({
    ...rest,
    _type: "blogPost",
    title: `${post.title} (Copy)`,
    slug: { _type: "slug", current: `${post.slug.current}-copy-${Date.now()}` },
    // No publishedAt = draft
  });
}

/** Hard delete from Sanity */
export async function deleteBlogPost(id: string) {
  return sanityClient.delete(id);
}

/** Update any fields on a post */
export async function updateBlogPost(
  id: string,
  data: Record<string, unknown>,
) {
  return sanityClient.patch(id).set(data).commit();
}
