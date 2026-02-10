import { PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/sanity";

export const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return null;
      }

      return (
        <figure className="my-8">
          <Image
            src={urlFor(value).width(800).url()}
            alt={value.alt || "Blog image"}
            width={800}
            height={600}
            className="rounded-xl shadow-2xl"
          />
          {value.caption && (
            <figcaption className="mt-3 text-center text-sm italic text-gray-600">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    h2: ({ children }) => (
      <h2 className="mb-4 mt-8 scroll-mt-24 text-3xl font-bold text-primary">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-3 mt-6 scroll-mt-24 text-2xl font-bold text-primary">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mb-2 mt-4 scroll-mt-24 text-xl font-bold text-primary">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="mb-6 leading-relaxed text-gray-700">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-primary bg-primary/5 py-4 pl-6 pr-4 italic">
        <p className="mb-0 text-lg text-primary">{children}</p>
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-6 ml-6 space-y-2 list-none">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-6 ml-6 space-y-2 list-decimal">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="relative pl-6">
        <span className="absolute left-0 top-2.5 h-2 w-2 rounded-full bg-accent" />
        {children}
      </li>
    ),
    number: ({ children }) => (
      <li className="pl-2">
        {children}
      </li>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const rel = !value.href.startsWith("/") ? "noreferrer noopener" : undefined;
      return (
        <Link
          href={value.href}
          rel={rel}
          className="font-medium text-accent underline-offset-4 transition-all hover:underline"
        >
          {children}
        </Link>
      );
    },
    strong: ({ children }) => (
      <strong className="font-bold text-primary">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="rounded bg-primary/10 px-2 py-1 font-mono text-sm text-primary">
        {children}
      </code>
    ),
  },
};
