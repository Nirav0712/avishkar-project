"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Information from "@/app/components/Information";
import { projects as fallbackProjects, type Project } from "@/lib/project";
import { parseYouTubeUrl, parseInstagramUrl } from "@/lib/video";

export default function ProjectDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [project, setProject] = useState<any>(fallbackProjects.find((p) => p.slug === slug));
  const [similarProjects, setSimilarProjects] = useState<Project[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Video Player state (9:16 vertical reel / shorts)
  const [activeVideoTab, setActiveVideoTab] = useState<'youtube' | 'instagram'>('youtube');
  const [loadYouTubeEmbed, setLoadYouTubeEmbed] = useState(false);
  const [loadInstagramEmbed, setLoadInstagramEmbed] = useState(false);

  // CRM Enquiry Form state
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientNotes, setClientNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const matched = data.find((p: any) => p.slug === slug || String(p.id) === slug);
          if (matched) {
            setProject(matched);
            setClientNotes(`Hi, I am interested in ${matched.title} in ${matched.location}. Please share floor plans, pricing details, and arrange a site visit.`);
          }
          const similar = data.filter((p: any) => p.slug !== slug).slice(0, 3);
          setSimilarProjects(similar);
        } else {
          const matched = fallbackProjects.find((p) => p.slug === slug);
          if (matched) setProject(matched);
        }
      })
      .catch((err) => console.error("Error loading project:", err))
      .finally(() => setIsLoading(false));
  }, [slug]);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) {
      setSubmitError("Please provide your name and contact number.");
      return;
    }
    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/enquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: clientName,
          phone: clientPhone,
          email: clientEmail || null,
          source: "Project Detail Page",
          project_id: project?.id || null,
          interested_in: project?.title || slug,
          preferred_location: project?.location || "",
          property_type: "Project / Apartment",
          priority: "High",
          notes: clientNotes || `Requested brochure and site visit for ${project?.title}`
        })
      });

      if (!res.ok) throw new Error("Failed to submit enquiry");
      setSubmitSuccess(true);
      setClientName("");
      setClientPhone("");
      setClientEmail("");
    } catch {
      setSubmitError("Unable to submit enquiry. You can reach us directly on WhatsApp or phone.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading && !project) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center py-20 text-slate-500">
          <i className="fas fa-circle-notch fa-spin text-3xl text-[#d4af37] mr-3"></i>
          <span>Loading project specifications...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col">
        <Header />
        <div className="flex-1 max-w-lg mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold text-slate-800">Project Not Found</h1>
          <p className="text-sm text-slate-500 mt-2">
            The project you requested is not available. Explore our other flagship projects.
          </p>
          <Link
            href="/project"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0b1528] text-white text-xs font-bold"
          >
            <i className="fas fa-arrow-left"></i>
            <span>Browse All Projects</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = Array.isArray(project.images) && project.images.length > 0 ? project.images : [project.image];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-slate-100/70 border-b border-slate-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-900">Home</Link>
          <span>/</span>
          <Link href="/project" className="hover:text-slate-900">Projects</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold truncate max-w-xs">{project.title}</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full">
        {/* Project Header Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="bg-[#d4af37] text-[#0b1528] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {project.status || "Under Construction"}
              </span>
              {project.zone && (
                <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold capitalize">
                  {project.zone} Zone
                </span>
              )}
              {project.featured && (
                <span className="bg-[#0b1528] text-[#e4c272] px-3 py-1 rounded-full text-xs font-bold">
                  ★ Flagship Development
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {project.title}
            </h1>

            <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
              <i className="fas fa-map-marker-alt text-[#d4af37]"></i>
              <span>{project.location}</span>
            </div>
          </div>

          <div className="text-left md:text-right">
            <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider">
              Starting Price
            </span>
            <span className="text-2xl sm:text-4xl font-black text-[#0b1528]">
              {project.displayPrice || "Price on Request"}
            </span>
          </div>
        </div>

        {/* Gallery Carousel */}
        <div className="relative h-[340px] sm:h-[480px] rounded-3xl overflow-hidden shadow-lg bg-slate-900 mb-8 group">
          <Image
            src={images[currentImageIndex] || project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 ease-out"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70"
                aria-label="Previous image"
              >
                <i className="fas fa-chevron-left text-sm"></i>
              </button>
              <button
                type="button"
                onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70"
                aria-label="Next image"
              >
                <i className="fas fa-chevron-right text-sm"></i>
              </button>
            </>
          )}

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_: any, i: number) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentImageIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentImageIndex ? "w-6 bg-[#d4af37]" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* RERA and Quick Highlights */}
            {project.rera && (
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg shrink-0">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                    Gujarat RERA Approved
                  </span>
                  <span className="text-xs text-emerald-950 font-mono font-medium">{project.rera}</span>
                </div>
              </div>
            )}

            {/* Overview Stats */}
            <div className="bg-white/90 backdrop-blur-md border border-white/80 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <i className="fas fa-cubes text-[#d4af37]"></i>
                Project Overview & Dimensions
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-xs text-slate-500 font-medium">Configurations</span>
                  <p className="text-base font-bold text-slate-900 mt-0.5">{project.bedrooms} BHK</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-xs text-slate-500 font-medium">Plot / Unit Area</span>
                  <p className="text-base font-bold text-slate-900 mt-0.5">{project.PlotArea || "Spacious"}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-xs text-slate-500 font-medium">Possession</span>
                  <p className="text-base font-bold text-slate-900 mt-0.5">{project.possession || "In Progress"}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-xs text-slate-500 font-medium">Total Towers</span>
                  <p className="text-base font-bold text-slate-900 mt-0.5">{project.totalTowers ? `${project.totalTowers} Towers` : "Premium"}</p>
                </div>
              </div>

              {/* Description */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <h3 className="text-base font-bold text-slate-900 mb-2">Architectural Highlights</h3>
                <p className="text-slate-600 text-sm leading-relaxed font-light">
                  {project.description}
                </p>
              </div>

              {/* Address */}
              {project.address && (
                <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <i className="fas fa-map-pin text-[#d4af37] text-base mt-0.5 shrink-0"></i>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Project Site Address</span>
                    <p className="text-xs text-slate-600 mt-0.5">{project.address}</p>
                  </div>
                </div>
              )}
            </div>

            {/* ========================================================================= */}
            {/* TASK 4: PROJECT VIDEOS (VERTICAL 9:16 REEL & SHORTS SHOWCASE)             */}
            {/* ========================================================================= */}
            {Boolean(
              project.hasVideo ||
              project.youtubeUrl ||
              project.instagramUrl
            ) && (() => {
              const ytParsed = project.youtubeUrl ? parseYouTubeUrl(project.youtubeUrl) : null;
              const instaParsed = project.instagramUrl ? parseInstagramUrl(project.instagramUrl) : null;
              const effectiveTab = (activeVideoTab === 'youtube' && ytParsed) ? 'youtube' : (instaParsed ? 'instagram' : 'youtube');

              return (
                <div className="bg-gradient-to-br from-[#0b1528] via-[#102447] to-[#0b1528] text-white rounded-3xl p-6 sm:p-8 border border-[#d4af37]/35 shadow-2xl relative overflow-hidden">
                  {/* Luxury Background Glows */}
                  <div className="absolute top-0 right-0 w-80 h-80 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/30 text-[#f5d77f] text-[11px] font-bold uppercase tracking-wider mb-2">
                          <i className="fas fa-film text-[10px]"></i>
                          <span>Project Video Showcase</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                          Exclusive 9:16 Video Tour & Reels
                        </h2>
                        <p className="text-xs text-slate-300 mt-1">
                          {project.videoTitle || `Interactive vertical walkthrough and reel tour of ${project.title}`}
                        </p>
                      </div>

                      {/* Tab Switcher (if both YouTube and Instagram exist) */}
                      {ytParsed && instaParsed && (
                        <div className="flex items-center gap-1.5 bg-white/10 p-1 rounded-2xl border border-white/10 self-start sm:self-auto">
                          <button
                            type="button"
                            onClick={() => setActiveVideoTab('youtube')}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                              effectiveTab === 'youtube'
                                ? 'bg-[#d4af37] text-[#0b1528] shadow-md'
                                : 'text-slate-300 hover:text-white'
                            }`}
                          >
                            <i className="fab fa-youtube text-rose-500"></i>
                            <span>YouTube Shorts</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveVideoTab('instagram')}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                              effectiveTab === 'instagram'
                                ? 'bg-[#d4af37] text-[#0b1528] shadow-md'
                                : 'text-slate-300 hover:text-white'
                            }`}
                          >
                            <i className="fab fa-instagram text-purple-400"></i>
                            <span>Instagram Reel</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Vertical 9:16 Video Player Card */}
                    <div className="flex flex-col items-center justify-center">
                      {/* YouTube Shorts Player */}
                      {effectiveTab === 'youtube' && ytParsed && (
                        <div className="w-full max-w-[340px] sm:max-w-[360px] flex flex-col items-center">
                          <div className="w-full aspect-[9/16] rounded-3xl overflow-hidden border-2 border-[#d4af37]/40 shadow-2xl bg-black relative group">
                            {!loadYouTubeEmbed ? (
                              <div className="relative w-full h-full">
                                <img
                                  src={project.videoThumbnail || ytParsed.thumbnailUrl || project.image}
                                  alt={project.title}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40 flex flex-col items-center justify-center p-6 text-center">
                                  <button
                                    type="button"
                                    onClick={() => setLoadYouTubeEmbed(true)}
                                    className="w-16 h-16 rounded-full bg-[#d4af37] text-[#0b1528] flex items-center justify-center text-xl shadow-2xl hover:scale-110 transition duration-300 mb-3"
                                    aria-label="Play YouTube Shorts"
                                  >
                                    <i className="fas fa-play ml-1"></i>
                                  </button>
                                  <span className="text-xs font-bold text-white tracking-wide uppercase">
                                    Click to Play YouTube Shorts
                                  </span>
                                  <span className="text-[11px] text-slate-300 mt-1 font-light">
                                    Vertical 9:16 HD Walkthrough
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <iframe
                                src={`${ytParsed.embedUrl}&autoplay=1`}
                                title={project.videoTitle || `${project.title} YouTube Shorts`}
                                className="w-full h-full object-cover"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                              />
                            )}
                          </div>

                          {/* Fallback & External Link */}
                          <div className="mt-4 flex items-center gap-3">
                            <a
                              href={ytParsed.originalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-slate-200 transition"
                            >
                              <i className="fab fa-youtube text-rose-500 text-sm"></i>
                              <span>Watch on YouTube</span>
                              <i className="fas fa-external-link-alt text-[10px] text-slate-400"></i>
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Instagram Reel Player */}
                      {effectiveTab === 'instagram' && instaParsed && (
                        <div className="w-full max-w-[340px] sm:max-w-[360px] flex flex-col items-center">
                          <div className="w-full aspect-[9/16] rounded-3xl overflow-hidden border-2 border-purple-500/40 shadow-2xl bg-black relative group">
                            {!loadInstagramEmbed ? (
                              <div className="relative w-full h-full">
                                <img
                                  src={project.videoThumbnail || project.image}
                                  alt={project.title}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40 flex flex-col items-center justify-center p-6 text-center">
                                  <button
                                    type="button"
                                    onClick={() => setLoadInstagramEmbed(true)}
                                    className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center text-xl shadow-2xl hover:scale-110 transition duration-300 mb-3"
                                    aria-label="Play Instagram Reel"
                                  >
                                    <i className="fas fa-play ml-1"></i>
                                  </button>
                                  <span className="text-xs font-bold text-white tracking-wide uppercase">
                                    Click to Load Instagram Reel
                                  </span>
                                  <span className="text-[11px] text-slate-300 mt-1 font-light">
                                    Vertical 9:16 Reel Showcase
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <iframe
                                src={instaParsed.embedUrl}
                                title={project.videoTitle || `${project.title} Instagram Reel`}
                                className="w-full h-full object-cover"
                                allowFullScreen
                              />
                            )}
                          </div>

                          {/* Fallback & External Link */}
                          <div className="mt-4 flex items-center gap-3">
                            <a
                              href={instaParsed.originalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-slate-200 transition"
                            >
                              <i className="fab fa-instagram text-purple-400 text-sm"></i>
                              <span>Watch Reel on Instagram</span>
                              <i className="fas fa-external-link-alt text-[10px] text-slate-400"></i>
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Unit Types Section */}
            {project.unitTypes && project.unitTypes.length > 0 && (
              <div className="bg-white/90 backdrop-blur-md border border-white/80 rounded-3xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <i className="fas fa-layer-group text-[#d4af37]"></i>
                  Available Unit Configurations & Floor Plans
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.unitTypes.map((unit: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#d4af37] transition-all duration-200 shadow-xs hover:shadow-md"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-900 text-sm">{unit.type}</h4>
                        <span className="text-xs font-bold text-[#d4af37] bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-xs">
                          {unit.area}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-light leading-relaxed">
                        {unit.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities Section */}
            {project.amenities && project.amenities.length > 0 && (
              <div className="bg-white/90 backdrop-blur-md border border-white/80 rounded-3xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <i className="fas fa-star text-[#d4af37]"></i>
                  Amenities & Club Facilities
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {project.amenities.map((amenity: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37] text-[10px] shrink-0">
                        <i className="fas fa-check"></i>
                      </span>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Blog Link */}
            {project.blogId && (
              <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0b1528] to-[#162544] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-base text-white">In-depth Property Analysis Available</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Read our expert real estate review and investment breakdown for {project.title}.
                  </p>
                </div>
                <Link
                  href={`/blog/${project.blogId}`}
                  className="px-5 py-2.5 rounded-full bg-[#d4af37] text-[#0b1528] text-xs font-bold hover:brightness-110 whitespace-nowrap"
                >
                  Read Market Report
                </Link>
              </div>
            )}
          </div>

          {/* Sticky CRM Enquiry Form (4 cols) */}
          <div className="lg:col-span-4">
            <div className="bg-white/90 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-8 shadow-xl sticky top-24">
              <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-[#0b1528] text-[#e4c272] flex items-center justify-center text-lg shadow-sm">
                  <i className="fas fa-file-signature"></i>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Book Priority Inspection</h3>
                  <span className="text-xs text-[#d4af37] font-semibold">Attributed to {project.title}</span>
                </div>
              </div>

              {submitSuccess ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 text-xl">
                    <i className="fas fa-check"></i>
                  </div>
                  <h4 className="font-bold text-emerald-900 text-base">Enquiry Sent to CRM!</h4>
                  <p className="text-xs text-emerald-700 mt-1">
                    Thank you! Our dedicated project specialist will connect with you to share the brochure and schedule your site visit.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitSuccess(false)}
                    className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                  >
                    Submit Another Query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-4 text-xs">
                  {submitError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
                      {submitError}
                    </div>
                  )}

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priyank Patel"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Phone Number (WhatsApp) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="priyank@example.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Inquiry / Visit Preference</label>
                    <textarea
                      rows={3}
                      value={clientNotes}
                      onChange={(e) => setClientNotes(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#d4af37] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-xl bg-[#0b1528] hover:bg-[#162544] text-[#e4c272] font-bold text-xs tracking-wide transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        <span>Registering Enquiry...</span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-calendar-check"></i>
                        <span>Request Brochure & Site Visit</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`https://wa.me/917041395595?text=${encodeURIComponent(`Hi Avishkar Realty, I am interested in project "${project.title}" located at ${project.location}. Please share the floor plan PDF and price quotation.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wide transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <i className="fab fa-whatsapp text-sm"></i>
                    <span>Connect on WhatsApp</span>
                  </a>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Similar Projects */}
        {similarProjects.length > 0 && (
          <div className="mt-20 pt-10 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Other Flagship Projects You May Consider</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarProjects.map((p) => (
                <div key={p.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all group">
                  <div className="relative h-48 overflow-hidden">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 left-3 bg-[#0b1528] text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase">
                      {p.status}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-slate-900 text-base line-clamp-1">{p.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{p.location}</p>
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100">
                      <span className="text-sm font-extrabold text-[#d4af37]">{p.displayPrice}</span>
                      <Link href={`/project/${p.slug}`} className="text-xs font-bold text-[#0b1528] hover:text-[#d4af37]">
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Information />
      <Footer />
    </div>
  );
}