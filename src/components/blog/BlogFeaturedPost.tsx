import { motion } from 'framer-motion';
import  Link  from 'next/link';
import Image from 'next/image';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { AspectRatio } from '@/src/components/ui/aspect-ratio';
import type { BlogPost } from './types';

interface BlogFeaturedPostProps {
  post: BlogPost;
  formatDate: (date: string) => string;
  getImageUrl: (post: BlogPost) => string | null;
}

const BlogFeaturedPost = ({ post, formatDate, getImageUrl }: BlogFeaturedPostProps) => {
  const imageUrl = getImageUrl(post);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href={`/blog/${post.slug}`}
            className="block group relative rounded-2xl overflow-hidden"
          >
            {/* 16:9 Featured Image */}
            <AspectRatio ratio={16 / 9}>
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-secondary flex items-center justify-center">
                  <span className="text-accent font-heading font-bold text-3xl">{post.category}</span>
                </div>
              )}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            </AspectRatio>

            {/* Content overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
              <Badge className="bg-accent text-accent-foreground w-fit mb-3 font-heading">
                {post.category}
              </Badge>

              <div className="flex items-center gap-4 text-muted-foreground text-sm mb-3">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.publishedAt)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {post.readTime || 5} min read
                </span>
              </div>

              <h2 className="font-heading font-bold text-2xl md:text-4xl text-foreground mb-3 max-w-3xl group-hover:text-accent transition-colors">
                {post.title}
              </h2>

              <p className="text-muted-foreground text-sm md:text-base mb-4 max-w-2xl line-clamp-2 md:line-clamp-3">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground text-sm">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-accent" />
                  </div>
                  {post.author?.name || 'Silverline Team'}
                </span>

                <Button variant="gold-outline" size="sm" className="group-hover:bg-accent group-hover:text-accent-foreground transition-all">
                  Read More
                  <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogFeaturedPost;
