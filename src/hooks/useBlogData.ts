import { useQuery } from "@tanstack/react-query";
import { BlogPost, Author, Category, Tag, BlogFilters, Comment } from "@/types/blog";
import { calculateReadingTime } from "@/lib/blogUtils";

const BLOG_STORAGE_KEY = "blog_posts";
const COMMENTS_STORAGE_KEY = "blog_comments";

// Mock Authors
const authors: Author[] = [
  {
    id: "1",
    name: "Sarah Mitchell",
    role: "AV Technology Specialist",
    bio: "With over 15 years of experience in audiovisual technology, Sarah specializes in cutting-edge event production and live streaming solutions.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    social: {
      twitter: "https://twitter.com/sarahmitchell",
      linkedin: "https://linkedin.com/in/sarahmitchell",
    },
  },
  {
    id: "2",
    name: "Michael Chen",
    role: "Event Production Director",
    bio: "Michael has produced over 500 corporate events and conferences, bringing creative vision and technical expertise to every project.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    social: {
      linkedin: "https://linkedin.com/in/michaelchen",
      website: "https://michaelchen.com",
    },
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    role: "Sound Engineering Expert",
    bio: "Emily is passionate about creating immersive audio experiences for live events, with expertise in acoustic design and sound reinforcement.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    social: {
      twitter: "https://twitter.com/emilyrodriguez",
      linkedin: "https://linkedin.com/in/emilyrodriguez",
    },
  },
];

// Mock Categories
const categories: Category[] = [
  { id: "1", name: "Event Tips", slug: "event-tips", postCount: 8 },
  { id: "2", name: "Technology Reviews", slug: "technology-reviews", postCount: 6 },
  { id: "3", name: "Industry News", slug: "industry-news", postCount: 5 },
  { id: "4", name: "Tutorials & Guides", slug: "tutorials-guides", postCount: 7 },
  { id: "5", name: "Case Studies", slug: "case-studies", postCount: 4 },
  { id: "6", name: "Behind the Scenes", slug: "behind-the-scenes", postCount: 3 },
];

// Mock Tags
const tags: Tag[] = [
  { id: "1", name: "Live Streaming", slug: "live-streaming", count: 12 },
  { id: "2", name: "Audio", slug: "audio", count: 10 },
  { id: "3", name: "Video Production", slug: "video-production", count: 15 },
  { id: "4", name: "LED Displays", slug: "led-displays", count: 8 },
  { id: "5", name: "Corporate Events", slug: "corporate-events", count: 14 },
  { id: "6", name: "Conferences", slug: "conferences", count: 9 },
  { id: "7", name: "Weddings", slug: "weddings", count: 7 },
  { id: "8", name: "Lighting", slug: "lighting", count: 11 },
];

