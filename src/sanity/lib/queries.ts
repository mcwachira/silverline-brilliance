import { client } from "./client";

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC QUERIES (used by the frontend / public blog)
// ─────────────────────────────────────────────────────────────────────────────

// GROQ query to fetch all blog posts (public listing)
export async function getAllPosts() {
  const query = `*[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    mainImage {
      asset->{ _id, url },
      alt
    },
    "categories": categories[]->{ _id, name, "slug": slug.current },
    tags,
    "author": author->{
      _id,
      name,
      "slug": slug.current,
      image { asset->{ _id, url }, alt },
      bio
    }
  }`;
  try {
    return await client.fetch(query);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

// GROQ query to fetch a single blog post by slug (public post page)
export async function getPostBySlug(slug: string) {
  const query = `*[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    mainImage {
      asset->{ _id, url },
      alt
    },
    "categories": categories[]->{ _id, name, "slug": slug.current, description },
    tags,
    content[],
    metaTitle,
    metaDescription,
    ogImage {
      asset->{ _id, url },
      alt
    },
    "author": author->{
      _id,
      name,
      "slug": slug.current,
      image { asset->{ _id, url }, alt },
      bio
    }
  }`;
  try {
    return await client.fetch(query, { slug });
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

// GROQ query to fetch all categories (public)
export async function getAllCategories() {
  const query = `*[_type == "category"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    description,
    "postCount": count(*[_type == "blogPost" && references(^._id)])
  }`;
  try {
    return await client.fetch(query);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// GROQ query to fetch related posts based on categories
export async function getRelatedPosts(
  postId: string,
  categoryIds: string[],
  limit: number = 3,
) {
  const query = `*[
    _type == "blogPost"
    && _id != $postId
    && count((categories[]._ref)[@ in $categoryIds]) > 0
  ] | order(publishedAt desc) [0...$limit] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    mainImage {
      asset->{ _id, url },
      alt
    },
    "categories": categories[]->{ _id, name, "slug": slug.current },
    "author": author->{
      _id,
      name,
      "slug": slug.current,
      image { asset->{ _id, url }, alt }
    }
  }`;
  try {
    return await client.fetch(query, { postId, categoryIds, limit });
  } catch (error) {
    console.error("Error fetching related posts:", error);
    return [];
  }
}

// GROQ query to get all post slugs for static generation
export async function getAllPostSlugs() {
  const query = `*[_type == "blogPost" && defined(slug.current)].slug.current`;
  try {
    return await client.fetch(query);
  } catch (error) {
    console.error("Error fetching post slugs:", error);
    return [];
  }
}

// GROQ query to fetch popular/recent posts (sidebar widget etc.)
export async function getPopularPosts(limit: number = 5) {
  const query = `*[_type == "blogPost"] | order(publishedAt desc) [0...$limit] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    mainImage {
      asset->{ _id, url },
      alt
    }
  }`;
  try {
    return await client.fetch(query, { limit });
  } catch (error) {
    console.error("Error fetching popular posts:", error);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN QUERIES  (used by the dashboard editor — requires full content[])
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch all posts for the admin blog list page.
 * Includes status, slug object (not flattened), and author reference
 * so the dashboard can display, filter, and link to edit pages.
 */
export const BLOG_POSTS_ADMIN_QUERY = `
  *[_type == "blogPost"] | order(_createdAt desc) {
    _id,
    _createdAt,
    _updatedAt,
    title,
    slug,
    excerpt,
    publishedAt,
    scheduledAt,
    "status": select(
      defined(publishedAt) && publishedAt <= now() => "published",
      defined(scheduledAt) && scheduledAt > now()  => "scheduled",
      "draft"
    ),
    featuredImage {
      asset->{ _id, url },
      alt
    },
    mainImage {
      asset->{ _id, url },
      alt
    },
    "categories": categories[]->{ _id, title, name, "slug": slug.current },
    tags,
    "author": author->{ _id, name, "slug": slug.current }
  }
`;

/**
 * Fetch a single post by _id for the admin editor.
 * Includes the full Portable Text content[] array so it can be
 * loaded into the rich-text editor.
 */
export const BLOG_POST_BY_ID_QUERY = `
  *[_type == "blogPost" && _id == $id][0] {
    _id,
    _createdAt,
    _updatedAt,
    title,
    slug,
    excerpt,
    publishedAt,
    scheduledAt,
    "status": select(
      defined(publishedAt) && publishedAt <= now() => "published",
      defined(scheduledAt) && scheduledAt > now()  => "scheduled",
      "draft"
    ),

    // ← Full Portable Text — required by the rich-text editor
    content[]{
      ...,
      _type == "image" => {
        ...,
        asset->{ _id, url, metadata { dimensions } }
      }
    },

    // Legacy body field (if you use body instead of content)
    body[]{
      ...,
      _type == "image" => {
        ...,
        asset->{ _id, url, metadata { dimensions } }
      }
    },

    featuredImage {
      asset->{ _id, url, metadata { dimensions } },
      alt
    },
    mainImage {
      asset->{ _id, url, metadata { dimensions } },
      alt
    },
    ogImage {
      asset->{ _id, url },
      alt
    },
    metaTitle,
    metaDescription,
    tags,
    "categories": categories[]->{ _id, title, name, "slug": slug.current },
    "author": author->{ _id, name, "slug": slug.current }
  }
`;

/**
 * Fetch all categories for the admin category picker.
 */
export const CATEGORIES_QUERY = `
  *[_type == "category"] | order(name asc) {
    _id,
    title,
    name,
    slug,
    description,
    color
  }
`;

/**
 * Fetch all authors for the admin author dropdown.
 */
export const AUTHORS_QUERY = `
  *[_type == "author"] | order(name asc) {
    _id,
    name,
    slug,
    image { asset->{ _id, url }, alt },
    bio
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN HELPER FUNCTIONS  (thin wrappers used by blog-action.ts / pages)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Used by the admin blog list page.
 */
export async function getAdminBlogPosts() {
  try {
    return await client.fetch(BLOG_POSTS_ADMIN_QUERY);
  } catch (error) {
    console.error("Error fetching admin blog posts:", error);
    return [];
  }
}

/**
 * Used by the admin edit page to load a post into the editor.
 */
export async function getAdminPostById(id: string) {
  try {
    return await client.fetch(BLOG_POST_BY_ID_QUERY, { id });
  } catch (error) {
    console.error("Error fetching admin post by id:", error);
    return null;
  }
}

/**
 * Used by the admin editor sidebar to populate the categories picker.
 */
export async function getAdminCategories() {
  try {
    return await client.fetch(CATEGORIES_QUERY);
  } catch (error) {
    console.error("Error fetching admin categories:", error);
    return [];
  }
}

/**
 * Used by the admin editor sidebar to populate the author dropdown.
 */
export async function getAdminAuthors() {
  try {
    return await client.fetch(AUTHORS_QUERY);
  } catch (error) {
    console.error("Error fetching admin authors:", error);
    return [];
  }
}