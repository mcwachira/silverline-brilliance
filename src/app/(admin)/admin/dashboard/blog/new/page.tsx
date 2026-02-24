"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  sanityClient,
  CATEGORIES_QUERY,
  AUTHORS_QUERY,
} from "@/src/sanity/lib/sanity";
import type { SanityCategory, SanityAuthor } from "@/types/types";
import { createBlogPost } from "@/src/app/actions/blog-editor";
import BlogEditorForm, {
  type BlogFormValues,
} from "@/src/components/admin/blog/BlogEditorForm";
import type { PortableTextBlock } from "@/src/lib/portable-text";

export default function NewBlogPostPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<SanityCategory[]>([]);
  const [authors, setAuthors] = useState<SanityAuthor[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [cats, auths] = await Promise.all([
          sanityClient.fetch(CATEGORIES_QUERY),
          sanityClient.fetch(AUTHORS_QUERY),
        ]);
        setCategories(cats);
        setAuthors(auths);
      } catch {
        toast.error("Failed to load categories and authors");
      } finally {
        setLoadingMeta(false);
      }
    }
    load();
  }, []);

  async function handleSave(
    values: BlogFormValues,
    content: PortableTextBlock[],
    publish: boolean
  ) {
    const result = await createBlogPost(
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
      publish
    );

    if (!result.success || !result.data) {
      toast.error(result.error ?? "Failed to save post");
      throw new Error(result.error ?? "Failed to save post");
    }

    toast.success(publish ? "Post published!" : "Draft saved!");
    router.push(`/admin/dashboard/blog/${result.data._id}/edit`);
  }

  return (
    <BlogEditorForm
      mode="create"
      categories={categories}
      authors={authors}
      loadingMeta={loadingMeta}
      onSave={handleSave}
      sanityStudioUrl={process.env.NEXT_PUBLIC_SANITY_STUDIO_URL}
    />
  );
}