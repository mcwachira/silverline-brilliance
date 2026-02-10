"use client";

import { Search } from "lucide-react";

interface BlogHeroProps {
  onSearch: (query: string) => void;
}

export default function BlogHero({ onSearch }: BlogHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary-light py-20 md:py-28">
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="dot-pattern h-full w-full" />
      </div>

      {/* Floating Clouds */}
      <div className="floating-cloud absolute left-10 top-20 h-64 w-64 animate-float" />
      <div className="floating-cloud absolute right-20 top-40 h-48 w-48 animate-float-delayed" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Heading */}
          <h1 className="mb-6 text-5xl font-bold text-accent md:text-6xl lg:text-7xl">
            Insights & Industry News
          </h1>

          {/* Subheading */}
          <p className="mb-10 text-xl text-white md:text-2xl">
            Stay updated with the latest in audiovisual technology
          </p>

          {/* Search Bar */}
          <div className="relative mx-auto max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles, tips, guides..."
                onChange={(e) => onSearch(e.target.value)}
                className="w-full rounded-full border-2 border-white/20 bg-white/95 px-6 py-4 pl-14 text-lg text-gray-800 shadow-2xl backdrop-blur-sm transition-all duration-300 placeholder:text-gray-500 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/30"
              />
              <Search className="absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 text-accent" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="currentColor"
            className="text-background"
          />
        </svg>
      </div>
    </section>
  );
}
