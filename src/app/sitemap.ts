import { MetadataRoute } from 'next';
import { getAllPosts, getAllPostSlugs } from '@/src/sanity/lib/queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://silverline-brilliance.com';
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/booking`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ];

  // Dynamic blog posts
  let blogPosts: Array<{
    url: string;
    lastModified: Date;
    changeFrequency: 'weekly' | 'monthly' | 'daily' | 'yearly' | 'always' | 'never';
    priority: number;
  }> = [];

  try {
    const posts = await getAllPosts();
    
    if (posts && Array.isArray(posts)) {
      blogPosts = posts.map((post: any) => ({
        url: `${baseUrl}/blog/${post.slug?.current || post.slug}`,
        lastModified: new Date(post.updatedAt || post.publishedAt || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.warn('Failed to fetch blog posts for sitemap:', error);
  }

  return [...staticPages, ...blogPosts];
}
