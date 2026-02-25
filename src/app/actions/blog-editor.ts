"use server"
import { client } from "@/src/sanity/lib/client";
import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import type { PortableTextBlock } from "@/src/lib/portable-text";
import type { ActionResult } from "@/types/admin";


const sanityWriteClient = client;
// ─── Input / Output types ─────────────────────────────────────────────────────

export interface BlogPostInput {
  title: string;
  slug: string;
  excerpt: string;
  content: PortableTextBlock[];
  authorId: string;
  categoryIds: string[];
  tags: string[];
  metaTitle: string;
  metaDescription: string;
}

export interface SavedPost {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt?: string;
}

function buildDoc(
  input: BlogPostInput,
  publish: boolean
): Record<string, unknown> {
  return {
    title: input.title.trim(),
    slug: { _type: "slug", current: input.slug.trim() },
    excerpt: input.excerpt.trim() || undefined,
    content: input.content,
    tags: input.tags.filter(Boolean),
    metaTitle: input.metaTitle.trim() || undefined,
    metaDescription: input.metaDescription.trim() || undefined,
    author: input.authorId
      ? { _type: "reference", _ref: input.authorId }
      : undefined,
    categories: input.categoryIds.map((id) => ({
      _type: "reference",
      _ref: id,
    })),
    ...(publish ? { publishedAt: new Date().toISOString() } : {}),
  };
}

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createBlogPost(
  input: BlogPostInput,
  publish: boolean
): Promise<ActionResult<SavedPost>> {

    try {
        const supabase = await createServerSupabaseClient();

         const {data: { user },error} = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorised" };

    if (!input.title.trim()) {
      return { success: false, error: "Title is required" };
    }
    if (!input.slug.trim()) {
      return { success: false, error: "Slug is required" };
    }
      const doc = {
      _type: "blogPost",
      ...buildDoc(input, publish),
    };

    const created = await sanityWriteClient.create(doc);

    return {
      success: true,
      data: {
        _id: created._id,
        title: created.title as string,
        slug: created.slug as { current: string },
        publishedAt: created.publishedAt as string | undefined,
      },
    };
  } catch (err) {
    console.error("[createBlogPost]", err);
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Failed to create post",
    };
}
}

// ─── Update ───────────────────────────────────────────────────────────────────

export async function updateBlogPost(
  id: string,
  input: BlogPostInput,
  publish: boolean,
  currentlyPublished: boolean
): Promise<ActionResult<SavedPost>> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorised" };

    if (!input.title.trim()) {
      return { success: false, error: "Title is required" };
    }
    if (!input.slug.trim()) {
      return { success: false, error: "Slug is required" };
    }

    const updates = buildDoc(input, false); // Don't set publishedAt here yet

    let patch = sanityWriteClient.patch(id).set(updates);

    if (publish && !currentlyPublished) {
      patch = patch.set({ publishedAt: new Date().toISOString() });
    } else if (!publish && currentlyPublished) {
      patch = patch.unset(["publishedAt"]);
    }

    const updated = await patch.commit();

    return {
      success: true,
      data: {
        _id: updated._id,
        title: updated.title as string,
        slug: updated.slug as { current: string },
        publishedAt: updated.publishedAt as string | undefined,
      },
    };
  } catch (err) {
    console.error("[updateBlogPost]", err);
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Failed to update post",
    };
  }
}

// ─── Image Upload ─────────────────────────────────────────────────────────────

export interface UploadedImage {
  assetRef: string;
  url: string;
  width?: number;
  height?: number;
}

export async function uploadImageToSanity(
  formData: FormData
): Promise<ActionResult<UploadedImage>> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorised" };

    const file = formData.get("file") as File | null;
    if (!file) return { success: false, error: "No file provided" };

    if (!file.type.startsWith("image/")) {
      return { success: false, error: "File must be an image" };
    }

    const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
    if (file.size > MAX_SIZE) {
      return { success: false, error: "Image must be under 10 MB" };
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const asset = await sanityWriteClient.assets.upload("image", buffer, {
      filename: file.name,
      contentType: file.type,
    });

    return {
      success: true,
      data: {
        assetRef: asset._id,
        url: asset.url,
        width: asset.metadata?.dimensions?.width,
        height: asset.metadata?.dimensions?.height,
      },
    };
  } catch (err) {
    console.error("[uploadImageToSanity]", err);
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Failed to upload image",
    };
  }
}