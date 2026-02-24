"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  sanityClient,
  BLOG_POST_BY_ID_QUERY,
  CATEGORIES_QUERY,
  AUTHORS_QUERY,
} from "@/src/sanity/lib/sanity";
import type { BlogPost, SanityCategory, SanityAuthor } from "@/types/types";
import { getBlogStatus } from "@/types/types";
import { updateBlogPost } from "@/src/app/actions/blog-editor";
import BlogEditorForm, {
  type BlogFormValues,
} from "@/src/components/admin/blog/BlogEditorForm";
import type { PortableTextBlock } from "@/src/lib/portable-text";

// ── Loading skeleton ──────────────────────────────────────────────────────────

function EditSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="flex items-center gap-4">
        <div
          className="w-9 h-9 rounded-lg"
          style={{ background: "oklch(1 0 0 / 0.05)" }}
        />
        <div className="space-y-2">
          <div
            className="h-7 w-48 rounded"
            style={{ background: "oklch(1 0 0 / 0.08)" }}
          />
          <div
            className="h-3.5 w-32 rounded"
            style={{ background: "oklch(1 0 0 / 0.04)" }}
          />
        </div>
        <div className="ml-auto flex gap-2">
          <div
            className="h-9 w-28 rounded-lg"
            style={{ background: "oklch(1 0 0 / 0.05)" }}
          />
          <div
            className="h-9 w-28 rounded-lg"
            style={{ background: "oklch(1 0 0 / 0.08)" }}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div
            className="card h-56"
            style={{ background: "oklch(1 0 0 / 0.02)" }}
          />
          <div
            className="rounded-xl h-96"
            style={{
              background: "oklch(1 0 0 / 0.02)",
              border: "1px solid var(--border)",
            }}
          />
          <div
            className="card h-40"
            style={{ background: "oklch(1 0 0 / 0.02)" }}
          />
        </div>
        <div className="space-y-4">
          {[80, 120, 100, 80].map((h, i) => (
            <div
              key={i}
              className="card"
              style={{
                height: `${h}px`,
                background: "oklch(1 0 0 / 0.02)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EditBlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [categories, setCategories] = useState<SanityCategory[]>([]);
  const [authors, setAuthors] = useState<SanityAuthor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [p, cats, auths] = await Promise.all([
          sanityClient.fetch(BLOG_POST_BY_ID_QUERY, { id }),
          sanityClient.fetch(CATEGORIES_QUERY),
          sanityClient.fetch(AUTHORS_QUERY),
        ]);

        if (!p) {
          toast.error("Post not found");
          router.push("/admin/dashboard/blog");
          return;
        }

        setPost(p);
        setCategories(cats);
        setAuthors(auths);
      } catch {
        toast.error("Failed to load post");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

  async function handleSave(
    values: BlogFormValues,
    content: PortableTextBlock[],
    publish: boolean
  ) {
    if (!post) return;

    const currentlyPublished = getBlogStatus(post) === "published";

    const result = await updateBlogPost(
      id,
      {
        title: values.title,
        slug: values.slug,
        excerpt: values.excerpt ?? "",
        content,
        authorId: values.authorId ?? "",
        categoryIds: values.categoryIds ?? [],
        tags: values.tags ?? [],
        metaTitle: values.metaTitle ?? "",
        metaDescription: values.metaDescription ?? "",
      },
      publish,
      currentlyPublished
    );

    if (!result.success) {
      toast.error(result.error ?? "Failed to save post");
      throw new Error(result.error ?? "Failed to save post");
    }

    toast.success(
      publish
        ? currentlyPublished
          ? "Post updated!"
          : "Post published!"
        : currentlyPublished
        ? "Post unpublished and saved as draft"
        : "Draft saved!"
    );

    // Refresh the post to get updated publishedAt etc.
    const updated = await sanityClient.fetch(BLOG_POST_BY_ID_QUERY, { id });
    if (updated) setPost(updated);
  }

  if (loading) return <EditSkeleton />;
  if (!post) return null;

  const isPublished = getBlogStatus(post) === "published";

  return (
    <BlogEditorForm
      mode="edit"
      postId={id}
      defaultValues={{
        title: post.title ?? "",
        slug: post.slug?.current ?? "",
        excerpt: post.excerpt ?? "",
        authorId: post.author?._id ?? "",
        categoryIds: post.categories?.map((c) => c._id) ?? [],
        tags: (post.tags as string[] | undefined) ?? [],
        metaTitle: post.metaTitle ?? "",
        metaDescription: post.metaDescription ?? "",
      }}
      defaultContent={
        (post.content as PortableTextBlock[] | undefined) ?? []
      }
      isPublished={isPublished}
      categories={categories}
      authors={authors}
      loadingMeta={false}
      onSave={handleSave}
      sanityStudioUrl={process.env.NEXT_PUBLIC_SANITY_STUDIO_URL}
    />
  );
}