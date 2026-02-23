"use client";

import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { Twitter, Linkedin, Github, User } from "lucide-react";
import { Author } from "@/src/lib/blog/types";

interface AuthorBioProps {
  author: Author;
}

export function AuthorBio({ author }: AuthorBioProps) {
  return (
    <section className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto rounded-2xl bg-card border border-border p-6 md:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {author.avatar ? (
              <div className="relative h-20 w-20 md:h-24 md:w-24 overflow-hidden rounded-full border-4 border-accent">
                <Image
                  src={author.avatar}
                  alt={author.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-muted flex items-center justify-center border-4 border-accent">
                <User className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Bio Content */}
          <div className="flex-1">
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-1">
              {author.name}
            </h3>

            <p className="text-sm md:text-base text-muted-foreground mb-3">
              {author.role}
            </p>

            {/* ✅ FIXED: Proper Portable Text Rendering */}
            {author.bio && (
              <div className="prose prose-sm md:prose-base max-w-none text-foreground/80 mb-4">
                <PortableText value={author.bio} />
              </div>
            )}

            {/* Social Links */}
            {(author.social?.twitter ||
              author.social?.linkedin ||
              author.social?.github) && (
              <div className="flex items-center gap-3">
                {author.social.twitter && (
                  <Link
                    href={author.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-muted text-foreground transition-all hover:bg-accent hover:text-accent-foreground"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-4 w-4" />
                  </Link>
                )}

                {author.social.linkedin && (
                  <Link
                    href={author.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-muted text-foreground transition-all hover:bg-accent hover:text-accent-foreground"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-4 w-4" />
                  </Link>
                )}

                {author.social.github && (
                  <Link
                    href={author.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-muted text-foreground transition-all hover:bg-accent hover:text-accent-foreground"
                    aria-label="GitHub"
                  >
                    <Github className="h-4 w-4" />
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
