"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight, User } from "lucide-react";
import { BlogPost } from "@/types/blog";
import { formatDate } from "@/src/lib/blogUtils";

interface FeaturedPostProps {
  post: BlogPost;
}

export default function FeaturedPost({ post }: FeaturedPostProps) {
  return (
    <section className="container mx-auto px-4 py-12">
      <Link href={`/blog/${post.slug}`} className="group block">
        <div className="relative overflow-hidden rounded-2xl bg-card shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-accent/20">
          {/* Featured Image */}
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            {/* Category Badge */}
            <div className="absolute left-6 top-6">
              <span className="rounded-full bg-accent px-4 py-2 text-sm font-bold text-accent-foreground shadow-lg">
                {post.category.name}
              </span>
            </div>

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              {/* Meta Info */}
              <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-white/90">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{post.readingTime} min read</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                {post.title}
              </h2>

              {/* Excerpt */}
              <p className="mb-6 line-clamp-2 text-lg text-white/90 md:text-xl">
                {post.excerpt}
              </p>

              {/* Author & CTA */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-accent">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{post.author.name}</p>
                    <p className="text-sm text-white/70">{post.author.role}</p>
                  </div>
                </div>

                <button className="flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-accent-foreground shadow-lg transition-all duration-300 hover:gap-4 hover:shadow-accent/50">
                  Read More
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
