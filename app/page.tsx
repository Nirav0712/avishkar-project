"use client";

import { useState, useEffect } from "react";
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

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchStatus, setSearchStatus] = useState<string>("For Sale");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroImages = [
    "https://plus.unsplash.com/premium_photo-1746387628298-af5695a3f935?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHByb3BlcnRpZXN8ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80",
    "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhvbWV8ZW58MHx8MHx8fDA%3D",
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

  useEffect(() => {
    const allProperties = getProperties();
    setProperties(allProperties);
  }, []);

  const featuredProperties = properties.filter((p) => p.featured).slice(0, 6);
  const displayedProperties =
    activeTab === "all"
      ? featuredProperties
      : featuredProperties.filter((p) => p.type === activeTab);

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
              <button className="w-full md:w-auto px-8 py-3 rounded-full border border-white text-white bg-white/10 backdrop-blur-md hover:bg-[#E3572B] hover:text-black transition duration-300">
                Commercial →
              </button>

              <button className="w-full md:w-auto px-8 py-3 rounded-full border border-white text-white bg-white/10 backdrop-blur-md hover:bg-[#E3572B] hover:text-black transition duration-300">
                Apartment →
              </button>

              <button className="w-full md:w-auto px-8 py-3 rounded-full border border-white text-white bg-white/10 backdrop-blur-md hover:bg-[#E3572B] hover:text-black transition duration-300">
                Industrial →
              </button>
            </div>

            {/* Search Widget with Glassmorphism Effect */}
            <div className="mt-10 md:mt-50 backdrop-blur-lg bg-white/20 rounded-xl p-4 md:p-6 shadow-2xl border border-white/30 mx-4 md:mx-0">
              {/* Tabs */}
              <div className="flex gap-4 mb-6 border-b-2 border-white/30">
                <button
                  onClick={() => setSearchStatus("For Sale")}
                  className={`px-6 py-3 font-medium transition-colors relative ${searchStatus === "For Sale"
                    ? "text-primary"
                    : "text-white hover:text-primary"
                    }`}
                >
                  For Sale
                  {searchStatus === "For Sale" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
                <button
                  onClick={() => setSearchStatus("For Rent")}
                  className={`px-6 py-3 font-medium transition-colors relative ${searchStatus === "For Rent"
                    ? "text-primary"
                    : "text-white hover:text-primary"
                    }`}
                >
                  For Rent
                  {searchStatus === "For Rent" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              </div>

              {/* Search Form */}
              <form
                onSubmit={handleSearch}
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
              >
                <input
                  type="text"
                  name="location"
                  placeholder="Location or keyword"
                  className="px-4 py-3 bg-white/90 border border-white/50 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-gray-900 placeholder:text-gray-600"
                />

                <select
                  name="type"
                  className="px-4 py-3 bg-white/90 border border-white/50 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-gray-900"
                >
                  <option value="all">All Types</option>
                  <option value="Villa">Villa</option>
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>the hero section is the
                  auto scroll to set the diffrent images and the search box is
                  the set in the bg to glass efect in the bg
                  <option value="Condo">Condo</option>
                  <option value="Land">Land</option>
                </select>

                <select
                  name="bedrooms"
                  className="px-4 py-3 bg-white/90 border border-white/50 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-gray-900"
                >
                  <option value="all">Bedrooms</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>

                <button
                  type="submit"
                  className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-all hover:-translate-y-0.5 hover:shadow-md flex items-center justify-center gap-2"
                >
                  <i className="fas fa-search"></i>
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${index === currentImageIndex
                ? "bg-primary w-8"
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
            <h2 className="text-3xl md:text-5xl font-bold text-secondary mb-4">
              Featured Properties
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Handpicked selection of our finest properties available for sale
              and rent
            </p>
          </div>

          {/* Property Type Tabs */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8 md:mb-12">
            {["all", "Villa", "Apartment", "House", "Condo"].map((type) => (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${activeTab === type
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                  }`}
              >
                {type === "all" ? "All" : `${type}s`}
              </button>
            ))}
          </div>

          {/* Property Grid */}
          {displayedProperties.length > 0 ? (
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
              className="inline-block bg-transparent border-2 border-secondary text-secondary px-10 py-4 rounded-lg font-semibold hover:bg-secondary hover:text-white transition-all text-lg"
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
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-primary mb-2">10K+</div>
              <div className="text-gray-600">Properties Sold</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-primary mb-2">5K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-primary mb-2">500+</div>
              <div className="text-gray-600">Expert Agents</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-primary mb-2">15+</div>
              <div className="text-gray-600">Years Experience</div>
            </div>
          </div>
        </div>
      </section>



      {/* Popular Cities */}
      <section className="py-20 ">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-secondary mb-4">
              Explore Properties by City
            </h2>
            <p className="text-xl text-gray-600">
              Premium real estate across India's top metro cities
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 md:gap-6">
            {[
              {
                name: "Mumbai",
                count: "2,500+ Properties",
                icon: "fa-building",
              },
              {
                name: "Bangalore",
                count: "1,800+ Properties",
                icon: "fa-laptop",
              },
              {
                name: "Delhi NCR",
                count: "3,200+ Properties",
                icon: "fa-landmark",
              },
              {
                name: "Pune",
                count: "1,200+ Properties",
                icon: "fa-graduation-cap",
              },
              {
                name: "Goa",
                count: "450+ Properties",
                icon: "fa-umbrella-beach",
              },
              { name: "Hyderabad", count: "900+ Properties", icon: "fa-city" },
            ].map((city, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <i className={`fas ${city.icon} text-3xl text-primary`}></i>
                </div>
                <h3 className="text-lg font-semibold text-secondary mb-2">
                  {city.name}
                </h3>
                <p className="text-sm text-gray-600">{city.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Required Properties */}
      <section className="bg-[#162B49] py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Heading */}
          {/* <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-14">
            <div>
              <p className="text-orange-500 font-semibold mb-3">
                Property By Requirement
              </p>
              <h2 className="text-3xl md:text-5xl font-bold text-white">
                Uncover Country Home
              </h2>
            </div>

            <div className="mt-6 md:mt-0 bg-white p-2 rounded-xl flex gap-3">
              <button className="px-5 py-2 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition">
                Commercial
              </button>
              <button className="px-5 py-2 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition">
                Industrial
              </button>
              <button className="px-5 py-2 rounded-lg bg-orange-500 text-white font-medium">
                Residential
              </button>
            </div>
          </div> */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-14">

            {/* Left Content */}
            <div className="text-center md:text-left">
              <p className="text-orange-500 font-semibold mb-3">
                Property By Requirement
              </p>

              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white leading-snug">
                Uncover Country Home
              </h2>
            </div>

            {/* Filter Buttons */}
            <div className="mt-6 md:mt-0 bg-white p-3 rounded-xl 
                  flex flex-col sm:flex-row 
                  gap-3 w-full md:w-auto">

              <button className="w-full sm:w-auto px-5 py-2 rounded-lg 
                       text-gray-700 font-medium 
                       hover:bg-gray-100 transition">
                Commercial
              </button>

              <button className="w-full sm:w-auto px-5 py-2 rounded-lg 
                       text-gray-700 font-medium 
                       hover:bg-gray-100 transition">
                Industrial
              </button>

              <button className="w-full sm:w-auto px-5 py-2 rounded-lg 
                       bg-orange-500 text-white font-medium">
                Residential
              </button>

            </div>

          </div>


          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-10">
            {/* Card 1 */}
            <div className="bg-[#EDEDED] rounded-2xl overflow-hidden shadow-md w-full max-w-[380px] mx-auto">
              <div className="relative h-[250px]">
                <img
                  src="https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6"
                  className="w-full h-full object-cover"
                  alt="property"
                />
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow">
                  ❤️
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#1f2d3d] mb-2">
                  THE AMBER 2BHK
                </h3>

                <p className="text-gray-600 text-sm mb-4">
                  Jagatpur, North West, Ahmedabad
                </p>

                <div className="flex justify-between text-gray-600 text-sm mb-6">
                  <span>🛏 Bed 2</span>
                  <span>🛁 Bath 2</span>
                </div>

                <button className="w-full bg-[#1f2d3d] text-white py-3 rounded-full hover:bg-orange-500 transition">
                  Details
                </button>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#EDEDED] rounded-2xl overflow-hidden shadow-md w-full max-w-[380px] mx-auto">
              <div className="relative h-[250px]">
                <img
                  src="https://images.unsplash.com/photo-1501183638710-841dd1904471"
                  className="w-full h-full object-cover"
                  alt="property"
                />
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow">
                  ❤️
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#1f2d3d] mb-2">
                  Addor Evara
                </h3>

                <p className="text-gray-600 text-sm mb-4">
                  SG Highway, North West, Ahmedabad
                </p>

                <div className="flex justify-between text-gray-600 text-sm mb-6">
                  <span>🛏 Bed 3</span>
                  <span>🛁 Bath 3</span>
                </div>

                <button className="w-full bg-[#1f2d3d] text-white py-3 rounded-full hover:bg-orange-500 transition">
                  Details
                </button>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#EDEDED] rounded-2xl overflow-hidden shadow-md w-full max-w-[380px] mx-auto">
              <div className="relative h-[250px]">
                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"
                  className="w-full h-full object-cover"
                  alt="property"
                />
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow">
                  ❤️
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#1f2d3d] mb-2">
                  Parvam 1,2 BHK
                </h3>

                <p className="text-gray-600 text-sm mb-4">
                  Ahmedabad, Gujarat, India
                </p>

                <div className="flex justify-between text-gray-600 text-sm mb-6">
                  <span>🛏 Bed 2</span>
                  <span>🛁 Bath 2</span>
                </div>

                <button className="w-full bg-orange-500 text-white py-3 rounded-full hover:bg-[#1f2d3d] transition">
                  Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* valued partners */}
      <section className="bg-[#f3f3f3] py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          {/* Small Top Text */}
          <p className="text-orange-500 text-sm font-semibold mb-2">
            Our Valued Partners
          </p>

          {/* Main Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f1f3d] mb-12">
            Partnerships built on trust and <br /> success.
          </h2>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card */}
            <div className="bg-white rounded-3xl shadow-md p-8 border border-orange-500  hover:border-orange-500 transition duration-300 hover:bg-[#16243E] hover:text-white">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1995/1995574.png"
                alt=""
                className="w-24 h-24 mx-auto mb-4"
              />
              <p className="text-orange-500 font-medium">
                Retail space Leasing
              </p>
            </div>

            <div
              className="bg-white rounded-3xl shadow-md p-8 border border-orange-500 transition duration-300 hover:bg-[#16243E] hover:text-white"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/1534/1534959.png"
                alt=""
                className="w-24 h-24 mx-auto mb-4"
              />
              <p className="text-orange-500 font-medium">Property Managment</p>
            </div>

            <div className="bg-white rounded-3xl shadow-md p-8 border border-orange-500 transition duration-300 hover:bg-[#16243E] hover:text-white">
              <img
                src="https://cdn-icons-png.flaticon.com/512/942/942748.png"
                alt=""
                className="w-24 h-24 mx-auto mb-4"
              />
              <p className="text-orange-500 font-medium">Interior Designing</p>
            </div>

            <div className="bg-white rounded-3xl shadow-md p-8 border border-orange-500  hover:border-orange-500 transition duration-300 hover:bg-[#16243E] hover:text-white">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1995/1995485.png"
                alt=""
                className="w-24 h-24 mx-auto mb-4"
              />
              <p className="text-orange-500 font-medium">
                Consultancy & Research
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-md p-8 border border-orange-500  hover:border-orange-500 transition duration-300 hover:bg-[#16243E] hover:text-white">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1040/1040230.png"
                alt=""
                className="w-24 h-24 mx-auto mb-4"
              />
              <p className="text-orange-500 font-medium">
                Corporate Space Leasing
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-md p-8 border border-orange-500 transition duration-300 hover:bg-[#16243E] hover:text-white">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
                alt=""
                className="w-24 h-24 mx-auto mb-4"
              />
              <p className="text-orange-500 font-medium">
                Legal Advise & Document
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-md p-8 border border-orange-500 transition duration-300 hover:bg-[#16243E] hover:text-white">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt=""
                className="w-24 h-24 mx-auto mb-4"
              />
              <p className="text-orange-500 font-medium">
                Investment in Rented Prop
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-md p-8 border border-orange-500 hover:border-orange-500 transition duration-300 hover:bg-[#16243E] hover:text-white">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2965/2965879.png"
                alt=""
                className="w-24 h-24 mx-auto mb-4"
              />
              <p className="text-orange-500 font-medium">
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


      {/* Testimonials */}
      <Testimonial />

      {/* footer section */}
      <Information />

      <Footer />
    </>
  );
}
