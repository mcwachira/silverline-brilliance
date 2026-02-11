"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const [activePage, setActivePage] = useState(currentPage);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  // Show max 7 page numbers
  const getVisiblePages = () => {
    if (totalPages <= 7) return pages;
    
    if (activePage <= 4) {
      return [...pages.slice(0, 5), -1, totalPages];
    }
    
    if (activePage >= totalPages - 3) {
      return [1, -1, ...pages.slice(totalPages - 5)];
    }
    
    return [1, -1, activePage - 1, activePage, activePage + 1, -1, totalPages];
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-center gap-2 py-8">
      {/* Previous Button */}
      <button
        onClick={() => setActivePage(activePage - 1)}
        disabled={activePage === 1}
        className="flex items-center gap-1 rounded-lg border-2 border-accent/30 bg-white px-4 py-2 text-sm font-semibold text-primary transition-all hover:border-accent hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-accent/30 disabled:hover:bg-white"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {visiblePages.map((page, index) => {
          if (page === -1) {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => setActivePage(page)}
              className={`h-10 w-10 rounded-lg text-sm font-semibold transition-all ${
                activePage === page
                  ? "bg-accent text-accent-foreground shadow-lg shadow-accent/30"
                  : "border-2 border-accent/30 bg-white text-primary hover:border-accent hover:bg-accent/10"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => setActivePage(activePage + 1)}
        disabled={activePage === totalPages}
        className="flex items-center gap-1 rounded-lg border-2 border-accent/30 bg-white px-4 py-2 text-sm font-semibold text-primary transition-all hover:border-accent hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-accent/30 disabled:hover:bg-white"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
