import {Metadata} from "next";
import {Suspense} from 'react';
import { getAllPosts, getAllCategories } from '@/src/sanity/lib/queries';
import { BlogHero } from '@/src/components/blog/BlogHero';
import { BlogFilters } from '@/src/components/blog/BlogFilters';
import { BlogGrid } from '@/src/components/blog/BlogGrid';
import { BlogSidebar } from '@/src/components/blog/BlogSidebar';
import { BlogPagination } from '@/src/components/blog/BlogPagination';
import { NoResults } from '@/src/components/blog/NoResult';
import { BlogGridSkeleton, SidebarSkeleton } from '@/src/components/blog/Skeletons';
import { filterPosts, paginatePosts, getPaginationInfo, extractTags, countByCategory } from '@/src/lib/blog/utils';
import { BLOG_CONFIG } from '@/src/lib/blog/constants';
import { BlogPost } from '@/src/lib/blog/types';

export const metadata:Metadata = {
    title: 'Blog | Silverline Technologies',
  description: 'Latest news, insights, and updates from Silverline Technologies. Explore our articles on technology, innovation, and industry trends.',
  openGraph: {
    title: 'Blog | Silverline Technologies',
    description: 'Latest news, insights, and updates from Silverline Technologies',
    type: 'website',
  },
}

interface BlogPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: 'newest' | 'oldest' | 'az';
    page?: string;
    search?: string;
  }>;
}

export const revalidate = 300; // Revalidate every 5 minutes

export default async function BlogPage({searchParams}: BlogPageProps) {

  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const category = params.category || "all";
  const sort = params.sort || 'newest';
  const search = params.search || '';


  // Fetch data once on server
  const [allPosts, categories] = await Promise.all([
    getAllPosts(),
    getAllCategories(),
  ]);

   // Apply filters server-side
  const filteredPosts = filterPosts(allPosts as BlogPost[], {
    category: category !== 'all' ? category : undefined,
    sort,
    search,
  });

  const paginatedPosts =  paginatePosts(filteredPosts, currentPage, BLOG_CONFIG.POSTS_PER_PAGE);

  const paginationInfo = getPaginationInfo(filteredPosts.length, currentPage, BLOG_CONFIG.POSTS_PER_PAGE);


  // Sidebar data
  const tags = extractTags(allPosts as BlogPost[], BLOG_CONFIG.TAGS_DISPLAY_LIMIT);
  const categoryCounts = countByCategory(allPosts as BlogPost[]);
  const recentPosts = allPosts.slice(0, BLOG_CONFIG.RECENT_POSTS_COUNT);


  // Featured post (first post on page 1)
  const featuredPost = currentPage === 1 && paginatedPosts.length > 0 ? paginatedPosts[0] : null;
  const gridPosts = currentPage === 1 ? paginatedPosts.slice(1) : paginatedPosts;

   return (
    <div className="min-h-screen bg-background">
      <BlogHero />

      <BlogFilters
        categories={categories}
        activeCategory={category}
        activeSortOrder={sort}
      />

      {filteredPosts.length === 0 ? (
        <NoResults searchQuery={search} />
      ) : (
        <>
          {/* Featured Post - Only on first page */}
          {featuredPost && (
            <Suspense fallback={<BlogGridSkeleton count={1} featured />}>
              <section className="container mx-auto px-4 py-8 md:py-12">
                <BlogGrid posts={[featuredPost]} variant="featured" />
              </section>
            </Suspense>
          )}

          {/* Blog Grid with Sidebar */}
          <section className="container mx-auto px-4 py-8 md:py-16">
            {/* Section Heading */}
            <div className="mb-8 md:mb-12 text-center">
              <h2 className="font-heading font-bold text-2xl md:text-3xl text-gradient-gold uppercase tracking-wider mb-4">
                Latest Articles
              </h2>
              <div className="w-16 h-1 bg-accent mx-auto" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
              {/* Posts Grid */}
              <div className="lg:col-span-3 space-y-8">
                <Suspense fallback={<BlogGridSkeleton count={BLOG_CONFIG.POSTS_PER_PAGE} />}>
                  {gridPosts.length > 0 ? (
                    <BlogGrid posts={gridPosts} />
                  ) : (
                    <p className="text-muted-foreground text-center py-12">
                      No more articles on this page.
                    </p>
                  )}
                </Suspense>

                <BlogPagination paginationInfo={paginationInfo} />
              </div>

              {/* Sidebar */}
              <Suspense fallback={<SidebarSkeleton />}>
                <BlogSidebar
                  recentPosts={recentPosts as BlogPost[]}
                  categories={categoryCounts}
                  tags={tags}
                />
              </Suspense>
            </div>
          </section>
        </>
      )}
    </div>
  );
}


