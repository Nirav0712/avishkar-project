"use client";

import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { projects } from "@/lib/project";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Information from "@/app/components/Information";
import Partner from "@/app/components/Partner";

function DetailImageCarousel({ project }: any) {

  const images =
    project.images && project.images.length > 0
      ? project.images.slice(0, 3)
      : [project.image];

  const [current, setCurrent] = useState(0);

  const prev = () => {
    setCurrent((c) => (c - 1 + images.length) % images.length);
  };

  const next = () => {
    setCurrent((c) => (c + 1) % images.length);
  };

  return (
    <div className="relative h-96 md:h-125 rounded-2xl overflow-hidden mb-8 bg-gray-100">

      <Image
        src={images[current]}
        alt={project.title}
        fill
        className="object-cover"
      />

      {/* Status */}
      <div className="absolute top-6 left-6 flex gap-2 z-10">

        {project.featured && (
          <span className="bg-[#0f1e3d] text-white px-4 py-2 rounded-lg text-sm font-semibold uppercase shadow-lg">
            Featured
          </span>
        )}

        <span className="bg-[#e4c272] text-[#0f1e3d] px-4 py-2 rounded-lg text-sm font-semibold uppercase shadow-lg">
          {project.status}
        </span>

      </div>

      {/* Buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-10 h-10 flex items-center justify-center"
          >
            &#8249;
          </button>

          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-10 h-10 flex items-center justify-center"
          >
            &#8250;
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_: any, i: number) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full ${i === current ? "bg-[#e4c272]" : "bg-white/50"
                  }`}
              />
            ))}
          </div>
        </>
      )}

    </div>
  );
}

export default function ProjectDetailsPage() {

  const params = useParams();
  const slug = params.slug as string;

  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const similarProjects = projects
    .filter((p) => p.slug !== slug)
    .slice(0, 3);

  return (
    <>
      <Header />

      <div className="py-12 bg-gray-50">

        <div className="container mx-auto px-4">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">

            <a href="/" className="hover:text-primary">Home</a>

            <span>/</span>

            <a href="/project" className="hover:text-primary">
              Projects
            </a>

            <span>/</span>

            <span className="text-[#0f1e3d] font-medium">
              {project.title}
            </span>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT */}
            <div className="lg:col-span-2">

              <DetailImageCarousel project={project} />

              <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">

                <div className="flex justify-between items-center mb-6">

                  <h1 className="text-4xl font-bold ">
                    {project.title}
                  </h1>

                  <div className="text-3xl font-bold text-[#e4c272]">
                    {project.displayPrice}
                  </div>

                </div>

                <p className="text-gray-600 mb-6">
                  {project.location}
                </p>

                {/* Features */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-6 border-y border-[#e4c272]">

                  <div className="text-center">
                    <div className="font-semibold">
                      {project.bedrooms} BHK
                    </div>
                    <div className="text-sm text-gray-500">
                      Configuration
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="font-semibold">
                      {project.status}
                    </div>
                    <div className="text-sm text-gray-500">
                      Status
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="font-semibold capitalize">
                      {project.zone}
                    </div>
                    <div className="text-sm text-gray-500">
                      Zone
                    </div>
                  </div>

                </div>

                {/* Description */}
                <div className="mt-6">

                  <h2 className="text-2xl font-bold mb-4">
                    Description
                  </h2>

                  <p className="text-gray-600 leading-relaxed">
                    {project.description}
                  </p>

                </div>


                {/* Property Details */}
                <div className="mt-8">

                  <h2 className="text-2xl font-bold mb-4">
                    Property Details
                  </h2>

                  <div className="grid md:grid-cols-2 gap-x-12">

                    <div className="flex justify-between py-3 border-b border-[#e4c272]">
                      <span>Plot Area</span>
                      <span className="text-right">{project.PlotArea}</span>
                    </div>

                    <div className="flex justify-between py-3 border-b border-[#e4c272]">
                      <span className="pr-2">Address</span>
                      <span className="text-right">{project.address}</span>
                    </div>

                    {project.possession && (
                      <div className="flex justify-between py-3 border-b border-[#e4c272]">
                        <span>Possession</span>
                        <span>{project.possession}</span>
                      </div>
                    )}

                    {project.totalTowers && (
                      <div className="flex justify-between py-3 border-b border-[#e4c272]">
                        <span>Total Towers</span>
                        <span>{project.totalTowers}</span>
                      </div>
                    )}

                    {project.totalFloors && (
                      <div className="flex justify-between py-3 border-b border-[#e4c272]">
                        <span>Total Floors</span>
                        <span>{project.totalFloors}</span>
                      </div>
                    )}

                    {project.totalUnits && (
                      <div className="flex justify-between py-3 border-b border-[#e4c272]">
                        <span>Total Units</span>
                        <span>{project.totalUnits}</span>
                      </div>
                    )}

                  </div>

                </div>


                {/* Amenities */}
                {project.amenities && project.amenities.length > 0 && (

                  <div className="mt-10">

                    <h2 className="text-2xl font-bold mb-6">
                      Amenities
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                      {project.amenities.map((amenity, index) => (

                        <div
                          key={index}
                          className="flex items-center gap-2 bg-gray-50 border rounded-lg px-4 py-3 border-[#e4c272]"
                        >

                          <span className="text-[#e4c272]">✔</span>

                          <span className="text-gray-700">
                            {amenity}
                          </span>

                        </div>

                      ))}

                    </div>

                  </div>

                )}

                {/* Project Overview */}
                {(project.totalTowers || project.totalFloors || project.totalUnits || project.possession) && (<div className="mt-8">

                  <h2 className="text-2xl font-bold mb-4">
                    Project Overview
                  </h2>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

                    {project.totalTowers && (
                      <div className="text-center border border-[#e4c272] rounded-lg p-4 hover:shadow-lg transition hover:-translate-y-2 cursor-pointer hover:bg-gray-50 hover:border-[#e4c272] ">
                        <div className="text-xl font-bold">{project.totalTowers}</div>
                        <div className="text-sm text-gray-500">Towers</div>
                      </div>
                    )}

                    {project.totalFloors && (
                      <div className="text-center border border-[#e4c272] rounded-lg p-4 hover:shadow-lg hover:-translate-y-2 transition cursor-pointer hover:bg-gray-50 hover:border-[#e4c272] ">
                        <div className="text-xl font-bold">{project.totalFloors}</div>
                        <div className="text-sm text-gray-500">Floors</div>
                      </div>
                    )}

                    {project.totalUnits && (
                      <div className="text-center border border-[#e4c272] rounded-lg p-4 hover:shadow-lg  hover:-translate-y-2 transition cursor-pointer hover:bg-gray-50 hover:border-[#e4c272] ">
                        <div className="text-xl font-bold">{project.totalUnits}</div>
                        <div className="text-sm text-gray-500">Units</div>
                      </div>
                    )}

                    {project.possession && (
                      <div className="text-center border border-[#e4c272] rounded-lg p-4 hover:shadow-lg hover:-translate-y-2 transition cursor-pointer hover:bg-gray-50 hover:border-[#e4c272] ">
                        <div className="text-xl font-bold">{project.possession}</div>
                        <div className="text-sm text-gray-500">Possession</div>
                      </div>
                    )}

                  </div>

                </div>
                )}

                {/* Unit Types */}
                {project.unitTypes && (

                  <div className="mt-10">

                    <h2 className="text-2xl font-bold mb-6">
                      Unit Types
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">

                      {project.unitTypes.map((unit: any, index: number) => (

                        <div
                          key={index}
                          className="border border-[#e4c272] rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-[#e4c272] hover:bg-gray-50 cursor-pointer group"
                        >

                          <h3 className="text-lg font-semibold text-[#0f1e3d] group-hover:text-[#0f1e3d] transition">
                            {unit.type}
                          </h3>

                          <p className="text-[#e4c272] hover:text-[#0f1e3d] font-bold mt-1">
                            {unit.area}
                          </p>

                          <p className="text-gray-600 text-sm mt-2 group-hover:text-gray-700 transition">
                            {unit.description}
                          </p>

                        </div>

                      ))}

                    </div>

                  </div>

                )}

              </div>

            </div>

            {/* SIDEBAR */}
            <div>

              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">

                <h3 className="text-xl font-bold mb-6">
                  Request Information
                </h3>

                <form className="space-y-4">

                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 border rounded-lg"
                  />

                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-3 border rounded-lg"
                  />

                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full px-4 py-3 border rounded-lg"
                  />

                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border rounded-lg"
                    defaultValue={`I'm interested in ${project.title}`}
                  />

                  <button
                    type="submit"
                    className="w-full bg-[#0f1e3d] border border-[#e4c272] text-[#e4c272] hover:bg-[#e4c272] hover:text-[#0f1e3d] hover:border-[#0f1e3d] py-3 rounded-lg font-semibold"
                  >
                    Send Message
                  </button>

                </form>

              </div>

            </div>

          </div>

          {/* Similar Projects */}
          {similarProjects.length > 0 && (

            <div className="mt-20">

              <h2 className="text-3xl font-bold mb-8">
                Similar Projects
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8  ">

                {similarProjects.map((item) => (

                  <div key={item.id} className="bg-white shadow p-4 rounded-xl hover:shadow-lg transition cursor-pointer">

                    <Image
                      src={item.image}
                      alt={item.title}
                      width={440}
                      height={200}
                      className="rounded-lg mb-4"
                    />

                    <h3 className="font-semibold mb-2">
                      {item.title}
                    </h3>

                    <p className="text-[#0f1e3d] font-bold">
                      {item.displayPrice}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      <i className="fas fa-map-marker-alt mr-2 text-[#e4c272]"></i>
                      {item.address}
                    </p>
                    <div className="grid  grid-cols-2 mt-4 text-sm text-gray-600">
                      <p className="">
                        <i className="fas fa-ruler-horizontal mr-2 text-[#e4c272]"></i>
                        {item.PlotArea}
                        {/* {project.PlotArea} */}
                      </p>
                      <p className=" ">
                        <i className="fas fa-bed mr-2 text-[#e4c272]"></i>
                        Bed {item.bedrooms}
                        {/* {project.bedrooms} */}
                      </p>
                    </div>

                  </div>

                ))}

              </div>

            </div>

          )}

        </div>

      </div>

      <Partner />
      <Information />
      <Footer />
    </>
  );
}