import Link from "next/link";
import { Menu, X, Shield } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { NavbarClient } from "./NavbarClient";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/booking", label: "Book Now" },
  { href: "/contact", label: "Contact" },
];

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent py-5">
      <div className="container mx-auto px-4 flex items-center justify-between">
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
              className="font-heading font-medium text-sm uppercase tracking-wide transition-colors duration-300 text-foreground/80 hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="hidden lg:flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/admin/login" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Admin Login
            </Link>
          </Button>

          <Button variant="gold" asChild>
            <Link href="/contact">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle - Client Component */}
        <NavbarClient navLinks={navLinks} />
      </div>
    </header>
  );
};

export default Navbar;
