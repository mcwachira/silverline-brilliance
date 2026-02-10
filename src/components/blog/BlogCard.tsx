"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { BlogPost } from "@/types/blog";
import { formatDate } from "@/lib/blogUtils";

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent/10">
        {/* Featured Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Category Badge */}
          <div className="absolute left-4 top-4">
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground shadow-lg">
              {post.category.name}
            </span>
          </div>

          {/* Date Badge */}
          <div className="absolute right-4 top-4">
            <div className="flex items-center gap-1 rounded-full bg-black/70 px-3 py-1 text-xs text-white backdrop-blur-sm">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-6">
          {/* Title */}
          <h3 className="mb-3 line-clamp-2 text-xl font-bold text-primary transition-colors group-hover:text-accent">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="mb-4 line-clamp-3 flex-1 text-sm text-gray-600">
            {post.excerpt}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            {/* Author */}
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-full">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-primary">
                  {post.author.name}
                </span>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>{post.readingTime} min</span>
                </div>
              </div>
            </div>

            {/* Read More Arrow */}
            <div className="flex items-center gap-1 text-accent transition-all duration-300 group-hover:gap-2">
              <span className="text-sm font-semibold">Read</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