const getDefaultPosts = (): BlogPost[] => {
  const posts: BlogPost[] = [
    {
      id: "1",
      title: "10 Essential Tips for Flawless Event Production",
      slug: "10-essential-tips-flawless-event-production",
      excerpt: "Master the art of event production with these proven strategies that ensure every detail is perfect, from planning to execution.",
      content: `<h2>Planning is Everything</h2><p>The foundation of any successful event lies in meticulous planning. Start by creating a comprehensive timeline that accounts for every phase of your event...</p><h2>Technology Integration</h2><p>Modern events demand seamless technology integration. From registration systems to live streaming capabilities, ensure your tech stack is robust and reliable...</p><h3>Audio Visual Setup</h3><p>Your AV setup can make or break an event. Invest in quality equipment and always have backup systems in place...</p>`,
      coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=675&fit=crop",
      author: authors[0],
      category: categories[0],
      tags: [tags[4], tags[5]],
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      readingTime: 8,
      viewCount: 2847,
      featured: true,
      metaTitle: "10 Essential Tips for Flawless Event Production | Silverline Brilliance",
      metaDescription: "Discover proven strategies for perfect event production from planning to execution.",
    },
    {
      id: "2",
      title: "The Future of Live Streaming: Trends to Watch in 2026",
      slug: "future-live-streaming-trends-2026",
      excerpt: "Explore the cutting-edge technologies and trends shaping the future of live streaming for corporate events and conferences.",
      content: `<h2>AI-Powered Production</h2><p>Artificial intelligence is revolutionizing live streaming with automated camera switching, real-time captioning, and intelligent content recommendations...</p><h2>Interactive Experiences</h2><p>The future of streaming is interactive. Audiences now expect to engage with content through polls, Q&A sessions, and virtual networking...</p>`,
      coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=675&fit=crop",
      author: authors[1],
      category: categories[2],
      tags: [tags[0], tags[2]],
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      readingTime: 6,
      viewCount: 1923,
      featured: false,
      metaTitle: "The Future of Live Streaming: 2026 Trends | Silverline Brilliance",
      metaDescription: "Explore cutting-edge live streaming technologies and trends for corporate events.",
    },
    {
      id: "3",
      title: "How to Choose the Perfect Sound System for Your Venue",
      slug: "choose-perfect-sound-system-venue",
      excerpt: "A comprehensive guide to selecting the right audio equipment based on venue size, acoustics, and event requirements.",
      content: `<h2>Understanding Your Space</h2><p>Every venue has unique acoustic properties. Before selecting equipment, conduct a thorough acoustic analysis...</p><h2>Power and Coverage</h2><p>Calculate the required wattage and speaker placement to ensure even coverage throughout your venue...</p>`,
      coverImage: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&h=675&fit=crop",
      author: authors[2],
      category: categories[3],
      tags: [tags[1], tags[4]],
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      readingTime: 10,
      viewCount: 3156,
      featured: false,
      metaTitle: "How to Choose the Perfect Sound System | Silverline Brilliance",
      metaDescription: "Comprehensive guide to selecting audio equipment for your venue.",
    },
    {
      id: "4",
      title: "Behind the Scenes: Setting Up a 5000-Person Conference",
      slug: "behind-scenes-5000-person-conference",
      excerpt: "Take an exclusive look at the logistics, planning, and execution of one of our largest corporate conference productions.",
      content: `<h2>The Challenge</h2><p>When our client approached us about producing a 5000-person international conference, we knew this would be our most ambitious project yet...</p><h2>Logistics and Planning</h2><p>Six months of planning went into every detail, from venue selection to technology infrastructure...</p>`,
      coverImage: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&h=675&fit=crop",
      author: authors[1],
      category: categories[5],
      tags: [tags[5], tags[4]],
      publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      readingTime: 12,
      viewCount: 4521,
      featured: true,
      metaTitle: "Behind the Scenes: 5000-Person Conference Setup | Silverline Brilliance",
      metaDescription: "Exclusive look at producing a massive corporate conference.",
    },
    {
      id: "5",
      title: "LED Wall Technology: A Complete Buyer's Guide",
      slug: "led-wall-technology-buyers-guide",
      excerpt: "Everything you need to know about LED wall specifications, pixel pitch, brightness, and choosing the right display for your events.",
      content: `<h2>Understanding Pixel Pitch</h2><p>Pixel pitch determines viewing distance and image quality. Learn how to calculate the optimal pitch for your application...</p><h2>Indoor vs Outdoor</h2><p>Different environments require different specifications. We break down the key differences...</p>`,
      coverImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=675&fit=crop",
      author: authors[0],
      category: categories[1],
      tags: [tags[3], tags[2]],
      publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      readingTime: 9,
      viewCount: 2734,
      featured: false,
      metaTitle: "LED Wall Technology Buyer's Guide | Silverline Brilliance",
      metaDescription: "Complete guide to LED wall specifications and selection.",
    },
    {
      id: "6",
      title: "Creating Unforgettable Wedding Experiences with AV Technology",
      slug: "unforgettable-wedding-experiences-av-technology",
      excerpt: "Discover how modern audiovisual technology can transform wedding celebrations into magical, memorable experiences.",
      content: `<h2>Lighting Design</h2><p>Transform any venue with intelligent lighting design. From romantic ambiance to dance floor energy...</p><h2>Sound and Music</h2><p>Crystal-clear audio ensures every word of your vows and every note of your first dance is perfect...</p>`,
      coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=675&fit=crop",
      author: authors[2],
      category: categories[0],
      tags: [tags[6], tags[7], tags[1]],
      publishedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
      readingTime: 7,
      viewCount: 1876,
      featured: false,
      metaTitle: "Wedding AV Technology Guide | Silverline Brilliance",
      metaDescription: "Transform weddings with modern audiovisual technology.",
    },
    {
      id: "7",
      title: "Hybrid Events: Best Practices for In-Person and Virtual Audiences",
      slug: "hybrid-events-best-practices",
      excerpt: "Master the art of hybrid event production with strategies that engage both in-person and virtual attendees equally.",
      content: `<h2>Dual Audience Engagement</h2><p>The key to successful hybrid events is treating virtual attendees as first-class participants, not afterthoughts...</p><h2>Technology Stack</h2><p>Building a reliable hybrid event requires careful integration of streaming, interaction, and production tools...</p>`,
      coverImage: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=1200&h=675&fit=crop",
      author: authors[0],
      category: categories[3],
      tags: [tags[0], tags[4], tags[5]],
      publishedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      readingTime: 11,
      viewCount: 3892,
      featured: true,
      metaTitle: "Hybrid Events Best Practices | Silverline Brilliance",
      metaDescription: "Engage both in-person and virtual audiences with hybrid event strategies.",
    },
    {
      id: "8",
      title: "Wireless Microphone Systems: What You Need to Know",
      slug: "wireless-microphone-systems-guide",
      excerpt: "Navigate the complex world of wireless microphone technology with this comprehensive guide to frequencies, ranges, and best practices.",
      content: `<h2>Frequency Coordination</h2><p>Understanding RF spectrum and frequency coordination is crucial for reliable wireless audio...</p><h2>System Components</h2><p>From transmitters to receivers, learn about each component and how they work together...</p>`,
      coverImage: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=1200&h=675&fit=crop",
      author: authors[2],
      category: categories[1],
      tags: [tags[1], tags[4]],
      publishedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      readingTime: 8,
      viewCount: 2145,
      featured: false,
      metaTitle: "Wireless Microphone Systems Guide | Silverline Brilliance",
      metaDescription: "Comprehensive guide to wireless microphone technology.",
    },
    {
      id: "9",
      title: "Case Study: Transforming a Corporate Annual Meeting",
      slug: "case-study-corporate-annual-meeting",
      excerpt: "See how we helped a Fortune 500 company reimagine their annual shareholder meeting with innovative AV solutions.",
      content: `<h2>The Client's Vision</h2><p>Our client wanted to move beyond traditional presentations to create an engaging, memorable experience...</p><h2>Our Solution</h2><p>We designed a multi-screen experience with interactive elements and live data visualization...</p>`,
      coverImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=675&fit=crop",
      author: authors[1],
      category: categories[4],
      tags: [tags[4], tags[2], tags[3]],
      publishedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      readingTime: 6,
      viewCount: 1654,
      featured: false,
      metaTitle: "Case Study: Corporate Annual Meeting | Silverline Brilliance",
      metaDescription: "How we transformed a Fortune 500 annual meeting with AV innovation.",
    },
    {
      id: "10",
      title: "Lighting Design Fundamentals for Event Professionals",
      slug: "lighting-design-fundamentals-events",
      excerpt: "Learn the principles of effective lighting design that can elevate any event from ordinary to extraordinary.",
      content: `<h2>Color Theory</h2><p>Understanding color psychology and how different hues affect mood and atmosphere...</p><h2>Layering Techniques</h2><p>Create depth and dimension with proper layering of ambient, accent, and effect lighting...</p>`,
      coverImage: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=675&fit=crop",
      author: authors[0],
      category: categories[3],
      tags: [tags[7], tags[4]],
      publishedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
      readingTime: 9,
      viewCount: 2987,
      featured: false,
      metaTitle: "Lighting Design Fundamentals | Silverline Brilliance",
      metaDescription: "Master event lighting design principles and techniques.",
    },
  ];

  return posts;
};

