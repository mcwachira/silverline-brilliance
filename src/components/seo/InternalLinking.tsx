import Link from 'next/link';
import { Badge } from '@/src/components/ui/badge';

interface ServiceLink {
  name: string;
  url: string;
  description: string;
}

interface InternalLinkingProps {
  type: 'services' | 'blog' | 'related';
  items: ServiceLink[];
  title?: string;
}

export function InternalLinking({ type, items, title }: InternalLinkingProps) {
  if (!items || items.length === 0) return null;

  const defaultTitles = {
    services: 'Related Services',
    blog: 'Related Articles',
    related: 'You Might Also Like'
  };

  const displayTitle = title || defaultTitles[type];

  return (
    <section className="py-8 bg-muted/30 rounded-lg">
      <div className="container mx-auto px-4">
        <h3 className="text-lg font-semibold mb-4">{displayTitle}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Link
              key={item.url}
              href={item.url}
              className="block p-4 bg-background rounded-lg border border-border hover:border-accent hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-foreground mb-2 hover:text-accent transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                </div>
                <Badge variant="secondary" className="ml-2 text-xs">
                  {type === 'services' ? 'Service' : type === 'blog' ? 'Article' : 'Related'}
                </Badge>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Service-specific internal linking component
export function ServiceInternalLinks() {
  const services = [
    {
      name: 'Live Streaming Services',
      url: '/services#live-streaming',
      description: 'Professional live streaming for corporate events, conferences, and special occasions.'
    },
    {
      name: 'Event Coverage',
      url: '/services#event-coverage',
      description: 'Comprehensive event coverage with professional photography and videography.'
    },
    {
      name: 'Sound Systems',
      url: '/services#sound-systems',
      description: 'Professional audio equipment and sound engineering services for events.'
    },
    {
      name: 'Stage Lighting',
      url: '/services#stage-lighting',
      description: 'Professional lighting design and equipment for events and productions.'
    }
  ];

  return <InternalLinking type="services" items={services} />;
}

// Blog-specific internal linking component
export function BlogInternalLinks({ currentSlug }: { currentSlug: string }) {
  // This would typically fetch related posts based on the current post
  const relatedPosts = [
    {
      name: 'Choosing the Right AV Equipment for Your Event',
      url: '/blog/choosing-av-equipment',
      description: 'A comprehensive guide to selecting the best audiovisual equipment for different types of events.'
    },
    {
      name: 'Live Streaming Best Practices for Corporate Events',
      url: '/blog/live-streaming-best-practices',
      description: 'Essential tips and techniques for successful live streaming of corporate events.'
    },
    {
      name: 'Event Photography Tips for Professional Results',
      url: '/blog/event-photography-tips',
      description: 'Professional photography techniques to capture memorable moments at your events.'
    }
  ];

  // Filter out current post if it's in the related posts
  const filteredPosts = relatedPosts.filter(post => !post.url.includes(currentSlug));

  return <InternalLinking type="blog" items={filteredPosts} />;
}
