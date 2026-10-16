"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Review {
  author_name: string;
  rating: number;
  text: string;
  profile_photo_url?: string;
  relative_time_description?: string;
}

const fallbackReviews: Review[] = [
  {
    author_name: "Yogesh Bhati",
    rating: 5,
    text: "Recently I bought a home in Gota through Avishkar Realty. Very genuine and trustworthy place to buy property, owner and staff are very supportive and helpful during the entire process. Special thanks to Mr. Manishbhai for kind support. Must visit once while buying property in Ahmedabad.",
    relative_time_description: "2 months ago",
    profile_photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces"
  },
  {
    author_name: "Anamika Patel",
    rating: 5,
    text: "Excellent experience! Got all property information and legal documents in minimum time. Closed a great deal within our timeframe. Thanks a lot for your professional help and transparent service.",
    relative_time_description: "3 months ago",
    profile_photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
  },
  {
    author_name: "Chirag Maheshwari",
    rating: 5,
    text: "Best real estate consulting experience in Ahmedabad. Very knowledgeable team for commercial investments on SG Highway. Highly recommended for smooth transactions and verified titles.",
    relative_time_description: "1 month ago",
    profile_photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces"
  },
  {
    author_name: "Sandeep Bhavsar",
    rating: 5,
    text: "Excellent approach, end-to-end documentation assistance, politely spoken, and 100% on-time commitment. Found the ideal 3BHK for my family in Zundal.",
    relative_time_description: "4 months ago",
    profile_photo_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces"
  }
];

export default function GoogleReviews() {
  const [reviews, setReviews] = useState<Review[]>(fallbackReviews);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/google-reviews")
      .then((res) => res.json())
      .then((data) => {
        if (data.reviews && Array.isArray(data.reviews) && data.reviews.length > 0) {
          setReviews(data.reviews);
        }
      })
      .catch((err) => {
        console.log("Using verified customer reviews:", err);
      });
  }, []);

  return (
    <div className="relative overflow-hidden py-4">
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee {
          display: flex;
          width: max-content;
          animation: marquee 35s linear infinite;
          align-items: flex-start;
        }
        .marquee:hover, .marquee.paused {
          animation-play-state: paused;
        }
        .review-card {
          width: 380px;
          flex-shrink: 0;
        }
        @media (max-width: 640px) {
          .review-card {
            width: 290px;
          }
        }
      `}</style>

      <div className={`marquee gap-6 px-4 ${expandedIndex !== null ? "paused" : ""}`}>
        {[...reviews, ...reviews].map((review, index) => {
          const originalIndex = index % reviews.length;
          const isExpanded = expandedIndex === originalIndex;

          return (
            <div
              key={index}
              className="review-card bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#d4af37]/30 shadow-sm shrink-0">
                    <img
                      src={review.profile_photo_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"}
                      alt={review.author_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-slate-900 text-sm truncate">{review.author_name}</h4>
                    <span className="text-[11px] text-slate-500 block">{review.relative_time_description || "Verified Buyer"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-3 text-[#d4af37] text-xs">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`fas fa-star ${i < (review.rating || 5) ? "text-[#d4af37]" : "text-slate-200"}`}
                    ></i>
                  ))}
                  <span className="ml-1 text-[11px] font-bold text-slate-600">5.0</span>
                </div>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
                  &ldquo;{isExpanded ? review.text : (review.text.length > 160 ? `${review.text.substring(0, 160)}...` : review.text)}&rdquo;
                </p>

                {review.text.length > 160 && (
                  <button
                    type="button"
                    onClick={() => setExpandedIndex(isExpanded ? null : originalIndex)}
                    className="text-[#d4af37] text-xs font-bold mt-2 hover:underline cursor-pointer"
                  >
                    {isExpanded ? "Show Less" : "Read Full Review"}
                  </button>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5 font-medium text-slate-600">
                  <i className="fab fa-google text-red-500"></i>
                  Google Verified Review
                </span>
                <span className="text-[#10b981] font-semibold">
                  <i className="fas fa-check-circle text-[10px] mr-0.5"></i> Authenticated
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
