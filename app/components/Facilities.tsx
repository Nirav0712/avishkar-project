"use client";

import { useState } from "react";
import Image from "next/image";

const Facilities = () => {
  const features = [
    {
      title: "Commercial",
      properties: "6 Properties",
      icon: "/images/facilities/icon-commercial.png",
    },
    {
      title: "Bunglow",
      properties: "8 Properties",
      icon: "/images/facilities/icon-bunglow.png",
    },
    {
      title: "Apartment",
      properties: "6 Properties",
      icon: "/images/facilities/icon-apartment.png",
    },
    {
      title: "Plot",
      properties: "4 Properties",
      icon: "/images/facilities/icon-plot.png",
    },
    {
      title: "Commercial",
      properties: "6 Properties",
      icon: "/images/facilities/icon-commercial.png",
    },
    {
      title: "Bunglow",
      properties: "8 Properties",
      icon: "/images/facilities/icon-bunglow.png",
    },
    
  ];

  const itemsPerView = 3;
  const maxSlide = features.length - itemsPerView;
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, maxSlide));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  return (
    <section
      className="relative py-24 bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/facilities/facilitiesbg.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative container mx-auto px-4">
        <div className="bg-[#162544] rounded-2xl p-16 flex flex-col lg:flex-row gap-12">
          {/* LEFT SIDE */}
          <div className="lg:w-1/3 text-white flex flex-col justify-between">
            <div>
              <p className="text-orange-500 font-semibold mb-4">Facilities</p>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Property <br /> Features
              </h2>
            </div>

            <div className="mt-16">
              <Image
                src="/images/facilities/1.png"
                alt="triangle design"
                width={120}
                height={120}
                className="opacity-70"
              />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:w-2/3 w-full">
            {/* SLIDER CONTAINER */}
            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentSlide * (100 / itemsPerView)}%)`,
                }}
              >
                {features.map((item, index) => (
                  <div
                    key={index}
                    className="w-1/3 shrink-0 px-4 mt-5"
                  >
                    <div
                      className="bg-transparent border border-white/20 rounded-2xl p-10 text-center text-white
                      transition-all duration-300 hover:border-orange-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-orange-500/20"
                    >
                      <div className="flex justify-center mb-8">
                        <Image
                          src={item.icon}
                          alt={item.title}
                          width={50}
                          height={50}
                          className="object-contain"
                        />
                      </div>
                      <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                      <p className="text-gray-300 text-sm">{item.properties}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* NAVIGATION BUTTONS */}
            <div className="flex justify-center items-center mt-10 gap-4">
              {/* <button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  currentSlide === 0
                    ? "bg-white/20 cursor-not-allowed"
                    : "bg-white/40 hover:bg-orange-500"
                }`}
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button> */}

              {/* DOT INDICATORS */}
              <div className="flex gap-2">
                {[0, 1, 2, 3].map((index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentSlide === index
                        ? "w-8 bg-orange-500"
                        : "w-2 bg-white/40 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>

              {/* <button
                onClick={nextSlide}
                disabled={currentSlide === maxSlide}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  currentSlide === maxSlide
                    ? "bg-white/20 cursor-not-allowed"
                    : "bg-white/40 hover:bg-orange-500"
                }`}
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Facilities;