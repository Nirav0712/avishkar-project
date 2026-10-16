"use client";

import React from "react";

export default function Information() {
  return (
    <section className="py-16 bg-[#0b1528] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#e4c272] text-lg shrink-0 shadow-sm">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div>
                <h3 className="text-white font-bold text-base tracking-wide">
                  Corporate Office
                </h3>
                <p className="text-slate-300 mt-1 text-xs sm:text-sm leading-relaxed">
                  Status Elysium, 23, Nr. Shree Vishnudhara Gardens, Gota, Ahmedabad, Gujarat 382481
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#e4c272] text-lg shrink-0 shadow-sm">
                <i className="fas fa-envelope"></i>
              </div>
              <div>
                <h3 className="text-white font-bold text-base tracking-wide">
                  Direct Correspondence
                </h3>
                <p className="text-slate-300 mt-1 text-xs sm:text-sm">
                  <a
                    href="mailto:avishkarrealty1@gmail.com"
                    className="hover:text-[#e4c272] transition-colors"
                  >
                    avishkarrealty1@gmail.com
                  </a>
                </p>
                <span className="text-[11px] text-[#10b981] mt-0.5 block">
                  <i className="fas fa-bolt mr-1"></i> Quick 24h Response
                </span>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#e4c272] text-lg shrink-0 shadow-sm">
                <i className="fas fa-phone-alt"></i>
              </div>
              <div>
                <h3 className="text-white font-bold text-base tracking-wide">
                  Advisory Hotline
                </h3>
                <div className="text-slate-300 mt-1 text-xs sm:text-sm flex flex-col gap-0.5">
                  <a
                    href="tel:+917041395595"
                    className="hover:text-[#e4c272] font-semibold transition-colors"
                  >
                    +91 70413 95595
                  </a>
                  <a
                    href="tel:+919825029913"
                    className="hover:text-[#e4c272] transition-colors"
                  >
                    +91 98250 29913
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
