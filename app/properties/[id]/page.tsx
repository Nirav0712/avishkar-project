'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PropertyCard from '../../components/PropertyCard';
import { type Property } from '@/lib/properties';

export default function PropertyDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [property, setProperty] = useState<Property | null>(null);
    const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchPropertyDetails = async () => {
            try {
                setIsLoading(true);
                const id = parseInt(params.id as string);

                // Fetch current property
                const res = await fetch(`/api/properties/${id}`);
                if (!res.ok) {
                    throw new Error('Property not found');
                }
                const propData = await res.json();

                // Ensure proper typing and formatting
                const formattedProperty = {
                    ...propData,
                    featured: propData.featured === 1 || propData.featured === true,
                    price: Number(propData.price) || 0,
                    bedrooms: Number(propData.bedrooms) || 0,
                    bathrooms: Number(propData.bathrooms) || 0,
                    area: Number(propData.area) || 0,
                    image: propData.image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
                };

                setProperty(formattedProperty);

                // Fetch similar properties
                const allPropsRes = await fetch('/api/properties');
                if (allPropsRes.ok) {
                    const allPropsData = await allPropsRes.json();

                    const similar = allPropsData
                        .map((p: any) => ({
                            ...p,
                            featured: p.featured === 1 || p.featured === true,
                            price: Number(p.price) || 0,
                            bedrooms: Number(p.bedrooms) || 0,
                            bathrooms: Number(p.bathrooms) || 0,
                            area: Number(p.area) || 0,
                            image: p.image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
                        }))
                        .filter((p: Property) => p.id !== id && p.type === formattedProperty.type)
                        .slice(0, 3);
                    setSimilarProperties(similar);
                }

                // Check if favorite
                const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
                setIsFavorite(favorites.includes(id));
            } catch (err) {
                console.error("Error fetching property:", err);
                setError("Property not found");
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            fetchPropertyDetails();
        }
    }, [params.id]);

    const toggleFavorite = () => {
        if (!property) return;

        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        let newFavorites;

        if (favorites.includes(property.id)) {
            newFavorites = favorites.filter((id: number) => id !== property.id);
            setIsFavorite(false);
        } else {
            newFavorites = [...favorites, property.id];
            setIsFavorite(true);
        }

        localStorage.setItem('favorites', JSON.stringify(newFavorites));
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    // Auto-scroll images
    useEffect(() => {
        if (!property || !property.image) return;

        const images = property.image.split(',').filter(Boolean);
        if (images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, [property]);

    if (isLoading) {
        return (
            <>
                <Header />
                <div className="flex h-screen items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <i className="fas fa-spinner fa-spin text-4xl text-primary"></i>
                        <p className="text-xl font-medium text-gray-600">Loading property details...</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (error || !property) {
        return (
            <>
                <Header />
                <div className="py-20 min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                    <i className="fas fa-search h-24 w-24 text-gray-300 mb-6 text-6xl"></i>
                    <h1 className="text-3xl font-bold text-secondary mb-4">Property Not Found</h1>
                    <p className="text-gray-600 mb-8 max-w-md">
                        We couldn't find the property you're looking for. It might have been removed or the URL is incorrect.
                    </p>
                    <button
                        onClick={() => router.push('/properties')}
                        className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                    >
                        Browse All Properties
                    </button>
                </div>
                <Footer />
            </>
        );
    }

    const images = property.image.split(',').filter(Boolean);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

            <Header />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="container mx-auto px-4 max-w-7xl">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-8 overflow-x-auto whitespace-nowrap pb-2">
                        <button onClick={() => router.push('/')} className="hover:text-primary transition-colors">Home</button>
                        <i className="fas fa-chevron-right text-xs"></i>
                        <button onClick={() => router.push('/properties')} className="hover:text-primary transition-colors">Properties</button>
                        <i className="fas fa-chevron-right text-xs"></i>
                        <span className="text-[#0f1e3d] font-medium truncate">{property.title}</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            {/* Image Carousel */}
                            <div className="relative h-100 md:h-137.5 rounded-2xl overflow-hidden mb-8 group bg-gray-100 shadow-sm group">
                                {images.length > 0 ? (
                                    <>
                                        <img
                                            src={images[currentImageIndex]}
                                            alt={`${property.title} - Image ${currentImageIndex + 1}`}

                                            className="object-contain w-full h-full items-center justify-center"
                                        // priority
                                        />

                                        {images.length > 1 && (
                                            <>
                                                {/* Navigation buttons */}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 hover:bg-white text-secondary flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100 z-10"
                                                    aria-label="Previous image"
                                                >
                                                    <i className="fas fa-chevron-left text-lg"></i>
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 hover:bg-white text-secondary flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100 z-10"
                                                    aria-label="Next image"
                                                >
                                                    <i className="fas fa-chevron-right text-lg"></i>
                                                </button>

                                                {/* Dots indicator */}
                                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10 bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">
                                                    {images.map((_, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                                                            className={`w-2.5 h-2.5 rounded-full transition-all ${currentImageIndex === idx ? 'bg-[#e4c272] scale-125' : 'bg-white/50 hover:bg-white/80'}`}
                                                            aria-label={`Go to image ${idx + 1}`}
                                                        />
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                        <i className="fas fa-image text-6xl mb-4"></i>
                                        <p>No image available</p>
                                    </div>
                                )}

                                <div className="absolute top-6 left-6 flex flex-wrap gap-2 z-10">
                                    {property.featured && (
                                        <span className="bg-[#0f1e3d] text-white px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wide shadow-lg flex items-center gap-2">
                                            <i className="fas fa-star text-xs"></i>
                                            Featured
                                        </span>
                                    )}
                                    <span className={`${property.status === 'For Sale' ? 'bg-[#e4c272]' : 'bg-[#e4c272]'
                                        } text-[#0f1e3d] px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wide shadow-lg flex items-center gap-2`}>
                                        <i className={`fas ${property.status === 'For Sale' ? 'fa-tag' : 'fa-key'} text-xs`}></i>
                                        {property.status}
                                    </span>
                                </div>
                                <button
                                    onClick={toggleFavorite}
                                    className={`absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg z-10 ${isFavorite
                                        ? 'bg-red-500 text-white'
                                        : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
                                        }`}
                                >
                                    <i className={`${isFavorite ? 'fas' : 'far'} fa-heart text-xl`}></i>
                                </button>
                            </div>

                            {/* Thumbnail Gallery */}
                            {images.length > 1 && (
                                <div className="flex gap-4 mb-8 overflow-x-auto pb-2 snap-x hide-scrollbar">
                                    {images.map((imgUrl, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={`relative h-24 min-w-24 md:min-w-32 rounded-xl overflow-hidden cursor-pointer transition-all snap-start ${currentImageIndex === idx ? 'ring-4 ring-primary ring-offset-2' : 'hover:opacity-80'}`}
                                        >
                                            <img
                                                src={imgUrl}
                                                alt={`Thumbnail ${idx + 1}`}

                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Property Info */}
                            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 mb-8 border border-gray-100">
                                <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 gap-4">
                                    <div>
                                        <h1 className="text-3xl md:text-4xl font-bold text-[#0f1e3d] mb-3 leading-tight text-wrap">{property.title}</h1>
                                        <div className="flex items-center text-gray-600">
                                            <i className="fas fa-map-marker-alt text-[#e4c272] mr-2 text-lg"></i>
                                            <span className="text-lg">{property.location}</span>
                                        </div>
                                    </div>
                                    <div className="md:text-right bg-gray-50 p-4 rounded-xl border border-gray-100 self-start w-full md:w-auto">
                                        <div className="text-sm text-gray-500 font-medium mb-1">Asking Price</div>
                                        <div className="text-3xl font-bold text-[#0f1e3d]">
                                            {formatPrice(property.price)}
                                            {property.status === 'For Rent' && <span className="text-lg text-gray-600 font-normal">/mo</span>}
                                        </div>
                                    </div>
                                </div>

                                {/* Features Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-gray-100">
                                    {property.bedrooms > 0 && (
                                        <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl">
                                            <i className="fas fa-bed text-2xl text-[#e4c272] mb-3"></i>
                                            <div className="font-bold text-[#0f1e3d] text-xl">{property.bedrooms}</div>
                                            <div className="text-sm text-gray-500 font-medium">Bedrooms</div>
                                        </div>
                                    )}
                                    <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl">
                                        <i className="fas fa-bath text-2xl text-[#e4c272] mb-3"></i>
                                        <div className="font-bold text-[#0f1e3d] text-xl">{property.bathrooms}</div>
                                        <div className="text-sm text-gray-500 font-medium">Bathrooms</div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl">
                                        <i className="fas fa-ruler-combined text-2xl text-[#e4c272] mb-3"></i>
                                        <div className="font-bold text-[#0f1e3d] text-xl">{property.area.toLocaleString()}</div>
                                        <div className="text-sm text-gray-500 font-medium">Sq Ft</div>
                                    </div>
                                    {property.parking !== undefined && property.parking > 0 && (
                                        <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl">
                                            <i className="fas fa-car text-2xl text-[#e4c272] mb-3"></i>
                                            <div className="font-bold text-[#0f1e3d] text-xl">{property.parking}</div>
                                            <div className="text-sm text-gray-500 font-medium">Parking Spaces</div>
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="mt-8">
                                    <h2 className="text-2xl font-bold text-[#0f1e3d] mb-4 flex items-center gap-2">
                                        <i className="fas fa-align-left text-[#e4c272]"></i>
                                        Description
                                    </h2>
                                    <div className="text-gray-600 leading-relaxed space-y-4">
                                        {property.description.split('\n').map((paragraph, i) => (
                                            <p key={i}>{paragraph}</p>
                                        ))}
                                    </div>
                                </div>

                                {/* Property Details */}
                                <div className="mt-10">
                                    <h2 className="text-2xl font-bold text-[#0f1e3d] mb-6 flex items-center gap-2">
                                        <i className="fas fa-list-ul text-[#e4c272]"></i>
                                        Property Details
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
                                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                            <span className="text-gray-500 font-medium">Property ID:</span>
                                            <span className="font-bold text-[#0f1e3d]">#{property.id}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                            <span className="text-gray-500 font-medium">Property Type:</span>
                                            <span className="font-bold text-[#0f1e3d]">{property.type}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                            <span className="text-gray-500 font-medium">Status:</span>
                                            <span className="font-bold text-[#0f1e3d]">{property.status}</span>
                                        </div>
                                        {property.yearBuilt ? (
                                            <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                                <span className="text-gray-500 font-medium">Year Built:</span>
                                                <span className="font-bold text-[#0f1e3d]">{property.yearBuilt}</span>
                                            </div>
                                        ) : null}
                                        <div className="flex justify-between items-center py-2 border-b border-gray-200 md:col-span-2">
                                            <span className="text-gray-500 font-medium">Area:</span>
                                            <span className="font-bold text-[#0f1e3d]">{property.area.toLocaleString()} sqft</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Amenities */}
                                {property.amenities && property.amenities.length > 0 && (
                                    <div className="mt-10">
                                        <h2 className="text-2xl font-bold text-[#0f1e3d] mb-6 flex items-center gap-2">
                                            <i className="fas fa-concierge-bell text-[#e4c272]"></i>
                                            Features & Amenities
                                        </h2>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {property.amenities.map((amenity, index) => (
                                                <div key={index} className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                    <div className="w-6 h-6 rounded-full bg-[#e4c272]/20 flex items-center justify-center shrink-0">
                                                        <i className="fas fa-check text-[#e4c272] text-xs"></i>
                                                    </div>
                                                    <span className="font-medium">{amenity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            {/* Contact Form */}
                            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 sticky top-24 border border-gray-100">
                                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                                        <i className="fas fa-user-tie text-2xl text-gray-400"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#0f1e3d] text-lg">Listing Agent</h3>
                                        <p className="text-[#e4c272] font-medium text-sm">Avishkar Team</p>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-[#0f1e3d] mb-6">Request Information</h3>
                                <form className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <i className="fas fa-user text-gray-400"></i>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="John Doe"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#0f1e3d] focus:ring-2 focus:ring-[#0f1e3d]/20 bg-gray-50 focus:bg-white transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <i className="fas fa-envelope text-gray-400"></i>
                                            </div>
                                            <input
                                                type="email"
                                                placeholder="john@example.com"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#0f1e3d] focus:ring-2 focus:ring-[#0f1e3d]/20 bg-gray-50 focus:bg-white transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <i className="fas fa-phone text-gray-400"></i>
                                            </div>
                                            <input
                                                type="tel"
                                                placeholder="+91 98765 43210"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#0f1e3d] focus:ring-2 focus:ring-[#0f1e3d]/20 bg-gray-50 focus:bg-white transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                        <textarea
                                            rows={4}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#0f1e3d] focus:ring-2 focus:ring-[#0f1e3d]/20 bg-gray-50 focus:bg-white transition-colors resize-none"
                                            defaultValue={`Hi, I'm interested in viewing "${property.title}". Please get in touch with me to schedule a visit.`}
                                        ></textarea>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.preventDefault(); alert('Message sent successfully! Our team will contact you soon.'); }}
                                        className="w-full bg-white text-[#0f1e3d] border border-[#0f1e3d] px-6 py-4 rounded-xl font-bold hover:bg-[#0f1e3d] hover:text-[#e4c272] transition-colors shadow-lg shadow-gray-300/30 flex items-center justify-center gap-2 mt-2"
                                    >
                                        <i className="fas fa-paper-plane"></i>
                                        Send Message
                                    </button>
                                </form>
                            </div>

                            {/* Share */}
                            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                                <h3 className="text-xl font-bold text-[#0f1e3d] mb-4 flex items-center gap-2">
                                    <i className="fas fa-share-alt text-[#0f1e3d]"></i>
                                    Share Property
                                </h3>
                                <div className="grid grid-cols-4 gap-3">
                                    <button className="flex items-center justify-center bg-[#1877F2] text-white py-3 rounded-xl hover:bg-[#1877F2]/90 transition-colors shadow-sm">
                                        <i className="fab fa-facebook-f text-lg"></i>
                                    </button>
                                    <button className="flex items-center justify-center bg-[#1DA1F2] text-white py-3 rounded-xl hover:bg-[#1DA1F2]/90 transition-colors shadow-sm">
                                        <i className="fab fa-twitter text-lg"></i>
                                    </button>
                                    <button className="flex items-center justify-center bg-[#25D366] text-white py-3 rounded-xl hover:bg-[#25D366]/90 transition-colors shadow-sm">
                                        <i className="fab fa-whatsapp text-lg"></i>
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(window.location.href);
                                            alert('Link copied to clipboard!');
                                        }}
                                        className="flex items-center justify-center bg-gray-800 text-white py-3 rounded-xl hover:bg-gray-900 transition-colors shadow-sm"
                                        title="Copy Link"
                                    >
                                        <i className="fas fa-link text-lg"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Similar Properties */}
                    {similarProperties.length > 0 && (
                        <div className="mt-24 mb-12">
                            <div className="flex items-end justify-between mb-8">
                                <div>
                                    <h2 className="text-sm font-bold text-[#e4c272] uppercase tracking-widest mb-1 mt-2">More Options</h2>
                                    <h3 className="text-3xl md:text-4xl font-bold text-[#0f1e3d]">Similar Properties</h3>
                                </div>
                                <button onClick={() => router.push('/properties')} className="hidden md:flex items-center gap-2 text-[#0f1e3d] font-semibold hover:bg-[#e4c272] transition-colors border-2 border-[#0f1e3d] px-5 py-2.5 rounded-full">
                                    View All <i className="fas fa-arrow-right"></i>
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {similarProperties.map((prop) => (
                                    <PropertyCard key={prop.id} property={prop} />
                                ))}
                            </div>
                            <button onClick={() => router.push('/properties')} className="mt-8 w-full md:hidden flex items-center justify-center gap-2 text-[#0f1e3d] font-semibold border-2 border-primary/20 px-5 py-3 rounded-xl">
                                View All Properties <i className="fas fa-arrow-right"></i>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
}
