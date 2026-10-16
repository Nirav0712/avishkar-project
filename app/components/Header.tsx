"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about-us" },
    { name: "Properties", href: "/properties" },
    { name: "Projects", href: "/project" },
    { name: "List Property", href: "/list-your-property" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Top Notification Bar */}
      <div className="bg-[#0b1528] text-xs text-slate-300 py-2 border-b border-white/10 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a
              href="tel:+917041395595"
              className="flex items-center gap-2 hover:text-[#e4c272] transition-colors"
            >
              <i className="fas fa-phone-alt text-[#e4c272] text-[10px]"></i>
              <span>+91 70413 95595</span>
            </a>
            <a
              href="mailto:avishkarrealty1@gmail.com"
              className="flex items-center gap-2 hover:text-[#e4c272] transition-colors"
            >
              <i className="fas fa-envelope text-[#e4c272] text-[10px]"></i>
              <span>avishkarrealty1@gmail.com</span>
            </a>
            <span className="hidden md:flex items-center gap-1.5 text-slate-400">
              <i className="fas fa-map-marker-alt text-[#e4c272] text-[10px]"></i>
              <span>Ahmedabad, Gujarat</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[#e4c272] font-medium tracking-wide">
              <i className="fas fa-shield-alt mr-1"></i> RERA Approved Partner
            </span>
            <div className="h-3 w-px bg-white/20"></div>
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <i className="fas fa-lock text-[#e4c272] text-[10px]"></i>
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Glass Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0b1528]/90 backdrop-blur-md shadow-lg border-b border-white/10 py-3"
            : "bg-[#0f1e3d]/95 backdrop-blur-sm py-4 border-b border-white/5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center justify-between">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img
                  src="/images/logo.png"
                  alt="Avishkar Realty"
                  className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <ul className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`px-3.5 py-2 rounded-lg text-sm font-medium tracking-wide transition-all duration-200 relative ${
                        active
                          ? "text-[#e4c272] bg-white/5 font-semibold"
                          : "text-slate-200 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {link.name}
                      {active && (
                        <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-[#e4c272] rounded-full"></span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-3">
              <Link
                href="/properties"
                className="w-10 h-10 rounded-full border border-white/15 bg-white/5 text-[#e4c272] flex items-center justify-center hover:bg-[#e4c272] hover:text-[#0b1528] transition-all duration-300 shadow-sm"
                title="Search Properties"
              >
                <i className="fas fa-search text-sm"></i>
              </Link>

              <Link
                href="/contact"
                className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-[#d4af37] to-[#e4c272] text-[#0b1528] px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide hover:shadow-lg hover:shadow-[#d4af37]/20 hover:brightness-105 transition-all duration-300"
              >
                <i className="fas fa-calendar-check text-xs"></i>
                <span>Enquire Now</span>
              </Link>

              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                className="lg:hidden w-10 h-10 rounded-lg bg-white/5 border border-white/15 text-slate-200 flex items-center justify-center text-lg hover:text-[#e4c272] transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Navigation"
              >
                <i className={`fas ${mobileMenuOpen ? "fa-times" : "fa-bars"}`}></i>
              </button>
            </div>
          </nav>

          {/* Mobile Glass Navigation Drawer */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pt-4 pb-6 border-t border-white/10 animate-in fade-in slide-in-from-top-2 duration-200">
              <ul className="flex flex-col gap-2">
                {navLinks.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-4 py-2.5 rounded-xl text-base font-medium transition-all ${
                          active
                            ? "bg-white/10 text-[#e4c272] font-semibold"
                            : "text-slate-200 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {link.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-3">
                <a
                  href="tel:+917041395595"
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 text-[#e4c272] border border-white/10 text-sm font-medium"
                >
                  <i className="fas fa-phone-alt"></i>
                  <span>Call +91 70413 95595</span>
                </a>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e4c272] text-[#0b1528] text-sm font-bold shadow-md"
                >
                  <i className="fas fa-calendar-check"></i>
                  <span>Book Free Consultation</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
