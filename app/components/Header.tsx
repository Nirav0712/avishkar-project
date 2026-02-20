"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top Bar */}
      {/* <div className="bg-[#E3572B] text-white py-2.5 text-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <div className="flex gap-6">
              <a
                href="mailto:info@veerrealstate.com"
                className="flex items-center gap-2 transition-colors"
              >
                <i className="fas fa-envelope"></i>
                avishkarrealty1@gmail.com
              </a>
              <a
                href="tel:+917041395595"
                className="flex items-center gap-2 transition-colors"
              >
                <i className="fas fa-phone"></i>
                +91 70413 95595
              </a>
            </div>
            <div className="flex gap-6">
              <Link
                href="/admin"
                className="flex items-center gap-2 transition-colors"
              >
                <i className="fas fa-user"></i>
                About /
              </Link>
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 transition-colors"
              >
                <i className="fas fa-tachometer-alt"></i>
                My Account /
              </Link>
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 transition-colors"
              >
                <i className="fas fa-tachometer-alt"></i>
                Contact
              </Link>
              <div className="flex gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-orange-600  hover:text-white transition"
                >
                  <i className="fab fa-facebook-f text-sm"></i>
                </a>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-orange-600 hover:text-white transition"
                >
                  <i className="fab fa-instagram text-sm"></i>
                </a>
              </div>

              <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
              />
            </div>
          </div>
        </div>
      </div> */}

      {/* Main Header */}
      <header className="bg-[#0f1e3d] shadow-md sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center justify-between py-6">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-secondary">
              {/* Veer<span className="text-primary">RealEstate</span> */}
              <img src="/logo.png" alt="logo" className="w-50 h-auto" />
            </Link>

            {/* Desktop Menu */}
            <ul className="hidden lg:flex items-center gap-8">
              <li>
                <Link
                  href="/"
                  className="block text-white text-light font-lg hover:text-[#E3572B] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="block text-white text-light font-lg hover:text-orange-600 transition-colors"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="/properties"
                  className="block text-white text-light font-lg hover:text-orange-600 transition-colors"
                >
                  Properties
                </Link>
              </li>

              <li>
                <Link
                  href="/project"
                  className="block text-white text-light font-lg hover:text-orange-600 transition-colors"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="block text-white text-light font-lg hover:text-orange-600 transition-colors"
                >
                  Blog
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/blog"
                  className="block text-white text-light font-lg hover:text-orange-600 transition-colors"
                >
                  Sale
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="block text-white text-light font-lg hover:text-orange-600 transition-colors"
                >
                  Rent
                </Link>
              </li> */}
              <li>
                <Link
                  href="/contact"
                  className="block text-white text-light font-lg hover:text-orange-600 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>

            <div className="flex items-center gap-4">
              {/* Search Icon */}
              <button className="w-12 h-12 rounded-full border border-white/70 flex items-center justify-center text-[#b7d39b] hover:text-[#12233D] hover:bg-[#b7d39b]">
                <i className="fas fa-search text-lg  hover:bg-[#b7d39b]"></i>
              </button>

              {/* Add Properties Button */}
              <a
                href="/admin/dashboard"
                className="
    flex items-center gap-2
    bg-[#12233D] text-[#b7d39b]
    px-6 py-3 rounded-full
    text-light font-light
    border border-[#b7d39b]
    transition-all duration-300
    hover:bg-[#b7d39b]
    hover:text-[#12233D]
  "
              >
                <i className="fas fa-home"></i>
                Add Properties
              </a>
            </div>

            {/* CTA Button */}
            {/* <div className="hidden lg:flex items-center gap-4">
              <Link
                href="/properties"
                className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                Browse Properties
              </Link>
            </div> */}

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden text-2xl text-secondary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <i
                className={`fas ${mobileMenuOpen ? "fa-times" : "fa-bars"}`}
              ></i>
            </button>
          </nav>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t">
              <ul className="flex flex-col gap-4">
                <li>
                  <Link
                    href="/"
                    className="block text-secondary hover:text-primary font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/properties"
                    className="block text-secondary hover:text-primary font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Properties
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="block text-secondary hover:text-primary font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="block text-secondary hover:text-primary font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="block text-secondary hover:text-primary font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/properties"
                    className="block bg-primary text-white px-6 py-2.5 rounded-lg font-medium text-center hover:bg-primary-dark transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Browse Properties
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
