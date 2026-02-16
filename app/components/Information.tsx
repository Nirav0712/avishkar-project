"use client";

import React from "react";

const Information = () => {
  return (
    <section className="py-20 bg-[#16243E]">
      <div className="bg-[#FFF8F2] max-w-6xl w-full rounded-3xl p-6 md:p-8 mt-10 mx-auto px-6 md:pr-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">

          {/* ADDRESS */}
          <div className="flex items-start gap-4">
            <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center text-orange-600 text-xl shadow">
              📍
            </div>
            <div>
              <h3 className="text-orange-600 font-semibold text-lg">
                Address
              </h3>
              <p className="text-gray-700 mt-1 text-sm leading-relaxed">
                Status Elysium, 23, Road, nr. Shree Vishnudhara Gardens,
                Gota, Ahmedabad, Gujarat 382481
              </p>
            </div>
          </div>

          {/* EMAIL */}
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

          {/* PHONE */}
          <div className="flex items-start gap-4">
            <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center text-orange-600 text-xl shadow">
              📞
            </div>
            <div>
              <h3 className="text-orange-600 font-semibold text-lg">
                Call Emergency
              </h3>
              <p className="text-gray-700 mt-1 text-sm">
                +91 70413 95595
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Information;
