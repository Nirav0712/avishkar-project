"use client";

import Image from "next/image";
import { useState } from "react";

const partners = [
  { name: "Lodha Group", logo: "/images/OurPartners/lodha.webp", projects: "30+ Projects" },
  { name: "DGS Group", logo: "/images/OurPartners/DGS.webp", projects: "20+ Projects" },
  { name: "Adityaraj Group", logo: "/images/OurPartners/adityaraj.jpg", projects: "33+ Projects" },
  { name: "Arkade Developers", logo: "/images/OurPartners/Arkade.webp", projects: "25+ Projects" },
  { name: "H.Rishabraj Builder", logo: "/images/OurPartners/h.rishabraj.avif", projects: "22+ Projects" },

  { name: "Pranav Constructions", logo: "/images/OurPartners/pranav.webp", projects: "20+ Projects" },
  { name: "Ajmera Group", logo: "/images/OurPartners/ajmera.png", projects: "15+ Projects" },
  { name: "Ruparel Realty", logo: "/images/OurPartners/ruparel.png", projects: "25+ Projects" },
  { name: "Sugee Group", logo: "/images/OurPartners/sugee.avif", projects: "20+ Projects" },
  { name: "Runwal", logo: "/images/OurPartners/runwal.svg", projects: "21+ Projects" },

  { name: "AG Highline", logo: "/images/OurPartners/AGgroup.png", projects: "10+ Projects" },
  { name: "TGS", logo: "/images/OurPartners/tgs.webp", projects: "12+ Projects" },
  { name: "Silver Luxuria", logo: "/images/OurPartners/avirat.png", projects: "10+ Projects" },
  { name: "Elegance", logo: "/images/OurPartners/elegance.png", projects: "10+ Projects" },
  { name: "Oryn", logo: "/images/OurPartners/oryn.webp", projects: "20+ Projects" },

  { name: "Parijat", logo: "/images/OurPartners/parijat.png", projects: "5+ Projects" },
  { name: "Sankalp", logo: "/images/OurPartners/sankalp.png", projects: "30+ Projects" },
  { name: "Sarang", logo: "/images/OurPartners/sarang.jpg", projects: "10+ Projects" },
  { name: "Anantara", logo: "/images/OurPartners/anantara.webp", projects: "10+ Projects" },
  { name: "Vivan Aura", logo: "/images/OurPartners/vivan.png", projects: "30+ Projects" },

  { name: "Dharohar", logo: "/images/OurPartners/dharohar.webp", projects: "20+ Projects" },
  { name: "The Evara", logo: "/images/OurPartners/evara.jpg", projects: "20+ Projects" },

  //   { name: "Trogon", logo: "/images/partners/trogon.png", projects: "25+ Projects" },
  //   { name: "Santam Parmeshwar", logo: "/images/partners/santam-parmeshwar.png", projects: "10+ Projects" },
  //   { name: "The Regal", logo: "/images/partners/the-regal.png", projects: "5+ Projects" },
  //   { name: "The Nest", logo: "/images/partners/the-nest.png", projects: "10+ Projects" },
  //   { name: "Shaligram", logo: "/images/partners/shaligram.png", projects: "15+ Projects" },
  //   { name: "Rewa", logo: "/images/partners/rewa.png", projects: "5+ Projects" },


];

export default function OurPartner() {

  const [showAll, setShowAll] = useState(false);

  const visiblePartners = showAll ? partners : partners.slice(0, 12);

  return (
    <section className="bg-gray-50 py-24">

      {/* Heading */}
      <h2 className="text-center text-[#0f1f3d] text-3xl font-bold tracking-wide mb-16">
        OUR PARTNERS
      </h2>

      <div className="max-w-7xl mx-auto px-6">

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">

          {visiblePartners.map((partner, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-6 text-center 
      flex flex-col items-center justify-center
      transition-all duration-300 
      hover:shadow-2xl hover:-translate-y-2 hover:border hover:border-[#e4c272]"
            >

              {/* Logo */}
              <div className="w-30 h-30 mb-4 rounded-full bg-gray-300 flex items-center justify-center shadow-sm">

                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={80}
                  height={80}
                  className="object-contain"
                />

              </div>

              {/* Name */}
              <h3 className="text-sm font-semibold text-[#0f1f3d]">
                {partner.name}
              </h3>

              {/* Projects */}
              <p className="text-xs text-gray-500 mt-1">
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