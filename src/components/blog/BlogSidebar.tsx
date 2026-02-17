import { motion } from 'framer-motion';
import  Link  from 'next/link';
import { Calendar, TrendingUp, Tag } from 'lucide-react';
// import NewsletterForm from '@/components/NewsletterForm';
import type { BlogPost } from './types';

interface BlogSidebarProps {
  posts: BlogPost[];
  categories: { name: string; count: number }[];
  tags: string[];
  formatDate: (date: string) => string;
  onCategoryClick: (category: string) => void;
  onTagClick: (tag: string) => void;
  getImageUrl: (post: BlogPost) => string | null;
}

const BlogSidebar = ({ posts, categories, tags, formatDate, onCategoryClick, onTagClick, getImageUrl }: BlogSidebarProps) => {
  const popularPosts = posts.slice(0, 5);

  return (
    <aside className="hidden lg:block space-y-8">
      {/* Newsletter Signup */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-card rounded-xl p-6 sticky top-24"
      >
        <h3 className="font-heading font-bold text-lg text-foreground mb-2">Stay Updated</h3>
        <p className="text-muted-foreground text-sm mb-4">Get the latest posts delivered to your inbox</p>
        {/* <NewsletterForm variant="compact" /> */}
      </motion.div>

      {/* Popular Posts */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="glass-card rounded-xl p-6"
      >
        <h3 className="font-heading font-bold text-lg text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-accent" />
          Most Read
        </h3>
        <div className="space-y-4">
          {popularPosts.map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug}`}
              className="flex gap-3 group"
            >
              {getImageUrl(post) ? (
                <img
                  src={getImageUrl(post)!}
                  alt={post.title}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-secondary flex-shrink-0 flex items-center justify-center">
                  <span className="text-accent text-xs font-heading">{post.category?.slice(0, 2)}</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-heading font-semibold text-sm text-foreground line-clamp-2 group-hover:text-accent transition-colors">
                  {post.title}
                </h4>
                <span className="text-muted-foreground text-xs flex items-center gap-1 mt-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(post.publishedAt)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Categories Widget */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="glass-card rounded-xl p-6"
      >
        <h3 className="font-heading font-bold text-lg text-foreground mb-4">Categories</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => onCategoryClick(cat.name)}
              className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary hover:text-accent transition-colors"
            >
              <span>{cat.name}</span>
              <span className="bg-secondary text-accent text-xs font-bold px-2 py-0.5 rounded-full">
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tags Cloud */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="glass-card rounded-xl p-6"
      >
        <h3 className="font-heading font-bold text-lg text-foreground mb-4 flex items-center gap-2">
          <Tag className="w-5 h-5 text-accent" />
          Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagClick(tag)}
              className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all border border-border/50"
            >
              {tag}
            </button>
          ))}
        </div>
      </motion.div>
    </aside>
  );
};

export default BlogSidebar;
