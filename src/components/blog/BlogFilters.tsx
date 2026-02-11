"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface BlogFiltersProps {
  categories: { id: string; name: string; slug: string }[];
}

export default function BlogFilters({ categories }: BlogFiltersProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const allCategories = [{ id: "all", name: "All Posts", slug: "all" }, ...categories];

  return (
    <div className="border-b border-border bg-card/50 py-6 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Category Pills */}
          <div className="flex flex-wrap gap-3 overflow-x-auto pb-2 lg:pb-0">
            {allCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.slug)}
                className={`whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 ${
                  activeCategory === category.slug
                    ? "bg-accent text-accent-foreground shadow-lg shadow-accent/30"
                    : "border-2 border-accent bg-white text-primary hover:bg-accent/10"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none rounded-lg border-2 border-accent/30 bg-white px-6 py-2.5 pr-12 text-sm font-medium text-primary shadow-sm transition-all duration-300 hover:border-accent focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
              <option value="alphabetical">A-Z</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-accent" />
          </div>
        </div>
      </div>
    </div>
  );
}
