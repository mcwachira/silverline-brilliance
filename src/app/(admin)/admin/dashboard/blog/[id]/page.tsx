"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import {
  sanityClient,
  BLOG_POST_BY_ID_QUERY,
  CATEGORIES_QUERY,
  AUTHORS_QUERY,
} from "@/src/sanity/lib/sanity";
import type { BlogPost, SanityCategory, SanityAuthor, PostFormData } from "@/types/types";
import BlogPostEditor from "@/src/components/admin/blog/BlogPostEditor";

// ── Loading skeleton ──────────────────────────────────────────────

function EditorSkeleton() {
  return (
    <div className="space-y-5 max-w-4xl animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div
          className="w-9 h-9 rounded-lg"
          style={{ background: "oklch(1 0 0 / 0.05)" }}
        />
        <div className="space-y-2">
          <div
            className="h-6 w-36 rounded"
            style={{ background: "oklch(1 0 0 / 0.08)" }}
          />
          <div
            className="h-3.5 w-52 rounded"
            style={{ background: "oklch(1 0 0 / 0.04)" }}
          />
        </div>
      </div>

      {/* Main + sidebar grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div
            className="card h-56"
            style={{ background: "oklch(1 0 0 / 0.02)" }}
          />
          <div
            className="card h-24"
            style={{ background: "oklch(1 0 0 / 0.02)" }}
          />
          <div
            className="card h-40"
            style={{ background: "oklch(1 0 0 / 0.02)" }}
          />
        </div>
        <div className="space-y-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="card"
              style={{
                height: i === 2 ? "120px" : "80px",
                background: "oklch(1 0 0 / 0.02)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────

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

  async function handleSave(data: PostFormData, publish: boolean) {
    const updates: Record<string, unknown> = {
      title: data.title,
      slug: { _type: "slug", current: data.slug },
      excerpt: data.excerpt || undefined,
      tags: data.tags.length > 0 ? data.tags : [],
      metaTitle: data.metaTitle || undefined,
      metaDescription: data.metaDescription || undefined,
      author: data.authorId
        ? { _type: "reference", _ref: data.authorId }
        : undefined,
      categories: data.categoryIds.map((rid) => ({
        _type: "reference",
        _ref: rid,
      })),
    };

    // Only set publishedAt if publishing and not already published
    if (publish && !post?.publishedAt) {
      updates.publishedAt = new Date().toISOString();
    }

    // Allow unpublishing
    if (!publish && post?.publishedAt) {
      await sanityClient.patch(id).unset(["publishedAt"]).commit();
    }

    await sanityClient.patch(id).set(updates).commit();
    toast.success(publish ? "Post published!" : "Draft saved!");
    router.refresh();
  }

  if (loading) return <EditorSkeleton />;
  if (!post) return null;

  return (
    <BlogPostEditor
      mode="edit"
      post={post}
      categories={categories}
      authors={authors}
      loadingMeta={false}
      onSave={handleSave}
    />
  );
}