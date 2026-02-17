"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import BlogHero from "./BlogHero";
import BlogCategoryFilter, { type SortOrder } from "./BlogCategoryFilter";
import BlogFeaturedPost from "./BlogFeaturedPost";
import BlogCard from "./BlogCard";
import BlogSidebar from "./BlogSidebar";
import BlogPagination from "./BlogPagination";
import NewsletterForm from "../NewsletterForm";

interface BlogPageClientProps {
  posts: any[];
  categories: any[];
}

export default function BlogPageClient({ posts, categories }: BlogPageClientProps) {
  const [activeCategory, setActiveCategory] = useState("All Posts");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  // Filter, search, sort
  const filteredAndSortedPosts = useMemo(() => {
    let result = [...posts];

    if (activeCategory !== "All Posts") {
      result = result.filter((post) =>
        post.categories?.some((cat: any) => cat.name === activeCategory)
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt?.toLowerCase().includes(query)
      );
    }

    result.sort((a, b) => {
      switch (sortOrder) {
        case "newest":
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        case "oldest":
          return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
        case "az":
          return a.title.localeCompare(b.title);
        default:
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
    });

    return result;
  }, [posts, activeCategory, searchQuery, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedPosts.length / postsPerPage);
  const paginatedPosts = filteredAndSortedPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const featuredPost = currentPage === 1 && paginatedPosts.length > 0 ? paginatedPosts[0] : null;
  const gridPosts = currentPage === 1 ? paginatedPosts.slice(1) : paginatedPosts;

  // Sidebar data
  const categoryCounts = useMemo(() => {
    return categories.map((cat) => ({
      name: cat.name,
      count: cat.postCount || 0,
    }));
  }, [categories]);

  const tags = useMemo(() => {
    const allTags = posts.flatMap((post) => post.tags || []);
    const uniqueTags = [...new Set(allTags)];
    return uniqueTags.slice(0, 10); // Limit to 10 tags
  }, [posts]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const getImageUrl = (post: any) => {
    return post.mainImage?.asset?.url || null;
  };

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <BlogHero
        // searchQuery={searchQuery}
        // onSearchChange={(v) => {
        //   setSearchQuery(v);
        //   setCurrentPage(1);
        // }}
      />

      <BlogCategoryFilter
        activeCategory={activeCategory}
        categories={["All Posts", ...categories.map((c) => c.name)]}
        onCategoryChange={handleCategoryClick}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
      />

      {filteredAndSortedPosts.length === 0 ? (
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-heading font-bold text-2xl text-foreground mb-4">
              No Posts Found
            </h2>
            <p className="text-muted-foreground">
              {searchQuery ? "Try a different search term." : "Check back later for new articles."}
            </p>
          </div>
        </section>
      ) : (
        <>
          {/* Featured Post */}
          {featuredPost && (
            <BlogFeaturedPost
              post={featuredPost}
              formatDate={formatDate}
              getImageUrl={getImageUrl}
            />
          )}

          {/* Blog Grid with Sidebar */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <h2 className="font-heading font-bold text-2xl md:text-3xl text-gradient-gold uppercase tracking-widest mb-4">
                  Latest Articles
                </h2>
                <div className="w-24 h-1 bg-accent mx-auto" />
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Posts Grid */}
                <div className="lg:col-span-3">
                  {gridPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {gridPosts.map((post, index) => (
                        <BlogCard
                          key={post._id}
                          post={post}
                          index={index}
                          formatDate={formatDate}
                          getImageUrl={getImageUrl}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-12">
                      No more articles on this page.
                    </p>
                  )}

                  <BlogPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>

                {/* Sidebar */}
                <BlogSidebar
                  posts={posts.slice(0, 5)}
                  categories={categoryCounts}
                  tags={tags}
                  formatDate={formatDate}
                  onCategoryClick={handleCategoryClick}
                  onTagClick={handleTagClick}
                  getImageUrl={getImageUrl}
                />
              </div>
            </div>
          </section>
        </>
      )}

      {/* <NewsletterForm/> */}
    </div>
  );
}