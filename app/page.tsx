"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import PropertyCard from "./components/PropertyCard";
import Projects from "./components/Projects";
import PropertyShowCase from "./components/PropertyShowCase";
import OurPartner from "./components/OurPartner";
import GoogleReviews from "./components/GoogleReviews";
import Information from "./components/Information";
import { getProperties, type Property } from "@/lib/properties";

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  // Quick consultation lead form state
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formType, setFormType] = useState("Residential");
  const [formBudget, setFormBudget] = useState("₹75 Lacs - ₹1.5 Cr");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/properties');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            const validData = data.map((p: any) => ({
              ...p,
              featured: p.featured === 1 || p.featured === true,
              price: Number(p.price) || 0,
              bedrooms: Number(p.bedrooms) || 0,
              bathrooms: Number(p.bathrooms) || 0,
              area: Number(p.area) || 0,
              image: p.image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
            }));
            // If DB only has 1 property, combine with sample properties so users see full rich catalog
            const localProps = getProperties();
            const combined = [...validData, ...localProps.filter(lp => !validData.some((vp: any) => vp.id === lp.id))];
            setProperties(combined);
          } else {
            setProperties(getProperties());
          }
        } else {
          setProperties(getProperties());
        }
      } catch (error) {
        console.error("Error loading properties:", error);
        setProperties(getProperties());
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const displayedProperties = properties.filter((property) => {
    if (activeCategory === "all") return true;
    return (
      property.category?.toLowerCase() === activeCategory.toLowerCase() ||
      property.type?.toLowerCase() === activeCategory.toLowerCase()
    );
  }).slice(0, 6);

  const handleQuickLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone) {
      setFormError("Please enter your name and contact number.");
      return;
    }
    setFormSubmitting(true);
    setFormError("");

    try {
      const res = await fetch('/api/enquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          phone: formPhone,
          email: formEmail || null,
          source: 'Homepage VIP Consultation Form',
          property_type: formType,
          budget: formBudget,
          priority: 'High',
          notes: `Requested tailored recommendations for ${formType} with budget ${formBudget}.`
        })
      });

      if (!res.ok) throw new Error('Submission failed');
      setFormSuccess(true);
      setFormName("");
      setFormPhone("");
      setFormEmail("");
    } catch {
      setFormError("Unable to submit. Please reach us directly on WhatsApp or call.");
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col selection:bg-[#d4af37] selection:text-[#0b1528]">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection />

        {/* Verified Confidence & Stat Bar */}
        <section className="py-10 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                <span className="text-3xl sm:text-4xl font-black text-[#0b1528] block">50+</span>
                <span className="text-xs sm:text-sm font-semibold text-[#d4af37] uppercase tracking-wider mt-1 block">
                  Top Developer Partners
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">Adani, Godrej, Shivalik & more</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                <span className="text-3xl sm:text-4xl font-black text-[#0b1528] block">100%</span>
                <span className="text-xs sm:text-sm font-semibold text-[#d4af37] uppercase tracking-wider mt-1 block">
                  RERA Compliance
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">Clean legal titles & verified plans</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                <span className="text-3xl sm:text-4xl font-black text-[#0b1528] block">500+</span>
                <span className="text-xs sm:text-sm font-semibold text-[#d4af37] uppercase tracking-wider mt-1 block">
                  Satisfied Families
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">Across North & West Ahmedabad</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                <span className="text-3xl sm:text-4xl font-black text-[#0b1528] block">₹0</span>
                <span className="text-xs sm:text-sm font-semibold text-[#d4af37] uppercase tracking-wider mt-1 block">
                  Buyer Brokerage
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">On all new developer projects</p>
              </div>
            </div>
          </div>
        </section>

        {/* Flagship Projects Section (Real DB Projects in Ahmedabad) */}
        <Projects />

        {/* Featured Properties Grid */}
        <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 w-full">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#855f05] text-xs font-bold uppercase tracking-wider mb-3">
                <i className="fas fa-home text-[10px]"></i>
                <span>Prime Listings</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
                Featured Properties <span className="text-[#0b1528]">for Discerning Buyers</span>
              </h2>
              <p className="mt-3 text-slate-600 text-sm sm:text-base max-w-xl font-light">
                Explore handpicked luxury villas, penthouses, modern apartments, and premium commercial assets.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { id: "all", label: "All Properties" },
                { id: "Residential", label: "Residential" },
                { id: "Commercial", label: "Commercial" },
                { id: "Villa", label: "Villas & Plots" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    activeCategory === tab.id
                      ? "bg-[#0b1528] text-white shadow-md shadow-[#0b1528]/20"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Properties Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-96 rounded-2xl bg-slate-200 animate-pulse"></div>
              ))}
            </div>
          ) : displayedProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
              <i className="fas fa-search text-3xl text-slate-300 mb-3"></i>
              <h3 className="text-lg font-bold text-slate-700">No properties in this category yet</h3>
              <p className="text-sm text-slate-500 mt-1">Try switching to &quot;All Properties&quot; or browsing our new projects.</p>
            </div>
          )}

          {/* View All Properties Button */}
          <div className="mt-14 text-center">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0b1528] hover:bg-[#162544] text-white text-sm font-bold tracking-wide transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5"
            >
              <span>Explore Complete Property Catalogue</span>
              <i className="fas fa-arrow-right text-xs text-[#e4c272]"></i>
            </Link>
          </div>
        </section>

        {/* Project Spotlight (The Amber) */}
        <PropertyShowCase />

        {/* Explore Properties by Area in Ahmedabad */}
        <section className="py-20 lg:py-28 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider mb-3">
                <i className="fas fa-map-marked-alt text-[#d4af37]"></i>
                <span>Strategic Growth Hubs</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Explore Ahmedabad&apos;s <span className="text-[#0b1528]">Prime Neighbourhoods</span>
              </h2>
              <p className="mt-3 text-slate-600 text-sm sm:text-base">
                Discover exceptional properties across the fastest-appreciating residential and commercial corridors in Gujarat.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  name: "SG Highway",
                  desc: "Corporate headquarters, luxury high-rises & vibrant entertainment.",
                  image: "/images/slider/slider1.jpeg",
                  tag: "High Appreciation"
                },
                {
                  name: "Vaishnodevi Circle",
                  desc: "Premier 4 BHK apartments, lake gardens & arterial connectivity.",
                  image: "/images/project/the-regal1.png",
                  tag: "Elite Residences"
                },
                {
                  name: "Zundal & Chandkheda",
                  desc: "Family-focused 2 & 3 BHK gated communities with zero space wastage.",
                  image: "/images/project/Om-heights1.png",
                  tag: "Best Value"
                },
                {
                  name: "Gota & Vandematram",
                  desc: "Established infrastructure, premium schools & peaceful residences.",
                  image: "/images/project/Shantam-Parmeshwar1.jpeg",
                  tag: "Family Haven"
                }
              ].map((area, idx) => (
                <Link
                  key={idx}
                  href={`/properties?location=${encodeURIComponent(area.name)}`}
                  className="group relative h-80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-end p-6"
                >
                  <img
                    src={area.image}
                    alt={area.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1528] via-[#0b1528]/50 to-transparent"></div>

                  <span className="relative z-10 self-start text-[10px] font-bold uppercase tracking-wider text-[#0b1528] bg-[#d4af37] px-2.5 py-1 rounded-md mb-2">
                    {area.tag}
                  </span>
                  <h3 className="relative z-10 text-xl font-bold text-white group-hover:text-[#e4c272] transition-colors">
                    {area.name}
                  </h3>
                  <p className="relative z-10 text-xs text-slate-300 mt-1 line-clamp-2 font-light">
                    {area.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Developer Partners */}
        <OurPartner />

        {/* Real Customer Reviews Section */}
        <section className="py-20 lg:py-28 bg-[#f1f5f9] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider mb-3">
              <i className="fas fa-quote-left text-[#d4af37]"></i>
              <span>Customer Satisfaction</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Trusted by Homebuyers & <span className="text-[#0b1528]">Commercial Investors</span>
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
              Read authentic Google reviews from clients who found their dream homes and successful commercial deals with us.
            </p>
          </div>

          <GoogleReviews />
        </section>

        {/* VIP Property Consultation Glass Card (Direct CRM Lead Submission) */}
        <section className="py-20 lg:py-24 bg-gradient-to-b from-[#f1f5f9] to-[#0b1528] px-4 sm:px-6">
          <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl border border-white/80 rounded-3xl p-8 sm:p-12 shadow-2xl relative">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-xs font-bold text-[#d4af37] uppercase tracking-widest block mb-1">
                Personalized Advisory
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Request a VIP Property Consultation
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                Share your requirements. Our real estate specialist will curate matching RERA-approved properties and schedule private site visits for you.
              </p>
            </div>

            {formSuccess ? (
              <div className="p-8 text-center bg-emerald-50 border border-emerald-200 rounded-2xl animate-in fade-in">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  <i className="fas fa-check"></i>
                </div>
                <h3 className="text-xl font-bold text-emerald-900">Enquiry Submitted to Our Team!</h3>
                <p className="text-sm text-emerald-700 mt-2 max-w-md mx-auto">
                  Thank you! Your requirements have been logged in our CRM. An executive from Avishkar Realty will reach out to you within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setFormSuccess(false)}
                  className="mt-6 px-6 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleQuickLeadSubmit} className="space-y-4">
                {formError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Patel"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-sm focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (WhatsApp) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-sm focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-sm focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Property Type</label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-sm focus:outline-none focus:border-[#d4af37] cursor-pointer"
                    >
                      <option value="Residential">Residential (2/3/4 BHK)</option>
                      <option value="Commercial">Commercial / Retail</option>
                      <option value="Penthouse">Luxury Penthouse</option>
                      <option value="Villa">Independent Villa</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Budget Preference</label>
                    <select
                      value={formBudget}
                      onChange={(e) => setFormBudget(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-sm focus:outline-none focus:border-[#d4af37] cursor-pointer"
                    >
                      <option value="Under ₹75 Lakhs">Under ₹75 Lakhs</option>
                      <option value="₹75 Lacs - ₹1.5 Cr">₹75 Lacs - ₹1.5 Cr</option>
                      <option value="₹1.5 Cr - ₹3 Cr">₹1.5 Cr - ₹3 Cr</option>
                      <option value="Above ₹3 Cr">Above ₹3 Cr</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="w-full py-4 rounded-xl bg-[#0b1528] hover:bg-[#162544] text-[#e4c272] text-sm font-bold tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    {formSubmitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        <span>Registering Enquiry...</span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane"></i>
                        <span>Request Custom Property Portfolio</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* Office & Direct Contact Information */}
        <Information />
      </main>

      <Footer />
    </div>
  );
}
