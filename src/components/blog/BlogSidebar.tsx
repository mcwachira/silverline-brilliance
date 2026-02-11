"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, TrendingUp, Tag as TagIcon } from "lucide-react";
import { BlogPost, Category, Tag } from "@/types/blog";
import { formatDate } from "@/src/lib/blogUtils";

interface BlogSidebarProps {
  popularPosts: BlogPost[];
  categories: Category[];
  tags: Tag[];
}

export default function BlogSidebar({ popularPosts, categories, tags }: BlogSidebarProps) {
  return (
    <aside className="space-y-8">
      {/* Newsletter Signup */}
      <div className="rounded-xl border border-border bg-gradient-to-br from-primary/5 to-accent/5 p-6 shadow-lg">
        <div className="mb-4 flex items-center gap-2">
          <Mail className="h-6 w-6 text-accent" />
          <h3 className="text-xl font-bold text-primary">Stay Updated</h3>
        </div>
        <p className="mb-4 text-sm text-gray-600">
          Get the latest posts delivered to your inbox
        </p>
        <form className="space-y-3">
          <input
            type="email"
            placeholder="Your email address"
            className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground shadow-lg transition-all hover:shadow-accent/50"
          >
            Subscribe
          </button>
        </form>
      </div>

      {/* Popular Posts */}
      <div className="rounded-xl border border-border bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-accent" />
          <h3 className="text-xl font-bold text-primary">Most Read</h3>
        </div>
        <div className="space-y-4">
          {popularPosts.slice(0, 5).map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex gap-3 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
            >
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-110"
                />
              </div>
              <div className="flex-1">
                <h4 className="mb-1 line-clamp-2 text-sm font-semibold text-primary transition-colors group-hover:text-accent">
                  {post.title}
                </h4>
                <p className="text-xs text-gray-500">{formatDate(post.publishedAt)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="rounded-xl border border-border bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-bold text-primary">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/blog?category=${category.slug}`}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent/10 hover:text-accent"
            >
              <span className="font-medium">{category.name}</span>
              <span className="rounded-full bg-accent/20 px-2 py-0.5 text-xs font-semibold text-accent">
                {category.postCount}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Tags Cloud */}
      <div className="rounded-xl border border-border bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center gap-2">
          <TagIcon className="h-6 w-6 text-accent" />
          <h3 className="text-xl font-bold text-primary">Popular Tags</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/blog?tag=${tag.slug}`}
              className="rounded-full border border-accent/30 bg-white px-3 py-1.5 text-xs font-medium text-primary transition-all hover:bg-accent hover:text-accent-foreground"
              style={{
                fontSize: `${Math.min(14, 10 + tag.count / 2)}px`,
              }}
            >
              {tag.name}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
