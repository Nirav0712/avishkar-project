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

export default function AboutPage() {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
      <Header />
      {/* Hero Section */}
      <section className="bg-[#162544] py-12 ">
      <div className="container mx-auto px-6">

        <div className="relative rounded-2xl overflow-hidden h-67.5  mb-10">

          {/* Background Image */}
          <Image
            src="/images/About/AboutBg.jpg" 
            alt="About Page"
            width={1600}
            height={600}
            className="w-full h-87.5 md:h-112.5 object-cover"
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
      <section className="py-20 bg-gray-100 relative w-80% mx-auto">
        <div className="container mx-auto px-4 -mt-30 ">
          <div className="bg-[#FFF8F2] rounded-2xl overflow-hidden shadow-lg border border-orange-600">
            {/* Row 1 */}
            <div className="grid md:grid-cols-2 items-center h-175">
              {/* Left Image */}
              <div className="relative h-175">
                <Image
                  src="/images/team/Founder1.jpg"
                  alt="Founder"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Right Content */}
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

            {/* Row 2 (Reversed Layout) */}
            <div className="grid md:grid-cols-2 items-center h-175">
              {/* Left Content */}
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

              {/* Right Image */}
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
      </section>

       {/* our partners */}
      <Partner />


      {/* Achivement section */}
      <Achivement />


    {/* property showcase */}
     <PropertyShowCase />




      {/* Our Story */}
      {/* <section className="py-20 bg-[#16243E]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-secondary mb-6">
                Our Story
              </h2>
              <p className="text-white leading-relaxed mb-4">
                Founded in 2008, VeerRealEstate has grown from a small local
                real estate agency to one of the most trusted property platforms
                in the country. Our journey began with a simple mission: to make
                property buying and renting accessible, transparent, and
                stress-free for everyone.
              </p>
              <p className="text-white leading-relaxed mb-4">
                Over the years, we've helped thousands of families find their
                dream homes, investors discover lucrative opportunities, and
                property owners connect with the right buyers and tenants.
              </p>
              <p className="text-white leading-relaxed">
                Today, we're proud to offer a comprehensive platform that
                combines cutting-edge technology with personalized service,
                making your property journey smooth and successful.
              </p>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"
                alt="About VeerRealEstate"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section> */}
      {/* Stats */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-secondary mb-4">
              Our Achievements
            </h2>
            <p className="text-xl text-gray-600">
              Numbers that speak for themselves
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-primary mb-2">
                10K+
              </div>
              <div className="text-gray-600 text-lg">Properties Sold</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-primary mb-2">
                5K+
              </div>
              <div className="text-gray-600 text-lg">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-primary mb-2">
                500+
              </div>
              <div className="text-gray-600 text-lg">Expert Agents</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-primary mb-2">
                15+
              </div>
              <div className="text-gray-600 text-lg">Years Experience</div>
            </div>
          </div>
        </div>
      </section>
      {/* Our Values */}
      {/* <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-secondary mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                <i className="fas fa-shield-alt text-4xl text-primary"></i>
              </div>
              <h3 className="text-2xl font-semibold text-secondary mb-4">
                Trust & Integrity
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We believe in complete transparency and honesty in all our
                dealings, building lasting relationships based on trust.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                <i className="fas fa-star text-4xl text-primary"></i>
              </div>
              <h3 className="text-2xl font-semibold text-secondary mb-4">
                Excellence
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We strive for excellence in every interaction, ensuring our
                clients receive the highest quality service at all times.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                <i className="fas fa-users text-4xl text-primary"></i>
              </div>
              <h3 className="text-2xl font-semibold text-secondary mb-4">
                Customer First
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Your needs and satisfaction are our top priority. We go the
                extra mile to ensure you find exactly what you're looking for.
              </p>
            </div>
          </div>
        </div>
      </section> */}
      {/* Our Team */}
      {/* <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-secondary mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600">
              Dedicated professionals committed to your success
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Vikram Malhotra",
                role: "CEO & Founder",
                image: "https://randomuser.me/api/portraits/men/51.jpg",
              },
              {
                name: "Anjali Deshmukh",
                role: "Head of Sales",
                image: "https://randomuser.me/api/portraits/women/72.jpg",
              },
              {
                name: "Arjun Nair",
                role: "Chief Operations Officer",
                image: "https://randomuser.me/api/portraits/men/62.jpg",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm overflow-hidden text-center"
              >
                <div className="relative h-72">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-secondary mb-1">
                    {member.name}
                  </h3>
                  <p className="text-gray-600">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      <Testimonial />
      <Facilities />

      {/* Call to Action */}
     <Information />
     
      <Footer />
    </>
  );
}
