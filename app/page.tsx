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
// import styled from 'styled-components';

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchStatus, setSearchStatus] = useState<string>("For Sale");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroImages = [
    "/images/slider/slider1.jpeg",
    "/images/slider/slider4.jpeg",
    "/images/slider/slider3.jpeg",
    "/images/slider/slider2.jpeg",
    "/images/slider/slider5.jpeg",
    // "https://plus.unsplash.com/premium_photo-1746387628298-af5695a3f935?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHByb3BlcnRpZXN8ZW58MHx8MHx8fDA%3D",
    // "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80",
    // "https://images.unsplash.com/photo-1635108199395-8cd24af60af1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fHByb3BlcnRpZXN8ZW58MHx8MHx8fDA%3D",
    // "https://images.unsplash.com/photo-1756435292384-1bf32eff7baf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjU0fHxwcm9wZXJ0aWVzfGVufDB8fDB8fHww",
    // "https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvcGVydGllc3xlbnwwfHwwfHx8MA%3D%3D",
  ];
  const sliderImages = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&q=80",
    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1000&q=80",
    "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=1000&q=80",
  ];

  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? sliderImages.length - 1 : prev - 1));
  };

  // ✅ Auto Slide (Every 4 Seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

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
  const displayedProperties =
    activeTab === "all"
      ? featuredProperties
      : featuredProperties.filter((p) => p.type === activeTab);

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
      <section className="relative min-h-screen md:h-205 flex items-center justify-center overflow-hidden py-20 md:py-0">
        {/* Background Image Carousel */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImageIndex ? "opacity-100" : "opacity-0"
                }`}
            >
              <Image
                src={image}
                alt={`Property ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-linear-to-r from-secondary/80 to-secondary/40 opacity-70"></div>
            </div>
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white ">
            <h1 className="text-3xl md:text-6xl font-bold mb-6 drop-shadow-lg justify-center items-center text-center px-4">
              Trusted Real Estate Expert in Ahmedabad
            </h1>
            {/* <p className="text-xl md:text-2xl mb-20 opacity-95 drop-shadow">
              Discover the perfect property from our extensive listings of homes, apartments, and commercial spaces
            </p> */}

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 w-full px-4">
              <button
                onClick={() => handleCategoryClick("Commercial")}
                className="w-full md:w-auto px-8 py-3 rounded-xl border border-white text-white bg-white/10 backdrop-blur-md hover:bg-[#e4c272] hover:text-black hover:border-black transition duration-300"
              >
                Commercial →
              </button>

              <button
                onClick={() => handleCategoryClick("Residential")}
                className="w-full md:w-auto px-8 py-3 rounded-xl border border-white text-white bg-white/10 backdrop-blur-md hover:bg-[#e4c272] hover:text-black hover:border-black transition duration-300"
              >
                Residential →
              </button>

              <button
                onClick={() => handleCategoryClick("Industrial")}
                className="w-full md:w-auto px-8 py-3 rounded-xl border border-white text-white bg-white/10 backdrop-blur-md hover:bg-[#e4c272] hover:text-black hover:border-black transition duration-300"
              >
                Industrial →
              </button>

              <Link href="/project">
                <button
                  className="w-full md:w-auto px-8 py-3 rounded-xl border border-white text-white bg-white/10 backdrop-blur-md hover:bg-[#e4c272] hover:text-black hover:border-black transition duration-300"
                >
                  New Projects →
                </button>
              </Link>
            </div>

            {/* Search Widget with Glassmorphism Effect */}
            {/* <div className="mt-10 backdrop-blur-lg bg-white/20 rounded-xl p-4 md:p-6 shadow-2xl border border-white/30 mx-4 md:mx-0">
              <div className="flex gap-4 mb-6 border-b-2 border-white/30">
                <button
                  onClick={() => setSearchStatus("For Sale")}
                  className={`px-6 py-3 font-medium transition-colors relative ${searchStatus === "For Sale"
                    ? "text-[#0f1e3d]"
                    : "text-white hover:text-#e4c272"
                    }`}
                >
                  For Sale
                  {searchStatus === "For Sale" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0f1e3d]" />
                  )}
                </button>
                <button
                  onClick={() => setSearchStatus("For Rent")}
                  className={`px-6 py-3 font-medium transition-colors relative ${searchStatus === "For Rent"
                    ? "text-[#0f1e3d]"
                    : "text-white hover:text-[#0f1e3d]"
                    }`}
                >
                  For Rent
                  {searchStatus === "For Rent" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0f1e3d]" />
                  )}
                </button>
              </div>

              <form
                onSubmit={handleSearch}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 bg-white/20 backdrop-blur-md p-4 md:p-6 rounded-xl border border-white/30 shadow-lg"
              >
                <select name="type" className="px-4 py-3 bg-white/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f1e3d] text-gray-500 ">
                  <option value="" >Property Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Commercial">Commercial Shops</option>
                  <option value="Commercial">Commercial Office</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Banglow">Bunglows</option>
                  <option value="Land">Land</option>
                  <option value="Plot">Plot</option>
                </select>

                <input
                  type="text"
                  name="location"
                  placeholder="Enter Location"
                  className="px-4 py-3 bg-white/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f1e3d] text-black w-full  placeholder:text-gray-500"
                />
                

                <select
                  name="bhk"
                  className="px-4 py-3 bg-white/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f1e3d] text-gray-500"
                >
                  <option value="" >BHK</option>
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4 BHK</option>
                  <option value="5">5+ BHK</option>
                </select>

                
                <input
                  type="number"
                  name="minBudget"
                  placeholder="Enter Min Budget"
                  className="px-4 py-3 bg-white/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f1e3d] text-black w-full  placeholder:text-gray-500"
                />
                

               
                <input
                  type="number"
                  name="maxBudget"
                  placeholder="Enter Max Budget"
                  className="px-4 py-3 bg-white/80 rounded-lg 
             focus:outline-none focus:ring-2 
             focus:ring-[#0f1e3d] text-black w-full  placeholder:text-gray-500"
                />
               

                <select
                  name="transaction"
                  className="px-4 py-3 bg-white/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f1e3d] text-gray-500"
                >
                  <option value="">Transaction</option>
                  <option value="new">New Property</option>
                  <option value="resale">Resale</option>
                  <option value="underconstruction">Under Construction</option>
                </select>

                <button
                  type="submit"
                  className="bg-[#0f1e3d] text-[#e4c272] border-2 border-[#e4c272] px-6 py-3 rounded-lg font-semibold transition-all hover:bg-[#e4c272] hover:text-[#0f1e3d] hover:border-[#0f1e3d] hover:-translate-y-0.5 hover:shadow-md col-span-1 sm:col-span-2 lg:col-span-3"
                >
                  Search
                </button>
              </form>
            </div> */}
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${index === currentImageIndex
                ? "bg-[#0f1e3d] w-8"
                : "bg-white/50 hover:bg-white/80"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

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
            {["all", "Villa", "Apartment", "House", "Land" ,"Industrial", "Commercial","Residential"].map((type) => (
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


      {/* Popular Cities */}
      <section className="py-20 ">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-[#0f1e3d] mb-4">
              Explore Properties by Area
            </h2>
            <p className="text-xl text-gray-600">
              Exclusive real estate in India’s major urban hubs
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 md:gap-6">
            {[
              {
                name: "SG Highway",
                count: "2,500+ Properties",
                icon: "fa-building",
              },
              {
                name: "Thaltej",
                count: "1,800+ Properties",
                icon: "fa-laptop",
              },
              {
                name: "Bodakdev",
                count: "3,200+ Properties",
                icon: "fa-landmark",
              },
              {
                name: "Bopal",
                count: "1,200+ Properties",
                icon: "fa-graduation-cap",
              },
              {
                name: "Prahlad Nagar",
                count: "450+ Properties",
                icon: "fa-umbrella-beach",
              },
              {
                name: "Ambli",
                count: "900+ Properties",
                icon: "fa-city"
              },
            ].map((city, index) => (
              <div
                key={index}
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

       {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
            <div className='w-40 h-40 rounded-full p-25 bg-white shadow-xl flex flex-col items-center justify-center text-center border-2 border-[#0f1e3d] hover:scale-110 transition-transform duration-300 cursor-pointer mx-auto'>
              <div className="text-5xl font-bold text-[#0f1e3d] mb-2">5K+</div>
              <div className="text-gray-600">Properties Sold</div>
            </div>
            <div className='w-40 h-40 rounded-full p-25 bg-white shadow-xl flex flex-col items-center justify-center text-center border-2 border-[#0f1e3d] hover:scale-110 transition-transform duration-300 cursor-pointer mx-auto'>
              <div className="text-5xl font-bold text-[#0f1e3d] mb-2">2500</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            {/* <div className='w-40 h-40 rounded-full p-25 bg-white shadow-xl flex flex-col items-center justify-center text-center border-2 border-[#0f1e3d] hover:scale-110 transition-transform duration-300 cursor-pointer mx-auto'>
              <div className="text-5xl font-bold text-[#0f1e3d] mb-2">100+</div>
              <div className="text-gray-600">Expert Agents</div>
            </div> */}
            <div className='w-40 h-40 rounded-full p-25  bg-white shadow-xl flex flex-col items-center justify-center text-center border-2 border-[#0f1e3d] hover:scale-110 transition-transform duration-300 cursor-pointer mx-auto'>
              <div className="text-5xl font-bold text-[#0f1e3d] mb-2">12+</div>
              <div className="text-gray-600">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Required Properties */}
      <section className="bg-[#162B49] py-20">
        <div className="max-w-7xl mx-auto px-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-14">

            {/* Left Content */}
            <div className="text-center md:text-left">
              <p className="text-[#e4c272] font-semibold mb-3">
                Property By Requirement
              </p>

              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white leading-snug">
                Uncover Country Home
              </h2>
            </div>

            {/* Filter Buttons */}
            <div className="mt-6 md:mt-0 bg-white p-3 rounded-xl flex flex-col sm:flex-row gap-3 w-full md:w-auto">

              <button
                type="button"
                onClick={() => handleCategoryClick("Commercial")}
                className="w-full sm:w-auto px-5 py-2 rounded-lg text-gray-700 font-medium hover:bg-[#0f1e3d] hover:text-white active:bg-[#0f1e3d] cursor-pointer transition"
              >
                Commercial
              </button>

              <button
                type="button"
                onClick={() => handleCategoryClick("Industrial")}
                className="w-full sm:w-auto px-5 py-2 rounded-lg text-gray-700 font-medium hover:bg-[#0f1e3d] hover:text-white active:bg-[#0f1e3d] cursor-pointer transition"
              >
                Industrial
              </button>

              <button
                type="button"
                onClick={() => handleCategoryClick("Residential")}
                className="w-full sm:w-auto px-5 py-2 rounded-lg text-gray-700 font-medium hover:bg-[#0f1e3d] hover:text-white active:bg-[#0f1e3d] cursor-pointer transition"
              >   Residential
              </button>

            </div>

          </div>


          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-10">
            {requirementProperties.map((property: Property) => (
              <div key={property.id} className="bg-[#EDEDED] rounded-2xl overflow-hidden shadow-md w-full max-w-95 mx-auto">
                <div className="relative h-62.5">
                  <img
                    src={property.image.split(',')[0]}
                    className="w-full h-full object-cover"
                    alt={property.title}
                  />
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow">
                    ❤️
                  </div>
                </div>

                <div className="p-6 text-center md:text-left">
                  <h3 className="text-xl font-semibold text-[#1f2d3d] mb-2 uppercase">
                    {property.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4">
                    {property.location}
                  </p>

                  <div className="flex justify-between text-gray-600 text-sm mb-6">
                    <span>🛏 Bed {property.bedrooms}</span>
                    <span>🛁 Bath {property.bathrooms}</span>
                  </div>

                  <Link
                    href={`/properties/${property.id}`}
                    className="block w-full text-center bg-[#1f2d3d] text-white py-3 rounded-full hover:bg-[#e4c272] hover:text-[#0f1e3d] border-2 hover:border-[#0f1e3d] transition"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}

            {requirementProperties.length === 0 && (
              <div className="col-span-3 text-center py-10 text-white/60">
                No properties found for these requirements.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* valued partners */}
      <section className="bg-[#f3f3f3] py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          {/* Small Top Text */}
          <p className="text-[#e4c272] bg-[#0f1f3d] p-2 ml-100 mr-100 text-sm font-semibold mb-2">
            Our Valued Partners
          </p>

          {/* Main Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f1f3d] mb-12">
            Partnerships built on trust and <br /> success.
          </h2>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card */}
            <div className="bg-white rounded-3xl shadow-md p-8 border border-[#e4c272]  hover:border-[#e4c272] transition duration-300  ">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1995/1995574.png"
                alt=""
                className="w-24 h-24 mx-auto mb-4 ransition-transform duration-300 hover:scale-125"
              />
              <p className="text-[#0f1f3d] font-medium">
                Retail space Leasing
              </p>
            </div>

            <div
              className="bg-white rounded-3xl shadow-md p-8 border border-[#e4c272] transition duration-300 "
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/1534/1534959.png"
                alt=""
                className="w-24 h-24 mx-auto mb-4 ransition-transform duration-300 hover:scale-125"
              />
              <p className="text-[#0f1f3d] font-medium">Property Managment</p>
            </div>

            <div className="bg-white rounded-3xl shadow-md p-8 border border-[#e4c272] transition duration-300 ">
              <img
                src="https://cdn-icons-png.flaticon.com/512/942/942748.png"
                alt=""
                className="w-24 h-24 mx-auto mb-4 ransition-transform duration-300 hover:scale-125"
              />
              <p className="text-[#0f1f3d] font-medium">Interior Designing</p>
            </div>

            <div className="bg-white rounded-3xl shadow-md p-8 border border-[#e4c272]  hover:border-[#e4c272] transition duration-300  ">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1995/1995485.png"
                alt=""
                className="w-24 h-24 mx-auto mb-4 ransition-transform duration-300 hover:scale-125"
              />
              <p className="text-[#0f1f3d] font-medium">
                Consultancy & Research
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-md p-8 border border-[#e4c272]  hover:border-[#e4c272] transition duration-300  ">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1040/1040230.png"
                alt=""
                className="w-24 h-24 mx-auto mb-4 ransition-transform duration-300 hover:scale-125"
              />
              <p className="text-[#0f1f3d] font-medium">
                Corporate Space Leasing
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-md p-8 border border-[#e4c272]  hover:border-[#e4c272] transition duration-300  ">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
                alt=""
                className="w-24 h-24 mx-auto mb-4 ransition-transform duration-300 hover:scale-125"
              />
              <p className="text-[#0f1f3d] font-medium">
                Legal Advise & Document
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-md p-8 border border-[#e4c272]  hover:border-[#e4c272] transition duration-300  ">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt=""
                className="w-24 h-24 mx-auto mb-4 ransition-transform duration-300 hover:scale-125"
              />
              <p className="text-[#0f1f3d] font-medium">
                Investment in Rented Prop
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-md p-8 border border-[#e4c272]  hover:border-[#e4c272] transition duration-300  ">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2965/2965879.png"
                alt=""
                className="w-24 h-24 mx-auto mb-4 ransition-transform duration-300 hover:scale-125"
              />
              <p className="text-[#0f1f3d] font-medium">
                Loan Against Property
              </p>
            </div>
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

      {/* Testimonials */}
      <Testimonial />

      {/* footer section */}
      <Information />

      <Footer />
    </>
  );
}
