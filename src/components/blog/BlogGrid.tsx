
import { BlogPost } from '@/src/lib/blog/types';
import { BlogCard } from './BlogCard';

interface BlogGridProps {
  posts: BlogPost[];
  variant?: 'default' | 'featured';
}

export function BlogGrid({ posts, variant = 'default' }: BlogGridProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No posts found.</p>
      </div>
    );
  }

  if (variant === 'featured' && posts.length > 0) {
    return (
      <div className="mb-8">
        <BlogCard post={posts[0]} variant="featured" priority />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
      {posts.map((post, index) => (
        <BlogCard 
          key={post._id} 
          post={post} 
          priority={index < 3} 
        />
      ))}
    </div>
  );
}
