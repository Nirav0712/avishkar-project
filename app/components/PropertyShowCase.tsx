"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function PropertyShowCase() {
  const sliderImages = [
    "/images/project/amber1.jpeg",
    "/images/project/amber2.jpeg",
    "/images/project/amber3.jpeg",
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sliderImages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [sliderImages.length]);

  return (
    <section className="py-20 lg:py-28 bg-[#102447] text-white relative overflow-hidden">
      {/* Decorative Blur Spheres */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#d4af37]/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#0b1528]/80 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Spotlight Text */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#e4c272] text-xs font-bold tracking-wider uppercase mb-4">
              <i className="fas fa-sparkles text-[11px]"></i>
              <span>Featured Spotlight Residence</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              The Amber <br />
              <span className="gold-gradient-text">Urban Excellence & Serenity</span>
            </h2>

            <p className="mt-5 text-slate-300 text-sm sm:text-base leading-relaxed font-light">
              By Dobariya Group — A premier residential enclave offering thoughtfully architected 2 BHK residences with expansive dual balconies for uninterrupted skyline views. Equipped with landscaped podium gardens, state-of-the-art gymnasium, banquet hall, and round-the-clock security.
            </p>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
              <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-3.5 rounded-2xl">
                <span className="block text-[11px] text-slate-400 font-medium">Configurations</span>
                <span className="text-base font-bold text-white mt-0.5">2 BHK Luxe</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-3.5 rounded-2xl">
                <span className="block text-[11px] text-slate-400 font-medium">Built-up Area</span>
                <span className="text-base font-bold text-[#e4c272] mt-0.5">1215 - 1400+ sqft</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-3.5 rounded-2xl col-span-2 sm:col-span-1">
                <span className="block text-[11px] text-slate-400 font-medium">Location</span>
                <span className="text-base font-bold text-white mt-0.5 truncate block">Nikol - Naroda Rd</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#e4c272] text-[#0b1528] font-bold text-sm tracking-wide shadow-lg shadow-[#d4af37]/20 hover:brightness-105 transition-all"
              >
                <span>Schedule Private Visit</span>
                <i className="fas fa-calendar-alt text-xs"></i>
              </Link>

              <a
                href="https://wa.me/917041395595?text=Hello%20Avishkar%20Realty,%20I%20would%20like%20to%20know%20more%20about%20The%20Amber%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-emerald-600 border border-white/20 text-white font-semibold text-sm transition-all"
              >
                <i className="fab fa-whatsapp text-emerald-400"></i>
                <span>Instant WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Column: Visual Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Main Slider */}
              <div className="sm:col-span-8 relative h-80 sm:h-96 rounded-3xl overflow-hidden shadow-2xl border border-white/20 group">
                <Image
                  src={sliderImages[current]}
                  alt="The Amber Luxury Living"
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                {/* Floating Glass Pill */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-3 flex items-center justify-between">
                  <div className="text-xs text-white">
                    <span className="font-bold text-[#e4c272]">Modern Lifestyle Club</span>
                    <p className="text-[10px] text-slate-200">Podium seating, kids zone & fitness</p>
                  </div>
                  <div className="flex gap-1">
                    {sliderImages.map((_, i) => (
                      <span
                        key={i}
                        className={`h-1.5 rounded-full transition-all ${
                          i === current ? 'w-4 bg-[#e4c272]' : 'w-1.5 bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Side Stacked Card */}
              <div className="sm:col-span-4 flex flex-col gap-4">
                <div className="relative h-44 rounded-2xl overflow-hidden border border-white/15 shadow-lg">
                  <Image
                    src="/images/project/evara1.png"
                    alt="Evara Residence"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40"></div>
                  <span className="absolute bottom-2.5 left-2.5 text-xs font-bold text-white bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                    The Evara
                  </span>
                </div>

                <div className="relative h-44 rounded-2xl overflow-hidden border border-white/15 shadow-lg">
                  <Image
                    src="/images/project/ARISTO-Anantam1.jpeg"
                    alt="Aristo Anantam"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40"></div>
                  <span className="absolute bottom-2.5 left-2.5 text-xs font-bold text-white bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                    Aristo Anantam
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
