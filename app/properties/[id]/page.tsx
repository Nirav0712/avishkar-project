'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PropertyCard from '../../components/PropertyCard';
import Information from '../../components/Information';
import { type Property, formatPrice, getPropertyById, getProperties } from '@/lib/properties';

export default function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const propertyId = resolvedParams.id;

  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Enquiry form state
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadMessage, setLeadMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/properties/${propertyId}`);
        let currentProp: Property | null = null;

        if (res.ok) {
          const propData = await res.json();
          currentProp = {
            ...propData,
            featured: propData.featured === 1 || propData.featured === true,
            price: Number(propData.price) || 0,
            bedrooms: Number(propData.bedrooms) || 0,
            bathrooms: Number(propData.bathrooms) || 0,
            area: Number(propData.area) || 0,
            image: propData.image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
          };
        } else {
          // Fallback to local properties
          const fallback = getPropertyById(propertyId);
          if (fallback) currentProp = fallback;
        }

        if (currentProp) {
          setProperty(currentProp);
          setLeadMessage(`Hi, I am interested in viewing "${currentProp.title}" (${currentProp.location}). Please contact me with pricing and site visit details.`);

          // Similar properties
          const allRes = await fetch('/api/properties');
          let allProps: Property[] = [];
          if (allRes.ok) {
            allProps = await allRes.json();
          } else {
            allProps = getProperties();
          }

          const similar = allProps
            .filter((p: Property) => String(p.id) !== String(propertyId) && p.type === currentProp?.type)
            .slice(0, 3);
          setSimilarProperties(similar);
        }

        // Favorites check
        try {
          const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
          setIsFavorite(favorites.includes(Number(propertyId)));
        } catch {
          // ignore
        }
      } catch (err) {
        console.error("Error loading property:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  const toggleFavorite = () => {
    try {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      const numericId = Number(propertyId);
      let newFavorites: number[];
      if (favorites.includes(numericId)) {
        newFavorites = favorites.filter((id: number) => id !== numericId);
        setIsFavorite(false);
      } else {
        newFavorites = [...favorites, numericId];
        setIsFavorite(true);
      }
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch {
      // ignore
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone) {
      setSubmitError('Please provide your name and phone number.');
      return;
    }
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch('/api/enquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadName,
          phone: leadPhone,
          email: leadEmail || null,
          source: 'Property Detail Page',
          property_id: Number(propertyId),
          interested_in: property ? `${property.title} (ID #${property.id})` : `Property #${propertyId}`,
          preferred_location: property?.location || '',
          property_type: property?.type || '',
          budget: property ? formatPrice(property.price) : '',
          priority: 'High',
          notes: leadMessage || 'Requested consultation and inspection for this property.'
        })
      });

      if (!res.ok) {
        throw new Error('Failed to record inquiry');
      }

      setSubmitSuccess(true);
      setLeadName('');
      setLeadPhone('');
      setLeadEmail('');
    } catch {
      setSubmitError('Unable to record your enquiry at this moment. You can connect directly via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center py-20 text-slate-500">
          <div className="flex flex-col items-center gap-3">
            <i className="fas fa-circle-notch fa-spin text-3xl text-[#d4af37]"></i>
            <span>Loading property details...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col">
        <Header />
        <div className="flex-1 max-w-xl mx-auto px-4 py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4 text-2xl">
            <i className="fas fa-home"></i>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Property Not Found</h1>
          <p className="text-sm text-slate-500 mt-2">
            The property you are looking for may have been sold, archived, or is temporarily unavailable.
          </p>
          <Link
            href="/properties"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0b1528] text-white text-xs font-bold"
          >
            <i className="fas fa-arrow-left"></i>
            <span>Browse Available Listings</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const rawImages = property.image ? property.image.split(',').map(s => s.trim()).filter(Boolean) : [];
  const galleryImages = rawImages.length > 0 ? rawImages : ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col">
      <Header />

      {/* Breadcrumb Bar */}
      <div className="bg-slate-100/70 border-b border-slate-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-900">Home</Link>
          <span>/</span>
          <Link href="/properties" className="hover:text-slate-900">Properties</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold truncate max-w-xs">{property.title}</span>
        </div>
      </div>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full">
        {/* Top Title & Price Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#d4af37] text-[#0b1528] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {property.status}
              </span>
              <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold">
                {property.type}
              </span>
              {property.featured && (
                <span className="bg-[#0b1528] text-[#e4c272] px-3 py-1 rounded-full text-xs font-bold">
                  ★ Featured
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {property.title}
            </h1>

            <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
              <i className="fas fa-map-marker-alt text-[#d4af37]"></i>
              <span>{property.location}</span>
            </div>
          </div>

          {/* Price & Action */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider">
                Listing Price
              </span>
              <span className="text-2xl sm:text-4xl font-black text-[#0b1528]">
                {formatPrice(property.price)}
                {property.status === 'For Rent' && <span className="text-sm font-normal text-slate-500">/mo</span>}
              </span>
            </div>

            <button
              type="button"
              onClick={toggleFavorite}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
                isFavorite
                  ? 'bg-rose-50 border-rose-200 text-rose-500'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="Save to Wishlist"
            >
              <i className={`fas fa-heart text-lg ${isFavorite ? 'scale-110' : ''}`}></i>
            </button>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Main Photo Gallery */}
          <div className="lg:col-span-8">
            <div className="relative h-[340px] sm:h-[480px] rounded-3xl overflow-hidden shadow-md bg-slate-900 group">
              <img
                src={galleryImages[selectedImageIndex]}
                alt={property.title}
                className="w-full h-full object-cover transition-transform duration-500 cursor-pointer group-hover:scale-102"
                onClick={() => setLightboxOpen(true)}
              />

              {/* View Fullscreen Action */}
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-black/80 transition-colors"
              >
                <i className="fas fa-expand"></i>
                <span>Fullscreen Gallery</span>
              </button>
            </div>

            {/* Thumbnail Row */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-2 scrollbar-thin">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImageIndex === idx ? 'border-[#d4af37] scale-105 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Property Overview Badges */}
            <div className="mt-8 bg-white/80 backdrop-blur-md rounded-3xl border border-white/80 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <i className="fas fa-info-circle text-[#d4af37]"></i>
                Key Specifications
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <i className="fas fa-bed text-[#d4af37] text-lg mb-1 block"></i>
                  <span className="text-xs text-slate-500 font-medium">Bedrooms</span>
                  <p className="text-base font-bold text-slate-900">{property.bedrooms > 0 ? `${property.bedrooms} BHK` : 'N/A'}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <i className="fas fa-bath text-[#d4af37] text-lg mb-1 block"></i>
                  <span className="text-xs text-slate-500 font-medium">Bathrooms</span>
                  <p className="text-base font-bold text-slate-900">{property.bathrooms > 0 ? `${property.bathrooms} Baths` : 'Commercial'}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <i className="fas fa-vector-square text-[#d4af37] text-lg mb-1 block"></i>
                  <span className="text-xs text-slate-500 font-medium">Super Built-up</span>
                  <p className="text-base font-bold text-slate-900">{property.area.toLocaleString('en-IN')} sqft</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <i className="fas fa-car text-[#d4af37] text-lg mb-1 block"></i>
                  <span className="text-xs text-slate-500 font-medium">Covered Parking</span>
                  <p className="text-base font-bold text-slate-900">{property.parking ? `${property.parking} Spots` : 'Available'}</p>
                </div>
              </div>

              {/* Description */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <h3 className="text-base font-bold text-slate-900 mb-3">About This Property</h3>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line font-light">
                  {property.description || "Thoughtfully designed premium residential property offering modern architecture, ample natural light, and strategic connectivity to schools, hospitals, and transit hubs across Ahmedabad."}
                </p>
              </div>

              {/* Amenities List */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <i className="fas fa-concierge-bell text-[#d4af37]"></i>
                    Amenities & Facilities
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {property.amenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium">
                        <span className="w-5 h-5 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37] text-[10px] shrink-0">
                          <i className="fas fa-check"></i>
                        </span>
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Lead Capture CRM Form */}
          <div className="lg:col-span-4">
            <div className="bg-white/90 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-8 shadow-xl sticky top-24">
              <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-[#0b1528] text-[#e4c272] flex items-center justify-center text-lg shadow-sm">
                  <i className="fas fa-user-shield"></i>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Direct Property Enquiry</h3>
                  <span className="text-xs text-[#d4af37] font-semibold">Attributed to Property #{property.id}</span>
                </div>
              </div>

              {submitSuccess ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 text-xl">
                    <i className="fas fa-check"></i>
                  </div>
                  <h4 className="font-bold text-emerald-900 text-base">Enquiry Sent to CRM!</h4>
                  <p className="text-xs text-emerald-700 mt-1">
                    Our sales advisor will reach out to schedule your private site inspection.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitSuccess(false)}
                    className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                  >
                    Submit Another Query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-4 text-xs">
                  {submitError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
                      {submitError}
                    </div>
                  )}

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anand Shah"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Phone Number (WhatsApp) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="anand@example.com"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Message / Inspection Request</label>
                    <textarea
                      rows={3}
                      value={leadMessage}
                      onChange={(e) => setLeadMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#d4af37] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-[#0b1528] hover:bg-[#162544] text-[#e4c272] font-bold text-xs tracking-wide transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        <span>Registering...</span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane"></i>
                        <span>Schedule Site Visit</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`https://wa.me/917041395595?text=${encodeURIComponent(`Hi Avishkar Realty, I am viewing property #${property.id}: "${property.title}" in ${property.location}. Please connect with me regarding pricing and site visit.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wide transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <i className="fab fa-whatsapp text-sm"></i>
                    <span>Connect Instantly on WhatsApp</span>
                  </a>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Similar Properties Showcase */}
        {similarProperties.length > 0 && (
          <div className="mt-20 pt-10 border-t border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider block mb-1">Comparable Options</span>
                <h2 className="text-2xl font-bold text-slate-900">Similar Properties You May Like</h2>
              </div>
              <Link
                href="/properties"
                className="text-xs font-bold text-[#0b1528] hover:text-[#d4af37] flex items-center gap-1.5"
              >
                <span>View All</span>
                <i className="fas fa-arrow-right text-[10px]"></i>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarProperties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-white text-2xl hover:text-[#d4af37] transition-colors"
          >
            ✕
          </button>
          <div className="max-w-5xl max-h-[85vh] w-full flex items-center justify-center">
            <img
              src={galleryImages[selectedImageIndex]}
              alt="Fullscreen View"
              className="max-h-[80vh] max-w-full object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}

      <Information />
      <Footer />
    </div>
  );
}
