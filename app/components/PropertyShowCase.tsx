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

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? sliderImages.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-[#162544] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT CONTENT */}
          <div>
            <span className="text-[#e4c272] font-semibold text-sm">
              Luxe 2 BHK Homes in Ahmedabad
            </span>

            <h2 className="text-3xl md:text-5xl font-bold leading-tight mt-4">
              Premium {" "}
              <span className="text-[#e4c272]">Urban Living</span>, <br />
              Designed for <span className="text-[#e4c272]">Comfort</span>
            </h2>

            <p className="text-gray-300 mt-6 leading-relaxed max-w-xl">
              The Amber by Dobariya Group is a premium residential project offering thoughtfully designed 2BHK apartments with two balconies for endless open views. The project features landscaped gardens, children's play area, gymnasium, indoor games, podium seating, banquet hall, and modern lifestyle amenities. Designed for comfortable urban living, the development combines smart architecture, green spaces, and convenient connectivity to major areas of Ahmedabad.
            </p>

            <div className="mt-6 font-semibold text-white">
              <span className="text-[#e4c272]">→ Size:</span> 1215 - 1400+ Sq Ft
            </div>
            <div className="mt-6 font-semibold text-white">
              <span className="text-[#e4c272]">→ Location:</span>  Nikol - Naroda Road, Ahmedabad, Gujarat
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 mt-8 border border-[#e4c272] text-[#e4c272] px-8 py-3 rounded-full font-semibold hover:bg-[#e4c272] hover:text-black transition duration-300"
            >
              Contact Sales
            </Link>
          </div>

          {/* RIGHT SIDE */}
          <div className="relative">

            {/* Two Image Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* LEFT STATIC IMAGE */}
              <div className="relative h-64 md:h-90 rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src="/images/project/evara1.png"
                  alt="Building"
                  fill
                  className="object-cover"
                />
              </div>

              {/* RIGHT SLIDER IMAGE */}
              <div className="relative h-64 md:h-90 w-full max-w-lg rounded-3xl overflow-hidden shadow-xl">

                <Image
                  src={sliderImages[current]}
                  alt="Property"
                  fill
                  className="object-cover transition-all duration-700 w-full"
                />

                {/* Speech Bubble */}
                <div className="absolute top-2 left-2 md:top-6 md:left-6 bg-[#EAEAEA] rounded-[20px] md:rounded-[30px] px-2 py-1 md:px-5 md:py-4 flex items-center gap-2 shadow-xl w-auto max-w-[95%]">

                  <div className="w-12 h-12 md:w-20 md:h-20 rounded-xl md:rounded-2xl overflow-hidden shrink-0">
                    <Image
                      src="/images/project/aristo-avira2.jpeg"
                      alt="Mini"
                      width={120}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <h3 className="text-[#162544] font-semibold text-xs md:text-lg">
                    MAINTENANCE & PARKING
                  </h3>

                  {/* Pointer */}
                  <div className="absolute -bottom-2 md:-bottom-4 left-8 md:left-16 w-0 h-0 
                    border-l-6 md:border-l-12 border-l-transparent
                    border-r-6 md:border-r-12 border-r-transparent
                    border-t-8 md:border-t-14 border-t-[#EAEAEA]"
                  />
                </div>

                {/* Slider Arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full hover:bg-white/40 transition"
                >
                  ‹
                </button>

                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full hover:bg-white/40 transition"
                >
                  ›
                </button>

                {/* Slider Dots */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-3">
                  {sliderImages.map((_, i) => (
                    <div
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`w-3 h-3 rounded-full cursor-pointer transition ${current === i
                        ? "bg-[#e4c272] scale-110"
                        : "bg-white/40"
                        }`}
                    />
                  ))}
                </div>

              </div>
            </div>

            {/* Stats Circles */}
            <div className="flex flex-wrap gap-4 md:gap-10 mt-10 md:mt-14 justify-center">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border border-gray-400 flex flex-col items-center justify-center hover:border-[#e4c272] transition p-2 text-center">
                <span className="text-xl md:text-2xl font-bold">2500+</span>
                <span className="text-[10px] md:text-sm text-gray-300">
                  Satisfied Client
                </span>
              </div>

              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border border-gray-400 flex flex-col items-center justify-center hover:border-[#e4c272] transition p-2 text-center">
                <span className="text-xl md:text-2xl font-bold">11+</span>
                <span className="text-[10px] md:text-sm text-gray-300">
                  Projects
                </span>
              </div>
            </div>


          </div>
        </div>
      </div>
    </section>
  );
}
