import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { BreadcrumbSchema } from './StructuredData';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
}

export function BreadcrumbNavigation({ items, showHome = true }: BreadcrumbNavigationProps) {
  const allItems = showHome 
    ? [{ name: 'Home', url: '/' }, ...items]
    : items;

  return (
    <>
      {/* Structured Data */}
      <BreadcrumbSchema items={allItems} />
      
      {/* Visual Breadcrumb */}
      <nav 
        aria-label="Breadcrumb navigation"
        className="flex items-center space-x-2 text-sm text-muted-foreground py-4"
      >
        {allItems.map((item, index) => (
          <div key={item.url} className="flex items-center space-x-2">
            {index === 0 && showHome && (
              <Home className="w-4 h-4" aria-hidden="true" />
            )}
            
            {index > 0 && (
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            )}
            
            {index === allItems.length - 1 ? (
              <span 
                className="font-medium text-foreground"
                aria-current="page"
              >
                {item.name}
              </span>
            ) : (
              <Link 
                href={item.url}
                className="hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </>
  );
}
