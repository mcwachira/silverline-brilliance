
'use client';

import { useEffect, useState } from 'react';
import { List } from 'lucide-react';

interface TableOfContentsProps {
  content: any[];
}

interface Heading {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Extract headings from content
    const extractedHeadings: Heading[] = [];
    
    content.forEach((block, index) => {
      if (block.style && (block.style === 'h2' || block.style === 'h3')) {
        const text = block.children
          ?.map((child: any) => child.text)
          .join('') || '';
        
        const id = `heading-${index}`;
        const level = block.style === 'h2' ? 2 : 3;
        
        extractedHeadings.push({ id, text, level });
      }
    });

    setHeadings(extractedHeadings);
  }, [content]);

  useEffect(() => {
    // Scroll spy functionality
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0% -35% 0%' }
    );

    const headingElements = headings.map((h) => 
      document.getElementById(h.id)
    ).filter(Boolean);

    headingElements.forEach((el) => el && observer.observe(el));

    return () => {
      headingElements.forEach((el) => el && observer.unobserve(el));
    };
  }, [headings]);

  if (headings.length === 0) return null;

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav className="rounded-xl bg-card border border-border p-6" aria-label="Table of contents">
      <div className="mb-4 flex items-center gap-2">
        <List className="h-5 w-5 text-accent" />
        <h3 className="text-lg font-bold text-foreground">Table of Contents</h3>
      </div>

      <ul className="space-y-2">
        {headings.map((heading) => (
          <li key={heading.id}>
            <button
              onClick={() => scrollToHeading(heading.id)}
              className={`block w-full text-left text-sm transition-colors ${
                heading.level === 3 ? 'pl-4' : ''
              } ${
                activeId === heading.id
                  ? 'text-accent font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
