'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, SortAsc } from 'lucide-react';
import { SORT_OPTIONS } from '@/src/lib/blog/constants';
import { Category } from '@/src/lib/blog/types';

interface BlogFiltersProps {
  categories: Category[];
  activeCategory: string;
  activeSortOrder: string;
}

export function BlogFilters({
  categories,
  activeCategory,
  activeSortOrder,
}: BlogFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (category === 'all') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    
    // Reset to page 1 when filter changes
    params.delete('page');
    
    router.push(`/blog?${params.toString()}`, { scroll: false });
  };

  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sort);
    
    router.push(`/blog?${params.toString()}`, { scroll: false });
  };

  return (
    <section className="border-b border-border bg-card/50 sticky top-0 z-40 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 md:py-6">
        <h2 className="sr-only">Filter and sort blog posts</h2>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Category Filter */}
          <div className="flex items-center gap-2" role="group" aria-label="Category filters">
            <Filter className="h-5 w-5 text-muted-foreground hidden sm:block" aria-hidden="true" />
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                  activeCategory === 'all'
                    ? 'bg-accent text-accent-foreground shadow-md'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
                aria-pressed={activeCategory === 'all'}
              >
                All Posts
              </button>

              {categories.map((category) => (
                <button
                  key={category._id}
                  onClick={() => handleCategoryChange(category.slug)}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                    activeCategory === category.slug
                      ? 'bg-accent text-accent-foreground shadow-md'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                  aria-pressed={activeCategory === category.slug}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <SortAsc className="h-5 w-5 text-muted-foreground hidden sm:block" aria-hidden="true" />
            <label htmlFor="sort-select" className="sr-only">
              Sort posts by
            </label>
            <select
              id="sort-select"
              value={activeSortOrder}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-muted text-foreground text-xs sm:text-sm font-medium border border-border focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              aria-label="Sort posts"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}