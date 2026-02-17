'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export function BackToBlogButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/blog')}
      className="fixed top-20 left-4 z-50 inline-flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2 text-sm font-medium text-foreground shadow-lg transition-all hover:bg-accent hover:text-accent-foreground hover:shadow-xl"
      aria-label="Back to blog"
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="hidden sm:inline">Back to Blog</span>
    </button>
  );
}