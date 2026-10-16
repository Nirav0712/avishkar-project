import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0b1528] text-white pt-20 pb-8 border-t border-white/10 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-16 border-b border-white/10">
          {/* Column 1 - Brand & About (4 cols) */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block mb-6">
              <img
                src="/images/logo.png"
                alt="Avishkar Realty Logo"
                className="h-12 w-auto object-contain"
              />
            </Link>

            <p className="text-slate-300 text-sm leading-relaxed mb-6 font-light max-w-sm">
              Ahmedabad&apos;s trusted premier real estate advisory firm. Curating landmark residential developments, luxury villas, and high-yielding commercial assets with unmatched transparency and dedicated client advisory.
            </p>

            <div className="flex items-center gap-2.5">
              <a
                href="https://www.facebook.com/avishkar.realty.in"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 hover:bg-[#1877F2] text-white rounded-xl flex items-center justify-center transition-all duration-200 border border-white/10"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f text-sm"></i>
              </a>

              <a
                href="https://www.instagram.com/ajay_prajapati_1709"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] text-white rounded-xl flex items-center justify-center transition-all duration-200 border border-white/10"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram text-sm"></i>
              </a>

              <a
                href="https://wa.me/917041395595"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 hover:bg-emerald-600 text-white rounded-xl flex items-center justify-center transition-all duration-200 border border-white/10"
                aria-label="WhatsApp"
              >
                <i className="fab fa-whatsapp text-sm"></i>
              </a>

              <a
                href="https://www.linkedin.com/company/avishkar-realty-in"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 hover:bg-[#0077B5] text-white rounded-xl flex items-center justify-center transition-all duration-200 border border-white/10"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin-in text-sm"></i>
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links (2.5 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold text-[#e4c272] uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"></span>
              Quick Navigation
            </h4>

            <ul className="space-y-2.5 text-sm text-slate-300">
              {[
                { name: "Luxury Properties", url: "/properties" },
                { name: "Ahmedabad Projects", url: "/project" },
                { name: "List Your Property", url: "/list-your-property" },
                { name: "About Avishkar", url: "/about-us" },
                { name: "Market Insights & Blog", url: "/blog" },
                { name: "Consultation & Contact", url: "/contact" },
                { name: "Admin Dashboard", url: "/admin/dashboard" },
              ].map((item, i) => (
                <li key={i}>
                  <Link
                    href={item.url}
                    className="hover:text-[#e4c272] transition-colors flex items-center gap-2"
                  >
                    <i className="fas fa-angle-right text-[#d4af37] text-xs"></i>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Popular Ahmedabad Zones (2.5 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold text-[#e4c272] uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"></span>
              Prime Zones
            </h4>

            <ul className="space-y-2.5 text-sm text-slate-300">
              {[
                "SG Highway",
                "Vaishnodevi Circle",
                "Zundal & Chandkheda",
                "Gota & Vandematram",
                "Science City",
                "Bodakdev & Prahlad Nagar"
              ].map((zone, i) => (
                <li key={i}>
                  <Link
                    href={`/properties?location=${encodeURIComponent(zone)}`}
                    className="hover:text-[#e4c272] transition-colors flex items-center gap-2"
                  >
                    <i className="fas fa-map-pin text-[#d4af37] text-xs"></i>
                    <span>{zone}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Direct Contact (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold text-[#e4c272] uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"></span>
              Direct Inquiries
            </h4>

            <div className="space-y-3.5 text-xs sm:text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <i className="fas fa-map-marker-alt text-[#d4af37] mt-1 shrink-0"></i>
                <span className="leading-relaxed">
                  Status Elysium, 23, Nr. Shree Vishnudhara Gardens, Gota, Ahmedabad, Gujarat 382481
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <i className="fas fa-phone-alt text-[#d4af37] shrink-0"></i>
                <a href="tel:+917041395595" className="hover:text-[#e4c272] font-medium">
                  +91 70413 95595
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <i className="fas fa-envelope text-[#d4af37] shrink-0"></i>
                <a href="mailto:avishkarrealty1@gmail.com" className="hover:text-[#e4c272]">
                  avishkarrealty1@gmail.com
                </a>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-400">
                <span className="text-[#e4c272] font-semibold block mb-0.5">
                  <i className="fas fa-certificate mr-1"></i> RERA Compliant
                </span>
                All featured projects comply with Gujarat RERA regulations.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Glass Pill */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} Avishkar Realty. All rights reserved. Managed with integrity in Ahmedabad.
          </p>

          <div className="flex items-center gap-6">
            <Link href="/about-us" className="hover:text-[#e4c272] transition-colors">
              About Agency
            </Link>
            <Link href="/contact" className="hover:text-[#e4c272] transition-colors">
              Contact Us
            </Link>
            <Link href="/admin/dashboard" className="text-slate-400 hover:text-white transition-colors">
              <i className="fas fa-user-shield mr-1"></i> CRM Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
