// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";

// const Testimonial = () => {
//   const testimonials = [
//     {
//       name: "Yogesh Bhati",
//       role: "Villa Owner",
//       image: "https://randomuser.me/api/portraits/men/43.jpg",
//       text: "Recently i bought home in Gota through Avishkar Realty, very genuine and trust worthy place to buy property, owner and staff is very Supportive and helpful during entire process of buying property. Special thankful to Mr. Manishbhai Maheshwari for kind Support. Must visit once while buying new property through Broker.",
//     },
//     {
//       name: "Anamika Patel",
//       role: "Apartment Owner",
//       image: "https://randomuser.me/api/portraits/women/68.jpg",
//       text: "Excellent experience. Get each n every information and documents in less time. Got good deal within timeframe. Thanks a lot for your help and awesome service.",
//     },
//     {
//       name: "Chirag Maheshwary3m,",
//       role: "Commercial Investor",
//       image: "https://randomuser.me/api/portraits/men/79.jpg",
//       text: "Best experience i have ever got while purchasing property 😉❤️🙏 Nice people in office Specially Manish bhai and Ajay bhai",
//     },
//     {
//       name: "Dhruvam Gandhi",
//       role: "Home Buyer",
//       image: "https://randomuser.me/api/portraits/women/12.jpg",
//       text: "Got good deal within timeframe. Thanks a lot for your help and awesome service.",
//     },
//     {
//       name: "Sandeep Bhavsar",
//       role: "Investor",
//       image: "https://randomuser.me/api/portraits/men/55.jpg",
//       text: "Excellent approach End to end help Politely spoken On time commitment",
//     },
//     {
//       name: "Yogesh Bhati",
//       role: "Investor",
//       image: "https://randomuser.me/api/portraits/men/55.jpg",
//       text: "Recently i bought home in Gota through Avishkar Realty, very genuine and trust worthy place to buy property, owner and staff is very Supportive and helpful during entire process of buying property. Special thankful to Mr. Manishbhai Maheshwari for kind Support. Must visit once while buying new property through Broker.",
//     },
//     // {
//     //   name: "Sandeep Bhavsar",
//     //   role: "Investor",
//     //   image: "https://randomuser.me/api/portraits/men/55.jpg",
//     //   text: "Excellent approach End to end help Politely spoken On time commitment",
//     // },
//     // {
//     //   name: "Sandeep Bhavsar",
//     //   role: "Investor",
//     //   image: "https://randomuser.me/api/portraits/men/55.jpg",
//     //   text: "Excellent approach End to end help Politely spoken On time commitment",
//     // },

//   ];

