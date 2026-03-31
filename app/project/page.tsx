

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

                  <div className="bg-white  rounded-3xl p-8  transition duration-300">

                    {/* Badges */}
                    <div className="flex flex-wrap gap-4 mb-6 uppercase">
                      <span className="text-[14px] font-bold text-gray-500 tracking-wide">
                        {project.status || "UNDER CONSTRUCTION"}
                      </span>
                      {project.isForSale && (
                        <span className="px-5 py-2 rounded-full text-[13px] font-bold bg-[#f5e6ff] text-[#9b4dca] tracking-wider shadow-sm">
                          FOR SALE
                        </span>
                      )}
                      {project.featured && (
                        <span className="px-5 py-2 rounded-full text-[13px] font-bold bg-[#00004d] text-white tracking-wider shadow-sm">
                          FEATURED
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-4xl md:text-5xl font-bold text-[#0f1e3d] mb-4">
                      {project.title}
                    </h3>

                    <div className="flex flex-col mb-4">
                      {/* Address/Location */}
                      <div className="flex items-center gap-2 text-gray-800 mb-3" >
                        <i className="fas fa-map-marker-alt text-lg"></i>
                        <span className="text-lg font-medium">
                          {project.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-800">
                        <div>
                          <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs sm:text-sm font-semibold px-3 py-1 rounded-full">
                            <i className="fas fa-check-circle text-green-600"></i>

                            RERA Approved :- <span className=" text-gray-500">{project.rera}</span>
                          </span>

                        </div>
                      </div>
                    </div>

                    {/* Property Info Bar */}
                    <div className="bg-[#f8f9fa] rounded-2xl p-6 mb-10 flex items-center justify-between max-w-xl">
                      <div className="flex items-center gap-4">
                        <i className="fas fa-bed text-3xl text-[#0f1e3d]"></i>
                        <span className="text-2xl font-bold text-gray-700">{project.bedrooms}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <i className="fas fa-bath text-3xl text-[#0f1e3d]"></i>
                        <span className="text-2xl font-bold text-gray-700">{project.bathrooms || 3}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <i className="fas fa-ruler-combined text-3xl text-[#d4af37]"></i>
                        <span className="text-2xl font-bold text-gray-700">{project.PlotArea}</span>
                      </div>
                    </div>


                    {/* Price */}
                    <div className="text-4xl font-extrabold text-[#e4c272] mb-8">
                      {project.displayPrice}
                    </div>

                    {/* Description */}
                    <p className="text-gray-500 text-lg leading-relaxed mb-10 max-w-2xl">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-4">
                      <button onClick={() => window.location.href = `/project/${project.slug}`}
                        className="cursor-pointer inline-flex items-center gap-4 px-10 py-5 rounded-2xl bg-[#00004d] text-white font-extrabold text-xl hover:bg-[#000033] transition-all duration-300 shadow-xl shadow-blue-900/40"
                      >
                        See Details
                      </button>

                      {project.blogId && (
                        <Link href={`/blog/${project.blogId}`}
                          className="cursor-pointer inline-flex items-center gap-4 px-10 py-5 rounded-2xl border-2 border-[#00004d] text-[#00004d] font-extrabold text-xl hover:bg-[#00004d] hover:text-white transition-all duration-300"
                        >
                          Read Blog
                        </Link>
                      )}
                    </div>

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