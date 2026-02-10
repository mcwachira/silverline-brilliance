import { Metadata } from "next";
import BlogHero from "@/components/blog/BlogHero";
import BlogFilters from "@/components/blog/BlogFilters";
import FeaturedPost from "@/components/blog/FeaturedPost";
import BlogCard from "@/components/blog/BlogCard";
import BlogSidebar from "@/components/blog/BlogSidebar";
import Pagination from "@/components/blog/Pagination";
import { getAllPosts, getAllCategories, getPopularPosts } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Blog | Silverline Brilliance",
  description: "Stay updated with the latest in audiovisual technology, event tips, and industry news.",
};

const POSTS_PER_PAGE = 9;

interface BlogPageProps {
  searchParams: {
    page?: string;
    category?: string;
    search?: string;
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const currentPage = parseInt(searchParams.page || "1");
  const selectedCategory = searchParams.category || "all";
  const searchQuery = searchParams.search || "";

  // Fetch data from Sanity
  const allPosts = await getAllPosts();
  const categories = await getAllCategories();
  const popularPosts = await getPopularPosts(5);

  // Filter posts
  let filteredPosts = allPosts;

  if (searchQuery) {
    filteredPosts = filteredPosts.filter((post: any) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (selectedCategory !== "all") {
    filteredPosts = filteredPosts.filter((post: any) =>
      post.categories?.some((cat: any) => cat.slug === selectedCategory)
    );
  }

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  // Featured post (first post)
  const featuredPost = filteredPosts[0];

  // Format posts for components
  const formattedPosts = paginatedPosts.map((post: any) => ({
    id: post._id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || "",
    coverImage: post.mainImage?.asset?.url || "",
    publishedAt: post.publishedAt,
    readingTime: 5, // You can calculate this from content if needed
    viewCount: 0,
    category: post.categories?.[0] || { id: "", name: "Uncategorized", slug: "" },
    author: {
      id: post.author?._id || "",
      name: post.author?.name || "Anonymous",
      role: "Content Creator",
      bio: post.author?.bio?.[0]?.children?.[0]?.text || "",
      avatar: post.author?.image?.asset?.url || "",
      social: {},
    },
    tags: post.tags || [],
    featured: false,
    metaTitle: "",
    metaDescription: "",
  }));

  const formattedFeaturedPost = featuredPost ? {
    id: featuredPost._id,
    title: featuredPost.title,
    slug: featuredPost.slug,
    excerpt: featuredPost.excerpt || "",
    coverImage: featuredPost.mainImage?.asset?.url || "",
    publishedAt: featuredPost.publishedAt,
    readingTime: 5,
    viewCount: 0,
    category: featuredPost.categories?.[0] || { id: "", name: "Uncategorized", slug: "" },
    author: {
      id: featuredPost.author?._id || "",
      name: featuredPost.author?.name || "Anonymous",
      role: "Content Creator",
      bio: featuredPost.author?.bio?.[0]?.children?.[0]?.text || "",
      avatar: featuredPost.author?.image?.asset?.url || "",
      social: {},
    },
    tags: featuredPost.tags || [],
    featured: true,
    metaTitle: "",
    metaDescription: "",
  } : null;

  const formattedPopularPosts = popularPosts.map((post: any) => ({
    id: post._id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || "",
    coverImage: post.mainImage?.asset?.url || "",
    publishedAt: post.publishedAt,
    readingTime: 5,
    viewCount: 0,
    category: { id: "", name: "", slug: "" },
    author: {
      id: "",
      name: "",
      role: "",
      bio: "",
      avatar: "",
      social: {},
    },
    tags: [],
    featured: false,
    metaTitle: "",
    metaDescription: "",
  }));

  const formattedCategories = categories.map((cat: any) => ({
    id: cat._id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    postCount: cat.postCount || 0,
  }));

  // Mock tags (you can add a tags collection in Sanity if needed)
  const tags = [
    { id: "1", name: "Live Streaming", slug: "live-streaming", count: 12 },
    { id: "2", name: "Audio", slug: "audio", count: 10 },
    { id: "3", name: "Video Production", slug: "video-production", count: 15 },
    { id: "4", name: "LED Displays", slug: "led-displays", count: 8 },
    { id: "5", name: "Corporate Events", slug: "corporate-events", count: 14 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Client Component for Search */}
      <BlogHero onSearch={() => {}} />

      {/* Filters - Client Component */}
      <BlogFilters
        categories={formattedCategories}
        activeCategory={selectedCategory}
        onCategoryChange={() => {}}
        sortBy="latest"
        onSortChange={() => {}}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {filteredPosts.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
            <p className="mb-2 text-2xl font-bold text-primary">No posts found</p>
            <p className="text-gray-600">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {formattedFeaturedPost && currentPage === 1 && !searchQuery && (
              <FeaturedPost post={formattedFeaturedPost} />
            )}

            {/* Blog Grid with Sidebar */}
            <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_350px]">
              {/* Blog Grid */}
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-primary">
                    {searchQuery
                      ? `Search Results (${filteredPosts.length})`
                      : selectedCategory !== "all"
                        ? `${categories.find((c: any) => c.slug === selectedCategory)?.name} (${filteredPosts.length})`
                        : `All Posts (${filteredPosts.length})`}
                  </h2>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {formattedPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={() => {}}
                  />
                )}
              </div>

              {/* Sidebar - Desktop Only */}
              <div className="hidden lg:block">
                <div className="sticky top-8">
                  <BlogSidebar
                    popularPosts={formattedPopularPosts}
                    categories={formattedCategories}
                    tags={tags}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
