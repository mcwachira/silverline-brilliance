"use client";

import Image from "next/image";
import Link from "next/link";
import { Twitter, Linkedin, Globe, ArrowRight } from "lucide-react";
import { Author } from "@/types/blog";

interface AuthorBioProps {
  author: Author;
}

export default function AuthorBio({ author }: AuthorBioProps) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-accent/5 p-8 shadow-xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          {/* Avatar */}
          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-full border-4 border-accent shadow-lg md:h-32 md:w-32">
            <Image
              src={author.avatar}
              alt={author.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h3 className="mb-1 text-2xl font-bold text-primary">{author.name}</h3>
            <p className="mb-3 text-sm font-medium text-accent">{author.role}</p>
            <p className="mb-4 text-gray-700">{author.bio}</p>

            {/* Social Links & More Articles */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Social Links */}
              <div className="flex items-center gap-3">
                {author.social.twitter && (
                  <a
                    href={author.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white transition-all hover:bg-accent hover:shadow-lg"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                )}
                {author.social.linkedin && (
                  <a
                    href={author.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white transition-all hover:bg-accent hover:shadow-lg"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
                {author.social.website && (
                  <a
                    href={author.social.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white transition-all hover:bg-accent hover:shadow-lg"
                  >
                    <Globe className="h-4 w-4" />
                  </a>
                )}
              </div>

              {/* More by Author */}
              <Link
                href={`/blog?author=${author.id}`}
                className="group flex items-center gap-2 rounded-full border-2 border-accent bg-white px-4 py-2 text-sm font-semibold text-primary transition-all hover:bg-accent hover:text-accent-foreground"
              >
                More by {author.name.split(" ")[0]}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
