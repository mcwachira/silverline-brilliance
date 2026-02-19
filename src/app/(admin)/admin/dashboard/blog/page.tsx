"use client";

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
} from "@/src/sanity/lib/sanity";
import type { BlogPost } from "@/types/types";
import StatusBadge from "@/src/components/shared/StatusBadge";
import ConfirmDialog from "@/src/components/shared/ConfirmDialog";
import {
  Plus,
  Search,
  RefreshCw,
  Eye,
  Edit2,
  Trash2,
  Copy,
  Globe,
  EyeOff,
  FileText,
  ChevronDown,
  Image,
} from "lucide-react";
import { urlFor } from "@/src/sanity/lib/sanity";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filtered, setFiltered] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
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
          p.author?.name?.toLowerCase().includes(q),
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
      setPosts(posts.filter((p) => p._id !== deletePost._id));
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

  const statusCounts = {
    all: posts.length,
    published: posts.filter((p) => p.status === "published").length,
    draft: posts.filter((p) => p.status === "draft").length,
    scheduled: posts.filter((p) => p.status === "scheduled").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Blog</h1>
          <p className="page-subtitle">{posts.length} posts total</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchPosts}
            className="btn-ghost p-2"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link href="/admin/dashboard/blog/new" className="btn-primary">
            <Plus className="w-4 h-4" />
            New Post
          </Link>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 flex-wrap">
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              statusFilter === status ? "btn-primary" : "btn-secondary"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "var(--text-faint)" }}
          />
          <input
            className="input pl-9"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Posts Grid / List */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="card h-48 animate-pulse"
              style={{ background: "rgba(255,255,255,0.02)" }}
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16">
          <FileText
            className="w-12 h-12 mb-4"
            style={{ color: "var(--text-faint)" }}
          />
          <p className="text-sm" style={{ color: "var(--text-faint)" }}>
            {search ? "No posts match your search" : "No posts yet"}
          </p>
          {!search && (
            <Link href="/dashboard/blog/new" className="btn-primary mt-4">
              <Plus className="w-4 h-4" /> Create First Post
            </Link>
          )}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>Post</th>
                <th>Status</th>
                <th>Author</th>
                <th>Categories</th>
                <th>Published</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((post) => (
                <tr key={post._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      {post.featuredImage ? (
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={urlFor(post.featuredImage)
                              .width(80)
                              .height(80)
                              .url()}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: "rgba(139,31,168,0.1)" }}
                        >
                          <Image
                            className="w-4 h-4"
                            style={{ color: "var(--text-faint)" }}
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p
                          className="font-medium text-sm truncate max-w-xs"
                          style={{ color: "var(--text)" }}
                        >
                          {post.title}
                        </p>
                        <p
                          className="text-xs truncate"
                          style={{ color: "var(--text-faint)" }}
                        >
                          /{post.slug?.current}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={post.status} />
                  </td>
                  <td>
                    <span className="text-xs">{post.author?.name ?? "—"}</span>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {post.categories?.slice(0, 2).map((cat) => (
                        <span
                          key={cat._id}
                          className="badge badge-draft text-xs"
                          style={{ padding: "2px 6px" }}
                        >
                          {cat.title}
                        </span>
                      ))}
                      {(post.categories?.length ?? 0) > 2 && (
                        <span
                          className="text-xs"
                          style={{ color: "var(--text-faint)" }}
                        >
                          +{(post.categories?.length ?? 0) - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="text-xs">
                      {post.publishedAt
                        ? format(new Date(post.publishedAt), "MMM d, yyyy")
                        : "—"}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/dashboard/blog/${post._id}`}
                        className="btn-ghost p-1.5"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handlePublishToggle(post)}
                        disabled={actionLoading === post._id}
                        className="btn-ghost p-1.5"
                        title={
                          post.status === "published" ? "Unpublish" : "Publish"
                        }
                        style={{
                          color:
                            post.status === "published" ? "#FFC107" : "#28A745",
                        }}
                      >
                        {post.status === "published" ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Globe className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDuplicate(post)}
                        disabled={actionLoading === post._id}
                        className="btn-ghost p-1.5"
                        title="Duplicate"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletePost(post)}
                        className="btn-ghost p-1.5"
                        title="Delete"
                        style={{ color: "#DC3545" }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!deletePost}
        title="Delete Post"
        description={`Permanently delete "${deletePost?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        onCancel={() => setDeletePost(null)}
      />
    </div>
  );
}
