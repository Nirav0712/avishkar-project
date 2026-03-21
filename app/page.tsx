"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PropertyCard from "./components/PropertyCard";
import { getProperties, formatPrice, type Property } from "@/lib/properties";
import Testimonial from "./components/Testimonial";
import PropertyShowCase from "./components/PropertyShowCase";
import Partner from "./components/Partner";
import Information from "./components/Information";
import Facilities from "./components/Facilities";
import React from 'react';
import Projects from "./components/Projects";
import OurPartner from "./components/OurPartner";
import Logospin from "./components/Logospin";
import HeroSection from "./components/HeroSection";
import styled from 'styled-components';
import GoogleReviews from "./components/GoogleReviews";

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchStatus, setSearchStatus] = useState<string>("For Sale");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/properties');
        if (response.ok) {
          const data = await response.json();
          const validData = data.map((p: any) => ({
            ...p,
            featured: p.featured === 1 || p.featured === true,
            price: Number(p.price) || 0,
            bedrooms: Number(p.bedrooms) || 0,
            bathrooms: Number(p.bathrooms) || 0,
            area: Number(p.area) || 0,
            image: p.image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
          }));
          console.log("Fetched database properties:", validData);
          setProperties(validData);
        } else {
          // fallback to localStorage or dummy data if API fails
          const allProperties = getProperties();
          setProperties(allProperties);
        }
      } catch (error) {
        console.error("Failed to fetch properties from DB:", error);
        const allProperties = getProperties();
        setProperties(allProperties);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProperties();
  }, []);

  const featuredProperties = properties.filter((p) => p.featured).slice(0, 6);
  // const displayedProperties =
  //   activeTab === "all"
  //     ? featuredProperties
  //     : featuredProperties.filter((p) => p.type === activeTab) || featuredProperties.filter((p) => p.category === activeTab);
  const displayedProperties = properties.filter((property) => {
    if (activeTab === "all") return true;

    return (
      property.type === activeTab ||
      property.category === activeTab
    );
  });

  // Get one random property for each requirement category
  const requirementProperties = useMemo(() => {
    const categories = ["Commercial", "Industrial", "Residential"];
    return categories.map(cat => {
      const catProps = properties.filter(p => p.category === cat);
      if (catProps.length === 0) return null;
      return catProps[Math.floor(Math.random() * catProps.length)];
    }).filter(p => p !== null) as Property[];
  }, [properties]);

  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams();
    params.set("category", category);
    window.location.href = `/properties?${params.toString()}`;
  };

  const handleLocationClick = (location: string) => {
    const params = new URLSearchParams();
    params.set("location", location);
    window.location.href = `/properties?${params.toString()}`;
  };

  const services = [
    {
      title: "Retail space Leasing",
      icon: "https://cdn-icons-png.flaticon.com/512/1995/1995574.png",
      description: "Premium retail locations for your business growth."
    },
    {
      title: "Property Management",
      icon: "https://cdn-icons-png.flaticon.com/512/1534/1534959.png",
      description: "Professional management for your valuable assets."
    },
    {
      title: "Interior Designing",
      icon: "https://cdn-icons-png.flaticon.com/512/942/942748.png",
      description: "Transforming spaces into beautiful, functional homes."
    },
    {
      title: "Consultancy & Research",
      icon: "https://cdn-icons-png.flaticon.com/512/1995/1995485.png",
      description: "Expert market insights for informed property decisions."
    },
    {
      title: "Corporate Space Leasing",
      icon: "https://cdn-icons-png.flaticon.com/512/1040/1040230.png",
      description: "Strategically located offices for modern enterprises."
    },
    {
      title: "Legal Advice & Document",
      icon: "https://cdn-icons-png.flaticon.com/512/2991/2991148.png",
      description: "Hassle-free legal support for all property matters."
    },
    {
      title: "Investment in Rented Prop",
      icon: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      description: "Secure investments with guaranteed rental returns."
    },
    {
      title: "Loan Against Property",
      icon: "https://cdn-icons-png.flaticon.com/512/2965/2965879.png",
      description: "Financial solutions tailored to your property value."
    }
  ];

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams();

    params.set("status", searchStatus);
    if (formData.get("location"))
      params.set("location", formData.get("location") as string);
    if (formData.get("type") !== "all")
      params.set("type", formData.get("type") as string);
    if (formData.get("bedrooms") !== "all")
      params.set("bedrooms", formData.get("bedrooms") as string);

    window.location.href = `/properties?${params.toString()}`;
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />

      <Header />


      {/* Hero Section with Auto-Scrolling Background */}
      <HeroSection />


      {/* our partners */}
      <Partner />


      {/* Featured Properties */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-[#0f1e3d] mb-4">
              Featured Properties
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Handpicked selection of our finest properties available for sale
              and rent
            </p>
          </div>

          {/* Property Type Tabs */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8 md:mb-12">
            {["all", "Villa", "Apartment", "Bungalow", "Land", "Showroom", "Shop"].map((type) => (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${activeTab === type
                  ? "bg-[#0f1e3d] text-[#e4c272]"
                  : "bg-white text-gray-700 hover:bg-[#0f1e3d] hover:text-[#e4c272] border border-gray-300"
                  }`}
              >
                {type === "all" ? "All" : `${type}s`}
              </button>
            ))}
            {["Industrial"].map((category) => (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${activeTab === category
                  ? "bg-[#0f1e3d] text-[#e4c272]"
                  : "bg-white text-gray-700 hover:bg-[#0f1e3d] hover:text-[#e4c272] border border-gray-300"
                  }`}
              >
                {category === "all" ? "All" : `${category}s`}
              </button>
            ))}
          </div>

          {/* Property Grid or Loader */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-[#e4c272] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-xl text-[#0f1e3d] font-medium">Loading properties...</p>
            </div>
          ) : displayedProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <i className="fas fa-home text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-600">
                No properties found in this category.
              </p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/properties"
              className="inline-block bg-transparent border-2 border-[#0f1e3d] text-[#0f1e3d] px-10 py-4 rounded-lg font-semibold hover:bg-[#0f1e3d] hover:text-[#e4c272] transition-all text-lg"
            >
              View All Properties
            </Link>
          </div>
        </div>
      </section>

      {/* Property Showcase Section */}
      <PropertyShowCase />

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#0f1e3d] mb-4">Our Achievements</h2>
          <p className="text-xl text-gray-600">Numbers that speak for themselves</p>
        </div>
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


      {/* Popular Cities */}
      <section className="py-20 ">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-[#0f1e3d] mb-4">
              Explore Properties by Area
            </h2>
            <p className="text-xl text-gray-600">
              Exclusive real estate in India's major urban hubs
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6">
            {[
              {
                name: "Gota",
                count: "2,500+ Properties",
                icon: "fa-building",
              },
              {
                name: "Chandlodiya",
                count: "1,800+ Properties",
                icon: "fa-laptop",
              },
              {
                name: "Zundal",
                count: "1,200+ Properties",
                icon: "fa-graduation-cap",
              },
              {
                name: "Vaishnodevi",
                count: "450+ Properties",
                icon: "fa-umbrella-beach",
              },
              {
                name: "Science City",
                count: "900+ Properties",
                icon: "fa-city"
              },
              {
                name: "Ognaj",
                count: "450+ Properties",
                icon: "fa-warehouse",
              },
              // {
              //   name: "Zundal",
              //   count: "450+ Properties",
              //   icon: "fa-parking",
              // },
            ].map((city, index) => (
              <div
                key={index}
                onClick={() => handleLocationClick(city.name)}
                className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-[#e4c272]/10 rounded-full flex items-center justify-center">
                  <i className={`fas ${city.icon} text-3xl text-[#e4c272]`}></i>
                </div>
                <h3 className="text-lg font-semibold text-[#0f1e3d] mb-2">
                  {city.name}
                </h3>
                <p className="text-sm text-gray-600">{city.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* projects scollers section */}
      <Projects />



      {/* valued partners */}
      <section className="bg-[#f3f3f3] py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-[#e4c272] bg-[#0f1f3d] py-2 px-4 inline-block text-md font-semibold mb-2 mx-auto">
            Our Services
          </p>

          {/* Main Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f1f3d] mb-12">
            We Provide Best Services.
          </h2>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 justify-items-center">
            {services.map((service, index) => (
              <StyledWrapper key={index}>
                <div className="book">
                  <p className="px-4 text-center">{service.description}</p>
                  <div className="cover">
                    <div className="bg-white rounded-3xl shadow-md p-8 border border-[#e4c272] transition duration-300 w-full h-full flex flex-col items-center justify-center">
                      <img
                        src={service.icon}
                        alt={service.title}
                        className="w-24 h-24 mx-auto mb-4 transition-transform duration-300 hover:scale-125"
                      />
                      <p className="text-[#0f1f3d] font-medium text-center">
                        {service.title}
                      </p>
                    </div>
                  </div>
                </div>
              </StyledWrapper>
            ))}
          </div>

        </div>
      </section>

      {/* How It Works */}

      {/* <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-white">
              Simple steps to find your perfect property
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="text-6xl text-primary mb-6">
                <i className="fas fa-search"></i>
              </div>
              <h3 className="text-2xl font-semibold text-secondary mb-4">
                Search Property
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Browse through our extensive database of properties using
                advanced filters to find exactly what you need.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="text-6xl text-primary mb-6">
                <i className="fas fa-calendar-check"></i>
              </div>
              <h3 className="text-2xl font-semibold text-secondary mb-4">
                Schedule Visit
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Book a convenient time to visit the property and get a
                comprehensive tour from our expert agents.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="text-6xl text-primary mb-6">
                <i className="fas fa-key"></i>
              </div>
              <h3 className="text-2xl font-semibold text-secondary mb-4">
                Get Your Keys
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Complete the paperwork and move into your dream home with our
                hassle-free process.
              </p>
            </div> */}


      {/* facilities section  */}
      <Facilities />


      {/* current developers section */}
      <OurPartner />

      {/* Testimonials */}
      {/* <Testimonial /> */}

      <h2 className="text-4xl font-bold text-center m-12 text-[#e4c272]">
        What Our Clients Say
      </h2>
      <GoogleReviews />

      {/* footer section */}
      <Information />

      <Footer />
    </>
  );
}

const StyledWrapper = styled.div`
  .book {
    position: relative;
    border-radius: 20px;
    width: 220px;
    height: 240px;
    background-color: whitesmoke;
    -webkit-box-shadow: 1px 1px 12px #e4c272;
    box-shadow: 1px 1px 12px #e4c272;
    -webkit-transform: preserve-3d;
    -ms-transform: preserve-3d;
    transform: preserve-3d;
    -webkit-perspective: 2000px;
    perspective: 2000px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    color: #000;
  }

  .cover {
    top: 0;
    position: absolute;
    background-color: lightgray;
    width: 100%;
    height: 100%;
    border-radius: 30px;
    cursor: pointer;
    -webkit-transition: all 0.5s;
    transition: all 0.5s;
    -webkit-transform-origin: 0;
    -ms-transform-origin: 0;
    transform-origin: 0;
    // -webkit-box-shadow: 1px 1px 12px #e4c272;
    // box-shadow: 1px 1px 12px #e4c272;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
  }

  .book:hover .cover {
    -webkit-transition: all 0.5s;
    transition: all 0.5s;
    -webkit-transform: rotatey(-80deg);
    -ms-transform: rotatey(-80deg);
    transform: rotatey(-80deg);
  }

  p {
    font-size: 20px;
    font-weight: bolder;
  }`;
