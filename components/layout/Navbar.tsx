"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

const navItems = [
  { name: "Tentang Perusahaan", href: "/tentang-kami" },
  { name: "Layanan", href: "/layanan", hasDropdown: true },
  { name: "Klien", href: "/klien" },
  { name: "Portofolio", href: "/portofolio" },
  { name: "Blog", href: "/artikel" },
  { name: "Hubungi Kami", href: "/hubungi-kami" },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [services, setServices] = useState<Array<{ id: number; title: string; slug: string }>>([]);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Fetch active services for dropdown
    fetch("/api/services")
      .then(res => res.json())
      .then(data => setServices(data.filter((s: any) => s.isActive)))
      .catch(err => console.error("Failed to fetch services:", err));
  }, []);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border py-4 shadow-sm"
          : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/logo.png" 
            alt="USSI ITS Logo" 
            width={120} 
            height={40} 
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            item.hasDropdown ? (
              <div
                key={item.name}
                className="relative group"
                onMouseEnter={() => {
                  // Clear any existing timeout
                  if (dropdownTimeout) {
                    clearTimeout(dropdownTimeout);
                    setDropdownTimeout(null);
                  }
                  setShowServicesDropdown(true);
                }}
                onMouseLeave={() => {
                  // Add delay before hiding
                  const timeout = setTimeout(() => {
                    setShowServicesDropdown(false);
                  }, 300); // 300ms delay
                  setDropdownTimeout(timeout);
                }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "text-sm font-medium hover:text-accent transition-colors flex items-center gap-1 cursor-pointer relative",
                    pathname.startsWith("/layanan") && "text-accent font-bold"
                  )}
                >
                  {item.name}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  {pathname.startsWith("/layanan") && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent rounded-full" />
                  )}
                </Link>
                
                {/* Dropdown Menu */}
                {showServicesDropdown && services.length > 0 && (
                  <div className="absolute top-full left-0 mt-1 pt-2 w-56 z-50">
                    <div className="bg-background border border-border rounded-lg shadow-lg py-2">
                      {services.map((service) => (
                        <Link
                          key={service.id}
                          href={`/layanan/${service.slug}`}
                          className="block px-4 py-2 text-sm hover:bg-muted hover:text-accent transition-colors"
                          onClick={() => setShowServicesDropdown(false)}
                        >
                          {service.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium hover:text-accent transition-colors relative",
                  pathname === item.href && "text-accent font-bold"
                )}
              >
                {item.name}
                {pathname === item.href && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent rounded-full" />
                )}
              </Link>
            )
          ))}
          
          {user ? (
            <div className="flex items-center gap-4">
               <Button asChild size="sm" variant="default">
                 <Link href="/admin">Dashboard</Link>
               </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Button asChild size="sm" variant="outline" className="text-foreground">
                 <Link href="/auth/login">Masuk</Link>
              </Button>
              <Button asChild size="sm">
                 <Link href="/hubungi-kami">Demo Gratis</Link>
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-primary z-[101] bg-background/50 backdrop-blur-sm border border-border/50 rounded-md shadow-sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border p-4 shadow-lg animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium py-2 hover:text-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Button asChild className="w-full">
              <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                Demo Gratis
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
