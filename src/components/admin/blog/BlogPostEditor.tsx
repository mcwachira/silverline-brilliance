"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import type {
  BlogPost,
  SanityCategory,
  SanityAuthor,
  PostFormData,
} from "@/types/types";
import { getBlogStatus, slugify } from "@/types/types";
import {
  ArrowLeft,
  Save,
  Globe,
  Eye,
  EyeOff,
  Loader2,
  Plus,
  X,
  Hash,
  ChevronDown,
  BookOpen,
  Check,
  Info,
} from "lucide-react";

interface Props {
  mode: "create" | "edit";
  post?: BlogPost;
  categories: SanityCategory[];
  authors: SanityAuthor[];
  loadingMeta: boolean;
  onSave: (data: PostFormData, publish: boolean) => Promise<void>;
}

// ── Sub-components ────────────────────────────────────────────────

function SectionCard({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`card p-5 space-y-4 ${className}`}>
      {title && (
        <h3
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--text-faint)" }}
        >
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

interface CharCounterProps {
  current: number;
  ideal: number;
  max: number;
}

function CharCounter({ current, ideal, max }: CharCounterProps) {
  const overIdeal = current > ideal;
  const overMax = current > max;
  return (
    <div className="flex items-center justify-between mt-1.5">
      {overIdeal && !overMax ? (
        <span
          className="text-xs flex items-center gap-1"
          style={{ color: "oklch(0.85 0.15 85)" }}
        >
          <Info className="w-3 h-3" /> Getting long
        </span>
      ) : overMax ? (
        <span
          className="text-xs flex items-center gap-1"
          style={{ color: "oklch(0.63 0.26 29)" }}
        >
          <Info className="w-3 h-3" /> Too long
        </span>
      ) : (
        <span />
      )}
      <span
        className="text-xs tabular-nums"
        style={{
          color: overMax
            ? "oklch(0.63 0.26 29)"
            : overIdeal
            ? "oklch(0.85 0.15 85)"
            : "var(--text-faint)",
        }}
      >
        {current}/{max}
      </span>
    </div>
  );
}

// ── Main editor ───────────────────────────────────────────────────

export default function BlogPostEditor({
  mode,
  post,
  categories,
  authors,
  loadingMeta,
  onSave,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [saveType, setSaveType] = useState<"draft" | "publish" | null>(null);
  const [tagInput, setTagInput] = useState("");

  const isPublished = post ? getBlogStatus(post) === "published" : false;

  const [form, setForm] = useState<PostFormData>({
    title: post?.title ?? "",
    slug: post?.slug?.current ?? "",
    excerpt: post?.excerpt ?? "",
    authorId: post?.author?._id ?? "",
    categoryIds: post?.categories?.map((c) => c._id) ?? [],
    tags: (post?.tags as string[]) ?? [],
    metaTitle: post?.metaTitle ?? "",
    metaDescription: post?.metaDescription ?? "",
  });

  const [slugManual, setSlugManual] = useState(mode === "edit");

  function set<K extends keyof PostFormData>(key: K, val: PostFormData[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function handleTitleChange(title: string) {
    set("title", title);
    if (!slugManual) set("slug", slugify(title));
  }

  function toggleCategory(id: string) {
    set(
      "categoryIds",
      form.categoryIds.includes(id)
        ? form.categoryIds.filter((c) => c !== id)
        : [...form.categoryIds, id]
    );
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (!t) return;
    if (form.tags.includes(t)) {
      toast.error("Tag already added");
      return;
    }
    set("tags", [...form.tags, t]);
    setTagInput("");
  }

  function removeTag(t: string) {
    set(
      "tags",
      form.tags.filter((x) => x !== t)
    );
  }

  function validate(): boolean {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return false;
    }
    if (!form.slug.trim()) {
      toast.error("Slug is required");
      return false;
    }
    return true;
  }

  function handleSubmit(publish: boolean) {
    if (!validate()) return;
    setSaveType(publish ? "publish" : "draft");
    startTransition(async () => {
      try {
        await onSave(form, publish);
      } catch (e) {
        toast.error((e as Error).message ?? "Save failed");
      } finally {
        setSaveType(null);
      }
    });
  }

  const busy = isPending;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard/blog"
            className="btn-ghost p-2 flex-shrink-0"
            title="Back to blog list"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="page-title">
              {mode === "create" ? "New Post" : "Edit Post"}
            </h1>
            <p className="page-subtitle">
              {mode === "edit" && post ? (
                isPublished ? (
                  <span style={{ color: "oklch(0.62 0.17 145)" }}>
                    ● Published — changes save immediately
                  </span>
                ) : (
                  <span style={{ color: "var(--text-faint)" }}>○ Draft</span>
                )
              ) : (
                "Manage rich text content in Sanity Studio"
              )}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {mode === "edit" && post && (
            
              <Link href={`${process.env.NEXT_PUBLIC_SANITY_STUDIO_URL ?? ""}/desk/blogPost;${post._id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm"
            >
              <Eye className="w-4 h-4" />
              Open in Studio
            </Link>
          )}

          <button
            onClick={() => handleSubmit(false)}
            disabled={busy}
            className="btn-secondary text-sm"
          >
            {busy && saveType === "draft" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {busy && saveType === "draft" ? "Saving..." : "Save Draft"}
          </button>

          <button
            onClick={() => handleSubmit(true)}
            disabled={busy}
            className="btn-primary text-sm"
          >
            {busy && saveType === "publish" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isPublished ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Globe className="w-4 h-4" />
            )}
            {busy && saveType === "publish"
              ? "Publishing..."
              : isPublished
              ? "Update & Keep Published"
              : "Publish"}
          </button>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ── Main column (2/3) ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Core fields card */}
          <SectionCard>
            {/* Title */}
            <div>
              <label className="label">
                Post Title <span style={{ color: "oklch(0.63 0.26 29)" }}>*</span>
              </label>
              <input
                className="input text-base"
                placeholder="Enter a compelling title..."
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                maxLength={100}
              />
              <CharCounter current={form.title.length} ideal={70} max={100} />
            </div>

            {/* Slug */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label mb-0">
                  URL Slug <span style={{ color: "oklch(0.63 0.26 29)" }}>*</span>
                </label>
                <span className="text-xs" style={{ color: "var(--text-faint)" }}>
                  yoursite.com/blog/
                  <span
                    className="font-semibold font-mono"
                    style={{ color: "var(--accent)" }}
                  >
                    {form.slug || "post-slug"}
                  </span>
                </span>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Hash
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
                    style={{ color: "var(--text-faint)" }}
                  />
                  <input
                    className="input pl-8 font-mono text-sm"
                    placeholder="post-slug"
                    value={form.slug}
                    onChange={(e) => {
                      setSlugManual(true);
                      set(
                        "slug",
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]/g, "-")
                          .replace(/-+/g, "-")
                      );
                    }}
                  />
                </div>
                {slugManual && (
                  <button
                    type="button"
                    className="btn-ghost text-xs whitespace-nowrap px-3"
                    onClick={() => {
                      setSlugManual(false);
                      set("slug", slugify(form.title));
                    }}
                    title="Auto-generate from title"
                  >
                    Auto-generate
                  </button>
                )}
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="label">
                Excerpt{" "}
                <span style={{ color: "var(--text-faint)" }}>
                  (shown in blog listing)
                </span>
              </label>
              <textarea
                className="input resize-none"
                rows={3}
                placeholder="A short description that appears in the blog listing..."
                value={form.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
                maxLength={300}
              />
              <CharCounter
                current={form.excerpt.length}
                ideal={160}
                max={300}
              />
            </div>
          </SectionCard>

          {/* Rich text notice */}
          <div
            className="rounded-xl p-4 flex items-start gap-3"
            style={{
              background: "oklch(0.88 0.17 85 / 0.06)",
              border: "1px solid oklch(0.88 0.17 85 / 0.18)",
            }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: "oklch(0.88 0.17 85 / 0.12)",
                border: "1px solid oklch(0.88 0.17 85 / 0.2)",
              }}
            >
              <BookOpen
                className="w-4 h-4"
                style={{ color: "var(--accent)" }}
              />
            </div>
            <div>
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--accent)" }}
              >
                Rich Text Content
              </p>
              <p
                className="text-xs mt-0.5 leading-relaxed"
                style={{ color: "var(--text-faint)" }}
              >
                Post body uses Sanity's Portable Text editor.{" "}
                {mode === "create"
                  ? 'Save the draft first, then click "Open in Studio" to write the full content.'
                  : 'Use "Open in Studio" above to edit the post body.'}
              </p>
            </div>
          </div>

          {/* SEO */}
          <SectionCard title="SEO Settings">
            <div>
              <label className="label">
                Meta Title{" "}
                <span style={{ color: "var(--text-faint)" }}>
                  (60 chars ideal)
                </span>
              </label>
              <input
                className="input"
                placeholder="SEO title — defaults to post title if blank"
                value={form.metaTitle}
                onChange={(e) => set("metaTitle", e.target.value)}
                maxLength={70}
              />
              <CharCounter
                current={form.metaTitle.length}
                ideal={60}
                max={70}
              />
            </div>
            <div>
              <label className="label">
                Meta Description{" "}
                <span style={{ color: "var(--text-faint)" }}>
                  (160 chars ideal)
                </span>
              </label>
              <textarea
                className="input resize-none"
                rows={3}
                placeholder="Description shown in Google search results..."
                value={form.metaDescription}
                onChange={(e) => set("metaDescription", e.target.value)}
                maxLength={180}
              />
              <CharCounter
                current={form.metaDescription.length}
                ideal={160}
                max={180}
              />
            </div>
          </SectionCard>
        </div>

        {/* ── Sidebar column (1/3) ── */}
        <div className="space-y-4">

          {/* Author */}
          <SectionCard title="Author">
            {loadingMeta ? (
              <div
                className="h-10 rounded-lg animate-pulse"
                style={{ background: "oklch(1 0 0 / 0.05)" }}
              />
            ) : (
              <div className="relative">
                <select
                  className="input appearance-none pr-8 cursor-pointer"
                  value={form.authorId}
                  onChange={(e) => set("authorId", e.target.value)}
                  style={{ background: "oklch(1 0 0 / 0.04)" }}
                >
                  <option value="">No author selected</option>
                  {authors.map((a) => (
                    <option
                      key={a._id}
                      value={a._id}
                      style={{ background: "var(--surface)" }}
                    >
                      {a.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: "var(--text-faint)" }}
                />
              </div>
            )}
          </SectionCard>

          {/* Categories */}
          <SectionCard title="Categories">
            {loadingMeta ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-8 rounded-lg animate-pulse"
                    style={{ background: "oklch(1 0 0 / 0.05)" }}
                  />
                ))}
              </div>
            ) : categories.length === 0 ? (
              <div
                className="flex items-center gap-2 p-2.5 rounded-lg text-xs"
                style={{
                  background: "oklch(1 0 0 / 0.03)",
                  color: "var(--text-faint)",
                  border: "1px dashed oklch(1 0 0 / 0.1)",
                }}
              >
                <Info className="w-3.5 h-3.5 flex-shrink-0" />
                No categories yet. Add them in Sanity Studio.
              </div>
            ) : (
              <div className="space-y-1">
                {categories.map((cat) => {
                  const checked = form.categoryIds.includes(cat._id);
                  return (
                    <button
                      key={cat._id}
                      type="button"
                      onClick={() => toggleCategory(cat._id)}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all duration-150 text-left"
                      style={{
                        background: checked
                          ? "oklch(0.49 0.18 302 / 0.12)"
                          : "transparent",
                        border: checked
                          ? "1px solid oklch(0.49 0.18 302 / 0.3)"
                          : "1px solid transparent",
                      }}
                    >
                      {/* Custom checkbox */}
                      <div
                        className="flex-shrink-0 w-4 h-4 rounded flex items-center justify-center transition-all"
                        style={{
                          background: checked
                            ? "var(--primary)"
                            : "oklch(1 0 0 / 0.06)",
                          border: checked
                            ? "1px solid var(--primary)"
                            : "1px solid oklch(1 0 0 / 0.15)",
                        }}
                      >
                        {checked && (
                          <Check
                            className="w-2.5 h-2.5"
                            style={{ color: "white" }}
                          />
                        )}
                      </div>
                      <span
                        className="text-sm"
                        style={{
                          color: checked ? "var(--text)" : "var(--text-muted)",
                        }}
                      >
                        {cat.name ?? cat.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </SectionCard>

          {/* Tags */}
          <SectionCard title="Tags">
            {/* Existing tags */}
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {form.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: "oklch(0.88 0.17 85 / 0.1)",
                      color: "var(--accent)",
                      border: "1px solid oklch(0.88 0.17 85 / 0.25)",
                    }}
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-0.5 rounded-full hover:opacity-70 transition-opacity"
                      title={`Remove tag "${tag}"`}
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Add tag input */}
            <div className="flex gap-2">
              <input
                className="input text-sm flex-1"
                placeholder="Add a tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <button
                type="button"
                onClick={addTag}
                className="btn-secondary p-2 flex-shrink-0"
                title="Add tag"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs" style={{ color: "var(--text-faint)" }}>
              Press Enter or + to add
            </p>
          </SectionCard>

          {/* Post info (edit mode only) */}
          {mode === "edit" && post && (
            <div
              className="card p-4 space-y-3"
              style={{ fontSize: "12px" }}
            >
              <h3
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--text-faint)" }}
              >
                Post Info
              </h3>

              <div className="space-y-2">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <span style={{ color: "var(--text-faint)" }}>Status</span>
                  <span
                    className="inline-flex items-center gap-1.5 font-semibold"
                    style={{
                      color: isPublished
                        ? "oklch(0.62 0.17 145)"
                        : "var(--text-muted)",
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background: isPublished
                          ? "oklch(0.62 0.17 145)"
                          : "var(--text-faint)",
                      }}
                    />
                    {isPublished ? "Published" : "Draft"}
                  </span>
                </div>

                {/* Published at */}
                {post.publishedAt && (
                  <div className="flex items-center justify-between">
                    <span style={{ color: "var(--text-faint)" }}>
                      Published
                    </span>
                    <span style={{ color: "var(--text-muted)" }}>
                      {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}

                {/* Created */}
                <div className="flex items-center justify-between">
                  <span style={{ color: "var(--text-faint)" }}>Created</span>
                  <span style={{ color: "var(--text-muted)" }}>
                    {new Date(post._createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Last updated */}
                <div className="flex items-center justify-between">
                  <span style={{ color: "var(--text-faint)" }}>Updated</span>
                  <span style={{ color: "var(--text-muted)" }}>
                    {new Date(post._updatedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div
                className="border-t pt-3"
                style={{ borderColor: "var(--border)" }}
              >
                <p
                  className="text-[10px] uppercase tracking-widest font-semibold mb-1.5"
                  style={{ color: "var(--text-faint)" }}
                >
                  Sanity ID
                </p>
                <p
                  className="font-mono text-[10px] truncate select-all"
                  style={{ color: "var(--text-faint)" }}
                >
                  {post._id}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}