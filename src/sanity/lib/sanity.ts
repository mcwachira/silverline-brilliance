import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import { apiVersion, dataset, projectId, useCdn } from "../env";

export const client = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn,
});
const builder = imageUrlBuilder(client);
export const urlFor = (source: any) => builder.image(source);
// GROQ queries

export const queries = {
  // 🏷 All Categories
  categories: `*[_type == "category"]{
    _id,
    name,
    slug,
    description
  }`,

  // 📰 All Blog Posts
  blogPosts: `*[_type == "blogPost"] | order(publishedAt desc){
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
        title,
        slug
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
        title,
        slug
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