//   const [itemsPerSlide, setItemsPerSlide] = useState(3);
//   const [currentSlide, setCurrentSlide] = useState(0);

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth < 1024) {
//         setItemsPerSlide(1);
//       } else {
//         setItemsPerSlide(3);
//       }
//     };

//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const totalSlides = Math.ceil(testimonials.length / itemsPerSlide);

//   const nextSlide = () => {
//     setCurrentSlide((prev) =>
//       prev >= testimonials.length - 3 ? 0 : prev + 1
//     );
//   };

//   const prevSlide = () => {
//     setCurrentSlide((prev) =>
//       prev === 0 ? testimonials.length - 3 : prev - 1
//     );
//   };

//   return (
//     <section className="py-20 bg-[#16243E]">
//       <div className="container mx-auto px-4 relative">

//         <h2 className="text-4xl font-bold text-center mb-12 text-[#e4c272] ">
//           What Our Clients Say
//         </h2>

//         {/* Slider Wrapper */}
//         <div className="overflow-hidden">
//           <div
//             className="flex gap-8 transition-transform duration-500 ease-in-out"
//             style={{
//               transform: `translateX(-${currentSlide * 33.333}%)`,
//             }}
//           >
//             {testimonials.map((testimonial, index) => (
//               <div
//                 key={index}
//                 className="bg-white p-6 rounded-xl shadow-md w-1/3 flex-shrink-0 text-center"
//               >
//                 <Image
//                   src={testimonial.image}
//                   alt={testimonial.name}
//                   width={70}
//                   height={70}
//                   className="rounded-full mx-auto mb-3 border-4 border-primary"
//                 />

//                 <div className="text-yellow-400 mb-2">
//                   {[...Array(5)].map((_, i) => (
//                     <i key={i} className="fas fa-star"></i>
//                   ))}
//                 </div>

//                 <p className="text-[#16243E] italic mb-3 text-sm">
//                   “{testimonial.text}”
//                 </p>

//                 <h4 className="text-[#16243E] p-3">{testimonial.name}</h4>
//                 <p className="text-xs text-[#16243E]">{testimonial.role}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Arrows */}
//         <button
//           onClick={prevSlide}
//           className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-3 rounded-full"
//         >
//           ❮
//         </button>

//         <button
//           onClick={nextSlide}
//           className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-3 rounded-full"
//         >
//           ❯
//         </button>

//         {/* Dots */}
//         <div className="flex justify-center mt-8 space-x-3">
//           {[...Array(totalSlides)].map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setCurrentSlide(index)}
//               className={`h-2 w-8 rounded-full transition ${currentSlide === index
//                 ? "bg-[#16243E]"
//                 : "bg-gray-400"
//                 }`}
//             ></button>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Testimonial;






"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const Testimonial = () => {
  const testimonials = [
    {
      name: "Yogesh Bhati",
      role: "Villa Owner",
      image: "https://randomuser.me/api/portraits/men/43.jpg",
      text: "Recently i bought home in Gota through Avishkar Realty, very genuine and trust worthy place to buy property.",
    },
    {
      name: "Anamika Patel",
      role: "Apartment Owner",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      text: "Excellent experience. Got every document quickly and a great deal within timeframe.",
    },
    {
      name: "Chirag Maheshwary",
      role: "Commercial Investor",
      image: "https://randomuser.me/api/portraits/men/79.jpg",
      text: "Best experience while purchasing property. Very supportive team.",
    },
    {
      name: "Dhruvam Gandhi",
      role: "Home Buyer",
      image: "https://randomuser.me/api/portraits/women/12.jpg",
      text: "Got good deal within timeframe. Thanks for your help and awesome service.",
    },
    {
      name: "Sandeep Bhavsar",
      role: "Investor",
      image: "https://randomuser.me/api/portraits/men/55.jpg",
      text: "Excellent approach, end-to-end help, polite communication and on-time commitment.",
    },
  ];

  const [itemsPerSlide, setItemsPerSlide] = useState(3);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setItemsPerSlide(1);
      } else {
        setItemsPerSlide(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev >= testimonials.length - itemsPerSlide ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? testimonials.length - itemsPerSlide : prev - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-[#16243E]">
      <div className="container mx-auto px-4 relative">

        <h2 className="text-4xl font-bold text-center mb-12 text-[#e4c272]">
          What Our Clients Say
        </h2>

        <div className="overflow-hidden">
          <div
            className="flex gap-8 transition-transform duration-500 ease-in-out pt-10"
            style={{
              transform: `translateX(-${currentSlide * (100 / itemsPerSlide)}%)`,
            }}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`relative group p-6 rounded-xl shadow-md shrink-0 text-center overflow-hidden backdrop-blur-lg bg-white/10 border border-white/20  hover:-translate-y-2 transition duration-300  ${
                  itemsPerSlide === 1 ? "w-full" : "w-1/3"
                }`}
              >
                {/* Golden Hover Background */}
                <div className="absolute bottom-0 left-0 w-full h-0 bg-linear-to-t from-[#e4c272]/70 via-[#e4c272]/40 to-transparent backdrop-blur-md transition-all duration-500 group-hover:h-full z-0"></div>

                <div className="relative z-10">

                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={70}
                    height={70}
                    className="rounded-full mx-auto mb-3 border-4 border-[#16243E] group-hover:-translate-y-2 group-hover:scale-110"
                  />

                  <div className="text-yellow-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="fas fa-star"></i>
                    ))}
                  </div>

                  <p className=" mb-3 text-sm text-white group-hover:text-[#16243E] text-800  transition-colors duration-300 text-300">
                    “{testimonial.text}”
                  </p>

                  <h4 className="p-3 text-white group-hover:text-[#16243E] transition-colors duration-300 hover:text-400 text-lg font-semibold">
                    {testimonial.name}
                  </h4>

                  {/* <p className="text-xs text-white group-hover:text-[#16243E] transition-colors duration-300">
                    {testimonial.role}
                  </p> */}

                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-3 rounded-full"
        >
          ❮
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-3 rounded-full"
        >
          ❯
        </button>
      </div>
    </section>
  );
};

export default Testimonial;
