

interface BlogGridSkeletonProps {
  count?: number;
  featured?: boolean;
}

export function BlogGridSkeleton({ count = 9, featured = false }: BlogGridSkeletonProps) {
  if (featured) {
    return (
      <div className="mb-8">
        <div className="animate-pulse rounded-2xl bg-card overflow-hidden shadow-2xl">
          <div className="aspect-[21/9] bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="rounded-xl bg-card border border-border overflow-hidden">
            <div className="aspect-video bg-muted" />
            <div className="p-4 sm:p-6 space-y-3">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded" />
                <div className="h-3 bg-muted rounded w-5/6" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <aside className="space-y-6 lg:space-y-8">
      {/* Recent Posts Skeleton */}
      <div className="animate-pulse rounded-xl bg-card border border-border p-4 sm:p-6">
        <div className="h-6 bg-muted rounded w-1/2 mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex gap-4">
              <div className="h-20 w-20 bg-muted rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Skeleton */}
      <div className="animate-pulse rounded-xl bg-card border border-border p-4 sm:p-6">
        <div className="h-6 bg-muted rounded w-1/2 mb-6" />
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-10 bg-muted rounded-lg" />
          ))}
        </div>
      </div>

      {/* Tags Skeleton */}
      <div className="animate-pulse rounded-xl bg-card border border-border p-4 sm:p-6">
        <div className="h-6 bg-muted rounded w-1/2 mb-6" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-8 w-16 bg-muted rounded-full" />
          ))}
        </div>
      </div>
    </aside>
  );
}