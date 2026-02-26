"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Information from "../components/Information";
import Partner from "../components/Partner";

const Projects = () => {
    const projects = [
        {
            id: "01",
            title: "The ROYAL Residence",
            description:
                "There are many varied forms of contemporary architecture, and throughout the years we have been able to create a unique style that is both modern and timeless.",
            image: "/images/project/1.jpg",
        },
        {
            id: "02",
            title: "The LUXE Residence",
            description:
                "The luxurious residences of our company are located in some of the most exclusive areas of the city.",
            image: "/images/project/2.jpg",
        },
        {
            id: "03",
            title: "The PRIME Residence",
            description:
                "There are many varied forms of contemporary architecture, and throughout the years we have been able to create a unique style that is both modern and timeless.",
            image: "/images/project/3.jpg",
        },
        {
            id: "04",
            title: "The ELITE Residence",
            description:
                "There are many varied forms of contemporary architecture, and throughout the years we have been able to create a unique style that is both modern and timeless.",
            image: "/images/project/4.jpg",
        },
    ];

    const heroImages = [
        "/images/project/bg4.jpg",
        "/images/project/4.jpg",
        "/images/project/bg2.jpg",
        "/images/project/bg3.jpg",
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto scroll functionality
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1));
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, [heroImages.length]);

    return (
        <>
            <Header />

            {/* HERO SECTION WITH AUTO SCROLL */}
            <section className="relative h-100 lg:h-100 flex items-center justify-center overflow-hidden">
                {/* Background Image Carousel */}
                <div className="absolute inset-0">
                    {heroImages.map((image, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                                index === currentSlide ? "opacity-100" : "opacity-0"
                            }`}
                        >
                            <Image
                                src={image}
                                alt={`Project ${index + 1}`}
                                fill
                                className="object-cover"
                                priority={index === 0}
                            />
                            <div className="absolute inset-0 bg-linear-to-r from-black/70 to-black/50"></div>
                        </div>
                    ))}
                </div>

                {/* Hero Content */}
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center text-white">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-lg">
                            Our Newest Projects
                        </h1>
                        <p className="text-lg md:text-xl lg:text-2xl mb-12 text-white/90 drop-shadow max-w-2xl mx-auto">
                            Exclusive listings designed for your lifestyle.
                        </p>
                    </div>
                </div>

                {/* Carousel Indicators */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
                    {heroImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                index === currentSlide
                                    ? "w-10 bg-[#E3572B]"
                                    : "w-3 bg-white/50 hover:bg-white/80"
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </section>

            {/* PROJECTS SECTION */}
            <section className="relative py-24 bg-white">
                <div className="container mx-auto px-4">
                    {/* PROJECTS LIST */}
                    <div className="space-y-16">
                        {projects.map((project, index) => (
                            <div
                                key={project.id}
                                id={project.title.split(" ")[1].toLowerCase()}
                                className={`flex flex-col ${
                                    index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                                } gap-8 lg:gap-12 items-center scroll-mt-24`}
                            >
                                {/* IMAGE SIDE */}
                                <div className="lg:w-1/2">
                                    <div className="relative h-75 lg:h-100 w-full rounded-2xl overflow-hidden shadow-xl">
                                        <Image
                                            src={project.image}
                                            alt={project.title}
                                            fill
                                            className="object-cover hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>
                                </div>

                                {/* CONTENT SIDE */}
                                <div className="lg:w-1/2 space-y-6">
                                    <div className="flex items-start gap-4">
                                        <span className="text-6xl md:text-7xl font-bold text-orange-500/20">
                                            {project.id}
                                        </span>
                                        <div className="pt-4">
                                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                                {project.title}
                                            </h3>
                                            <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                                {project.description}
                                            </p>
                                            <Link
                                                href="#"
                                                className="inline-flex items-center text-orange-500 font-semibold hover:text-orange-600 transition-colors group"
                                            >
                                                More Details
                                                <svg
                                                    className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform"
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
                            </div>
                        ))}
                    </div>
                </div>
            </section>


{/* partner section */}
<Partner />

            {/* footer section */}
            <Information />
            <Footer />



        </>
    );
};

export default Projects;