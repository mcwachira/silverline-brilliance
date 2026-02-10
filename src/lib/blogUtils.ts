import { BlogPost, Heading } from "@/types/blog";

/**
 * Calculate reading time based on average reading speed of 200 words per minute
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return readingTime;
}

/**
 * Format date to readable string
 */
export function formatDate(date: string): string {
  const dateObj = new Date(date);
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return "Today";
  } else if (diffInDays === 1) {
    return "Yesterday";
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  } else {
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
}

/**
 * Generate URL-friendly slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Extract headings from HTML or markdown content
 */
export function extractHeadings(content: string): Heading[] {
  const headings: Heading[] = [];
  const headingRegex = /<h([2-3])[^>]*>(.*?)<\/h\1>/gi;
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = parseInt(match[1]);
    const text = match[2].replace(/<[^>]*>/g, "").trim();
    const id = generateSlug(text);

    headings.push({ id, text, level });
  }

  return headings;
}

/**
 * Get related posts based on category and tags
 */
export function getRelatedPosts(
  post: BlogPost,
  allPosts: BlogPost[],
  limit: number = 3
): BlogPost[] {
  const otherPosts = allPosts.filter((p) => p.id !== post.id);

  // Score posts based on similarity
  const scoredPosts = otherPosts.map((p) => {
    let score = 0;

    // Same category gets high score
    if (p.category.id === post.category.id) {
      score += 10;
    }

    // Shared tags
    const sharedTags = p.tags.filter((tag) =>
      post.tags.some((t) => t.id === tag.id)
    );
    score += sharedTags.length * 3;

    return { post: p, score };
  });

  // Sort by score and return top results
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post);
}

/**
 * Truncate text to specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

/**
 * Get time ago string
 */
export function getTimeAgo(date: string): string {
  const dateObj = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  } else {
    return formatDate(date);
  }
}

/**
 * Format view count to readable string
 */
export function formatViewCount(count: number): string {
  if (count < 1000) {
    return count.toString();
  } else if (count < 1000000) {
    return `${(count / 1000).toFixed(1)}K`;
  } else {
    return `${(count / 1000000).toFixed(1)}M`;
  }
}
