import { client } from "@/sanity/lib/sanity";

// GROQ query to fetch all blog posts
export async function getAllPosts() {
  const query = `*[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
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
      "slug": slug.current
    },
    tags,
    "author": author->{
      _id,
      name,
      "slug": slug.current,
      image {
        asset->{
          _id,
          url
        },
        alt
      },
      bio
    }
  }`;

  try {
    const posts = await client.fetch(query);
    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

// GROQ query to fetch a single blog post by slug
export async function getPostBySlug(slug: string) {
  const query = `*[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
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
      "slug": slug.current,
      description
    },
    tags,
    content,
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
      _id,
      name,
      "slug": slug.current,
      image {
        asset->{
          _id,
          url
        },
        alt
      },
      bio
    }
  }`;

  try {
    const post = await client.fetch(query, { slug });
    return post;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

// GROQ query to fetch all categories
export async function getAllCategories() {
  const query = `*[_type == "category"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    description,
    "postCount": count(*[_type == "blogPost" && references(^._id)])
  }`;

  try {
    const categories = await client.fetch(query);
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// GROQ query to fetch related posts based on categories
export async function getRelatedPosts(postId: string, categoryIds: string[], limit: number = 3) {
  const query = `*[_type == "blogPost" && _id != $postId && count((categories[]._ref)[@ in $categoryIds]) > 0] | order(publishedAt desc) [0...$limit] {
    _id,
    title,
    "slug": slug.current,
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
      "slug": slug.current
    },
    "author": author->{
      _id,
      name,
      "slug": slug.current,
      image {
        asset->{
          _id,
          url
        },
        alt
      }
    }
  }`;

  try {
    const posts = await client.fetch(query, { postId, categoryIds, limit });
    return posts;
  } catch (error) {
    console.error("Error fetching related posts:", error);
    return [];
  }
}

// GROQ query to get all post slugs for static generation
export async function getAllPostSlugs() {
  const query = `*[_type == "blogPost" && defined(slug.current)].slug.current`;

  try {
    const slugs = await client.fetch(query);
    return slugs;
  } catch (error) {
    console.error("Error fetching post slugs:", error);
    return [];
  }
}

// GROQ query to fetch popular posts (you can add a viewCount field to track this)
export async function getPopularPosts(limit: number = 5) {
  const query = `*[_type == "blogPost"] | order(publishedAt desc) [0...$limit] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    mainImage {
      asset->{
        _id,
        url
      },
      alt
    }
  }`;

  try {
    const posts = await client.fetch(query, { limit });
    return posts;
  } catch (error) {
    console.error("Error fetching popular posts:", error);
    return [];
  }
}
