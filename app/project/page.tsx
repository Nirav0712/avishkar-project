"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Information from "../components/Information";
import { projects as fallbackProjects, type Project } from "@/lib/project";

export default function ProjectsPage() {
  const [projectList, setProjectList] = useState<Project[]>(fallbackProjects);
  const [filter, setFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProjectList(data);
        }
      })
      .catch(err => console.error('Error fetching live projects:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredProjects = filter === "all"
    ? projectList
    : projectList.filter(p => p.status?.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col">
      <Header />

      {/* Hero Header */}
      <section className="bg-gradient-to-r from-[#0b1528] via-[#102447] to-[#0b1528] text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] opacity-15"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#e4c272] text-xs font-bold uppercase tracking-widest mb-4">
            <i className="fas fa-city text-xs"></i>
            <span>Architectural Excellence</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto">
            Flagship Residential & <span className="gold-gradient-text">Commercial Projects</span>
          </h1>

          <p className="mt-4 text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            Discover landmark addresses in Ahmedabad engineered for generational value, modern luxury, and high appreciation.
          </p>

          {/* Quick Filter Bar */}
          <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
            {[
              { id: "all", label: "All Projects" },
              { id: "under construction", label: "Under Construction" },
              { id: "upcoming", label: "Upcoming Launches" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  filter === tab.id
                    ? "bg-[#d4af37] text-[#0b1528] shadow-md shadow-[#d4af37]/30"
                    : "bg-white/10 text-slate-200 hover:bg-white/20"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Showcase List */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16 flex-1 w-full">
        {isLoading ? (
          <div className="space-y-12">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-96 rounded-3xl bg-slate-200 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-16">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className={`bg-white/90 backdrop-blur-md border border-white/80 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Visual Showcase (50%) with Video Overlay & Internal Link */}
                <div className="lg:w-1/2 relative min-h-[300px] sm:min-h-[420px] overflow-hidden group">
                  <Image
                    src={project.videoThumbnail || project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30"></div>

                  {/* Overlaid Badges */}
                  <div className="absolute top-5 left-5 flex flex-wrap gap-2 z-10">
                    <span className="bg-[#d4af37] text-[#0b1528] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                      {project.status}
                    </span>
                    {project.zone && (
                      <span className="bg-black/60 backdrop-blur-md text-white border border-white/20 px-3 py-1 rounded-full text-xs font-medium capitalize">
                        {project.zone} Zone
                      </span>
                    )}
                    {Boolean(project.hasVideo || project.youtubeUrl || project.instagramUrl) && (
                      <span className="bg-rose-600/90 backdrop-blur-md text-white border border-rose-400/40 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-1.5">
                        <i className="fas fa-play text-[10px]"></i>
                        <span>Reel / Short Video</span>
                      </span>
                    )}
                  </div>

                  {/* Play Button Overlay (Navigates directly to project detail page) */}
                  <Link
                    href={`/project/${project.slug}`}
                    className="absolute inset-0 z-10 flex items-center justify-center group/play"
                    aria-label={`View ${project.title} video tour & floor plans`}
                  >
                    {Boolean(project.hasVideo || project.youtubeUrl || project.instagramUrl) && (
                      <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border-2 border-[#d4af37] text-[#f5d77f] flex items-center justify-center shadow-2xl group-hover/play:scale-115 group-hover/play:bg-[#d4af37] group-hover/play:text-[#0b1528] transition-all duration-300">
                        <i className="fas fa-play text-xl ml-1"></i>
                      </div>
                    )}
                  </Link>

                  <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end z-10 pointer-events-none">
                    <span className="text-2xl font-black text-white drop-shadow-md">
                      {project.displayPrice || "Price on Request"}
                    </span>
                    {project.possession && (
                      <span className="text-xs bg-white/20 backdrop-blur-md text-white border border-white/30 px-3 py-1 rounded-lg">
                        Possession: {project.possession}
                      </span>
                    )}
                  </div>
                </div>

                {/* Project Details (50%) */}
                <div className="lg:w-1/2 p-6 sm:p-10 flex flex-col justify-between">
                  <div>
                    <Link href={`/project/${project.slug}`}>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight hover:text-[#0b1528] transition-colors">
                        {project.title}
                      </h2>
                    </Link>

                    <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mt-2">
                      <i className="fas fa-map-marker-alt text-[#d4af37]"></i>
                      <span>{project.location}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3.5">
                      {project.rera && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold max-w-full">
                          <i className="fas fa-shield-alt text-emerald-600 shrink-0"></i>
                          <span className="truncate">RERA: {project.rera}</span>
                        </div>
                      )}
                      {Boolean(project.hasVideo || project.youtubeUrl || project.instagramUrl) && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-bold">
                          <i className="fas fa-film text-rose-600 shrink-0"></i>
                          <span>9:16 Video Tour Available</span>
                        </div>
                      )}
                    </div>

                    <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                      {project.description}
                    </p>

                    {/* Specifications Grid */}
                    <div className="grid grid-cols-3 gap-3 my-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                      <div>
                        <span className="block text-[11px] text-slate-400 font-medium">Bedrooms</span>
                        <span className="text-sm font-bold text-slate-900 mt-0.5 block">{project.bedrooms} BHK</span>
                      </div>
                      <div>
                        <span className="block text-[11px] text-slate-400 font-medium">Carpet Area</span>
                        <span className="text-sm font-bold text-slate-900 mt-0.5 block">{project.PlotArea || "Spacious"}</span>
                      </div>
                      <div>
                        <span className="block text-[11px] text-slate-400 font-medium">Total Units</span>
                        <span className="text-sm font-bold text-slate-900 mt-0.5 block">{project.totalUnits || "Exclusive"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
                    <Link
                      href={`/project/${project.slug}`}
                      className="flex-1 py-3 px-6 rounded-xl bg-[#0b1528] hover:bg-[#162544] text-[#e4c272] text-xs font-bold text-center tracking-wide transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <span>Explore Project Details</span>
                      <i className="fas fa-arrow-right text-[10px]"></i>
                    </Link>

                    {project.blogId && (
                      <Link
                        href={`/blog/${project.blogId}`}
                        className="py-3 px-5 rounded-xl border border-slate-300 hover:border-[#0b1528] text-slate-700 hover:text-[#0b1528] text-xs font-bold transition-all"
                      >
                        Read Analysis
                      </Link>
                    )}

                    <a
                      href={`https://wa.me/917041395595?text=${encodeURIComponent(`Hi Avishkar Realty, I would like to request floor plans and pricing for project "${project.title}" in ${project.location}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white border border-emerald-200 flex items-center justify-center text-lg transition-colors"
                      title="Enquire on WhatsApp"
                    >
                      <i className="fab fa-whatsapp"></i>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Information />
      <Footer />
    </div>
  );
}