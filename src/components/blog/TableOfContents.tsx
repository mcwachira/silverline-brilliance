"use client";

import { useEffect, useState } from "react";
import { List } from "lucide-react";
import { Heading } from "@/types/blog";

interface TableOfContentsProps {
  headings: Heading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
      setIsOpen(false);
    }
  };

  if (headings.length === 0) return null;

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="fixed bottom-24 right-4 z-40 lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-2xl transition-all hover:scale-110"
        >
          <List className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[70vh] overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl">
            <h3 className="mb-4 text-xl font-bold text-primary">Table of Contents</h3>
            <nav>
              <ul className="space-y-2">
                {headings.map((heading) => (
                  <li key={heading.id}>
                    <button
                      onClick={() => scrollToHeading(heading.id)}
                      className={`block w-full text-left transition-colors ${
                        heading.level === 3 ? "pl-4" : ""
                      } ${
                        activeId === heading.id
                          ? "font-semibold text-accent"
                          : "text-gray-600 hover:text-accent"
                      }`}
                    >
                      {heading.text}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-xl border border-border bg-white p-6 shadow-lg">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-primary">
            <List className="h-5 w-5 text-accent" />
            Table of Contents
          </h3>
          <nav>
            <ul className="space-y-2">
              {headings.map((heading) => (
                <li key={heading.id}>
                  <button
                    onClick={() => scrollToHeading(heading.id)}
                    className={`block w-full text-left text-sm transition-colors ${
                      heading.level === 3 ? "pl-4" : ""
                    } ${
                      activeId === heading.id
                        ? "font-semibold text-accent"
                        : "text-gray-600 hover:text-accent"
                    }`}
                  >
                    {heading.text}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Reading Progress */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="mb-2 text-xs font-semibold text-gray-500">READING PROGRESS</p>
            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{
                  width: `${((headings.findIndex((h) => h.id === activeId) + 1) / headings.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
