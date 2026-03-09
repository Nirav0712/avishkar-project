"use client";

import React from "react";

const Information = () => {
  return (
    <section className="py-20 bg-[#16243E]">
      <div className="bg-[#FFF8F2] max-w-6xl w-full rounded-3xl p-6 md:p-8 mt-10 mx-auto px-6 md:pr-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">

          {/* ADDRESS */}
          <div className="flex items-start gap-4">
            <div className="bg-white w-25 h-12 rounded-full flex items-center justify-center text-[#0f1e3d] text-xl shadow">
              <i className="fas fa-map-marker-alt text-lg"></i>
            </div>
            <div>
              <h3 className="text-[#0f1e3d] font-semibold text-lg">
                Address
              </h3>
              <p className="text-gray-700 mt-1 text-sm leading-relaxed">
                <a href="https://www.google.com/maps/place/Status+Elysium,+23,+Road,+nr.+Shree+Vishnudhara+Gardens,+Gota,+Ahmedabad,+Gujarat+382481" target="_blank" rel="noopener noreferrer" className="text-[#0f1e3d] hover:underline">
                  Status Elysium, 23, Road, nr. Shree Vishnudhara Gardens,
                  Gota, Ahmedabad, Gujarat 382481
                </a>
              </p>
            </div>
          </div>

          {/* EMAIL */}
          <div className="flex items-start gap-4">
            <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center text-[#0f1e3d] text-xl shadow">
              <i className="fa fa-envelope"></i>
            </div>
            <div>
              <h3 className="text-[#0f1e3d] font-semibold text-lg">
                Send Email
              </h3>
              <p className="text-gray-700 mt-1 text-sm">
                <a href="mailto:avishkarrealty1@gmail.com" className="text-[#0f1e3d] hover:underline ">
                  avishkarrealty1@gmail.com
                </a>
              </p>
            </div>
          </div>

          {/* PHONE */}
          <div className="flex items-start gap-4">
            <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center text-[#0f1e3d] text-xl shadow">
              <i className="fa fa-phone"></i>
            </div>
            <div>
              <h3 className="text-[#0f1e3d] font-semibold text-lg">
                Call
              </h3>
              <p className="text-gray-700 mt-1 text-sm hover:underline">
                <a href="tel:+917041395595" className="text-[#0f1e3d] hover:underline">
                  +91 70413 95595
                </a>
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Information;
