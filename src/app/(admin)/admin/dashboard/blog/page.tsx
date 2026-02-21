"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  sanityClient,
  BLOG_POSTS_ADMIN_QUERY,
  deleteBlogPost,
  publishBlogPost,
  unpublishBlogPost,
  duplicateBlogPost,
  urlFor,
} from "@/src/sanity/lib/sanity";
import type { BlogPost } from "@/types/types";
import { StatusBadge } from "@/src/components/admin/shared/StatusBadge";
import ConfirmDialog from "@/src/components/admin/shared/ConfirmDialog";
import {
  Plus,
  Search,
  RefreshCw,
  Edit2,
  Trash2,
  Copy,
  Globe,
  EyeOff,
  FileText,
  Loader2,
  LayoutGrid,
} from "lucide-react";

type StatusFilter = "all" | "published" | "draft" | "scheduled";

function pluralize(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

// ── Skeleton row ──────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex-shrink-0"
            style={{ background: "oklch(1 0 0 / 0.05)" }}
          />
          <div className="space-y-1.5">
            <div
              className="h-3.5 w-40 rounded"
              style={{ background: "oklch(1 0 0 / 0.06)" }}
            />
            <div
              className="h-3 w-24 rounded"
              style={{ background: "oklch(1 0 0 / 0.04)" }}
            />
          </div>
        </div>
      </td>
      {[1, 2, 3, 4].map((i) => (
        <td key={i} className="px-4 py-3.5">
          <div
            className="h-3.5 w-20 rounded"
            style={{ background: "oklch(1 0 0 / 0.05)" }}
          />
        </td>
      ))}
      <td className="px-4 py-3.5">
        <div className="flex gap-1.5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-7 h-7 rounded-lg"
              style={{ background: "oklch(1 0 0 / 0.05)" }}
            />
          ))}
        </div>
      </td>
    </tr>
  );
}

// ── Empty state ───────────────────────────────────────────────────

function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <tr>
      <td colSpan={6}>
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: "oklch(0.49 0.18 302 / 0.1)",
              border: "1px solid oklch(0.49 0.18 302 / 0.2)",
            }}
          >
            <FileText
              className="w-7 h-7"
              style={{ color: "var(--text-faint)" }}
            />
          </div>
          <div className="text-center">
            <p
              className="text-sm font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              {hasSearch ? "No posts match your search" : "No blog posts yet"}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-faint)" }}>
              {hasSearch
                ? "Try adjusting your search or status filter"
                : "Create your first post to get started"}
            </p>
          </div>
          {!hasSearch && (
            <Link
              href="/admin/dashboard/blog/new"
              className="btn-primary mt-1"
            >
              <Plus className="w-4 h-4" />
              Create First Post
            </Link>
          )}
        </div>
      </td>
    </tr>
  );
}

