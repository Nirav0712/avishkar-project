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
  { name: "SANTAM PARMESHWAR", logo: "/images/OurPartners/santam.svg", projects: "10+ Projects" },
  { name: "DHAROHAR", logo: "/images/OurPartners/dharohar.webp", projects: "20+ Projects" },
  { name: "THE EVARA", logo: "/images/OurPartners/evara.jpg", projects: "20+ Projects" }
];

export default function OurPartner() {

  const [showAll, setShowAll] = useState(false);

  const visiblePartners = showAll ? partners : partners.slice(0, 15);

  return (
    <section className="bg-gray-50 py-24">

      {/* Heading */}
      <h2 className="text-center text-[#0f1f3d] text-3xl font-bold tracking-wide mb-10">
        OUR PARTNERS
      </h2>

      <p className="text-center text-gray-500 text-sm sm:text-base md:text-md font-semibold tracking-wide mb-8 sm:mb-12 md:mb-16 px-4 md:px-20 lg:px-40">
        We have worked with some of the most reputable developers in the real estate industry, and we are proud to showcase our partnerships with them. Our partners are carefully selected based on their track record, quality of work, and commitment to excellence. We believe that strong partnerships are the foundation of success, and we are committed to building long-term relationships with our partners based on trust, respect, and mutual benefit.
      </p>
      <div className="max-w-7xl mx-auto px-6">

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">

          {visiblePartners.map((partner, index) => (
            <div
              key={index}
              className="bg-white rounded-[25px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-6 md:p-8 text-center 
              flex flex-col items-center justify-center relative mt-10
              transition-all duration-300 
              hover:shadow-2xl hover:-translate-y-2 group"
            >

              {/* Logo Circle */}
              <div className="w-20 h-20 md:w-28 md:h-28 absolute -top-8 md:-top-10 left-1/2 -translate-x-1/2 
              rounded-full bg-white flex items-center justify-center 
              border-4 border-[#f0f4f8] shadow-sm overflow-hidden p-3 md:p-4">

                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={100}
                  height={100}
                  unoptimized
                  className="object-contain group-hover:scale-110 transition-transform duration-300"
                />

              </div>

              {/* Name */}
              <h3 className="text-md font-bold text-gray-800 uppercase tracking-tight mt-13">
                {partner.name}
              </h3>

              {/* Projects */}
              <p className="text-md text-gray-400 font-medium mt-3">
                {partner.projects}
              </p>

            </div>
          ))}

        </div>

        {/* Button */}
        <div className="flex justify-center mt-16">

          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-[#162544] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#e4c272] hover:text-black transition"
          >
            {showAll ? "View Less ↑" : "View More ↓"}
          </button>

        </div>

      </div>

    </section>
  );
}