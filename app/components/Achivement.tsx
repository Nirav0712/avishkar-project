"use client";

import { useState } from "react";
import Image from "next/image";

const Achivement = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section className="bg-[#162544] py-24">
        <div className="container mx-auto px-6">

          {/* TOP CONTENT */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-10">

            {/* LEFT TEXT */}
            <div>
              <p className="text-[#e4c272] font-semibold mb-4">
                Our Achievement
              </p>

              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight max-w-2xl">
                Building <span className="text-[#e4c272]">Dreams</span>, <br />
                Creating <span className="text-[#e4c272]">Success</span> Stories
              </h2>
            </div>

            {/* RIGHT STATS */}
            <div className="flex gap-12 text-white">
              <div>
                <h3 className="text-4xl font-bold">11+</h3>
                <p className="text-gray-300 mt-2">Featured Projects</p>
              </div>

              <div className="flex items-start gap-6">
                <span className="text-gray-400 text-3xl"></span>
                <div>
                  <h3 className="text-4xl font-bold">2500+</h3>
                  <p className="text-gray-300 mt-2">Satisfied Clients</p>
                </div>
              </div>
            </div>
          </div>

          {/* VIDEO IMAGE SECTION */}
          <div className="relative rounded-2xl overflow-hidden">

            <Image
              src="/images/About/Achivement.jpg"
              alt="Achievement"
              width={1200}
              height={600}
              className="w-full h-125 object-cover rounded-2xl"
            />

            {/* Animated Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative flex items-center justify-center">

                {/* Pulse Ring */}
                <span className="absolute inline-flex h-24 w-24 rounded-full bg-white/30 animate-ping"></span>

                {/* Button */}
                <button
                  onClick={() => setIsOpen(true)}
                  className="relative z-10 w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 hover:scale-110 transition duration-300"
                >
                  <div className="w-0 h-0 border-l-18 border-l-white border-t-12 border-t-transparent border-b-12 border-b-transparent ml-1"></div>
                </button>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* VIDEO MODAL */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="relative w-full max-w-4xl">

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-12 right-0 text-white text-3xl"
            >
              ✕
            </button>

            {/* YouTube Video */}
            <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-xl">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="/Video/Aboutvideo1.mp4"
                title="Achievement Video"
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Achivement;
