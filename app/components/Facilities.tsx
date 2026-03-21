"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const Facilities = () => {
  const features = [
    {
      title: "Commercial",
      properties: "6 Properties",
      icon: "/images/facilities/icon-commercial.png",
      background: "/images/facilities/ARISTO-Anantam1.jpeg",
    },
    {
      title: "Bunglow",
      properties: "8 Properties",
      icon: "/images/facilities/icon-bunglow.png",
      background: "/images/facilities/ARISTO-Anantam2.jpeg",
    },
    {
      title: "Apartment",
      properties: "6 Properties",
      icon: "/images/facilities/icon-apartment.png",
      background: "/images/facilities/aristo-avira3.jpeg",
    },
    {
      title: "Plot",
      properties: "4 Properties",
      icon: "/images/facilities/icon-plot.png",
      background: "/images/facilities/aristo-avira1.jpeg",
    },
    {
      title: "Commercial",
      properties: "6 Properties",
      icon: "/images/facilities/icon-commercial.png",
      background: "/images/facilities/ARISTO-Anantam1.jpeg",
    },
    {
      title: "Bunglow",
      properties: "8 Properties",
      icon: "/images/facilities/icon-bunglow.png",
      background: "/images/facilities/ARISTO-Anantam2.jpeg",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 768) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else setItemsPerView(3);
    };
    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const maxSlide = features.length - itemsPerView;

  return (
    <section
      className="relative py-24 bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/facilities/facilitiesbg.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative container mx-auto px-4">
        <div className="bg-[#162544] rounded-2xl p-8 md:p-16 flex flex-col lg:flex-row gap-12">

          {/* LEFT SIDE */}
          <div className="lg:w-1/3 text-white flex flex-col justify-between">
            <div>
              <p className="text-[#e4c272] font-semibold mb-4">Facilities</p>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                Property <br /> Features
              </h2>
            </div>

            <div className="mt-8 lg:mt-16">
              <Image
                src="/images/facilities/1.png"
                alt="triangle design"
                width={80}
                height={80}
                className="opacity-70 md:w-[120px] md:h-[120px]"
              />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:w-2/3 w-full">

            {/* SLIDER */}
            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentSlide * (100 / itemsPerView)}%)`,
                }}
              >
                {features.map((item, index) => (
                  <div key={index}
                    className="shrink-0 px-4 mt-5"
                    style={{ width: `${100 / itemsPerView}%` }}
                  >

                    <div className="relative rounded-2xl p-6 md:p-10 text-center text-white border border-white/20 overflow-hidden group transition-all duration-300 hover:-translate-y-3" style={{ backgroundImage: `url(${item.background})`, opacity: 0.7 }}>

                      {/* Golden overlay */}
                      {/* <div className="absolute inset-0 bg-[#0f1a3d]/20 opacity-0 group-hover:opacity-100 transition duration-500"></div> */}
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition duration-500"></div>

                      {/* Content */}
                      <div className="relative z-10">
                        <div className="flex justify-center mb-6 md:mb-8">
                          <Image
                            src={item.icon}
                            alt={item.title}
                            width={40}
                            height={40}
                            className="md:w-[50px] md:h-[50px] "
                          />
                        </div>

                        <h4 className="text-lg md:text-xl font-semibold mb-2">{item.title}</h4>
                        <p className="text-gray-300 text-xs md:text-sm">{item.properties}</p>
                      </div>

                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* DOT NAVIGATION */}
            <div className="flex justify-center items-center mt-10 gap-2">
              {Array.from({ length: maxSlide + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${currentSlide === index
                    ? "w-8 bg-[#e4c272]"
                    : "w-2 bg-white/40 hover:bg-white/60"
                    }`}
                />
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Facilities;