"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

const heroImages = [
  "/images/slider/slider1.jpeg",
  "/images/slider/slider4.jpeg",
  "/images/slider/slider3.jpeg",
  "/images/slider/slider2.jpeg",
  "/images/slider/slider5.jpeg",
];

export default function HeroSection() {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Search filter states
  const [activeTab, setActiveTab] = useState<"all" | "Residential" | "Commercial" | "Projects">("all");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [budget, setBudget] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "Projects") {
      router.push("/project");
      return;
    }
    const params = new URLSearchParams();
    if (activeTab !== "all") params.set("category", activeTab);
    if (location) params.set("location", location);
    if (propertyType) params.set("type", propertyType);
    if (budget) params.set("budget", budget);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[620px] lg:min-h-[720px] flex items-center justify-center overflow-hidden py-16 lg:py-24">
      {/* Background Image Carousel with Rich Overlays */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
            style={{ transition: "opacity 1.2s ease-in-out, transform 8s ease-out" }}
          >
            <Image
              src={image}
              alt={`Avishkar Luxury Architecture ${index + 1}`}
              fill
              className="object-cover object-center"
              priority={index === 0}
            />
            {/* Multi-layered cinematic gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1528] via-[#0b1528]/60 to-[#0b1528]/40"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b1528]/80 via-transparent to-[#0b1528]/70"></div>
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 w-full text-center">
        {/* Prestige Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#e4c272] text-xs sm:text-sm font-semibold tracking-wider uppercase mb-6 shadow-md">
          <i className="fas fa-crown text-[11px]"></i>
          <span>Premier Real Estate Advisory in Ahmedabad</span>
        </div>

        {/* Main Hero Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto drop-shadow-md">
          Curated Luxury Living & Prime Commercial Spaces in{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e4c272] via-[#f7df99] to-[#d4af37]">
            Ahmedabad
          </span>
        </h1>

        <p className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-200 max-w-2xl mx-auto font-light leading-relaxed">
          From iconic high-rises on SG Highway to serene family residences in Zundal & Vaishnodevi Circle. Certified RERA projects with transparent guidance.
        </p>

        {/* Refined Glassmorphism Search Container */}
        <div className="mt-8 sm:mt-10 max-w-4xl mx-auto bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl shadow-black/30 text-left">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === "all"
                  ? "bg-[#d4af37] text-[#0b1528] shadow-md shadow-[#d4af37]/30"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              All Properties
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("Residential")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === "Residential"
                  ? "bg-[#d4af37] text-[#0b1528] shadow-md shadow-[#d4af37]/30"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              Residential
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("Commercial")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === "Commercial"
                  ? "bg-[#d4af37] text-[#0b1528] shadow-md shadow-[#d4af37]/30"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              Commercial
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("Projects")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === "Projects"
                  ? "bg-[#d4af37] text-[#0b1528] shadow-md shadow-[#d4af37]/30"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <i className="fas fa-building mr-1.5 text-xs"></i>
              Flagship Projects
            </button>
          </div>

          {/* Search Fields Grid */}
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Location */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2.5 border border-white/60 focus-within:ring-2 focus-within:ring-[#d4af37]">
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">
                Location
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="">All Ahmedabad</option>
                <option value="SG Highway">SG Highway</option>
                <option value="Zundal">Zundal</option>
                <option value="Gota">Gota</option>
                <option value="Vaishnodevi Circle">Vaishnodevi Circle</option>
                <option value="Bodakdev">Bodakdev</option>
                <option value="Science City">Science City</option>
                <option value="Nikol">Nikol</option>
              </select>
            </div>

            {/* Property Type */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2.5 border border-white/60 focus-within:ring-2 focus-within:ring-[#d4af37]">
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">
                Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="">All Types</option>
                <option value="Apartment">Apartment (2/3/4 BHK)</option>
                <option value="Penthouse">Luxury Penthouse</option>
                <option value="Villa">Independent Villa</option>
                <option value="Commercial">Office / Retail Showroom</option>
                <option value="Land">Commercial / Residential Plot</option>
              </select>
            </div>

            {/* Budget */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2.5 border border-white/60 focus-within:ring-2 focus-within:ring-[#d4af37]">
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">
                Budget Range
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="">Any Budget</option>
                <option value="under-75l">Under ₹75 Lakhs</option>
                <option value="75l-1.5cr">₹75 Lakhs - ₹1.5 Cr</option>
                <option value="1.5cr-3cr">₹1.5 Cr - ₹3 Cr</option>
                <option value="above-3cr">₹3 Cr & Above</option>
              </select>
            </div>

            {/* Submit Action Button */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full h-[52px] bg-gradient-to-r from-[#d4af37] to-[#e4c272] text-[#0b1528] rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#d4af37]/30 hover:brightness-105 transition-all duration-200"
              >
                <i className="fas fa-search text-xs"></i>
                <span>Explore Properties</span>
              </button>
            </div>
          </form>
        </div>

        {/* Verified Confidence Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#e4c272] text-[10px]">
              <i className="fas fa-check"></i>
            </span>
            <span>50+ Partner Developers</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#e4c272] text-[10px]">
              <i className="fas fa-check"></i>
            </span>
            <span>100% RERA Verified</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#e4c272] text-[10px]">
              <i className="fas fa-check"></i>
            </span>
            <span>Zero Brokerage on New Projects</span>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex items-center gap-2 z-20">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentImageIndex ? "w-8 bg-[#d4af37]" : "w-2 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
