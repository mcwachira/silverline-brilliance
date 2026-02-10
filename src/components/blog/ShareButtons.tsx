"use client";

import { useState, useEffect } from "react";
import { Facebook, Twitter, Linkedin, Link as LinkIcon, MessageCircle } from "lucide-react";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
      {/* Facebook */}
      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:scale-110 hover:bg-[#1877F2] hover:shadow-xl"
        aria-label="Share on Facebook"
      >
        <Facebook className="h-5 w-5 text-[#1877F2] transition-colors group-hover:text-white" />
      </a>

      {/* Twitter/X */}
      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:scale-110 hover:bg-black hover:shadow-xl"
        aria-label="Share on Twitter"
      >
        <Twitter className="h-5 w-5 text-black transition-colors group-hover:text-white" />
      </a>

      {/* LinkedIn */}
      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:scale-110 hover:bg-[#0A66C2] hover:shadow-xl"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="h-5 w-5 text-[#0A66C2] transition-colors group-hover:text-white" />
      </a>

      {/* WhatsApp */}
      <a
        href={shareLinks.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:scale-110 hover:bg-[#25D366] hover:shadow-xl"
        aria-label="Share on WhatsApp"
      >
        <MessageCircle className="h-5 w-5 text-[#25D366] transition-colors group-hover:text-white" />
      </a>

      {/* Copy Link */}
      <button
        onClick={copyLink}
        className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:scale-110 hover:bg-accent hover:shadow-xl"
        aria-label="Copy link"
      >
        <LinkIcon className="h-5 w-5 text-accent transition-colors group-hover:text-accent-foreground" />
        {copied && (
          <span className="absolute -left-20 whitespace-nowrap rounded-lg bg-black px-3 py-1 text-xs text-white">
            Copied!
          </span>
        )}
      </button>
    </div>
  );
}
