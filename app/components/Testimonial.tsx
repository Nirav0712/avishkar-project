"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const Testimonial = () => {
  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Villa Owner",
      image: "https://randomuser.me/api/portraits/men/43.jpg",
      text: "VeerRealEstate helped us find our dream villa in Mumbai. The team was professional and understood our requirements perfectly!",
    },
    {
      name: "Priya Sharma",
      role: "Apartment Owner",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      text: "Excellent service! Found the perfect 3BHK in Bangalore within two weeks.",
    },
    {
      name: "Amit Patel",
      role: "Commercial Investor",
      image: "https://randomuser.me/api/portraits/men/79.jpg",
      text: "Great experience with land purchase and responsive agents.",
    },
    {
      name: "Anjali Verma",
      role: "Home Buyer",
      image: "https://randomuser.me/api/portraits/women/12.jpg",
      text: "Very smooth and transparent property process. Highly recommended!",
    },
    {
      name: "Karan Singh",
      role: "Investor",
      image: "https://randomuser.me/api/portraits/men/55.jpg",
      text: "Professional team and detailed listings. Excellent support.",
    },
  ];

  const [itemsPerSlide, setItemsPerSlide] = useState(3);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setItemsPerSlide(1);
      } else {
        setItemsPerSlide(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalSlides = Math.ceil(testimonials.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === totalSlides - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? totalSlides - 1 : prev - 1
    );
  };

  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4 relative">

        <h2 className="text-4xl font-bold text-center mb-12">
          What Our Clients Say
        </h2>

        {/* Slider Wrapper */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
            }}
          >
            {[...Array(totalSlides)].map((_, slideIndex) => (
              <div
                key={slideIndex}
                className="min-w-full flex justify-center gap-8"
              >
                {testimonials
                  .slice(
                    slideIndex * itemsPerSlide,
                    slideIndex * itemsPerSlide + itemsPerSlide
                  )
                  .map((testimonial, index) => (
                    <div
                      key={index}
                      className={`bg-white p-6 rounded-xl shadow-md ${itemsPerSlide === 1 ? "w-full" : "w-1/3"} text-center`}
                    >
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={70}
                        height={70}
                        className="rounded-full mx-auto mb-3 border-4 border-primary"
                      />

                      <div className="text-yellow-400 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className="fas fa-star"></i>
                        ))}
                      </div>

                      <p className="text-gray-600 italic mb-3 text-sm">
                        “{testimonial.text}”
                      </p>

                      <h4 className="font-semibold">
                        {testimonial.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {testimonial.role}
                      </p>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>

        {/* Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-3 rounded-full"
        >
          ❮
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-3 rounded-full"
        >
          ❯
        </button>

        {/* Dots */}
        <div className="flex justify-center mt-8 space-x-3">
          {[...Array(totalSlides)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 w-8 rounded-full transition ${currentSlide === index
                  ? "bg-red-500"
                  : "bg-gray-400"
                }`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