const getPublishedPosts = (): BlogPost[] => {
  const stored = localStorage.getItem(BLOG_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }

  const defaultPosts = getDefaultPosts();
  localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(defaultPosts));
  return defaultPosts;
};

const filterAndSortPosts = (posts: BlogPost[], filters: BlogFilters): BlogPost[] => {
  let filtered = [...posts];

  // Search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (post) =>
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower) ||
        post.author.name.toLowerCase().includes(searchLower)
    );
  }

  // Category filter
  if (filters.category && filters.category !== "all") {
    filtered = filtered.filter((post) => post.category.slug === filters.category);
  }

  // Tag filter
  if (filters.tag) {
    filtered = filtered.filter((post) =>
      post.tags.some((tag) => tag.slug === filters.tag)
    );
  }

  // Sort
  switch (filters.sortBy) {
    case "latest":
      filtered.sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
      break;
    case "oldest":
      filtered.sort(
        (a, b) =>
          new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
      );
      break;
    case "popular":
      filtered.sort((a, b) => b.viewCount - a.viewCount);
      break;
    case "alphabetical":
      filtered.sort((a, b) => a.title.localeCompare(b.title));
      break;
    default:
      filtered.sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
  }

  return filtered;
};

export const useBlogPosts = (filters: BlogFilters = {}) => {
  return useQuery({
    queryKey: ["blog-posts", filters],
    queryFn: () => {
      const posts = getPublishedPosts();
      return filterAndSortPosts(posts, filters);
    },
  });
};

export const useBlogPost = (slug: string) => {
  return useQuery({
    queryKey: ["blog-post", slug],
    queryFn: () => {
      const posts = getPublishedPosts();
      const post = posts.find((p) => p.slug === slug);
      if (!post) throw new Error("Post not found");
      
      // Increment view count
      post.viewCount += 1;
      localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(posts));
      
      return post;
    },
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categories,
  });
};

export const useTags = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: () => tags,
  });
};

export const useComments = (postId: string) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => {
      const stored = localStorage.getItem(COMMENTS_STORAGE_KEY);
      if (!stored) return [];
      
      const allComments: Comment[] = JSON.parse(stored);
      return allComments.filter((c) => c.postId === postId && !c.parentId);
    },
  });
};

export const addComment = (comment: Omit<Comment, "id" | "createdAt" | "likes">): Comment => {
  const stored = localStorage.getItem(COMMENTS_STORAGE_KEY);
  const comments: Comment[] = stored ? JSON.parse(stored) : [];
  
  const newComment: Comment = {
    ...comment,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    likes: 0,
  };
  
  comments.push(newComment);
  localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments));
  
  return newComment;
};
