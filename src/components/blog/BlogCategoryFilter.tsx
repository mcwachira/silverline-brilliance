import { SortAsc, SortDesc, TrendingUp, ArrowDownAZ } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';

const categories = [
  'All Posts',
  'Event Tips',
  'Technology Reviews',
  'Industry News',
  'Tutorials & Guides',
  'Case Studies',
  'Behind the Scenes',
];

export type SortOrder = 'newest' | 'oldest' | 'popular' | 'az';

interface BlogCategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
}

const BlogCategoryFilter = ({
  activeCategory,
  onCategoryChange,
  sortOrder,
  onSortChange,
}: BlogCategoryFilterProps) => {
  return (
    <section className="py-6 bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Categories - horizontal scrollable on mobile */}
          <div className="flex overflow-x-auto gap-2 pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`px-5 py-2 rounded-full font-heading font-medium text-sm whitespace-nowrap transition-all duration-300 border ${
                  activeCategory === category
                    ? 'bg-accent text-accent-foreground border-accent shadow-glow-gold/20'
                    : 'bg-transparent text-muted-foreground border-border hover:border-accent hover:text-accent'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <Select value={sortOrder} onValueChange={(v) => onSortChange(v as SortOrder)}>
            <SelectTrigger className="w-[180px] bg-secondary/50 border-border">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">
                <span className="flex items-center gap-2">
                  <SortDesc className="w-4 h-4" /> Latest First
                </span>
              </SelectItem>
              <SelectItem value="oldest">
                <span className="flex items-center gap-2">
                  <SortAsc className="w-4 h-4" /> Oldest First
                </span>
              </SelectItem>
              <SelectItem value="popular">
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Most Popular
                </span>
              </SelectItem>
              <SelectItem value="az">
                <span className="flex items-center gap-2">
                  <ArrowDownAZ className="w-4 h-4" /> A-Z
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
};

export default BlogCategoryFilter;
