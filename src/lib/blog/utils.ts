import {BlogPost, BlogFilters} from "./types"

/**
 * Format Date into a readable string
 */

export function formatDate(dateString:string):string {
return new Date(dateString).toLocaleDateString("en-us", {
    year:"numeric",
    month:"long",
    day:"numeric"
})
}

/**
 * Format date to relative time (e.g., "2 days ago")
 */
export function formatRelativeDate(dateString:string):string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime())/1000);
 if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return formatDate(dateString);
}

/**
 * Get image URL from post with fallback
 */
export function getImageUrl(post: BlogPost): string {
  return post.mainImage?.asset?.url || post.coverImage ;
}

/**
 * Get OG image URL with fallbacks
 */
export function getOgImageUrl(post: BlogPost): string {
  return post.ogImage?.asset?.url || post.mainImage?.asset?.url || post.coverImage || '';
}

/**
 * Calculate reading time from content
 */

export function calculateReadingTime(content:any[]):number {

    if(!content || content.length === 0) return 5;

    const text = content.filter((block) => block._type === 'block').
    map((block) =>block.children?.filter((child:any) => child._type === 'span')
    .map((child:any)=> child.text).join("")).join(" ");
   
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  
  return minutes || 5;
}


/**
 * Generate excerpt from content if not provided
 */

export function generateExcerpt(content: any[], maxLength: number = 160): string {
  if (!content || content.length === 0) return '';

  const text = content
    .filter((block) => block._type === 'block')
    .map((block) =>
      block.children
        ?.filter((child: any) => child._type === 'span')
        .map((child: any) => child.text)
        .join('')
    )
    .join(' ');

  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}


/**
 * Filter posts based on search query
 */

export function searchPosts(posts:BlogPost[], query:string):BlogPost[] {
 if(!query.trim()) return posts;
 const searchTerms =  query.toLowerCase();
 
 return posts.filter((post) => {
   post.title.toLowerCase().includes(searchTerms) || 
   post.excerpt.toLowerCase().includes(searchTerms) || 
   post.tags.some(tag =>tag.toLowerCase().includes(searchTerms))
 })
}


/**
 * Filter posts based on search query
 */

export function filterByCategory(posts:BlogPost[], category:string):BlogPost[]{
  if(!category || category === "all") return posts;
return posts.filter((post) =>
    post.categories?.some((cat) => cat.slug === category || cat.name === category) ||
    post.category.slug === category ||
    post.category.name === category
  );
}

/**
 * Sort posts
 */
export function sortPosts(
  posts: BlogPost[],
  sortOrder: 'newest' | 'oldest' | 'az' = 'newest'
): BlogPost[] {
  const sorted = [...posts];

  switch (sortOrder) {
    case 'newest':
      return sorted.sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    case 'oldest':
      return sorted.sort(
        (a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
      );
    case 'az':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return sorted;
  }
}

/**
 * Paginate posts
 */

export function paginatePosts(posts:BlogPost[],page:number, postsPerPage:number ):BlogPost[] {

  const start =(page -1)*postsPerPage;
  const end = start + postsPerPage;
  return posts.slice(start, end)
  
}

/**
 * Get Pagoination info
 */

export function getPaginationInfo(totalPosts:number,currentPage:number,postsPerPage:number){
    
  const totalPages = Math.ceil(totalPosts/postsPerPage);

  return {
    currentPage,
    totalPages,
    totalPosts,
    postsPerPage,
      hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  }
}

/**
 * Apply all filters to posts
 */

export function filterPosts(posts:BlogPost[], filters:BlogFilters):BlogPost[]{


  let filtered = [...posts];

// Search
  if (filters.search) {
    filtered = searchPosts(filtered, filters.search);
  }

  // Category
  if (filters.category) {
    filtered = filterByCategory(filtered, filters.category);
  }

  // Sort
  if (filters.sort) {
    filtered = sortPosts(filtered, filters.sort);
  }

  return filtered;

}

/**
 * Extarct unique tags from posts 
 */

export function extractTags(posts: BlogPost[], limit?: number): string[] {
  const allTags = posts.flatMap((post) => post.tags || []);
  const uniqueTags = [...new Set(allTags)];
  return limit ? uniqueTags.slice(0, limit) : uniqueTags;
}



/**
 * Count posts by category
 */
export function countByCategory(posts: BlogPost[]) {
  const counts = new Map<string, number>();

  posts.forEach((post) => {
    post.categories?.forEach((cat) => {
      counts.set(cat.name, (counts.get(cat.name) || 0) + 1);
    });
  });

  return Array.from(counts, ([name, count]) => ({ name, count }));
}


  /**
 * Create URL-friendly slug
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}


/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Get estimated read time string
 */
export function getReadTimeString(minutes: number): string {
  if (minutes < 1) return 'Less than a minute';
  if (minutes === 1) return '1 minute read';
  return `${minutes} min read`;
}