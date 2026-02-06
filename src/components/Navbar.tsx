"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  // { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/booking", label: "Book Now" },
  { href: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isAdmin = "test";
  const user = "new";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass-nav py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="contaiiner mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-heading font-extrabold text-xl md:text-2xl text-gradient-gold uppercase tracking-wider">
            Silverline Technologies
          </span>
        </Link>

        {/* Desktop Navigation */}

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative font-heading font-medium text-sm uppercase tracking-wide transition-colors duration-300 ${
                location.pathname === link.href
                  ? "text-accent"
                  : "text-foreground/80 hover:text-accent"
              }`}
            >
              {link.label}
              {pathname === link.href && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent"
                  initial={false}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* CTA Button */}

        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="tel:0700040225"
            className="flex items-center gap-2 text-accent font-heading font-semibold text-sm"
          >
            <Phone className="w-4 h-4" />
            0700040225
          </Link>

          {user ? (
            isAdmin ? (
              <Button variant="outline" asChild>
                <Link href="/admin" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Admin
                </Link>
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <Link href="/auth" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Account
                </Link>
              </Button>
            )
          ) : (
            <Button variant="outline" asChild>
              <Link href="/auth">Sign In</Link>
            </Button>
          )}

          <Button variant="gold" asChild>
            <Link href="/contact">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}

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
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-nav border-t border-white/10"
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
                      location.pathname === link.href
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
                className="pt-4 border-t border-white/10"
              >
                <Button variant="gold" className="w-full" asChild>
                  <Link href="/contact">Get Started</Link>
                </Button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
