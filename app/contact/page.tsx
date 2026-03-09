'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Information from '../components/Information';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for contacting us! We\'ll get back to you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      <Header />

      {/* Hero Section */}
      {/* <section className="relative bg-linear-to-br from-secondary to-secondary-light text-white py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">Get In Touch</h1>
                        <p className="text-xl md:text-2xl opacity-95">
                            Have questions? We're here to help you find your dream property
                        </p>
                    </div>
                </div>
            </section> */}
      <section className="relative">

        {/* 🔥 Map Background */}
        <div className="h-125 w-full">
          <iframe
            src="https://www.google.com/maps?q=Status+Elysium,+23+Road,+Shree+Vishnudhara+Gardens,+Gota,+Ahmedabad,+Gujarat+382481&output=embed"
            className="w-full h-full"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ahmedabad Location Map"
          />
        </div>


        {/* 🔥 Cards Section (Overlapping Map) */}
        <div className="relative -mt-32 pb-24">
          <div className="max-w-337.5 mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

              {/* Card 1 - Our Address */}
              <div className="bg-[#efefef] rounded-2xl p-10 text-center shadow-lg h-75 flex flex-col justify-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-[#0f1e3d] flex items-center justify-center">
                  <i className="fas fa-map-marker-alt text-[#e4c272] text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-[#1f2d3d] mb-3">
                  Our Address
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Status Elysium, 23, Road, nr. Shree Vishnudhara Gardens,
                  Gota, Ahmedabad, Gujarat 382481
                </p>
              </div>

              {/* Card 2 - Email */}
              <div className="bg-[#efefef] rounded-2xl p-10 text-center shadow-lg h-75 flex flex-col justify-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-[#0f1e3d] flex items-center justify-center">
                  <i className="fas fa-envelope text-[#e4c272] text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-[#1f2d3d] mb-3">
                  avishkarrealty1@gmail.com
                </h3>
                <p className="text-gray-600 text-sm">
                  Email us anytime for any kind of query.
                </p>
              </div>

              {/* Card 3 - Phone */}
              <div className="bg-[#efefef] rounded-2xl p-10 text-center shadow-lg h-75 flex flex-col justify-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-[#0f1e3d] flex items-center justify-center">
                  <i className="fas fa-phone text-[#e4c272] text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-[#1f2d3d] mb-3">
                  +91 70413 95595
                </h3>
                <p className="text-gray-600 text-sm">
                  24/7/365 priority Live Chat and ticketing support.
                </p>
              </div>

              {/* Card 4 - Opening Hour */}
              <div className="bg-[#efefef] rounded-2xl p-10 text-center shadow-lg h-75 flex flex-col justify-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-[#0f1e3d] flex items-center justify-center">
                  <i className="fas fa-clock text-[#e4c272] text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-[#1f2d3d] mb-3">
                  Opening Hour
                </h3>
                <p className="text-gray-600 text-sm">
                  Monday - Sunday : 10 AM - 7 PM
                </p>
              </div>

            </div>
          </div>
        </div>

      </section>



      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-bold text-[#0f1e3d] mb-8">Contact Information</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#e4c272]/30 rounded-lg flex items-center justify-center shrink-0">
                    <i className="fas fa-map-marker-alt text-[#e4c272] text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0f1e3d] mb-1">Our Office</h3>
                    <p className="text-gray-600">  Status Elysium, 23, Road, nr. Shree Vishnudhara Gardens, Gota,
                      Ahmedabad, Gujarat 382481</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#e4c272]/30 rounded-lg flex items-center justify-center shrink-0">
                    <i className="fas fa-phone text-[#e4c272] text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0f1e3d] mb-1">Phone</h3>
                    <p className="text-gray-600">+91 70413 95595</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#e4c272]/30 rounded-lg flex items-center justify-center shrink-0">
                    <i className="fas fa-envelope text-[#e4c272] text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0f1e3d] mb-1">Email</h3>
                    <p className="text-gray-600">avishkarrealty1@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#e4c272]/30 rounded-lg flex items-center justify-center shrink-0">
                    <i className="fas fa-clock text-[#e4c272] text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0f1e3d] mb-1">Business Hours</h3>
                    <p className="text-gray-600">
                      Mon - Fri: 9:00 AM - 6:00 PM<br />
                      Sat: 10:00 AM - 4:00 PM<br />
                      Sun: Closed
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="mt-8">
                <h3 className="font-semibold text-secondary mb-4">Follow Us</h3>
                <div className="flex gap-3">
                  <a href="https://www.facebook.com/avishkar.realty.in?mibextid=wwXIfr&rdid=25JQj9cHJt68kr8F&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1AjAyp2oT2%2F%3Fmibextid%3DwwXIfr#" className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  {/* <a href="#" className="w-10 h-10 bg-blue-400 text-white rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors">
                                        <i className="fab fa-twitter"></i>
                                    </a> */}
                  <a href="https://www.instagram.com/ajay_prajapati_1709?igsh=YXZyOGhkdzR0NGkw&utm_source=qr" className="w-10 h-10 bg-pink-600 text-white rounded-lg flex items-center justify-center hover:bg-pink-700 transition-colors">
                    <i className="fab fa-instagram"></i>
                  </a>
                  {/* <a href="#" className="w-10 h-10 bg-blue-700 text-white rounded-lg flex items-center justify-center hover:bg-blue-800 transition-colors">
                                        <i className="fab fa-linkedin-in"></i>
                                    </a> */}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h2 className="text-3xl font-bold text-[#0f1e3d] mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e4c272] focus:ring-2 focus:ring-[#e4c272]"
                        placeholder="Rajesh Kumar"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e4c272] focus:ring-2 focus:ring-[#e4c272]"
                        placeholder="rajesh@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e4c272] focus:ring-2 focus:ring-[#e4c272]"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e4c272] focus:ring-2 focus:ring-[#e4c272]"
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="buying">Buying a Property</option>
                        <option value="selling">Selling a Property</option>
                        <option value="renting">Renting a Property</option>
                        <option value="support">Support</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e4c272] focus:ring-2 focus:ring-[#e4c272]"
                      placeholder="Tell us how we can help you..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#e4c272] text-[#0f1e3d] border border-[#0f1e3d] px-8 py-4 rounded-lg font-semibold hover:bg-[#0f1e3d] hover:text-[#e4c272] transition-colors text-lg"
                  >
                    <i className="fas fa-paper-plane mr-2"></i>
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>  
      </section>

      {/* Map Section */}
      {/* <section className="py-20 bg-[#16243E]">
            
      <div className="bg-[#FFF8F2] max-w-6xl w-full rounded-3xl p-8 mt-10 mx-auto pr-20">
        <div className="grid md:grid-cols-3 gap-10 items-center bg ">
          <div className="flex items-start gap-4">
            <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center text-orange-600 text-xl shadow">
              📍
            </div>
            <div>
              <h3 className="text-orange-600 font-semibold text-lg">Address</h3>
              <p className="text-gray-700 mt-1 text-sm leading-relaxed">
                Status Elysium, 23, Road, nr. Shree Vishnudhara Gardens, Gota,
                Ahmedabad, Gujarat 382481
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center text-orange-600 text-xl shadow">
              ✉
            </div>
            <div>
              <h3 className="text-orange-600 font-semibold text-lg">
                Send Email
              </h3>
              <p className="text-gray-700 mt-1 text-sm">
                avishkarrealty1@gmail.com
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center text-orange-600 text-xl shadow">
              📞
            </div>
            <div>
              <h3 className="text-orange-600 font-semibold text-lg">
                Call
              </h3>
              <p className="text-gray-700 mt-1 text-sm">+91 70413 95595</p>
            </div>
          </div>
        </div>
      </div>
            </section> */}

      <Information />
      <Footer />
    </>
  );
}
