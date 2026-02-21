"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const Testimonial = () => {
  const testimonials = [
    {
      name: "Yogesh Bhati",
      role: "Villa Owner",
      image: "https://randomuser.me/api/portraits/men/43.jpg",
      text: "Recently i bought home in Gota through Avishkar Realty, very genuine and trust worthy place to buy property, owner and staff is very Supportive and helpful during entire process of buying property. Special thankful to Mr. Manishbhai Maheshwari for kind Support. Must visit once while buying new property through Broker.",
    },
    {
      name: "Anamika Patel",
      role: "Apartment Owner",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      text: "Excellent experience. Get each n every information and documents in less time. Got good deal within timeframe. Thanks a lot for your help and awesome service.",
    },
    {
      name: "Chirag Maheshwary3m,",
      role: "Commercial Investor",
      image: "https://randomuser.me/api/portraits/men/79.jpg",
      text: "Best experience i have ever got while purchasing property 😉❤️🙏 Nice people in office Specially Manish bhai and Ajay bhai",
    },
    {
      name: "Dhruvam Gandhi",
      role: "Home Buyer",
      image: "https://randomuser.me/api/portraits/women/12.jpg",
      text: "Got good deal within timeframe. Thanks a lot for your help and awesome service.",
    },
    {
      name: "Sandeep Bhavsar",
      role: "Investor",
      image: "https://randomuser.me/api/portraits/men/55.jpg",
      text: "Excellent approach End to end help Politely spoken On time commitment",
    },
     {
      name: "Yogesh Bhati",
      role: "Investor",
      image: "https://randomuser.me/api/portraits/men/55.jpg",
      text: "Recently i bought home in Gota through Avishkar Realty, very genuine and trust worthy place to buy property, owner and staff is very Supportive and helpful during entire process of buying property. Special thankful to Mr. Manishbhai Maheshwari for kind Support. Must visit once while buying new property through Broker.",
    },
    // {
    //   name: "Sandeep Bhavsar",
    //   role: "Investor",
    //   image: "https://randomuser.me/api/portraits/men/55.jpg",
    //   text: "Excellent approach End to end help Politely spoken On time commitment",
    // },
    // {
    //   name: "Sandeep Bhavsar",
    //   role: "Investor",
    //   image: "https://randomuser.me/api/portraits/men/55.jpg",
    //   text: "Excellent approach End to end help Politely spoken On time commitment",
    // },
    
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
    <section className="py-20 bg-white">
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
                      className={`bg-[#16243E] p-6 rounded-xl shadow-md ${itemsPerSlide === 1 ? "w-full" : "w-1/3"} text-center`}
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

                      <p className="text-white italic mb-3 text-sm">
                        “{testimonial.text}”
                      </p>

                      <h4 className="text-white p-3">
                        {testimonial.name}
                      </h4>
                      <p className="text-xs text-white">
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
