"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PropertyCard from "../components/PropertyCard";
import { type Property, getProperties } from "@/lib/properties";
import Information from "../components/Information";

function PropertiesList() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("default");

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
        let list: Property[] = [];
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const formattedData = data.map((p: any) => ({
              ...p,
              featured: p.featured === 1 || p.featured === true,
              price: Number(p.price) || 0,
              bedrooms: Number(p.bedrooms) || 0,
              bathrooms: Number(p.bathrooms) || 0,
              area: Number(p.area) || 0,
              image: p.image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
            }));
            const localProps = getProperties();
            list = [...formattedData, ...localProps.filter(lp => !formattedData.some((fp: any) => fp.id === lp.id))];
          } else {
            list = getProperties();
          }
        } else {
          list = getProperties();
        }

        setProperties(list);
        applyFilters(list, filters, sortBy);
      } catch (err) {
        console.error("Error fetching properties:", err);
        const fallback = getProperties();
        setProperties(fallback);
        applyFilters(fallback, filters, sortBy);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const applyFilters = (props: Property[], currentFilters: typeof filters, currentSort: string) => {
    let result = [...props];

    if (currentFilters.status && currentFilters.status !== "all") {
      result = result.filter(p => p.status === currentFilters.status);
    }

    if (currentFilters.type && currentFilters.type !== "all") {
      result = result.filter(p => p.type?.toLowerCase() === currentFilters.type.toLowerCase());
    }

    if (currentFilters.category && currentFilters.category !== "all") {
      result = result.filter(p => p.category?.toLowerCase() === currentFilters.category.toLowerCase());
    }

    if (currentFilters.minPrice) {
      const min = parseFloat(currentFilters.minPrice);
      if (!isNaN(min)) result = result.filter(p => p.price >= min);
    }

    if (currentFilters.maxPrice) {
      const max = parseFloat(currentFilters.maxPrice);
      if (!isNaN(max)) result = result.filter(p => p.price <= max);
    }

    if (currentFilters.bedrooms && currentFilters.bedrooms !== "all") {
      const beds = parseInt(currentFilters.bedrooms);
      if (!isNaN(beds)) result = result.filter(p => p.bedrooms >= beds);
    }

    if (currentFilters.location) {
      const searchTerm = currentFilters.location.toLowerCase();
      result = result.filter(p =>
        p.location.toLowerCase().includes(searchTerm) ||
        p.title.toLowerCase().includes(searchTerm)
      );
    }

    // Sort
    if (currentSort === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (currentSort === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (currentSort === "area-high") {
      result.sort((a, b) => b.area - a.area);
    }

    setFilteredProperties(result);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const nextFilters = { ...filters, [name]: value };
    setFilters(nextFilters);
    applyFilters(properties, nextFilters, sortBy);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSortBy(val);
    applyFilters(properties, filters, val);
  };

  const clearFilters = () => {
    const cleared = {
      status: "all",
      type: "all",
      category: "all",
      minPrice: "",
      maxPrice: "",
      bedrooms: "all",
      location: "",
    };
    setFilters(cleared);
    setSortBy("default");
    applyFilters(properties, cleared, "default");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col">
      <Header />

      {/* Hero Banner with Glass Accent */}
      <section className="bg-gradient-to-r from-[#0b1528] via-[#102447] to-[#0b1528] text-white py-14 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] opacity-15"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#e4c272] text-xs font-bold uppercase tracking-widest mb-3">
            <i className="fas fa-building"></i>
            <span>Curated Inventory</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Properties in <span className="gold-gradient-text">Ahmedabad & Beyond</span>
          </h1>
          <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-xl font-light">
            Browse verified luxury homes, high-yield commercial showrooms, plots, and ready-to-move apartments.
          </p>
        </div>
      </section>

      {/* Main Filter & Listings Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex-grow w-full">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Glass Sidebar Filters (Desktop) */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-sm sticky top-24">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <i className="fas fa-sliders-h text-[#d4af37]"></i>
                  <h2 className="font-bold text-slate-900 text-base">Filter Properties</h2>
                </div>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs text-[#d4af37] hover:text-[#0b1528] font-bold hover:underline"
                >
                  Reset
                </button>
              </div>

              <div className="space-y-4 text-xs">
                {/* Search Term */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Keywords / Location</label>
                  <input
                    type="text"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="e.g. Zundal, SG Highway..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Deal Type</label>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#d4af37] cursor-pointer"
                  >
                    <option value="all">All Deals</option>
                    <option value="For Sale">For Sale (Buy)</option>
                    <option value="For Rent">For Rent (Lease)</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#d4af37] cursor-pointer"
                  >
                    <option value="all">All Categories</option>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                  </select>
                </div>

                {/* Property Type */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Type</label>
                  <select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#d4af37] cursor-pointer"
                  >
                    <option value="all">All Types</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa / House</option>
                    <option value="Condo">Penthouse / Condo</option>
                    <option value="Land">Land / Plot</option>
                    <option value="Retail">Retail / Showroom</option>
                  </select>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bedrooms</label>
                  <select
                    name="bedrooms"
                    value={filters.bedrooms}
                    onChange={handleFilterChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#d4af37] cursor-pointer"
                  >
                    <option value="all">Any Configuration</option>
                    <option value="1">1+ BHK</option>
                    <option value="2">2+ BHK</option>
                    <option value="3">3+ BHK</option>
                    <option value="4">4+ BHK</option>
                  </select>
                </div>

                {/* Price Filter */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price Range (₹)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      name="minPrice"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      placeholder="Min"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#d4af37]"
                    />
                    <input
                      type="number"
                      name="maxPrice"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      placeholder="Max"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Main Content: Results & Grid */}
          <main className="flex-1 w-full">
            {/* Top Bar: Count, Sort, View Toggle */}
            <div className="bg-white/80 backdrop-blur-md border border-white/80 rounded-2xl p-4 shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-xs sm:text-sm text-slate-600 font-medium">
                Showing <span className="font-bold text-slate-900">{filteredProperties.length}</span> properties
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500 font-semibold hidden sm:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#d4af37] cursor-pointer"
                  >
                    <option value="default">Featured First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="area-high">Area: Largest First</option>
                  </select>
                </div>

                {/* Grid / List Toggle */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-colors ${
                      viewMode === "grid" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                    }`}
                    title="Grid View"
                  >
                    <i className="fas fa-th"></i>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-colors ${
                      viewMode === "list" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                    }`}
                    title="List View"
                  >
                    <i className="fas fa-list"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Listings Grid / List */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className="h-80 bg-slate-200 rounded-3xl animate-pulse"></div>
                ))}
              </div>
            ) : filteredProperties.length > 0 ? (
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6" : "flex flex-col gap-6"}>
                {filteredProperties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/70 backdrop-blur-sm rounded-3xl border border-slate-200 p-8">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4 text-2xl">
                  <i className="fas fa-filter"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-800">No properties matched your criteria</h3>
                <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
                  Try adjusting or clearing your filters to view more listings in Ahmedabad.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-6 px-6 py-2.5 rounded-full bg-[#0b1528] text-white text-xs font-bold hover:bg-[#162544] transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      <Information />
      <Footer />
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8fafc] flex items-center justify-center text-slate-600">Loading catalog...</div>}>
      <PropertiesList />
    </Suspense>
  );
}
