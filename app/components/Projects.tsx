"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { projects as fallbackProjects, type Project } from "@/lib/project";

export default function Projects() {
  const [projectList, setProjectList] = useState<Project[]>(fallbackProjects);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProjectList(data);
        }
      })
      .catch(err => console.error('Error fetching projects:', err));
  }, []);

  const filteredProjects = filter === "all"
    ? projectList
    : projectList.filter(p => p.status?.toLowerCase().includes(filter.toLowerCase()));

  return (
    <section className="bg-gradient-to-b from-[#0b1528] via-[#0f1e3d] to-[#0b1528] py-20 lg:py-28 relative overflow-hidden text-white">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#20335e]/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#e4c272] text-xs font-bold uppercase tracking-widest mb-3">
              <i className="fas fa-building text-[10px]"></i>
              <span>Ahmedabad Developments</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Exclusive Luxury <span className="gold-gradient-text">Flagship Projects</span>
            </h2>
            <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-xl font-light">
              High-growth locations with verified RERA approvals, world-class amenities, and superior construction quality.
            </p>
          </div>

          {/* Quick Filter Tabs & Link */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                filter === "all"
                  ? "bg-[#d4af37] text-[#0b1528]"
                  : "bg-white/10 text-slate-300 hover:bg-white/20"
              }`}
            >
              All Projects
            </button>
            <button
              onClick={() => setFilter("under construction")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                filter === "under construction"
                  ? "bg-[#d4af37] text-[#0b1528]"
                  : "bg-white/10 text-slate-300 hover:bg-white/20"
              }`}
            >
              Under Construction
            </button>
            <button
              onClick={() => setFilter("upcoming")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                filter === "upcoming"
                  ? "bg-[#d4af37] text-[#0b1528]"
                  : "bg-white/10 text-slate-300 hover:bg-white/20"
              }`}
            >
              Upcoming
            </button>
            <Link
              href="/project"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#d4af37] text-[#e4c272] hover:bg-[#d4af37] hover:text-[#0b1528] text-xs font-semibold transition-all duration-200"
            >
              <span>View All Projects</span>
              <i className="fas fa-arrow-right text-[10px]"></i>
            </Link>
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.slice(0, 6).map((project) => (
            <div
              key={project.id}
              className="group bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl overflow-hidden hover:border-[#d4af37]/50 hover:shadow-2xl hover:shadow-black/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image Container with Video Overlay & Canonical Link */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={project.videoThumbnail || project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1528] via-transparent to-black/30"></div>

                  {/* Status, Zone & Video Badges */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                    <span className="bg-[#d4af37] text-[#0b1528] px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm">
                      {project.status}
                    </span>
                    {project.zone && (
                      <span className="bg-black/60 backdrop-blur-md text-slate-200 border border-white/20 px-2.5 py-1 rounded-full text-[11px] font-medium capitalize">
                        {project.zone} Zone
                      </span>
                    )}
                    {Boolean(project.hasVideo || project.youtubeUrl || project.instagramUrl) && (
                      <span className="bg-rose-600/90 backdrop-blur-md text-white border border-rose-400/40 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                        <i className="fas fa-play text-[9px]"></i>
                        <span>Reel / Short</span>
                      </span>
                    )}
                  </div>

                  {/* Play Button Overlay (Navigates to Project Details) */}
                  <Link
                    href={`/project/${project.slug}`}
                    className="absolute inset-0 flex items-center justify-center z-10 group/play"
                    aria-label={`View ${project.title} project details & video tour`}
                  >
                    {Boolean(project.hasVideo || project.youtubeUrl || project.instagramUrl) && (
                      <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-black/60 backdrop-blur-md border-2 border-[#d4af37] text-[#f5d77f] flex items-center justify-center shadow-xl group-hover/play:scale-110 group-hover/play:bg-[#d4af37] group-hover/play:text-[#0b1528] transition-all duration-300">
                        <i className="fas fa-play text-base sm:text-lg ml-0.5"></i>
                      </div>
                    )}
                  </Link>

                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end z-10 pointer-events-none">
                    <span className="text-xl font-extrabold text-[#e4c272] drop-shadow-md">
                      {project.displayPrice || "Price on Request"}
                    </span>
                    {project.possession && (
                      <span className="text-xs text-slate-300 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                        Possession: {project.possession}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <Link href={`/project/${project.slug}`}>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#e4c272] transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                    <i className="fas fa-map-marker-alt text-[#d4af37]"></i>
                    <span className="truncate">{project.location}</span>
                  </div>

                  <p className="text-xs text-slate-300 mt-3 line-clamp-2 font-light leading-relaxed">
                    {project.description}
                  </p>

                  {/* Specs Pill List */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/10 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <i className="fas fa-home text-[#d4af37] text-xs"></i>
                      <span>{project.bedrooms ? `${project.bedrooms} BHK Units` : 'Multi-Config'}</span>
                    </div>
                    {project.PlotArea && (
                      <div className="flex items-center gap-1.5 justify-end">
                        <i className="fas fa-expand text-[#d4af37] text-xs"></i>
                        <span className="truncate">{project.PlotArea}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 pb-6 pt-0 flex gap-3">
                <Link
                  href={`/project/${project.slug}`}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e4c272] text-[#0b1528] text-xs font-bold text-center hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Explore Project</span>
                  <i className="fas fa-arrow-right text-[10px]"></i>
                </Link>

                <a
                  href={`https://wa.me/917041395595?text=${encodeURIComponent(`Hi Avishkar Realty, I would like to request brochure and floor plans for project "${project.title}" in ${project.location}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-emerald-600 border border-white/15 flex items-center justify-center text-white transition-colors"
                  title="WhatsApp Enquiry"
                >
                  <i className="fab fa-whatsapp"></i>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}