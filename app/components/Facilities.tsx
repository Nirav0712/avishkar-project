"use client";

import { useState } from "react";
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

  const itemsPerView = 3;
  const maxSlide = features.length - itemsPerView;
  const [currentSlide, setCurrentSlide] = useState(0);

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
              <p className="text-[#e4c272] font-semibold mb-4">Facilities</p>
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

            {/* SLIDER */}
            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentSlide * (100 / itemsPerView)}%)`,
                }}
              >
                {features.map((item, index) => (
                  <div key={index} className="w-1/3 shrink-0 px-4 mt-5">

                    <div className="relative rounded-2xl p-10 text-center text-white border border-white/20 overflow-hidden group transition-all duration-300 hover:-translate-y-3" style={{ backgroundImage: `url(${item.background})`, opacity: 0.7 }}>

                      {/* Background Image */}
                      {/* <div
                        className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-30 transition-all duration-500 group-hover:scale-110"
                        style={{ backgroundImage: `url(${item.background})` }}
                      ></div> */}

                      {/* Golden overlay */}
                      <div className="absolute inset-0 bg-[#0f1a3d]/20 opacity-0 group-hover:opacity-100 transition duration-500"></div>

                      {/* Content */}
                      <div className="relative z-10">
                        <div className="flex justify-center mb-8">
                          <Image
                            src={item.icon}
                            alt={item.title}
                            width={50}
                            height={50}
                          />
                        </div>

                        <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                        <p className="text-gray-300 text-sm">{item.properties}</p>
                      </div>

                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* DOT NAVIGATION */}
            <div className="flex justify-center items-center mt-10 gap-2">
              {[0, 1, 2, 3].map((index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentSlide === index
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