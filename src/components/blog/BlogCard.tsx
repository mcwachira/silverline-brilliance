// app/blog/components/blog-card.tsx
// Server component for blog post card (supports regular and featured variants)

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight, User } from 'lucide-react';
import { BlogPost } from '@/src/lib/blog/types';
import { formatDate, getImageUrl, getReadTimeString } from '@/src/lib/blog/utils';
import { BLOG_ROUTES } from '@/src/lib/blog/constants';

interface BlogCardProps {
  post: BlogPost;
  variant?: 'default' | 'featured';
  priority?: boolean;
}

export function BlogCard({ post, variant = 'default', priority = false }: BlogCardProps) {

  console.log(post);
  const imageUrl = getImageUrl(post);
  const postUrl = BLOG_ROUTES.POST(post.slug);
  console.log(postUrl)

  if (variant === 'featured') {
    return (
      <article className="group relative overflow-hidden rounded-2xl bg-card shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-accent/20">
        <Link href={postUrl} className="block">
          {/* Featured Image */}
          <div className="relative aspect-[21/9] overflow-hidden">
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              priority={priority}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

            {/* Category Badge */}
            <div className="absolute left-4 sm:left-6 top-4 sm:top-6">
              <span className="rounded-full bg-accent px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold text-accent-foreground shadow-lg">
                {post.category?.name}
              </span>
            </div>

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
              {/* Meta Info */}
              <div className="mb-3 sm:mb-4 flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-white/90">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>{getReadTimeString(post.readingTime)}</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="mb-3 sm:mb-4 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white line-clamp-2">
                {post.title}
              </h2>

              {/* Excerpt */}
              <p className="mb-4 sm:mb-6 line-clamp-2 text-sm sm:text-base lg:text-lg text-white/90">
                {post.excerpt}
              </p>

              {/* Author & CTA */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  {post.author.avatar ? (
                    <div className="relative h-10 w-10 sm:h-12 sm:w-12 overflow-hidden rounded-full border-2 border-accent">
                      <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-accent/20 flex items-center justify-center border-2 border-accent">
                      <User className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-sm sm:text-base text-white">{post.author.name}</p>
                    <p className="text-xs sm:text-sm text-white/70">{post.author.role}</p>
                  </div>
                </div>

                <span 
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-accent-foreground shadow-lg transition-all duration-300 group-hover:gap-4 group-hover:shadow-accent/50"
                  aria-label="Read article"
                >
                  Read More
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>
              </div>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  // Default card variant
  return (
    <article className="group h-full flex flex-col overflow-hidden rounded-xl bg-card border border-border shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/10">
      <Link href={postUrl} className="flex flex-col h-full">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            priority={priority}
          />
          
          {/* Category Badge */}
          <div className="absolute left-3 top-3">
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground shadow-md">
              {post.category.name}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-4 sm:p-6">
          {/* Meta */}
          <div className="mb-3 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{getReadTimeString(post.readingTime)}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="mb-2 sm:mb-3 text-lg sm:text-xl font-bold text-foreground line-clamp-2 group-hover:text-accent transition-colors">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="mb-4 flex-1 text-sm sm:text-base text-muted-foreground line-clamp-3">
            {post.excerpt}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              {post.author.avatar ? (
                <div className="relative h-8 w-8 overflow-hidden rounded-full">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
              <span className="text-xs sm:text-sm font-medium text-foreground">
                {post.author.name}
              </span>
            </div>

            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-accent group-hover:gap-2.5 transition-all">
              Read More
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}