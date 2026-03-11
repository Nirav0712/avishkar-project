

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Information from "../components/Information";
import Partner from "../components/Partner";
import { projects } from "@/lib/project";

export default function ProjectsPage() {

  const heroImages = [
    "/images/project/bg4.jpg",
    "/images/project/4.jpg",
    "/images/project/bg2.jpg",
    "/images/project/bg3.jpg",
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === heroImages.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Header />

      {/* HERO SECTION */}
      <section className="relative h-100 lg:h-100 flex items-center justify-center overflow-hidden">

        <div className="absolute inset-0">

          {heroImages.map((image, index) => (

            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
            >

              <Image
                src={image}
                alt="Project Hero"
                fill
                className="object-cover"
                priority={index === 0}
              />

              <div className="absolute inset-0 bg-black/60"></div>

            </div>

          ))}

        </div>

        {/* HERO TEXT */}
        <div className="container mx-auto px-4 relative z-10">

          <div className="text-center text-white max-w-3xl mx-auto">

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Our Newest Projects
            </h1>

            <p className="text-lg md:text-xl text-white/90">
              Exclusive listings designed for your lifestyle.
            </p>

          </div>

        </div>

        {/* SLIDER DOTS */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">

          {heroImages.map((_, index) => (

            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${index === currentSlide
                ? "w-10 bg-[#e4c272]"
                : "w-3 bg-white/50"
                }`}
            />

          ))}

        </div>

      </section>

      {/* PROJECTS SECTION */}
      <section className="py-24 bg-white">

        <div className="container mx-auto px-4">

          <div className="space-y-20">

            {projects.map((project, index) => (

              <div
                key={project.id}
                className={`flex flex-col ${index % 2 === 0
                  ? "lg:flex-row"
                  : "lg:flex-row-reverse"
                  } gap-10 items-center`}
              >

                {/* IMAGE */}
                <div className="lg:w-1/2">
                  <div className="relative h-80 lg:h-105 w-full rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-700 border-4 border-[#e4c272] rounded-2xl hover:border-4 hover:border-[#e4c272]"
                    />
                  </div>
                </div>

                {/* CONTENT */}
                <div className="lg:w-1/2">

                  <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100 hover:shadow-2xl transition duration-300">

                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">

                      <span className="text-5xl font-bold text-[#e4c272]/40">
                        {project.id}
                      </span>

                      <h3 className="text-3xl font-bold text-[#0f1e3d]">
                        {project.title}
                      </h3>

                    </div>

                    {/* Address */}
                    <div className="flex items-center gap-3 text-gray-600 mb-6">

                      <i className="fas fa-map-marker-alt text-[#e4c272] text-lg"></i>

                      <span className="font-medium">
                        {project.address}
                      </span>

                    </div>

                    {/* Property Info */}
                    <div className="grid grid-cols-3 gap-6 mb-8 text-center">

                      <div className="bg-gray-50 p-4 rounded-xl">

                        <i className="fas fa-dollar-sign text-[#e4c272] text-lg mb-1"></i>

                        <p className="text-sm text-gray-500">Price</p>

                        <p className="font-semibold text-[#0f1e3d]">
                          {project.displayPrice}
                        </p>

                      </div>

                      <div className="bg-gray-50 p-4 rounded-xl">

                        <i className="fas fa-bed text-[#e4c272] text-lg mb-1"></i>

                        <p className="text-sm text-gray-500">Bedrooms</p>

                        <p className="font-semibold text-[#0f1e3d]">
                          {project.bedrooms}
                        </p>

                      </div>

                      <div className="bg-gray-50 p-4 rounded-xl">

                        <i className="fas fa-ruler-combined text-[#e4c272] text-lg mb-1"></i>

                        <p className="text-sm text-gray-500">Area</p>

                        <p className="font-semibold text-[#0f1e3d]">
                          {project.PlotArea}
                        </p>

                      </div>

                    </div>

                    {/* Button */}
                    <Link
                      href={`/project/${project.slug}`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0f1e3d] text-white font-semibold hover:bg-[#e4c272] hover:text-black transition duration-300 group"
                    >
                      View Details

                      <svg
                        className="w-5 h-5 group-hover:translate-x-2 transition-transform"
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

                    </Link>

                  </div>

                </div>


              </div>

            ))}

          </div>

        </div>

      </section>

      <Partner />
      <Information />
      <Footer />
    </>
  );
}