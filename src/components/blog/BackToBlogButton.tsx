"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BackToBlogButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <Link
      href="/blog"
      className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-2xl transition-all hover:scale-110 hover:shadow-accent/50"
      aria-label="Back to blog"
    >
      <ArrowLeft className="h-6 w-6" />
    </Link>
  );
}
