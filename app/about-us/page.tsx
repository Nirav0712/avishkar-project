"use client";

import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Testimonial from "../components/Testimonial";
import Facilities from "../components/Facilities";
import Achivement from "../components/Achivement";
import Partner from "../components/Partner";
import PropertyShowCase from "../components/PropertyShowCase";
import Link from "next/link";
import Information from "../components/Information";
import GoogleReviews from "../components/GoogleReviews";

export default function AboutPage() {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
      <Header />
      {/* Hero Section */}
      <section className="bg-[#162544] py-8 md:py-12 ">
        <div className="container mx-auto px-4 md:px-6">

          <div className="relative rounded-2xl overflow-hidden h-[250px] md:h-[400px] mb-10">

            {/* Background Image */}
            <Image
              src="/images/About/AboutBg.jpg"
              alt="About Page"
              width={1600}
              height={600}
              className="w-full h-full object-cover"
            />

            {/* Dark Overlay */}
            {/* <div className="absolute inset-0 bg-black/50"></div> */}

            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">

              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                About Page
              </h1>

              {/* Breadcrumb */}
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full text-sm md:text-base">
                <Link href="/" className="hover:text-orange-400 transition">
                  Home
                </Link>
                <span>/</span>
                <span className="text-orange-400">About Page</span>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* Meet Our Founder Section */}
      {/* <section className="py-20 bg-white relative w-80% mx-auto">
        <div className="container mx-auto px-4 -mt-30 ">
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg ">
       
            <div className="grid md:grid-cols-2 items-center h-175">
   
              <div className="relative h-175">
                <Image
                  src="/images/team/Founder1.jpg"
                  alt="Founder"
                  fill
                  className="object-cover"
                />
              </div>

          
              <div className="p-10">
                <p className="text-orange-600 font-semibold mb-3">
                  Meet Our Founder
                </p>
                <h2 className="text-5xl font-bold text-[#16243E] mb-10 ">
               Ajay Prajapati
                </h2>
                <p className="text-gray-500 leading-relaxed mb-4 line-height-50 word-spacing-2">
                  The foundation of Avishkar Realty was laid by a visionary
                  leader with a deep passion for real estate and a commitment to
                  delivering excellence. With years of experience in property
                  consulting, investments, and project management, our founder
                  has built a trusted brand that prioritizes transparency,
                  innovation, and client satisfaction.
                </p>
                <p className="text-gray-500 leading-relaxed line-height-50 word-spacing-2">
                  Driven by the belief that real estate is not just about
                  property but about creating long-term value, our founder
                  ensures every deal is built on trust, integrity, and results.
                </p>
              </div>
            </div>

      
            <div className="grid md:grid-cols-2 items-center h-175">
             
              <div className="p-10 order-2 md:order-1">
                <p className="text-orange-600 font-semibold mb-3">
                  Meet Our Founder
                </p>
                <h2 className="text-5xl font-bold text-[#16243E] mb-10 ">
              Dashrathbhai Prajapati
                </h2>
                <p className="text-gray-500 leading-relaxed line-height-50 word-spacing-2 mb-4">
                  Our founder continues to guide the company with strategic
                  insight and a client-first approach — ensuring that every real
                  estate transaction delivers exceptional value and long-term
                  success.
                </p>
                <p className="text-gray-500 leading-relaxed line-height-50 word-spacing-2">
                  With a strong focus on integrity and innovation, we aim to
                  redefine the property experience for buyers, sellers, and
                  investors alike.
                </p>
              </div>

          
              <div className="relative h-175 order-1 md:order-2">
                <Image
                  src="/images/team/Founder2.jpg" // replace with your second image
                  alt="Founder"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section> */}

      <section className="py-12 md:py-20 bg-white relative w-[95%] md:w-[80%] mx-auto">
        <div className="container mx-auto px-4 ">
          <div className="bg-white rounded-2xl overflow-hidden  ">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-16 items-center mb-16 md:mb-24">
              <div className="relative w-full h-[350px] md:h-[500px] rounded-2xl overflow-hidden border-2 border-[#e4c272] shadow-xl group transform transition duration-500 hover:-translate-y-3">
                <Image
                  src="/images/team/Founder1.jpg"
                  alt="Founder"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-6 md:p-12 lg:p-16">
                <p className="text-[#e4c272] font-bold mb-3">
                  Meet Our Founder
                </p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#16243E] mb-6">
                  Ajay Prajapati
                </h2>
                <p className="text-gray-500 leading-relaxed mb-4 text-base md:text-lg lg:text-xl">
                  The foundation of Avishkar Realty was laid by a visionary leader with a deep passion for real estate and a commitment to delivering excellence. With years of experience in property consulting, investments, and project management, our founder has built a trusted brand that prioritizes transparency, innovation, and client satisfaction.
                </p>
                <p className="text-gray-500 leading-relaxed text-base md:text-lg lg:text-xl">
                  Driven by the belief that real estate is not just about property but about creating long-term value, our founder ensures every deal is built on trust, integrity, and results.
                </p>
              </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-16 items-center">
              <div className="p-6 md:p-12 lg:p-16 order-2 md:order-1">
                <p className="text-[#e4c272] font-bold mb-3">
                  Meet Our Founder
                </p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#16243E] mb-6">
                  Dashrathbhai Prajapati
                </h2>
                <p className="text-gray-500 leading-relaxed mb-4 text-base md:text-lg lg:text-xl">
                  Our founder continues to guide the company with strategic insight and a client-first approach — ensuring that every real estate transaction delivers exceptional value and long-term success.
                </p>
                <p className="text-gray-500 leading-relaxed text-base md:text-lg lg:text-xl">
                  With a strong focus on integrity and innovation, we aim to redefine the property experience for buyers, sellers, and investors alike.
                </p>
              </div>
              <div className="relative w-full h-[350px] md:h-[500px] order-1 md:order-2 rounded-2xl overflow-hidden border-2 border-[#e4c272] shadow-xl group transform transition duration-500 hover:-translate-y-3">
                <Image
                  src="/images/team/Founder2.jpg"
                  alt="Founder"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </div>
          </div>
        </div>
      </section>




      {/* our partners */}
      <Partner />


      {/* Achivement section */}
      <Achivement />


      {/* property showcase */}
      <PropertyShowCase />





      {/* Stats */}
      <section className="pt-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#0f1e3d] mb-4">
              Our Achievements
            </h2>
            <p className="text-xl text-gray-600">
              Numbers that speak for themselves
            </p>
          </div>

          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center place-items-center">
                <div className='w-28 h-28 sm:w-32 sm:h-32 md:w-44 md:h-44 rounded-full p-4 md:p-8 bg-white shadow-xl flex flex-col items-center justify-center text-center border-2 border-[#0f1e3d] hover:scale-110 transition-transform duration-300 cursor-pointer'>
                  <div className="text-2xl md:text-5xl font-bold text-[#0f1e3d] mb-1">5K+</div>
                  <div className="text-[10px] md:text-sm text-gray-600 uppercase tracking-wider">Properties Sold</div>
                </div>
                <div className='w-28 h-28 sm:w-32 sm:h-32 md:w-44 md:h-44 rounded-full p-4 md:p-8 bg-white shadow-xl flex flex-col items-center justify-center text-center border-2 border-[#0f1e3d] hover:scale-110 transition-transform duration-300 cursor-pointer'>
                  <div className="text-2xl md:text-5xl font-bold text-[#0f1e3d] mb-1">2500</div>
                  <div className="text-[10px] md:text-sm text-gray-600 uppercase tracking-wider">Happy Customers</div>
                </div>
                <div className='w-28 h-28 sm:w-32 sm:h-32 md:w-44 md:h-44 rounded-full p-4 md:p-8 bg-white shadow-xl flex flex-col items-center justify-center text-center border-2 border-[#0f1e3d] hover:scale-110 transition-transform duration-300 cursor-pointer'>
                  <div className="text-2xl md:text-5xl font-bold text-[#0f1e3d] mb-1">12+</div>
                  <div className="text-[10px] md:text-sm text-gray-600 uppercase tracking-wider">Years Experience</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      {/* <Testimonial /> */}
      <h2 className="text-4xl font-bold text-[#e4c272] mb-4 text-center mt-10">Google Reviews</h2>
      <GoogleReviews />

      <Facilities />

      {/* Call to Action */}
      <Information />

      <Footer />
    </>
  );
}
