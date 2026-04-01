"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PropertyCard from "../components/PropertyCard";
import { type Property } from "@/lib/properties";
import Information from "../components/Information";

function PropertiesContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    status: searchParams.get("status") || "all",
    type: searchParams.get("type") || "all",
    category: searchParams.get("category") || "all",
    minPrice: "",
    maxPrice: "",
    bedrooms: searchParams.get("bedrooms") || "all",
    location: searchParams.get("location") || "",
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/properties");
        if (!res.ok) {
          throw new Error('Failed to fetch properties');
        }
        const data = await res.json();

        // Format properties
        const formattedData = data.map((p: any) => ({
          ...p,
          featured: p.featured === 1 || p.featured === true,
          price: Number(p.price) || 0,
          bedrooms: Number(p.bedrooms) || 0,
          bathrooms: Number(p.bathrooms) || 0,
          area: Number(p.area) || 0,
          image: p.image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
        }));

        setProperties(formattedData);
        applyFilters(formattedData, filters);
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("Failed to load properties. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []); // Run once on mount

  const applyFilters = (props: Property[], currentFilters: typeof filters) => {
    let result = [...props];

    if (currentFilters.status && currentFilters.status !== "all") {
      result = result.filter(p => p.status === currentFilters.status);
    }

    if (currentFilters.type && currentFilters.type !== "all") {
      result = result.filter(p => p.type === currentFilters.type);
    }

    if (currentFilters.category && currentFilters.category !== "all") {
      result = result.filter((p: any) => p.category === currentFilters.category);
    }

    if (currentFilters.minPrice) {
      const min = parseFloat(currentFilters.minPrice);
      if (!isNaN(min)) {
        result = result.filter(p => p.price >= min);
      }
    }

    if (currentFilters.maxPrice) {
      const max = parseFloat(currentFilters.maxPrice);
      if (!isNaN(max)) {
        result = result.filter(p => p.price <= max);
      }
    }

    if (currentFilters.bedrooms && currentFilters.bedrooms !== "all") {
      const beds = parseInt(currentFilters.bedrooms);
      if (!isNaN(beds)) {
        result = result.filter(p => p.bedrooms >= beds);
      }
    }

    if (currentFilters.location) {
      const searchTerm = currentFilters.location.toLowerCase();
      result = result.filter(p =>
        p.location.toLowerCase().includes(searchTerm) ||
        p.title.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredProperties(result);
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    // We update the filter state here, but we wait for form submission to apply
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters(properties, filters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      status: "all",
      type: "all",
      category: "all",
      minPrice: "",
      maxPrice: "",
      bedrooms: "all",
      location: "",
    };
    setFilters(clearedFilters);
    setFilteredProperties(properties);
  };

  return (
    <>
      <Header />

      {/* Page Header */}
      <div className="bg-linear-to-br from-[#0f1f3d] to-[#0f1f3d] text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Featured Properties</h1>
          <p className="text-xl opacity-90">Find the Perfect Space for You</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-80 shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-secondary">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-[#0f1e3d] hover:text-[#e4c272] hover:bg-[#0f1e3d] p-2  font-medium"
                >
                  Clear All
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0f1e3d] focus:ring-2 focus:ring-[#0f1e3d]/20"
                  >
                    <option value="all">All</option>
                    <option value="For Sale">For Sale</option>
                    <option value="For Rent">For Rent</option>
                  </select>
                </div>

                {/* Category Feed */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Feed
                  </label>
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0f1e3d] focus:ring-2 focus:ring-[#0f1e3d]/20"
                  >
                    <option value="all">All Category</option>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                  </select>
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type
                  </label>
                  <select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0f1e3d] focus:ring-2 focus:ring-[#0f1e3d]/20"
                  >
                    <option value="all">All Types</option>
                    <option value="Villa">Villa</option>
                    <option value="Apartment">Apartment</option>
                    {/* <option value="House">House</option> */}
                    <option value="Bungalow">Bungalow</option>
                    <option value="Land">Land</option>
                    <option value="Retail">Retail</option>
                    <option value="Shop">Shop</option>
                    <option value="Showroom">Showroom</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      name="minPrice"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      placeholder="Min"
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0f1e3d] focus:ring-2 focus:ring-[#0f1e3d]/20 w-full"
                    />
                    <input
                      type="number"
                      name="maxPrice"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      placeholder="Max"
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0f1e3d] focus:ring-2 focus:ring-[#0f1e3d]/20 w-full"
                    />
                  </div>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms
                  </label>
                  <select
                    name="bedrooms"
                    value={filters.bedrooms}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0f1e3d] focus:ring-2 focus:ring-[#0f1e3d]/20"
                  >
                    <option value="all">All</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="City, State..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0f1e3d] focus:ring-2 focus:ring-[#0f1e3d]/20"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-white text-[#0f1e3d] border border-[#0f1e3d] px-6 py-3 rounded-lg font-semibold hover:bg-[#0f1e3d] hover:text-[#e4c272] hover:border-[#e4c272] transition-colors flex items-center justify-center gap-2"
                >
                  <i className="fas fa-search"></i>
                  Apply Filters
                </button>
              </form>
            </div>
          </aside>

          {/* Properties Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                <span className="font-bold text-[#0f1e3d]">
                  {isLoading ? "..." : filteredProperties.length}
                </span>{" "}
                properties found
              </p>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <i className="fas fa-spinner fa-spin text-4xl text-[#0f1e3d]"></i>
              </div>
            ) : error ? (
              <div className="text-center py-20 bg-red-50 rounded-xl">
                <i className="fas fa-exclamation-triangle text-4xl text-[#0f1e3d] mb-4"></i>
                <h3 className="text-xl font-semibold text-gray-800">{error}</h3>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-primary text-white px-6 py-2 rounded-lg"
                >
                  Try Again
                </button>
              </div>
            ) : filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <i className="fas fa-home text-6xl text-gray-300 mb-4"></i>
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                  No Properties Found
                </h3>
                <p className="text-gray-600 mb-6 px-4">
                  We couldn't find any properties matching your current filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-white border border-[#0f1e3d] text-secondary px-8 py-3 rounded-lg font-bold hover:bg-[#0f1e3d] hover:text-white transition-colors shadow-sm inline-flex items-center gap-2"
                >
                  <i className="fas fa-times"></i>
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Information />
      <Footer />
    </>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <i className="fas fa-spinner fa-spin text-4xl text-primary"></i>
      </div>
    }>
      <PropertiesContent />
    </Suspense>
  );
}
