"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Logospin from "./Logospin";
import styled from 'styled-components';

const heroImages = [
    "/images/slider/slider1.jpeg",
    "/images/slider/slider4.jpeg",
    "/images/slider/slider3.jpeg",
    "/images/slider/slider2.jpeg",
    "/images/slider/slider5.jpeg",
];

export default function HeroSection() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleCategoryClick = (category: string) => {
        const params = new URLSearchParams();
        params.set("category", category);
        window.location.href = `/properties?${params.toString()}`;
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative h-[500px] md:h-[910px] flex items-center justify-center overflow-hidden py-20 md:py-0">
            {/* Background Image Carousel */}
            <div className="absolute inset-0">
                {heroImages.map((image, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImageIndex ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        <Image
                            src={image}
                            alt={`Property ${index + 1}`}
                            fill
                            className="object-cover"
                            priority={index === 0}
                        />
                        <div className="absolute inset-0 bg-linear-to-r from-secondary/80 to-secondary/40 opacity-70"></div>
                    </div>
                ))}
            </div>


            <div className="hidden md:block absolute top-10 left-10 z-30">
                <StyledWrapper>
                    <button
                        className="button"
                        onClick={() => window.open('https://t.me/yourtelegram', '_blank')}
                    >
                        <p className="button__text">
                            {"AVISHKAR REALTY || AVISHKAR REALTY || ".split("").map((char, i) => (
                                <span
                                    key={i}
                                    style={{ "--index": i } as any}
                                >
                                    {char}
                                </span>
                            ))}
                        </p>
                        <div className="button__circle">
                            {/* <img src="/arlogo.png" alt="icoimg.png" className="animate-[spin_8s_linear_infinite] w-full h-full object-contain p-2" /> */}
                            <img src="/arlogo.png" alt="icoimg.png" className="w-full h-full object-contain p-2" />
                        </div>
                    </button>
                </StyledWrapper>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center text-white ">
                    <h1 className="text-3xl md:text-6xl font-bold mb-6 drop-shadow-lg justify-center items-center text-center px-4">
                        Trusted Real Estate Expert in Ahmedabad
                    </h1>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 w-full px-4">
                        <button
                            onClick={() => handleCategoryClick("Commercial")}
                            className="w-full md:w-auto px-8 py-3 rounded-xl border border-white text-white bg-white/10 backdrop-blur-md hover:bg-[#e4c272] hover:text-black hover:border-black transition duration-300"
                        >
                            Commercial →
                        </button>

                        <button
                            onClick={() => handleCategoryClick("Residential")}
                            className="w-full md:w-auto px-8 py-3 rounded-xl border border-white text-white bg-white/10 backdrop-blur-md hover:bg-[#e4c272] hover:text-black hover:border-black transition duration-300"
                        >
                            Residential →
                        </button>

                        <button
                            onClick={() => handleCategoryClick("Industrial")}
                            className="w-full md:w-auto px-8 py-3 rounded-xl border border-white text-white bg-white/10 backdrop-blur-md hover:bg-[#e4c272] hover:text-black hover:border-black transition duration-300"
                        >
                            Industrial →
                        </button>

                        <Link href="/project">
                            <button
                                className="w-full md:w-auto px-8 py-3 rounded-xl border border-white text-white bg-white/10 backdrop-blur-md hover:bg-[#e4c272] hover:text-black hover:border-black transition duration-300"
                            >
                                New Projects →
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="absolute top-[40%] md:top-[65%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none opacity-30 md:opacity-50">
                <Logospin />
            </div>

            {/* Carousel Indicators */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                {heroImages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all ${index === currentImageIndex
                            ? "bg-[#0f1e3d] w-8"
                            : "bg-white/50 hover:bg-white/80"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}

const StyledWrapper = styled.div`
  .button {
    cursor: pointer;
    border: none;
    background: transparent;
    color: #fff;
    width: 100px;
    height: 100px;
    @media (min-width: 768px) {
      width: 150px;
      height: 150px;
    }
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    display: grid;
    place-content: center;
    transition:
      background 300ms,
      transform 200ms;
    font-weight: 600;
  }

  .button__text {
    position: absolute;
    inset: 0;
    animation: text-rotation 8s linear infinite;

    > span {
      position: absolute;
      top: 0;
      left: 50%;
      transform-origin: 50% 50px;
      @media (min-width: 768px) {
        transform-origin: 50% 75px;
      }
      transform: translateX(-50%) rotate(calc(9.47deg * var(--index)));
    }
  }

  .button__circle {
    position: relative;
    width: 80px;
    height: 80px;
    @media (min-width: 768px) {
      width: 130px;
      height: 130px;
    }
    overflow: hidden;
    background: transparent;
    color: #2aabee;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .button__icon--copy {
    position: absolute;
    transform: translate(-150%, 150%);
  }

  .button:hover {
    background: #0f1e3d;
    transform: scale(1.05);
  }

  .button:hover .button__icon {
    color: #fff;
  }

  .button:hover .button__icon:first-child {
    transition: transform 0.3s ease-in-out;
    transform: translate(150%, -150%);
  }

  .button:hover .button__icon--copy {
    transition: transform 0.3s ease-in-out 0.1s;
    transform: translate(0);
  }

  @keyframes text-rotation {
    to {
      transform: rotate(360deg);
    }
  }

  .button:active {
    transform: scale(0.95);
  }`;
