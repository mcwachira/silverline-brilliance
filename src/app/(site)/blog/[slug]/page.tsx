import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import BlogPostHero from "@/src/components/blog/BlogPostHero";
import AuthorBio from "@/src/components/blog/AuthorBio";
import RelatedPosts from "@/src/components/blog/RelatedPosts";
import ShareButtons from "@/src/components/blog/ShareButtons";
import BackToBlogButton from "@/src/components/blog/BackToBlogButton";
import { getPostBySlug, getAllPostSlugs, getRelatedPosts } from "@/src/sanity/lib/queries";
import { portableTextComponents } from "@/src/sanity/lib/portableText";

// ----------------------------
// Define BlogPost type here
// ----------------------------
interface BlogPost {
  _id: string;
  status: string;
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string;
  readingTime: number;
  viewCount: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  author: {
    id: string;
    name: string;
    role: string;
    bio: string;
    avatar: string;
    social: Record<string, any>;
  };
  tags: string[];
  featured: boolean;
  metaTitle: string;
  metaDescription: string;
}

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// ----------------------------
// Static params for SSG
// ----------------------------
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug: string) => ({ slug }));
}

// ----------------------------
// SEO metadata
// ----------------------------
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;  
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  const ogImage = post.ogImage?.asset?.url || post.mainImage?.asset?.url;

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: ogImage ? [{ url: ogImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      images: ogImage ? [ogImage] : [],
    },
  };
}

// ----------------------------
// Page Component
// ----------------------------
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;  

  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const categoryIds = post.categories?.map((cat: any) => cat._id) || [];
  const relatedPosts = await getRelatedPosts(post._id, categoryIds, 3);

  const formattedPost: BlogPost = {
    _id: post._id,
    status: post.status || "draft",
    id: post.id || post._id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || "",
    coverImage: post.coverImage || post.mainImage?.asset?.url || "",
    publishedAt: post.publishedAt,
    readingTime: calculateReadingTime(post.content),
    viewCount: post.viewCount || 0,
    category: post.categories?.[0] || { id: "", name: "Uncategorized", slug: "" },
    author: {
      id: post.author.id || post.author._id,
      name: post.author.name,
      role: post.author.role || "Content Creator",
      bio: post.author.bio || "",
      avatar: post.author.avatar || post.author.image?.asset?.url || "",
      social: post.author.social || {},
    },
    tags: post.tags || [],
    featured: post.featured || false,
    metaTitle: post.metaTitle || "",
    metaDescription: post.metaDescription || "",
  };

  const formattedRelatedPosts = relatedPosts.map((p: any) => ({
    _id: p._id,
    status: p.status || "draft",
    id: p.id || p._id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt || "",
    coverImage: p.mainImage?.asset?.url || "",
    publishedAt: p.publishedAt,
    readingTime: 5,
    viewCount: 0,
    category: p.categories?.[0] || { id: "", name: "Uncategorized", slug: "" },
    author: {
      id: p.author.id || p.author._id,
      name: p.author.name,
      role: p.author.role || "Content Creator",
      bio: p.author.bio || "",
      avatar: p.author.avatar || p.author.image?.asset?.url || "",
      social: p.author.social || {},
    },
    tags: p.tags || [],
    featured: p.featured || false,
    metaTitle: p.metaTitle || "",
    metaDescription: p.metaDescription || "",
  }));

  return (
    <div className="min-h-screen bg-background">
      <BlogPostHero post={formattedPost} />
      <article className="prose prose-lg mx-auto max-w-3xl px-4 py-12">
        <div className="article-content">
          <PortableText value={post.content} components={portableTextComponents} />
        </div>
      </article>
      <AuthorBio author={formattedPost.author} />
      {formattedRelatedPosts.length > 0 && <RelatedPosts posts={formattedRelatedPosts} />}
      <ShareButtons url={`${process.env.NEXT_PUBLIC_SITE_URL || ""}/blog/${post.slug}`} title={post.title} />
      <BackToBlogButton />
    </div>
  );
}

// ----------------------------
// Helper: reading time
// ----------------------------
function calculateReadingTime(content: any[]): number {
  if (!content) return 5;
  const text = content
    .filter((block) => block._type === "block")
    .map((block) =>
      block.children
        .filter((child: any) => child._type === "span")
        .map((child: any) => child.text)
        .join("")
    )
    .join(" ");
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute) || 5;
}