'use client';

import { useState } from 'react';
import { Share2, Twitter, Linkedin, Facebook, Link as LinkIcon, Check } from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  };

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-xl bg-card border border-border p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Share2 className="h-5 w-5 text-accent" />
              <h3 className="text-lg font-semibold text-foreground">Share this article</h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.open(shareLinks.twitter, '_blank')}
                className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-muted text-foreground transition-all hover:bg-[#1DA1F2] hover:text-white"
                aria-label="Share on Twitter"
              >
                <Twitter className="h-4 w-4" />
              </button>

              <button
                onClick={() => window.open(shareLinks.linkedin, '_blank')}
                className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-muted text-foreground transition-all hover:bg-[#0077B5] hover:text-white"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </button>

              <button
                onClick={() => window.open(shareLinks.facebook, '_blank')}
                className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-muted text-foreground transition-all hover:bg-[#4267B2] hover:text-white"
                aria-label="Share on Facebook"
              >
                <Facebook className="h-4 w-4" />
              </button>

              <button
                onClick={handleCopyLink}
                className={`inline-flex items-center justify-center h-10 w-10 rounded-full transition-all ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-muted text-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
                aria-label="Copy link"
              >
                {copied ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}