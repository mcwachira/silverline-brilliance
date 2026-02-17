// app/blog/components/blog-sidebar.tsx
// Server component for blog sidebar

import Link from 'next/link';
import Image from 'next/image';
import { TrendingUp, Tag, Folder, Calendar, User } from 'lucide-react';
import { BlogPost, CategoryCount } from '@/src/lib/blog/types';
import { formatDate, getImageUrl } from '@/src/lib/blog/utils';
import { BLOG_ROUTES } from '@/src/lib/blog/constants';

interface BlogSidebarProps {
  recentPosts: BlogPost[];
  categories: CategoryCount[];
  tags: string[];
}

export function BlogSidebar({ recentPosts, categories, tags }: BlogSidebarProps) {
  return (
    <aside className="space-y-6 lg:space-y-8">
      {/* Recent Posts */}
      <div className="rounded-xl bg-card border border-border p-4 sm:p-6 shadow-sm">
        <div className="mb-4 sm:mb-6 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-accent" />
          <h3 className="text-lg sm:text-xl font-bold text-foreground">Recent Posts</h3>
        </div>

        <div className="space-y-4">
          {recentPosts.map((post) => {
            const imageUrl = getImageUrl(post);
            return (
              <Link
                key={post._id}
                href={BLOG_ROUTES.POST(post.slug.current)}
                className="group flex gap-3 sm:gap-4"
              >
                <div className="relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={imageUrl}
                    alt={post.title}
                    fill
                    sizes="80px"
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="mb-1 sm:mb-2 text-sm sm:text-base font-semibold text-foreground line-clamp-2 group-hover:text-accent transition-colors">
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="rounded-xl bg-card border border-border p-4 sm:p-6 shadow-sm">
          <div className="mb-4 sm:mb-6 flex items-center gap-2">
            <Folder className="h-5 w-5 text-accent" />
            <h3 className="text-lg sm:text-xl font-bold text-foreground">Categories</h3>
          </div>

          <div className="space-y-2">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={BLOG_ROUTES.CATEGORY(category.name.toLowerCase())}
                className="group flex items-center justify-between rounded-lg p-2 sm:p-3 transition-colors hover:bg-accent/10"
              >
                <span className="text-sm sm:text-base font-medium text-foreground group-hover:text-accent transition-colors">
                  {category.name}
                </span>
                <span className="rounded-full bg-muted px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs font-semibold text-muted-foreground">
                  {category.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="rounded-xl bg-card border border-border p-4 sm:p-6 shadow-sm">
          <div className="mb-4 sm:mb-6 flex items-center gap-2">
            <Tag className="h-5 w-5 text-accent" />
            <h3 className="text-lg sm:text-xl font-bold text-foreground">Popular Tags</h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?search=${encodeURIComponent(tag)}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs sm:text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Newsletter CTA (Optional) */}
      <div className="rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 p-4 sm:p-6">
        <h3 className="mb-2 text-lg sm:text-xl font-bold text-foreground">Stay Updated</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Get the latest articles delivered straight to your inbox.
        </p>
        <Link
          href="/newsletter"
          className="inline-flex items-center justify-center w-full rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-all hover:shadow-lg hover:shadow-accent/50"
        >
          Subscribe Now
        </Link>
      </div>
    </aside>
  );
}