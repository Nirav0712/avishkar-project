"use client";

import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Information from "../components/Information";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setErrorMessage("Please enter your name and phone number.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/enquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email || null,
          source: "Contact Page Form",
          interested_in: formData.subject,
          priority: "High",
          notes: `Subject: ${formData.subject}\nMessage: ${formData.message}`
        })
      });

      if (!res.ok) throw new Error("Failed to submit");
      setIsSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "General Inquiry",
        message: ""
      });
    } catch {
      setErrorMessage("Unable to save your message right now. Please reach us via WhatsApp or phone.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col">
      <Header />

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-[#0b1528] via-[#102447] to-[#0b1528] text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] opacity-15"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#e4c272] text-xs font-bold uppercase tracking-widest mb-3">
            <i className="fas fa-headset text-xs"></i>
            <span>Concierge Consultation</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Connect with <span className="gold-gradient-text">Avishkar Realty</span>
          </h1>
          <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-xl mx-auto font-light">
            Whether you seek a luxury family home, a high-yield commercial asset, or verified market advice in Ahmedabad, our specialists are at your service.
          </p>
        </div>
      </section>

      {/* Contact Grid Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-14 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Contact Details & Info Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-3xl p-8 shadow-sm">
              <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider block mb-1">
                Headquarters
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-4">
                Visit Our Office
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 font-light">
                Located conveniently in Gota, Ahmedabad. Meet our senior property advisors for personalized project portfolios and legal document review.
              </p>

              <div className="space-y-5 text-xs sm:text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#d4af37] flex items-center justify-center shrink-0 text-base">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">Address</span>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">
                      Status Elysium, 23, Nr. Shree Vishnudhara Gardens, Gota, Ahmedabad, Gujarat 382481
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#d4af37] flex items-center justify-center shrink-0 text-base">
                    <i className="fas fa-phone-alt"></i>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">Direct Phone</span>
                    <a href="tel:+917041395595" className="text-slate-600 hover:text-[#d4af37] block mt-0.5 font-medium">
                      +91 70413 95595
                    </a>
                    <a href="tel:+919825029913" className="text-slate-600 hover:text-[#d4af37] block text-xs">
                      +91 98250 29913
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#d4af37] flex items-center justify-center shrink-0 text-base">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">Email Correspondence</span>
                    <a href="mailto:avishkarrealty1@gmail.com" className="text-slate-600 hover:text-[#d4af37] block mt-0.5">
                      avishkarrealty1@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#d4af37] flex items-center justify-center shrink-0 text-base">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">Business Hours</span>
                    <p className="text-slate-600 mt-0.5">Monday – Sunday: 9:30 AM – 7:30 PM</p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Action Button */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <a
                  href="https://wa.me/917041395595?text=Hello%20Avishkar%20Realty,%20I%20am%20interested%20in%20consulting%20regarding%20Ahmedabad%20properties."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wide transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <i className="fab fa-whatsapp text-base"></i>
                  <span>Chat Directly on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* CRM Connected Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white/90 backdrop-blur-xl border border-white/80 rounded-3xl p-8 sm:p-10 shadow-xl">
              <div className="mb-6">
                <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider block mb-1">
                  Online Inquiry Form
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Send Us a Direct Message
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Enquiries are immediately logged into our CRM system and assigned to a specialized executive.
                </p>
              </div>

              {isSuccess ? (
                <div className="p-8 text-center bg-emerald-50 border border-emerald-200 rounded-2xl animate-in fade-in">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                    <i className="fas fa-check"></i>
                  </div>
                  <h3 className="text-xl font-bold text-emerald-900">Message Received & Logged!</h3>
                  <p className="text-xs sm:text-sm text-emerald-700 mt-2 max-w-md mx-auto">
                    Your request has been successfully recorded in our CRM. A representative from Avishkar Realty will contact you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSuccess(false)}
                    className="mt-6 px-6 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  {errorMessage && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
                      {errorMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="e.g. Ketan Shah"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#d4af37] text-sm"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Phone Number (WhatsApp) *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#d4af37] text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="ketan@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#d4af37] text-sm"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Subject / Requirement</label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#d4af37] text-sm cursor-pointer"
                      >
                        <option value="Buy Residential Property">Buy Residential Property (2/3/4 BHK)</option>
                        <option value="Commercial Investment">Commercial / Office Space</option>
                        <option value="New Project Consultation">New Project Consultation</option>
                        <option value="Sell or Lease Property">Sell or Lease a Property</option>
                        <option value="General Inquiry">General Consultation</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Your Message & Requirements</label>
                    <textarea
                      name="message"
                      rows={4}
                      placeholder="Please share details such as preferred location, budget, or specific project name..."
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#d4af37] text-sm resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-xl bg-[#0b1528] hover:bg-[#162544] text-[#e4c272] font-bold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i>
                          <span>Connecting to CRM...</span>
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane"></i>
                          <span>Submit Official Inquiry</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Embedded Interactive Map */}
        <div className="mt-14 rounded-3xl overflow-hidden shadow-lg border border-slate-200 h-96 relative">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3670.364239851722!2d72.53521627589943!3d23.083758314055273!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e83a435091437%3A0x932f0cf445bf9686!2sAvishkar%20realty!5e0!3m2!1sen!2sin!4v1743513344603!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Avishkar Realty Office Location"
          ></iframe>
        </div>
      </main>

      <Information />
      <Footer />
    </div>
  );
}
