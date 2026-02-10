"use client";

interface ArticleContentProps {
  content: string;
}

export default function ArticleContent({ content }: ArticleContentProps) {
  return (
    <article className="prose prose-lg mx-auto max-w-3xl px-4 py-12">
      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <style jsx global>{`
        .article-content {
          @apply text-gray-700;
        }

        .article-content h2 {
          @apply mb-4 mt-8 scroll-mt-24 text-3xl font-bold text-primary;
        }

        .article-content h3 {
          @apply mb-3 mt-6 scroll-mt-24 text-2xl font-bold text-primary;
        }

        .article-content h4 {
          @apply mb-2 mt-4 scroll-mt-24 text-xl font-bold text-primary;
        }

        .article-content p {
          @apply mb-6 leading-relaxed;
        }

        .article-content a {
          @apply font-medium text-accent underline-offset-4 transition-all hover:underline;
        }

        .article-content strong {
          @apply font-bold text-primary;
        }

        .article-content em {
          @apply italic;
        }

        .article-content ul,
        .article-content ol {
          @apply mb-6 ml-6 space-y-2;
        }

        .article-content ul {
          @apply list-none;
        }

        .article-content ul li {
          @apply relative pl-6;
        }

        .article-content ul li::before {
          content: "";
          @apply absolute left-0 top-2.5 h-2 w-2 rounded-full bg-accent;
        }

        .article-content ol {
          @apply list-decimal;
        }

        .article-content ol li {
          @apply pl-2;
        }

        .article-content ol li::marker {
          @apply font-bold text-accent;
        }

        .article-content blockquote {
          @apply my-6 border-l-4 border-primary bg-primary/5 py-4 pl-6 pr-4 italic;
        }

        .article-content blockquote p {
          @apply mb-0 text-lg text-primary;
        }

        .article-content img {
          @apply my-8 rounded-xl shadow-2xl;
        }

        .article-content figure {
          @apply my-8;
        }

        .article-content figcaption {
          @apply mt-3 text-center text-sm italic text-gray-600;
        }

        .article-content code {
          @apply rounded bg-primary/10 px-2 py-1 font-mono text-sm text-primary;
        }

        .article-content pre {
          @apply my-6 overflow-x-auto rounded-xl bg-gray-900 p-6;
        }

        .article-content pre code {
          @apply bg-transparent p-0 text-gray-100;
        }

        .article-content table {
          @apply my-6 w-full border-collapse overflow-hidden rounded-xl border border-border;
        }

        .article-content thead {
          @apply bg-primary text-white;
        }

        .article-content th {
          @apply px-4 py-3 text-left font-semibold;
        }

        .article-content td {
          @apply border-t border-border px-4 py-3;
        }

        .article-content tbody tr:hover {
          @apply bg-accent/5;
        }

        /* Callout boxes */
        .article-content .callout {
          @apply my-6 rounded-xl border-l-4 p-6;
        }

        .article-content .callout.info {
          @apply border-blue-500 bg-blue-50;
        }

        .article-content .callout.warning {
          @apply border-yellow-500 bg-yellow-50;
        }

        .article-content .callout.success {
          @apply border-green-500 bg-green-50;
        }

        .article-content .callout.tip {
          @apply border-accent bg-accent/5;
        }
      `}</style>
    </article>
  );
}
