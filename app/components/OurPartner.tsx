"use client";

import Image from "next/image";
import { useState } from "react";

const partners = [
  { name: "ADANI REALTY", logo: "/images/Partner/4.png", projects: "30+ Projects" },
  { name: "GODREJ PROPERTIES", logo: "/images/OurPartners/godrej.svg", projects: "20+ Projects" },
  { name: "SHIVALIK", logo: "/images/OurPartners/shivalik.svg", projects: "33+ Projects" },
  { name: "HN SAFAL", logo: "/images/OurPartners/hnsafal.webp", projects: "25+ Projects" },
  { name: "GOYAL & CO.", logo: "/images/OurPartners/goyalco.png", projects: "22+ Projects" },
  { name: "GALA", logo: "/images/Partner/1.png", projects: "20+ Projects" },
  { name: "SHILP", logo: "/images/OurPartners/shilp.svg", projects: "15+ Projects" },
  { name: "SOBHA REALTY", logo: "/images/OurPartners/sobha.jpg", projects: "25+ Projects" },
  { name: "ARISTO", logo: "/images/OurPartners/aristo.svg", projects: "20+ Projects" },
  { name: "TREMONT", logo: "/images/OurPartners/tremont.svg", projects: "21+ Projects" },
  { name: "AG HIGHLINE", logo: "/images/OurPartners/AGgroup.png", projects: "10+ Projects" },
  { name: "TGS", logo: "/images/OurPartners/tgs.webp", projects: "12+ Projects" },
  { name: "REWA", logo: "/images/OurPartners/rewa.svg", projects: "5+ Projects" },
  { name: "SILVER LUXURIA", logo: "/images/OurPartners/avirat.png", projects: "10+ Projects" },
  { name: "ELEGANCE", logo: "/images/OurPartners/elegance.png", projects: "10+ Projects" },
  { name: "SHALIGRAM", logo: "/images/OurPartners/shaligram.svg", projects: "15+ Projects" },
  { name: "ORYN", logo: "/images/OurPartners/oryn.webp", projects: "20+ Projects" },
  { name: "THE REGAL", logo: "/images/OurPartners/theregal.svg", projects: "5+ Projects" },
  { name: "THE NEST", logo: "/images/OurPartners/thenest.svg", projects: "10+ Projects" },
  { name: "PARIJAT", logo: "/images/OurPartners/parijat.png", projects: "5+ Projects" },
  { name: "REAL ESTATE PARTNER", logo: "/images/OurPartners/realestatepartner.svg", projects: "10+ Projects" },
  { name: "SANKALP", logo: "/images/OurPartners/sankalp.png", projects: "30+ Projects" },
  { name: "TROGON", logo: "/images/OurPartners/trogon.svg", projects: "25+ Projects" },
  { name: "SARANG", logo: "/images/OurPartners/sarang.jpg", projects: "10+ Projects" },
  { name: "ANANTRARA", logo: "/images/OurPartners/anantara.webp", projects: "10+ Projects" },
  { name: "VIVAN AURA", logo: "/images/OurPartners/vivan.png", projects: "30+ Projects" },
  { name: "SHANTAM PARMESHWAR", logo: "/images/OurPartners/santam.svg", projects: "10+ Projects" },
  { name: "DHAROHAR", logo: "/images/OurPartners/dharohar.webp", projects: "20+ Projects" },
  { name: "THE EVARA", logo: "/images/OurPartners/evara.jpg", projects: "20+ Projects" }
];

export default function OurPartner() {
  const [showAll, setShowAll] = useState(false);
  const visiblePartners = showAll ? partners : partners.slice(0, 15);

  return (
    <section className="bg-slate-50/70 py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-200/70 border border-slate-300 text-slate-800 text-xs font-bold uppercase tracking-wider mb-3">
            <i className="fas fa-handshake text-[#d4af37]"></i>
            <span>Institutional Collaborations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Distinguished <span className="text-[#0f1e3d]">Developer Partnerships</span>
          </h2>
          <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
            Avishkar Realty is proud to collaborate with Gujarat's most reputed real estate developers, providing direct developer pricing, priority unit selection, and zero brokerage on new project bookings.
          </p>
        </div>

        {/* Partner Logos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {visiblePartners.map((partner, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/80 p-5 sm:p-6 text-center flex flex-col items-center justify-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#d4af37]/40 group shadow-sm"
            >
              <div className="w-20 h-16 sm:w-24 sm:h-20 flex items-center justify-center p-2 mb-3">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={96}
                  height={80}
                  unoptimized
                  className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-105"
                />
              </div>

              <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-tight group-hover:text-[#0b1528] line-clamp-1">
                {partner.name}
              </h3>

              <span className="text-[11px] text-[#d4af37] font-semibold mt-1">
                {partner.projects}
              </span>
            </div>
          ))}
        </div>

        {/* Toggle Button */}
        <div className="flex justify-center mt-12">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-[#0b1528] text-slate-800 hover:text-white border border-slate-300 text-xs sm:text-sm font-bold transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <span>{showAll ? "View Less Developers" : "View All 29+ Partner Developers"}</span>
            <i className={`fas fa-chevron-${showAll ? 'up' : 'down'} text-xs`}></i>
          </button>
        </div>
      </div>
    </section>
  );
}