// ── Main page ─────────────────────────────────────────────────────

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filtered, setFiltered] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [deletePost, setDeletePost] = useState<BlogPost | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  async function fetchPosts() {
    setLoading(true);
    try {
      const data = await sanityClient.fetch(BLOG_POSTS_ADMIN_QUERY);
      setPosts(data);
    } catch {
      toast.error("Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    let result = posts;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.author?.name?.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter);
    }
    setFiltered(result);
  }, [posts, search, statusFilter]);

  async function handleDelete() {
    if (!deletePost) return;
    setActionLoading(deletePost._id);
    try {
      await deleteBlogPost(deletePost._id);
      toast.success("Post deleted");
      setPosts((prev) => prev.filter((p) => p._id !== deletePost._id));
    } catch {
      toast.error("Failed to delete post");
    } finally {
      setActionLoading(null);
      setDeletePost(null);
    }
  }

  async function handlePublishToggle(post: BlogPost) {
    setActionLoading(post._id);
    try {
      if (post.status === "published") {
        await unpublishBlogPost(post._id);
        toast.success("Post unpublished");
      } else {
        await publishBlogPost(post._id);
        toast.success("Post published");
      }
      fetchPosts();
    } catch {
      toast.error("Failed to update post status");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDuplicate(post: BlogPost) {
    setActionLoading(post._id);
    try {
      await duplicateBlogPost(post._id);
      toast.success("Post duplicated as draft");
      fetchPosts();
    } catch {
      toast.error("Failed to duplicate post");
    } finally {
      setActionLoading(null);
    }
  }

  const statusCounts: Record<StatusFilter, number> = {
    all: posts.length,
    published: posts.filter((p) => p.status === "published").length,
    draft: posts.filter((p) => p.status === "draft").length,
    scheduled: posts.filter((p) => p.status === "scheduled").length,
  };

  const STATUS_TABS: { key: StatusFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "published", label: "Published" },
    { key: "draft", label: "Draft" },
    { key: "scheduled", label: "Scheduled" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Blog</h1>
          <p className="page-subtitle">
            {loading ? "Loading..." : pluralize(posts.length, "post")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchPosts}
            className="btn-ghost p-2"
            title="Refresh posts"
            disabled={loading}
          >
            <RefreshCw
              className={`w-4 h-4 transition-transform ${loading ? "animate-spin" : ""}`}
            />
          </button>
          <Link href="/admin/dashboard/blog/new" className="btn-primary">
            <Plus className="w-4 h-4" />
            New Post
          </Link>
        </div>
      </div>

      {/* ── Filters + Search bar ── */}
      <div
        className="card px-4 py-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between"
      >
        {/* Status tabs */}
        <div className="flex items-center gap-1 flex-wrap">
          {STATUS_TABS.map(({ key, label }) => {
            const active = statusFilter === key;
            return (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className="relative px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
                style={{
                  background: active
                    ? "oklch(0.88 0.17 85 / 0.15)"
                    : "transparent",
                  color: active ? "var(--accent)" : "var(--text-faint)",
                  border: active
                    ? "1px solid oklch(0.88 0.17 85 / 0.3)"
                    : "1px solid transparent",
                }}
              >
                {label}
                <span
                  className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                  style={{
                    background: active
                      ? "oklch(0.88 0.17 85 / 0.2)"
                      : "oklch(1 0 0 / 0.06)",
                    color: active ? "var(--accent)" : "var(--text-faint)",
                  }}
                >
                  {statusCounts[key]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
            style={{ color: "var(--text-faint)" }}
          />
          <input
            className="input pl-9 py-2 text-sm"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── Table ── */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="pl-4 pr-3 w-[40%]">Post</th>
                <th>Status</th>
                <th>Author</th>
                <th className="hidden lg:table-cell">Categories</th>
                <th className="hidden md:table-cell">Published</th>
                <th className="text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))
              ) : filtered.length === 0 ? (
                <EmptyState hasSearch={!!search || statusFilter !== "all"} />
              ) : (
                filtered.map((post) => {
                  const isLoading = actionLoading === post._id;
                  return (
                    <tr key={post._id} className="group">
                      {/* Post info */}
                      <td className="pl-4 pr-3">
                        <div className="flex items-center gap-3">
                          {/* Thumbnail */}
                          <div
                            className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center"
                            style={{
                              background: "oklch(0.49 0.18 302 / 0.1)",
                              border: "1px solid oklch(0.49 0.18 302 / 0.15)",
                            }}
                          >
                            {post.featuredImage ? (
                              <Image
                                src={urlFor(post.featuredImage)
                                  .width(80)
                                  .height(80)
                                  .url()}
                                alt={post.title}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <LayoutGrid
                                className="w-4 h-4"
                                style={{ color: "var(--text-faint)" }}
                              />
                            )}
                          </div>

                          {/* Title + slug */}
                          <div className="min-w-0">
                            <p
                              className="font-medium text-sm truncate max-w-[200px] lg:max-w-xs group-hover:text-white transition-colors"
                              style={{ color: "var(--text)" }}
                            >
                              {post.title}
                            </p>
                            <p
                              className="text-xs truncate font-mono"
                              style={{ color: "var(--text-faint)" }}
                            >
                              /{post.slug?.current}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td>
                        <StatusBadge status={post.status ?? "draft"} />
                      </td>

                      {/* Author */}
                      <td>
                        <span
                          className="text-xs"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {post.author?.name ?? (
                            <span style={{ color: "var(--text-faint)" }}>
                              —
                            </span>
                          )}
                        </span>
                      </td>

                      {/* Categories */}
                      <td className="hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {(post.categories ?? []).slice(0, 2).map((cat) => (
                            <span
                              key={cat._id}
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold"
                              style={{
                                background: "oklch(0.49 0.18 302 / 0.12)",
                                color: "oklch(0.75 0.15 315)",
                                border:
                                  "1px solid oklch(0.49 0.18 302 / 0.2)",
                              }}
                            >
                              {cat.title ?? cat.name}
                            </span>
                          ))}
                          {(post.categories?.length ?? 0) > 2 && (
                            <span
                              className="text-[10px]"
                              style={{ color: "var(--text-faint)" }}
                            >
                              +{(post.categories?.length ?? 0) - 2}
                            </span>
                          )}
                          {!post.categories?.length && (
                            <span style={{ color: "var(--text-faint)" }}>
                              —
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Published date */}
                      <td className="hidden md:table-cell">
                        <span
                          className="text-xs"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {post.publishedAt
                            ? format(new Date(post.publishedAt), "MMM d, yyyy")
                            : <span style={{ color: "var(--text-faint)" }}>—</span>}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="pr-4">
                        <div className="flex items-center gap-0.5 justify-end">
                          {isLoading ? (
                            <Loader2
                              className="w-4 h-4 animate-spin mx-2"
                              style={{ color: "var(--text-faint)" }}
                            />
                          ) : (
                            <>
                              {/* Edit */}
                              <Link
                                href={`/admin/dashboard/blog/${post._id}`}
                                className="btn-ghost p-1.5 rounded-lg"
                                title="Edit post"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </Link>

                              {/* Publish / Unpublish */}
                              <button
                                onClick={() => handlePublishToggle(post)}
                                disabled={isLoading}
                                className="btn-ghost p-1.5 rounded-lg transition-colors"
                                title={
                                  post.status === "published"
                                    ? "Unpublish"
                                    : "Publish"
                                }
                                style={{
                                  color:
                                    post.status === "published"
                                      ? "oklch(0.62 0.17 145)"
                                      : "var(--text-faint)",
                                }}
                              >
                                {post.status === "published" ? (
                                  <EyeOff className="w-3.5 h-3.5" />
                                ) : (
                                  <Globe className="w-3.5 h-3.5" />
                                )}
                              </button>

                              {/* Duplicate */}
                              <button
                                onClick={() => handleDuplicate(post)}
                                disabled={isLoading}
                                className="btn-ghost p-1.5 rounded-lg"
                                title="Duplicate as draft"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => setDeletePost(post)}
                                className="btn-ghost p-1.5 rounded-lg transition-colors"
                                title="Delete post"
                                style={{ color: "oklch(0.63 0.26 29)" }}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer row count */}
        {!loading && filtered.length > 0 && (
          <div
            className="px-4 py-2.5 border-t flex items-center justify-between"
            style={{
              borderColor: "var(--border)",
              background: "oklch(1 0 0 / 0.01)",
            }}
          >
            <p className="text-xs" style={{ color: "var(--text-faint)" }}>
              Showing {filtered.length} of {posts.length} posts
            </p>
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deletePost}
        title="Delete Post"
        description={`Permanently delete "${deletePost?.title}"? This cannot be undone and will remove it from Sanity.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        onCancel={() => setDeletePost(null)}
      />
    </div>
  );
}