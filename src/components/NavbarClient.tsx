"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Shield } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface NavbarClientProps {
  navLinks: { href: string; label: string }[];
}

const NavbarClient = ({ navLinks }: NavbarClientProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  if (!mounted) {
    return (
      <button className="lg:hidden p-2 text-foreground" aria-label="Loading Menu">
        <div className="w-6 h-6 bg-gray-200 animate-pulse rounded"></div>
      </button>
    );
  }

  return (
    <>
      <button
        className="lg:hidden p-2 text-foreground"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle Menu"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-nav border-t border-white/10 absolute top-full left-0 right-0"
          >
            <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className={`block font-heading font-semibold text-lg ${
                      pathname === link.href
                        ? "text-accent"
                        : "text-foreground/80 hover:text-accent"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="pt-4 border-t border-white/10 space-y-3"
              >
                <Button variant="outline" className="w-full" asChild>
                  <Link
                    href="/admin/login"
                    className="flex items-center justify-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    Admin Login
                  </Link>
                </Button>
                <Button variant="gold" className="w-full" asChild>
                  <Link href="/contact">Get Started</Link>
                </Button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export { NavbarClient };
