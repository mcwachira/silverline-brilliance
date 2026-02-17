import { PortableText } from '@portabletext/react';
import { portableTextComponents } from '@/src/sanity/lib/portableText';

interface BlogPostContentProps {
  content: any[];
}

export function BlogPostContent({ content }: BlogPostContentProps) {
  return (
    <div className="prose prose-lg md:prose-xl max-w-none 
      prose-headings:font-heading prose-headings:font-bold prose-headings:tracking-tight
      prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mb-4 prose-h2:mt-8
      prose-h3:text-xl prose-h3:md:text-2xl prose-h3:mb-3 prose-h3:mt-6
      prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:mb-4
      prose-a:text-accent prose-a:no-underline hover:prose-a:underline
      prose-strong:text-foreground prose-strong:font-semibold
      prose-code:text-accent prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
      prose-pre:bg-muted prose-pre:border prose-pre:border-border
      prose-img:rounded-xl prose-img:shadow-lg
      prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:pl-4 prose-blockquote:italic
      prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6
      prose-li:mb-2">
      <PortableText value={content} components={portableTextComponents} />
    </div>
  );
}