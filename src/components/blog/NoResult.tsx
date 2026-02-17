

import { SearchX } from 'lucide-react';
import Link from 'next/link';

interface NoResultsProps {
  searchQuery?: string;
}

export function NoResults({ searchQuery }: NoResultsProps) {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 text-center">
        <SearchX className="h-16 w-16 md:h-20 md:w-20 text-muted-foreground mx-auto mb-6" />
        
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-4">
          No Posts Found
        </h2>
        
        <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-md mx-auto">
          {searchQuery 
            ? `No articles match "${searchQuery}". Try a different search term.`
            : 'Check back later for new articles.'}
        </p>

        <Link
          href="/blog"
          className="inline-flex items-center justify-center rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-all hover:shadow-lg hover:shadow-accent/50"
        >
          View All Posts
        </Link>
      </div>
    </section>
  );
}