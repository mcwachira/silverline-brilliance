import { BlogPost } from '@/lib/blog/types';
import { BlogCard } from '../blog-card';

interface RelatedPostsProps {
  posts: BlogPost[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-8 md:py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-4">
            Related Articles
          </h2>
          <div className="w-16 h-1 bg-accent mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {posts.map((post) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}