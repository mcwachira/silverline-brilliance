import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  getPostBySlug,
  getAllPostSlugs,
  getRelatedPosts,
} from "@/src/sanity/lib/queries";
import { BlogPost } from "@/src/lib/blog/types";
import { calculateReadingTime, getOgImageUrl } from "@/src/lib/blog/utils";
import { BlogPostHero } from "@/src/components/blog/BlogPostHero";
import { BlogPostContent } from "@/src/components/blog/BlogPostContent";
import { AuthorBio } from "@/src/components/blog/AuthorBio";
import RelatedPosts from "@/src/components/blog/RelatedPosts";
import { ShareButtons } from "@/src/components/blog/ShareButtons";
import { TableOfContents } from "@/src/components/blog/TableOfContents";
import { BackToBlogButton } from "@/src/components/blog/BackToBlogButton";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all blog posts (for SSG)
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug: string) => ({ slug }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found | Silverline Technologies",
      description: "The requested blog post could not be found.",
    };
  }

  const ogImage = getOgImageUrl(post as unknown as BlogPost);

  return {
    title: post.metaTitle || `${post.title} | Silverline Technologies`,
    description: post.metaDescription || post.excerpt,
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      authors: [post.author.name],
      images: ogImage ? [{ url: ogImage }] : [],
      tags: post.tags || [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      images: ogImage ? [ogImage] : [],
      creator: post.author.social?.twitter,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  // Calculate reading time from content
  const readingTime = calculateReadingTime(post.content);

  // Format post data
  const formattedPost: BlogPost = {
    _id: post._id,
    status: post.status || "published",
    id: post._id,
    title: post.title,
    slug: { current: post.slug },
    excerpt: post.excerpt,
    coverImage: post.mainImage?.asset?.url || "",
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    readingTime,
    viewCount: post.viewCount || 0,
    category: {
      name: post.category?.name || "Uncategorized",
      slug: post.category?.slug || "uncategorized",
    },
    author: {
      id: post.author._id,
      name: post.author.name,
      role: post.author.role || "Content Creator",
      bio: post.author.bio || [],
      avatar: post.author.image?.asset?.url || "",
      social: post.author.social || {},
    },
    tags: post.tags || [],
    featured: post.featured || false,
    metaTitle: post.metaTitle || "",
    metaDescription: post.metaDescription || "",
    content: post.content,
    mainImage: post.mainImage,
    ogImage: post.ogImage,
  };

  // Get related posts
  const categoryIds = post.categories?.map((cat: any) => cat._id) || [];
  const relatedPostsRaw = await getRelatedPosts(post._id, categoryIds, 3);

  const formattedRelatedPosts: BlogPost[] = relatedPostsRaw.map((p: any) => ({
    _id: p._id,
    status: p.status || "published",
    id: p._id,
    title: p.title,
    slug: { current: p.slug },
    excerpt: p.excerpt,
    coverImage: p.mainImage?.asset?.url || "",
    publishedAt: p.publishedAt,
    readingTime: 5,
    viewCount: 0,
    category: {
      name: p.categories?.[0]?.name || "Uncategorized",
      slug: p.categories?.[0]?.slug || "uncategorized",
    },
    author: {
      id: p.author._id,
      name: p.author.name,
      role: "Content Creator",
      bio: "",
      avatar: p.author.image?.asset?.url || "",
      social: {},
    },
    tags: [],
    featured: false,
    metaTitle: "",
    metaDescription: "",
  }));

  // Build post URL for sharing
  const postUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}`;

  // Generate structured data for rich snippets
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: formattedPost.coverImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author.name,
      url: post.author.social?.twitter,
    },
    publisher: {
      "@type": "Organization",
      name: "Silverline Technologies",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-background">
        {/* Back to Blog Button - Fixed Position */}
        <BackToBlogButton />

        {/* Hero Section */}
        <BlogPostHero post={formattedPost} />

        {/* Main Content Area */}
        <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Table of Contents - Hidden on mobile, sticky on desktop */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-24">
                <Suspense
                  fallback={
                    <div className="h-64 animate-pulse bg-muted rounded-lg" />
                  }
                >
                  <TableOfContents content={post.content} />
                </Suspense>
              </div>
            </aside>

            {/* Main Article Content */}
            <article className="lg:col-span-9">
              <BlogPostContent content={post.content} />
            </article>
          </div>
        </div>

        {/* Author Bio */}
        <AuthorBio author={formattedPost.author} />

        {/* Share Buttons */}
        <ShareButtons url={postUrl} title={post.title} />

        {/* Related Posts */}
        {formattedRelatedPosts.length > 0 && (
          <Suspense fallback={<div className="h-96 animate-pulse bg-muted" />}>
            <RelatedPosts posts={formattedRelatedPosts} />
          </Suspense>
        )}
      </div>
    </>
  );
}
