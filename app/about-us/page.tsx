"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Information from "../components/Information";
import OurPartner from "../components/OurPartner";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col">
      <Header />

      {/* Hero Header */}
      <section className="bg-gradient-to-r from-[#0b1528] via-[#102447] to-[#0b1528] text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] opacity-15"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#e4c272] text-xs font-bold uppercase tracking-widest mb-3">
            <i className="fas fa-landmark text-xs"></i>
            <span>Our Heritage & Vision</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto">
            About <span className="gold-gradient-text">Avishkar Realty</span>
          </h1>

          <p className="mt-4 text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            Founded on the pillars of transparency, market acumen, and uncompromising integrity in Ahmedabad, Gujarat.
          </p>
        </div>
      </section>

      {/* Main Story & Core Values */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 flex-1 w-full space-y-20">
        {/* Leadership Section */}
        <div className="space-y-16">
          {/* Founder 1: Ajay Prajapati */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-10 shadow-lg grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5 relative h-80 sm:h-96 rounded-2xl overflow-hidden shadow-md border-2 border-[#d4af37]/30 group">
              <Image
                src="/images/team/Founder1.jpg"
                alt="Ajay Prajapati - Founder"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="md:col-span-7">
              <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider block mb-1">
                Founder & Strategic Director
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
                Ajay Prajapati
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-light mb-4">
                The foundation of Avishkar Realty was established by a visionary leader with a deep commitment to elevating real estate advisory standards in Gujarat. With extensive expertise spanning high-value residential transactions, commercial investments, and developer liaison, Ajay Prajapati has built a reputable institution centered on investor confidence and transparent guidance.
              </p>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-light">
                &ldquo;Real estate is not just an exchange of square feet — it is the cornerstone of family security and enterprise growth. Every mandate entrusted to us is treated with the utmost responsibility.&rdquo;
              </p>
            </div>
          </div>

          {/* Founder 2: Dashrathbhai Prajapati */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-10 shadow-lg grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 order-2 md:order-1">
              <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider block mb-1">
                Co-Founder & Senior Advisor
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
                Dashrathbhai Prajapati
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-light mb-4">
                Bringing decades of hands-on property experience, community goodwill, and strategic mentorship, Dashrathbhai Prajapati guides Avishkar Realty with deep values of ethical conduct and client-first commitment.
              </p>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-light">
                Under his leadership, Avishkar Realty has nurtured enduring partnerships with top builders including Adani, Godrej, Shivalik, and HN Safal, ensuring clients receive privileged terms and verified legal scrutiny.
              </p>
            </div>
            <div className="md:col-span-5 order-1 md:order-2 relative h-80 sm:h-96 rounded-2xl overflow-hidden shadow-md border-2 border-[#d4af37]/30 group">
              <Image
                src="/images/team/Founder2.jpg"
                alt="Dashrathbhai Prajapati - Co-Founder"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* Core Pillars Grid */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Why Discerning Buyers Choose Avishkar
            </h2>
            <p className="mt-2 text-slate-600 text-sm">
              Principles that govern every consultation, negotiation, and handover.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white/80 shadow-sm text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#0b1528] text-[#e4c272] flex items-center justify-center text-xl mx-auto mb-5 shadow-sm">
                <i className="fas fa-file-contract"></i>
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">100% RERA Diligence</h3>
              <p className="text-slate-500 text-xs sm:text-sm font-light leading-relaxed">
                Zero ambiguity. We verify title deeds, builder track record, sanction plans, and RERA registration before recommending any inventory.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white/80 shadow-sm text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#0b1528] text-[#e4c272] flex items-center justify-center text-xl mx-auto mb-5 shadow-sm">
                <i className="fas fa-coins"></i>
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Zero Buyer Brokerage</h3>
              <p className="text-slate-500 text-xs sm:text-sm font-light leading-relaxed">
                Enjoy transparent developer pricing with ₹0 brokerage fees on newly launched and under-construction developer projects.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white/80 shadow-sm text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#0b1528] text-[#e4c272] flex items-center justify-center text-xl mx-auto mb-5 shadow-sm">
                <i className="fas fa-hand-holding-heart"></i>
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">End-to-End Escrow & Loan</h3>
              <p className="text-slate-500 text-xs sm:text-sm font-light leading-relaxed">
                Complete documentation, bank home loan pre-approvals, legal agreement draft checks, and post-possession assistance.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Developer Partnerships */}
      <OurPartner />

      <Information />
      <Footer />
    </div>
  );
}
