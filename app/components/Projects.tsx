"use client";

import Image from "next/image";

const projects = [
  {
    id: 1,
    name: "Amber",
    image: "/images/project/amber1.jpeg",
  },
  {
    id: 2,
    name: "Aristo-Anantam",
    image: "/images/project/ARISTO-Anantam1.jpeg",
  },
  {
    id: 3,
    name: "Evara",
    image: "/images/project/evara2.png",
  },
  {
    id: 4,
    name: "La Mer",
    image: "/images/project/la-mer3.jpeg",
  },
  {
    id: 5,
    name: "Om Heights",
    image: "/images/project/Om-heights1.png",
  },
  {
    id: 6,
    name: "Sadhna",
    image: "/images/project/sadhna1.png",
  },
  {
    id: 7,
    name: "Shantam Parmeshwar",
    image: "/images/project/Shantam-Parmeshwar1.jpeg",
  },
  {
    id: 8,
    name: "Signet",
    image: "/images/project/signet1.png",
  },
  {
    id: 9,
    name: "The Regal",
    image: "/images/project/the-regal3.png",
  },
  {
    id: 10,
    name: "Aristo Avira",
    image: "/images/project/aristo-avira3.jpeg",
  },
  {
    id: 11,
    name: "Proposed Residence",
    image: "/images/project/pr1.jpeg",
  },
];

export default function Projects() {
    const duplicated = [...projects, ...projects];

  return (
    <section className="bg-[#0f1f3d] py-20 overflow-hidden">

        <div className=" items-center gap-16">


            <h2 className="text-5xl font-bold text-[#e4c272] leading-tight text-center ">
              Exclusive  Luxury Projects
            </h2>
            <p className="text-gray-400 text-center pt-3">  Discover thoughtfully designed residences that blend elegance, comfort, and modern living.</p>
        
          {/* RIGHT SLIDER */}
          <div className=" relative w-full overflow-hidden mt-10">

            {/* Left Fade */}
            <div className="absolute left-0 top-0 h-full w-20 bg-linear-to-r from-[#0f1f3d] to-transparent z-10"></div>

            {/* Right Fade */}
            <div className="absolute right-0 top-0 h-full w-20 bg-linear-to-l from-[#0f1f3d] to-transparent z-10"></div>

            {/* Slider Track */}
            <div className="flex w-max animate-scroll gap-8">

              {duplicated.map((project, index) => (
                <div
                  key={index}
                  className="min-w-[320px] rounded-xl overflow-hidden shadow-lg relative group"
                >
                  <Image
                    src={project.image}
                    alt={project.name}
                    width={400}
                    height={600}
                    className="w-full h-137.5 object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Project Name */}
                  <div className="absolute bottom-4 left-0 right-0 text-center text-white font-bold text-2xl">
                    {project.name}
                  </div>
                </div>
              ))}

            </div>

          </div>
      </div>

      {/* Animation */}
      <style jsx>{`
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }

        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>

    </section>
  );
}