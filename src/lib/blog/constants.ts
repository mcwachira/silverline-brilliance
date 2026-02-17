export const BLOG_CONFIG = {
  POSTS_PER_PAGE: 9,
  RECENT_POSTS_COUNT: 5,
  RELATED_POSTS_COUNT: 3,
  TAGS_DISPLAY_LIMIT: 12,
  EXCERPT_LENGTH: 160,
  WORDS_PER_MINUTE: 200,
} as const;

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'az', label: 'A-Z' },
] as const;

export const BLOG_ROUTES = {
  HOME: '/blog',
  POST: (slug: string) => `/blog/${slug}`,
  CATEGORY: (category: string) => `/blog?category=${category}`,
} as const;