"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, Eye, ChevronRight } from "lucide-react";
import { BlogPost } from "@/types/blog";
import { formatDate, formatViewCount } from "@/src/lib/blogUtils";

interface BlogPostHeroProps {
  post: BlogPost;
}

export default function BlogPostHero({ post }: BlogPostHeroProps) {
  return (
    <section className="relative">
      {/* Hero Image */}
      <div className="relative h-[60vh] min-h-[500px] w-full">
        {post.coverImage && (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />

        {/* Content */}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-12">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-2 text-sm text-white/80">
              <Link href="/" className="hover:text-accent transition-colors">
                Home
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/blog" className="hover:text-accent transition-colors">
                Blog
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link
                href={`/blog?category=${post.category.slug}`}
                className="hover:text-accent transition-colors"
              >
                {post.category.name}
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white">Article</span>
            </nav>

            <div className="max-w-4xl">
              {/* Category Badge */}
              <div className="mb-4">
                <span className="inline-block rounded-full bg-accent px-4 py-2 text-sm font-bold text-accent-foreground shadow-lg">
                  {post.category.name}
                </span>
              </div>

              {/* Title */}
              <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                {post.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-white">
                {/* Author */}
                <div className="flex items-center gap-3">
                  {post.author.avatar && (
                    <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-accent">
                      <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{post.author.name}</p>
                    <p className="text-sm text-white/70">{post.author.role}</p>
                  </div>
                </div>

                <div className="h-8 w-px bg-white/30" />

                {/* Date */}
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-accent" />
                  <span>{formatDate(post.publishedAt)}</span>
                </div>

                {/* Reading Time */}
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-accent" />
                  <span>{post.readingTime} min read</span>
                </div>

                {/* View Count */}
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-accent" />
                  <span>{formatViewCount(post.viewCount)} views</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}