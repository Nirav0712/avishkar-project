"use client";

import { useState } from "react";

interface CallingButtonProps {
  phoneNumber: string;
}

const CallingButton = ({ phoneNumber }: CallingButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const cleanedNumber = phoneNumber.replace(/[^\d+]/g, "");

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3">

      {/* Tooltip */}
      {isHovered && (
        <div className="absolute -top-10 left-0 bg-gray-900 text-white px-3 py-1 rounded text-sm shadow-lg">
          tel:{cleanedNumber}
        </div>
      )}

      {/* Phone Icon */}
      <a
        href={`tel:${cleanedNumber}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 
          19.79 19.79 0 0 1-8.63-3.07 
          19.5 19.5 0 0 1-6-6 
          19.79 19.79 0 0 1-3.07-8.67 
          A2 2 0 0 1 4.11 2h3 
          a2 2 0 0 1 2 1.72 
          12.84 12.84 0 0 0 .7 2.81 
          2 2 0 0 1-.45 2.11L8.09 9.91 
          a16 16 0 0 0 6 6 
          l1.27-1.27 
          a2 2 0 0 1 2.11-.45 
          12.84 12.84 0 0 0 2.81.7 
          A2 2 0 0 1 22 16.92z"/>
        </svg>
      </a>

      {/* Enquire Button */}
      <a
        href={`tel:${cleanedNumber}`}
        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded-full shadow-md text-sm font-medium"
      >
        Enquire Now
      </a>

    </div>
  );
};

export default CallingButton;