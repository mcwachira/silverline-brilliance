"use client";

import { useState, useTransition, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Globe,
  EyeOff,
  Loader2,
  Plus,
  X,
  Hash,
  Check,
  Info,
  ChevronDown,
  Eye,
  BookOpen,
  Sparkles,
} from "lucide-react";
import PortableTextEditor from "@/src/components/admin/editor/PortableTextEditor";
import type { PortableTextBlock } from "@/src/lib/portable-text";
import type { SanityCategory, SanityAuthor } from "@/types/types";
import { slugify } from "@/types/types";

// ─── Schema ───────────────────────────────────────────────────────────────────

const blogSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  excerpt: z.string().max(400).optional().default(""),
  authorId: z.string().optional().default(""),
  categoryIds: z.array(z.string()).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
  metaTitle: z.string().max(70).optional().default(""),
  metaDescription: z.string().max(180).optional().default(""),
});

export type BlogFormValues = z.infer<typeof blogSchema>;

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  mode: "create" | "edit";
  defaultValues?: Partial<BlogFormValues>;
  defaultContent?: PortableTextBlock[];
  isPublished?: boolean;
  postId?: string;
  categories: SanityCategory[];
  authors: SanityAuthor[];
  loadingMeta: boolean;
  onSave: (
    values: BlogFormValues,
    content: PortableTextBlock[],
    publish: boolean
  ) => Promise<void>;
  sanityStudioUrl?: string;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SidebarCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-4 space-y-3">
      <h3
        className="text-[10px] font-bold uppercase tracking-widest"
        style={{ color: "var(--text-faint)" }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

function CharBar({
  current,
  ideal,
  max,
}: {
  current: number;
  ideal: number;
  max: number;
}) {
  const pct = Math.min((current / max) * 100, 100);
  const overIdeal = current > ideal;
  const overMax = current > max;
  const color = overMax
    ? "oklch(0.63 0.26 29)"
    : overIdeal
    ? "oklch(0.85 0.15 85)"
    : "oklch(0.62 0.17 145)";

  return (
    <div className="space-y-1 mt-1.5">
      <div
        className="h-1 rounded-full overflow-hidden"
        style={{ background: "oklch(1 0 0 / 0.06)" }}
      >
        <div
          className="h-1 rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <div className="flex justify-between">
        {overIdeal ? (
          <span className="text-[10px]" style={{ color }}>
            <Info className="w-3 h-3 inline mr-0.5" />
            {overMax ? "Too long" : "Getting long"}
          </span>
        ) : (
          <span />
        )}
        <span className="text-[10px]" style={{ color: "var(--text-faint)" }}>
          {current}/{max}
        </span>
      </div>
    </div>
  );
}

// ─── Main Form Component ──────────────────────────────────────────────────────

export default function BlogEditorForm({
  mode,
  defaultValues,
  defaultContent = [],
  isPublished = false,
  postId,
  categories,
  authors,
  loadingMeta,
  onSave,
  sanityStudioUrl,
}: Props) {
  const [content, setContent] = useState<PortableTextBlock[]>(defaultContent);
  const [tagInput, setTagInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const [saveType, setSaveType] = useState<"draft" | "publish" | null>(null);
  const [slugManual, setSlugManual] = useState(mode === "edit");

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      authorId: "",
      categoryIds: [],
      tags: [],
      metaTitle: "",
      metaDescription: "",
      ...defaultValues,
    },
  });

  const watchTitle = watch("title");
  const watchSlug = watch("slug");
  const watchExcerpt = watch("excerpt") ?? "";
  const watchMetaTitle = watch("metaTitle") ?? "";
  const watchMetaDescription = watch("metaDescription") ?? "";
  const watchTags = watch("tags") ?? [];
  const watchCategoryIds = watch("categoryIds") ?? [];

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setValue("title", val);
    if (!slugManual) {
      setValue("slug", slugify(val));
    }
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (!t) return;
    if (watchTags.includes(t)) {
      toast.error("Tag already exists");
      return;
    }
    setValue("tags", [...watchTags, t]);
    setTagInput("");
  }

  function removeTag(t: string) {
    setValue(
      "tags",
      watchTags.filter((x) => x !== t)
    );
  }

  function toggleCategory(id: string) {
    const current = watchCategoryIds;
    setValue(
      "categoryIds",
      current.includes(id)
        ? current.filter((c) => c !== id)
        : [...current, id]
    );
  }

  function submit(publish: boolean) {
    handleSubmit(async (values) => {
      setSaveType(publish ? "publish" : "draft");
      startTransition(async () => {
        try {
          await onSave(values, content, publish);
        } catch (e) {
          toast.error((e as Error).message ?? "Save failed");
        } finally {
          setSaveType(null);
        }
      });
    })();
  }

  const busy = isPending;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Page header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard/blog"
            className="btn-ghost p-2 flex-shrink-0"
            title="Back to blog"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="page-title">
              {mode === "create" ? "New Post" : "Edit Post"}
            </h1>
            <p className="page-subtitle">
              {mode === "edit" ? (
                isPublished ? (
                  <span style={{ color: "oklch(0.62 0.17 145)" }}>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-current mr-1.5 align-middle" />
                    Published
                  </span>
                ) : (
                  <span style={{ color: "var(--text-faint)" }}>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-current mr-1.5 align-middle" />
                    Draft
                  </span>
                )
              ) : (
                "Write and publish directly from your dashboard"
              )}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {mode === "edit" && postId && sanityStudioUrl && (
            
              <Link href={`${sanityStudioUrl}/desk/blogPost;${postId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm"
            >
              <Eye className="w-4 h-4" />
              Open in Studio
            </Link>
          )}

          <button
            type="button"
            onClick={() => submit(false)}
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
            type="button"
            onClick={() => submit(true)}
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
              ? "Update Post"
              : "Publish"}
          </button>
        </div>
      </div>

      {/* ── Two-column grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* ── Main column ── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Core fields */}
          <div className="card p-5 space-y-5">
            {/* Title */}
            <div>
              <label className="label">
                Post Title{" "}
                <span style={{ color: "oklch(0.63 0.26 29)" }}>*</span>
              </label>
              <input
                {...register("title")}
                onChange={handleTitleChange}
                className={`input text-base ${errors.title ? "border-red-500" : ""}`}
                placeholder="Enter a compelling title..."
                maxLength={200}
              />
              {errors.title && (
                <p
                  className="text-xs mt-1"
                  style={{ color: "oklch(0.63 0.26 29)" }}
                >
                  {errors.title.message}
                </p>
              )}
              <CharBar
                current={watchTitle?.length ?? 0}
                ideal={70}
                max={200}
              />
            </div>

            {/* Slug */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label mb-0">
                  URL Slug{" "}
                  <span style={{ color: "oklch(0.63 0.26 29)" }}>*</span>
                </label>
                <span className="text-[11px]" style={{ color: "var(--text-faint)" }}>
                  /blog/
                  <span
                    className="font-semibold font-mono"
                    style={{ color: "var(--accent)" }}
                  >
                    {watchSlug || "post-slug"}
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
                    {...register("slug")}
                    className={`input pl-8 font-mono text-sm ${
                      errors.slug ? "border-red-500" : ""
                    }`}
                    placeholder="post-slug"
                    onChange={(e) => {
                      setSlugManual(true);
                      setValue(
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
                    className="btn-ghost text-xs whitespace-nowrap px-3 gap-1.5"
                    onClick={() => {
                      setSlugManual(false);
                      setValue("slug", slugify(getValues("title")));
                    }}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Auto
                  </button>
                )}
              </div>
              {errors.slug && (
                <p
                  className="text-xs mt-1"
                  style={{ color: "oklch(0.63 0.26 29)" }}
                >
                  {errors.slug.message}
                </p>
              )}
            </div>

            {/* Excerpt */}
            <div>
              <label className="label">
                Excerpt{" "}
                <span
                  className="font-normal ml-1"
                  style={{ color: "var(--text-faint)" }}
                >
                  (shown in blog listing)
                </span>
              </label>
              <textarea
                {...register("excerpt")}
                className="input resize-none"
                rows={3}
                placeholder="A short description that appears in the blog listing..."
                maxLength={400}
              />
              <CharBar
                current={watchExcerpt.length}
                ideal={160}
                max={400}
              />
            </div>
          </div>

          {/* ── Rich Text Editor ── */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div
                className="w-1 h-5 rounded-full flex-shrink-0"
                style={{
                  background:
                    "linear-gradient(180deg, var(--accent), var(--primary))",
                }}
              />
              <label
                className="text-sm font-semibold"
                style={{
                  color: "var(--text)",
                  fontFamily: "Playfair Display, serif",
                }}
              >
                Content
              </label>
              <span
                className="text-xs ml-1"
                style={{ color: "var(--text-faint)" }}
              >
                Saves as Portable Text
              </span>
            </div>
            <PortableTextEditor
              value={content}
              onChange={setContent}
              placeholder="Start writing your post..."
              disabled={busy}
              minHeight={480}
            />
          </div>

          {/* ── SEO ── */}
          <div className="card p-5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-1 h-5 rounded-full flex-shrink-0"
                style={{
                  background:
                    "linear-gradient(180deg, oklch(0.65 0.15 220), oklch(0.49 0.18 302))",
                }}
              />
              <h3
                className="text-sm font-semibold"
                style={{
                  color: "var(--text)",
                  fontFamily: "Playfair Display, serif",
                }}
              >
                SEO Settings
              </h3>
            </div>

            <div>
              <label className="label">
                Meta Title{" "}
                <span
                  className="font-normal"
                  style={{ color: "var(--text-faint)" }}
                >
                  (60 chars ideal)
                </span>
              </label>
              <input
                {...register("metaTitle")}
                className="input"
                placeholder="SEO title — defaults to post title if blank"
                maxLength={70}
              />
              <CharBar
                current={watchMetaTitle.length}
                ideal={60}
                max={70}
              />
            </div>

            <div>
              <label className="label">
                Meta Description{" "}
                <span
                  className="font-normal"
                  style={{ color: "var(--text-faint)" }}
                >
                  (160 chars ideal)
                </span>
              </label>
              <textarea
                {...register("metaDescription")}
                className="input resize-none"
                rows={3}
                placeholder="Description shown in Google search results..."
                maxLength={180}
              />
              <CharBar
                current={watchMetaDescription.length}
                ideal={160}
                max={180}
              />
            </div>
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-4 lg:sticky lg:top-6">
          {/* Author */}
          <SidebarCard title="Author">
            {loadingMeta ? (
              <div
                className="h-10 rounded-lg animate-pulse"
                style={{ background: "oklch(1 0 0 / 0.05)" }}
              />
            ) : (
              <div className="relative">
                <Controller
                  name="authorId"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="input appearance-none pr-8 cursor-pointer"
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
                  )}
                />
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: "var(--text-faint)" }}
                />
              </div>
            )}
          </SidebarCard>

          {/* Categories */}
          <SidebarCard title="Categories">
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
                className="flex items-center gap-2 p-3 rounded-lg text-xs"
                style={{
                  background: "oklch(1 0 0 / 0.02)",
                  color: "var(--text-faint)",
                  border: "1px dashed oklch(1 0 0 / 0.1)",
                }}
              >
                <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
                No categories yet. Add in Sanity Studio.
              </div>
            ) : (
              <div className="space-y-1">
                {categories.map((cat) => {
                  const checked = watchCategoryIds.includes(cat._id);
                  return (
                    <button
                      key={cat._id}
                      type="button"
                      onClick={() => toggleCategory(cat._id)}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all duration-100 text-left"
                      style={{
                        background: checked
                          ? "oklch(0.49 0.18 302 / 0.12)"
                          : "transparent",
                        border: `1px solid ${
                          checked
                            ? "oklch(0.49 0.18 302 / 0.3)"
                            : "transparent"
                        }`,
                      }}
                    >
                      <div
                        className="flex-shrink-0 w-4 h-4 rounded flex items-center justify-center transition-all"
                        style={{
                          background: checked
                            ? "var(--primary)"
                            : "oklch(1 0 0 / 0.06)",
                          border: `1px solid ${
                            checked
                              ? "var(--primary)"
                              : "oklch(1 0 0 / 0.15)"
                          }`,
                        }}
                      >
                        {checked && (
                          <Check className="w-2.5 h-2.5 text-white" />
                        )}
                      </div>
                      <span
                        className="text-sm truncate"
                        style={{
                          color: checked
                            ? "var(--text)"
                            : "var(--text-muted)",
                        }}
                      >
                        {cat.name ?? cat.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </SidebarCard>

          {/* Tags */}
          <SidebarCard title="Tags">
            {watchTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {watchTags.map((tag) => (
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
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:opacity-70 transition-opacity ml-0.5"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
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
                className="btn-secondary p-2.5 flex-shrink-0"
                title="Add tag"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <p
              className="text-[11px]"
              style={{ color: "var(--text-faint)" }}
            >
              Press Enter or + to add
            </p>
          </SidebarCard>

          {/* Post info (edit only) */}
          {mode === "edit" && postId && (
            <div className="card p-4 space-y-3">
              <h3
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: "var(--text-faint)" }}
              >
                Post Info
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span style={{ color: "var(--text-faint)" }}>
                    Status
                  </span>
                  <span
                    className="flex items-center gap-1.5 font-semibold"
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
              </div>
              <div
                className="border-t pt-3"
                style={{ borderColor: "var(--border)" }}
              >
                <p
                  className="text-[10px] uppercase tracking-widest font-semibold mb-1"
                  style={{ color: "var(--text-faint)" }}
                >
                  ID
                </p>
                <p
                  className="font-mono text-[10px] truncate select-all break-all"
                  style={{ color: "var(--text-faint)" }}
                >
                  {postId}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}