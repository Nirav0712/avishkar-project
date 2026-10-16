'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { formatPrice } from '@/lib/properties';

interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  type: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  featured: boolean;
  image: string;
  category?: string;
  description?: string;
}

interface PropertyCardProps {
  property: Property;
  onEnquire?: (property: Property) => void;
}

export default function PropertyCard({ property, onEnquire }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    try {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorite(favorites.includes(property.id));
    } catch {
      // ignore
    }
  }, [property.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      let newFavorites: number[];
      if (favorites.includes(property.id)) {
        newFavorites = favorites.filter((id: number) => id !== property.id);
        setIsFavorite(false);
      } else {
        newFavorites = [...favorites, property.id];
        setIsFavorite(true);
      }
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch {
      // ignore
    }
  };

  const primaryImage = property.image ? property.image.split(',')[0].trim() : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80';

  return (
    <div className="group bg-white/85 backdrop-blur-md border border-white/80 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(15,30,61,0.12)] transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between">
      <div>
        {/* Image Container with Badges */}
        <div className="relative h-60 sm:h-64 overflow-hidden">
          <img
            src={primaryImage}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>

          {/* Badges */}
          <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-2">
            {property.featured && (
              <span className="bg-[#0b1528]/90 backdrop-blur-md text-[#e4c272] border border-[#d4af37]/40 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase">
                <i className="fas fa-star text-[10px] mr-1"></i> Featured
              </span>
            )}
            <span className="bg-white/90 backdrop-blur-md text-[#0b1528] px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase shadow-sm">
              {property.status}
            </span>
          </div>

          {/* Favorite Heart Button */}
          <button
            type="button"
            onClick={toggleFavorite}
            className={`absolute top-3.5 right-3.5 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
              isFavorite
                ? 'bg-rose-500 text-white'
                : 'bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white hover:text-rose-500'
            }`}
            aria-label="Save to favorites"
          >
            <i className={`fas fa-heart text-sm ${isFavorite ? 'scale-110' : ''}`}></i>
          </button>

          {/* Price Tag in Image Footer */}
          <div className="absolute bottom-3.5 left-3.5 right-3.5 flex justify-between items-end">
            <div className="text-white">
              <span className="block text-[11px] font-medium text-slate-300 uppercase tracking-wider">
                Price
              </span>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-md">
                {formatPrice(property.price)}
                {property.status === 'For Rent' && <span className="text-xs font-normal text-slate-200">/mo</span>}
              </span>
            </div>
            {property.category && (
              <span className="bg-black/50 backdrop-blur-sm text-slate-200 text-xs px-2.5 py-1 rounded-lg border border-white/20">
                {property.category}
              </span>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5">
          {/* Title */}
          <Link href={`/properties/${property.id}`}>
            <h3 className="font-bold text-lg text-slate-900 line-clamp-1 hover:text-[#d4af37] transition-colors">
              {property.title}
            </h3>
          </Link>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5">
            <i className="fas fa-map-marker-alt text-[#d4af37]"></i>
            <span className="truncate">{property.location}</span>
          </div>

          {/* Specs / Features Grid */}
          <div className="grid grid-cols-3 gap-2 py-3.5 my-3.5 border-y border-slate-100 text-slate-600 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <i className="fas fa-bed text-[#d4af37]"></i>
              <span>{property.bedrooms > 0 ? `${property.bedrooms} Beds` : 'Plot / Open'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <i className="fas fa-bath text-[#d4af37]"></i>
              <span>{property.bathrooms > 0 ? `${property.bathrooms} Baths` : 'Commercial'}</span>
            </div>
            <div className="flex items-center gap-1.5 justify-end">
              <i className="fas fa-vector-square text-[#d4af37]"></i>
              <span>{property.area.toLocaleString('en-IN')} sqft</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="px-5 pb-5 pt-0 flex items-center gap-2">
        <Link
          href={`/properties/${property.id}`}
          className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-[#0b1528] text-slate-800 hover:text-white text-xs font-bold text-center transition-all duration-200 flex items-center justify-center gap-1.5"
        >
          <span>View Property</span>
          <i className="fas fa-arrow-right text-[10px]"></i>
        </Link>

        <a
          href={`https://wa.me/917041395595?text=${encodeURIComponent(`Hi Avishkar Realty, I am interested in property #${property.id}: "${property.title}" in ${property.location}. Please share more details.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-xl bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white flex items-center justify-center text-sm transition-colors border border-emerald-200"
          title="Chat on WhatsApp"
        >
          <i className="fab fa-whatsapp text-base"></i>
        </a>
      </div>
    </div>
  );
}
