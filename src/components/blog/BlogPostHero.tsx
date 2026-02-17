
import Image from 'next/image';
import { Calendar, Clock, User, Eye, Folder } from 'lucide-react';
import { BlogPost } from '@//src/lib/blog/types';
import { formatDate, getImageUrl, getReadTimeString } from '@/src/lib/blog/utils';

interface BlogPostHeroProps {
  post: BlogPost;
}

export function BlogPostHero({ post }: BlogPostHeroProps) {
  const imageUrl = getImageUrl(post);

  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary-light">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <div className="dot-pattern h-full w-full" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Category Badge */}
          <div className="mb-4 md:mb-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-bold text-accent-foreground shadow-lg">
              <Folder className="h-4 w-4" />
              {post.category.name}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-4 md:mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-lg md:text-xl text-white/90 mb-6 md:mb-8 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm md:text-base text-white/90">
            {/* Author */}
            <div className="flex items-center gap-2 md:gap-3">
              {post.author.avatar ? (
                <div className="relative h-10 w-10 md:h-12 md:w-12 overflow-hidden rounded-full border-2 border-accent">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-accent/20 flex items-center justify-center border-2 border-accent">
                  <User className="h-5 w-5 md:h-6 md:w-6 text-accent" />
                </div>
              )}
              <div>
                <p className="font-semibold text-white">{post.author.name}</p>
                <p className="text-xs md:text-sm text-white/70">{post.author.role}</p>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 md:h-5 md:w-5" />
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            </div>

            {/* Reading Time */}
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 md:h-5 md:w-5" />
              <span>{getReadTimeString(post.readingTime)}</span>
            </div>

            {/* View Count (if available) */}
            {post.viewCount > 0 && (
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 md:h-5 md:w-5" />
                <span>{post.viewCount.toLocaleString()} views</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-6 md:mt-8 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs md:text-sm font-medium text-white backdrop-blur-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Featured Image (Optional - can be moved to content) */}
      {imageUrl && (
        <div className="container mx-auto px-4 pb-8 md:pb-12">
          <div className="relative max-w-5xl mx-auto aspect-video md:aspect-[21/9] overflow-hidden rounded-2xl shadow-2xl">
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}
    </header>
  );
}
