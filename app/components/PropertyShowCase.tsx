"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function PropertyShowCase() {
  const sliderImages = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
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
              Luxe 2 & 3 BHK Homes in Ahmedabad
            </span>

            <h2 className="text-3xl md:text-5xl font-bold leading-tight mt-4">
              Professional{" "}
              <span className="text-[#e4c272]">Guidance</span>, <br />
              Proven <span className="text-[#e4c272]">Results</span>
            </h2>

            <p className="text-gray-300 mt-6 leading-relaxed max-w-xl">
              Experience elevated living at Bluebell, a 14-story residential
              landmark offering thoughtfully designed 2 & 3 BHK homes and
              premium retail spaces. Designed for comfort and lifestyle,
              Bluebell blends modern architecture with serene surroundings
              to create your perfect urban retreat.
            </p>

            <div className="mt-6 font-semibold text-white">
              → Size: 1413 sq.ft & 2142 sq.ft
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
                  src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=80"
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
                <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-[#EAEAEA] rounded-[30px] px-3 py-2 md:px-5 md:py-4 flex items-center gap-2 shadow-xl w-auto max-w-[90%]">

                  <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                    <Image
                      src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80"
                      alt="Mini"
                      width={120}
                      height={80}
                      className="object-cover"
                    />
                  </div>

                  <h3 className="text-[#162544] font-semibold text-lg">
                    MAINTENANCE & PARKING
                  </h3>

                  {/* Pointer */}
                  <div className="absolute -bottom-4 left-16 w-0 h-0 
                    border-l-12 border-l-transparent
                    border-r-12 border-r-transparent
                    border-t-14 border-t-[#EAEAEA]"
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

                {/* <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-3">
  {sliderImages.map((_, i) => (
    <div
      key={i}
      onClick={() => setCurrent(i)}
      className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 
        ${current === i 
          ? "bg-orange-500 scale-110" 
          : "bg-white/40 hover:bg-orange-500 hover:scale-110"
        }`}
    />
  ))}
</div> */}


{/* 
<div className="bg-[#162B4D] py-16 flex justify-center gap-16">


  <div className="w-40 h-40 border border-white/40 rounded-full 
                  flex flex-col items-center justify-center text-center
                  transition-all duration-300 
                  hover:scale-105 hover:border-orange-500 hover:shadow-lg">
    <h2 className="text-3xl font-bold text-white">500+</h2>
    <p className="text-white/80 text-sm mt-1">Satisfied Client</p>
  </div>

  
  <div className="w-40 h-40 border border-white/40 rounded-full 
                  flex flex-col items-center justify-center text-center
                  transition-all duration-300 
                  hover:scale-105 hover:border-orange-500 hover:shadow-lg">
    <h2 className="text-3xl font-bold text-white">40+</h2>
    <p className="text-white/80 text-sm mt-1">Projects</p>
  </div>

</div> */}




              </div>
            </div>

           {/*} Stats Circles */}
             <div className="flex flex-wrap gap-6 md:gap-10 mt-10 md:mt-14 justify-center md:justify-center">
              <div className="w-32 h-32 rounded-full border border-gray-400 flex flex-col items-center justify-center hover:border-[#e4c272] transition">
                <span className="text-2xl font-bold">500+</span>
                <span className="text-sm text-gray-300 text-center">
                  Satisfied Client
                </span>
              </div>

              <div className="w-32 h-32 rounded-full border border-gray-400 flex flex-col items-center justify-center hover:border-[#e4c272] transition">
                <span className="text-2xl font-bold">40+</span>
                <span className="text-sm text-gray-300 text-center">
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
