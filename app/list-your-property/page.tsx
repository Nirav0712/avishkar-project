"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

const PROPERTY_TYPES = [
  { id: "Apartment", label: "Apartment / Flat", icon: "fa-building", hasBeds: true },
  { id: "Penthouse", label: "Penthouse", icon: "fa-crown", hasBeds: true },
  { id: "Villa", label: "Independent House / Villa", icon: "fa-house-chimney", hasBeds: true },
  { id: "Plot", label: "Residential Plot / Land", icon: "fa-vector-square", hasBeds: false },
  { id: "Commercial Office", label: "Commercial Office", icon: "fa-briefcase", hasBeds: false },
  { id: "Shop / Showroom", label: "Shop / Showroom", icon: "fa-shop", hasBeds: false },
  { id: "Other", label: "Other Commercial / Industrial", icon: "fa-warehouse", hasBeds: false },
];

const AHMEDABAD_LOCALITIES = [
  "SG Highway",
  "Sindhu Bhavan Road (SBR)",
  "Science City",
  "Gota",
  "Vaishnodevi Circle",
  "Zundal",
  "South Bopal",
  "Shela",
  "Ambli",
  "Bodakdev",
  "Satellite",
  "Prahlad Nagar",
  "Thaltej",
  "Vastrapur",
  "Navrangpura",
  "Chandkheda",
  "Shilaj",
  "Other Area",
];

export default function ListYourPropertyPage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Owner Information
    owner_name: "",
    owner_phone: "",
    owner_email: "",
    owner_whatsapp: "",
    preferred_contact_method: "Phone",

    // Step 2: Property Information
    listing_purpose: "Sell" as "Sell" | "Rent",
    property_type: "Apartment",
    property_title: "",
    locality: "SG Highway",
    custom_locality: "",
    city: "Ahmedabad",
    address: "",
    expected_price: "",
    area: "",
    area_unit: "sq ft",
    bedrooms: "3",
    bathrooms: "3",
    furnishing: "Semi-Furnished",
    parking: "1",
    description: "",

    // Step 4: Consent
    consent_given: true,
  });

  // Photos State
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Field-level error state
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successReference, setSuccessReference] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Helper to append incoming files with validation
  const handleIncomingFiles = (incomingFiles: File[]) => {
    const validImages = incomingFiles.filter(f => f.type.startsWith('image/'));
    if (validImages.length === 0) {
      setErrorMessage("Please select valid image files (JPG, PNG, or WEBP).");
      return;
    }

    if (selectedFiles.length + validImages.length > 8) {
      setErrorMessage("You can upload a maximum of 8 images.");
      return;
    }

    setErrorMessage("");
    const newFiles = [...selectedFiles, ...validImages];
    setSelectedFiles(newFiles);

    const newPreviews = validImages.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  // Handle Image Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    handleIncomingFiles(Array.from(e.target.files));
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setUploadedUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const setAsCover = (index: number) => {
    if (index === 0) return;
    const newFiles = [...selectedFiles];
    const [targetFile] = newFiles.splice(index, 1);
    newFiles.unshift(targetFile);
    setSelectedFiles(newFiles);

    const newPreviews = [...previewUrls];
    const [targetPreview] = newPreviews.splice(index, 1);
    newPreviews.unshift(targetPreview);
    setPreviewUrls(newPreviews);

    if (uploadedUrls.length > 0) {
      const newUploaded = [...uploadedUrls];
      const [targetUploaded] = newUploaded.splice(index, 1);
      newUploaded.unshift(targetUploaded);
      setUploadedUrls(newUploaded);
    }
  };

  // Upload images to backend
  const uploadImagesToServer = async (): Promise<string[]> => {
    if (selectedFiles.length === 0) return [];
    if (uploadedUrls.length === selectedFiles.length) return uploadedUrls;

    setUploadingImages(true);
    try {
      const data = new FormData();
      selectedFiles.forEach((file) => {
        data.append("files", file);
      });

      const res = await fetch("/api/upload/property-images", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to upload images.");
      }

      const resJson = await res.json();
      setUploadedUrls(resJson.urls || []);
      return resJson.urls || [];
    } finally {
      setUploadingImages(false);
    }
  };

  // Validation
  const validateStep1 = () => {
    const errors: Record<string, string> = {};

    if (!formData.owner_name.trim()) {
      errors.owner_name = "Full name is required";
    }

    const cleanPhone = formData.owner_phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      errors.owner_phone = "Valid 10-digit mobile number is required";
    }

    if (formData.owner_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.owner_email)) {
      errors.owner_email = "Please enter a valid email address";
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setErrorMessage(Object.values(errors)[0]);
      return false;
    }

    setErrorMessage("");
    return true;
  };

  const validateStep2 = () => {
    const errors: Record<string, string> = {};

    if (!formData.property_title.trim()) {
      errors.property_title = "Please enter a descriptive property title.";
    }

    const effectiveLocality =
      formData.locality === "Other Area" ? formData.custom_locality.trim() : formData.locality;
    if (!effectiveLocality) {
      errors.locality = "Please specify the property locality or area.";
    }

    const priceNum = Number(formData.expected_price);
    if (!formData.expected_price || isNaN(priceNum) || priceNum <= 0) {
      errors.expected_price = `Valid ${formData.listing_purpose === "Rent" ? "monthly rent" : "selling price"} is required.`;
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setErrorMessage(Object.values(errors)[0]);
      return false;
    }

    setErrorMessage("");
    return true;
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      if (!validateStep1()) return;
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!validateStep2()) return;
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  // Final Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent_given) {
      setErrorMessage("Please agree to the contact consent checkbox to proceed.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      // 1. Upload images first if any selected
      let finalImages = uploadedUrls;
      if (selectedFiles.length > 0 && uploadedUrls.length === 0) {
        finalImages = await uploadImagesToServer();
      }

      const effectiveLocality =
        formData.locality === "Other Area" ? formData.custom_locality.trim() : formData.locality;

      const payload = {
        owner_name: formData.owner_name,
        owner_phone: formData.owner_phone,
        owner_email: formData.owner_email || null,
        owner_whatsapp: formData.owner_whatsapp || null,
        preferred_contact_method: formData.preferred_contact_method,
        listing_purpose: formData.listing_purpose,
        property_type: formData.property_type,
        property_title: formData.property_title,
        locality: effectiveLocality,
        city: formData.city,
        address: formData.address,
        expected_price: Number(formData.expected_price),
        area: Number(formData.area) || 0,
        area_unit: formData.area_unit,
        bedrooms: Number(formData.bedrooms) || 0,
        bathrooms: Number(formData.bathrooms) || 0,
        furnishing: formData.furnishing,
        parking: Number(formData.parking) || 0,
        description: formData.description,
        images: finalImages,
        consent_given: formData.consent_given,
      };

      const res = await fetch("/api/property-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit property. Please check your inputs.");
      }

      setSuccessReference(data.reference_number);
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const copyReference = () => {
    if (successReference) {
      navigator.clipboard.writeText(successReference);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const selectedTypeObj = PROPERTY_TYPES.find((t) => t.id === formData.property_type) || PROPERTY_TYPES[0];

  return (
    <div className="min-h-screen bg-[#070e1b] text-slate-100 flex flex-col font-sans selection:bg-[#d4af37]/30 selection:text-white">
      <Header />

      {/* Hero Header Section */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-white/10 overflow-hidden bg-gradient-to-b from-[#0b162c] to-[#070e1b]">
        {/* Glow Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-[#d4af37]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#f5d77f] text-xs font-semibold uppercase tracking-wider mb-4">
            <i className="fa-solid fa-house-chimney-user text-xs" />
            <span>Owner & Seller Assistance Portal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight leading-tight mb-4">
            List Your Property with <span className="gold-gradient-text">Avishkar Realty</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Connect with genuine property seekers and get assistance from our real estate team across Ahmedabad&apos;s prime residential and commercial corridors.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <i className="fa-solid fa-shield-check text-[#d4af37]" />
              <span>Verified Review System</span>
            </span>
            <span className="text-slate-600">&bull;</span>
            <span className="flex items-center gap-1.5">
              <i className="fa-solid fa-lock text-[#d4af37]" />
              <span>Private Owner Contact</span>
            </span>
            <span className="text-slate-600">&bull;</span>
            <span className="flex items-center gap-1.5">
              <i className="fa-solid fa-handshake text-[#d4af37]" />
              <span>Dedicated Brokerage Support</span>
            </span>
          </div>
        </div>
      </section>

      {/* Main Wizard Section */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10">
        {/* Success Confirmation Card */}
        {successReference ? (
          <div className="glass-card bg-[#0c1628]/95 rounded-3xl p-8 sm:p-12 border border-[#d4af37]/40 shadow-2xl text-center space-y-6 animate-fadeIn">
            <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-3xl mx-auto shadow-lg shadow-emerald-500/20">
              <i className="fa-solid fa-circle-check" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                Property Submitted Successfully!
              </h2>
              <p className="text-sm text-slate-300 max-w-lg mx-auto">
                Thank you for submitting your property. Our real estate team will review your details and contact you if additional information is required.
              </p>
            </div>

            {/* Reference Badge */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 max-w-md mx-auto flex items-center justify-between gap-3">
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Reference Tracking ID
                </div>
                <div className="text-lg font-mono font-bold text-[#f5d77f]">
                  {successReference}
                </div>
              </div>
              <button
                type="button"
                onClick={copyReference}
                className="px-3.5 py-2 rounded-xl bg-[#d4af37]/20 hover:bg-[#d4af37]/30 border border-[#d4af37]/40 text-xs font-semibold text-[#f5d77f] transition flex items-center gap-1.5"
              >
                <i className={`fa-solid ${copiedRef ? "fa-check" : "fa-copy"}`} />
                <span>{copiedRef ? "Copied" : "Copy ID"}</span>
              </button>
            </div>

            {/* Explanatory Notice */}
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200 text-left max-w-lg mx-auto space-y-1.5">
              <div className="font-semibold flex items-center gap-1.5 text-blue-300">
                <i className="fa-solid fa-circle-info" />
                <span>Verification and Review Process</span>
              </div>
              <p className="text-slate-300">
                To maintain high quality for buyers and tenants, all listings undergo internal review before being approved for public display. Your personal phone number and exact address remain confidential.
              </p>
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`https://wa.me/917041395595?text=Hello%20Avishkar%20Realty,%20I%20have%20submitted%20my%20property%20listing%20with%20Reference%20${successReference}.%20Please%20guide%20me%20on%20the%20next%20steps.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                <i className="fa-brands fa-whatsapp text-sm" />
                <span>Chat on WhatsApp</span>
              </a>

              <Link
                href="/properties"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/15 transition flex items-center justify-center gap-2"
              >
                <span>Browse Live Properties</span>
                <i className="fa-solid fa-arrow-right text-xs" />
              </Link>

              <button
                type="button"
                onClick={() => {
                  setSuccessReference(null);
                  setCurrentStep(1);
                  setFormData({
                    owner_name: "",
                    owner_phone: "",
                    owner_email: "",
                    owner_whatsapp: "",
                    preferred_contact_method: "Phone",
                    listing_purpose: "Sell",
                    property_type: "Apartment",
                    property_title: "",
                    locality: "SG Highway",
                    custom_locality: "",
                    city: "Ahmedabad",
                    address: "",
                    expected_price: "",
                    area: "",
                    area_unit: "sq ft",
                    bedrooms: "3",
                    bathrooms: "3",
                    furnishing: "Semi-Furnished",
                    parking: "1",
                    description: "",
                    consent_given: true,
                  });
                  setSelectedFiles([]);
                  setPreviewUrls([]);
                  setUploadedUrls([]);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-slate-400 hover:text-white text-xs font-semibold transition"
              >
                Submit Another Property
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Step Progress Indicator */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {[
                { step: 1, title: "Owner Info", icon: "fa-user" },
                { step: 2, title: "Property Details", icon: "fa-building" },
                { step: 3, title: "Photos", icon: "fa-images" },
                { step: 4, title: "Review & Submit", icon: "fa-clipboard-check" },
              ].map((s) => {
                const isCompleted = currentStep > s.step;
                const isCurrent = currentStep === s.step;
                return (
                  <button
                    type="button"
                    key={s.step}
                    disabled={!isCompleted && !isCurrent}
                    onClick={() => {
                      if (isCompleted) {
                        setErrorMessage("");
                        setCurrentStep(s.step as any);
                      }
                    }}
                    aria-label={`Step ${s.step}: ${s.title}`}
                    className={`p-3 rounded-2xl border transition-all text-center flex flex-col items-center justify-center ${
                      isCurrent
                        ? "bg-[#d4af37]/15 border-[#d4af37]/60 text-[#f5d77f] shadow-lg shadow-[#d4af37]/10"
                        : isCompleted
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 cursor-pointer"
                        : "bg-white/[0.02] border-white/10 text-slate-500 cursor-not-allowed opacity-60"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 ${
                        isCurrent
                          ? "bg-[#d4af37] text-[#0b1528]"
                          : isCompleted
                          ? "bg-emerald-500 text-white"
                          : "bg-white/10 text-slate-400"
                      }`}
                    >
                      {isCompleted ? <i className="fa-solid fa-check text-[10px]" /> : s.step}
                    </div>
                    <span className="text-[11px] font-semibold hidden sm:inline">{s.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-3">
                <i className="fa-solid fa-circle-exclamation text-rose-400 text-base shrink-0" />
                <span className="font-medium">{errorMessage}</span>
              </div>
            )}

            {/* Form Container */}
            <form onSubmit={handleSubmit} className="glass-card bg-[#0c1628]/95 rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl space-y-8">
              {/* ========================================================================= */}
              {/* STEP 1: OWNER INFORMATION */}
              {/* ========================================================================= */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-white/10 pb-4">
                    <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2.5">
                      <i className="fa-solid fa-id-card text-[#d4af37]" />
                      <span>Step 1: Property Owner Information</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Please enter your contact details. Avishkar Realty values your privacy; your direct contact information is never published publicly.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        Owner Full Name <span className="text-[#d4af37]">*</span>
                      </label>
                      <div className="relative">
                        <i className="fa-solid fa-user absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Rajeshbhai Patel"
                          value={formData.owner_name}
                          onChange={(e) => {
                            setFormData({ ...formData, owner_name: e.target.value });
                            if (fieldErrors.owner_name) setFieldErrors(prev => ({ ...prev, owner_name: '' }));
                          }}
                          className={`w-full pl-9 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none transition ${
                            fieldErrors.owner_name
                              ? "border-rose-500/70 focus:border-rose-400 bg-rose-500/5"
                              : "border-white/10 focus:border-[#d4af37]"
                          }`}
                        />
                      </div>
                      {fieldErrors.owner_name && (
                        <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-medium">
                          <i className="fa-solid fa-circle-exclamation text-[10px]" />
                          <span>{fieldErrors.owner_name}</span>
                        </p>
                      )}
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        Mobile Number <span className="text-[#d4af37]">*</span>
                      </label>
                      <div className="relative">
                        <i className="fa-solid fa-phone absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 9876543210"
                          value={formData.owner_phone}
                          onChange={(e) => {
                            setFormData({ ...formData, owner_phone: e.target.value });
                            if (fieldErrors.owner_phone) setFieldErrors(prev => ({ ...prev, owner_phone: '' }));
                          }}
                          className={`w-full pl-9 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none transition ${
                            fieldErrors.owner_phone
                              ? "border-rose-500/70 focus:border-rose-400 bg-rose-500/5"
                              : "border-white/10 focus:border-[#d4af37]"
                          }`}
                        />
                      </div>
                      {fieldErrors.owner_phone && (
                        <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-medium">
                          <i className="fa-solid fa-circle-exclamation text-[10px]" />
                          <span>{fieldErrors.owner_phone}</span>
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        Email Address <span className="text-slate-500 text-[10px] lowercase">(optional)</span>
                      </label>
                      <div className="relative">
                        <i className="fa-solid fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                        <input
                          type="email"
                          placeholder="e.g. rajesh@example.com"
                          value={formData.owner_email}
                          onChange={(e) => {
                            setFormData({ ...formData, owner_email: e.target.value });
                            if (fieldErrors.owner_email) setFieldErrors(prev => ({ ...prev, owner_email: '' }));
                          }}
                          className={`w-full pl-9 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none transition ${
                            fieldErrors.owner_email
                              ? "border-rose-500/70 focus:border-rose-400 bg-rose-500/5"
                              : "border-white/10 focus:border-[#d4af37]"
                          }`}
                        />
                      </div>
                      {fieldErrors.owner_email && (
                        <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-medium">
                          <i className="fa-solid fa-circle-exclamation text-[10px]" />
                          <span>{fieldErrors.owner_email}</span>
                        </p>
                      )}
                    </div>

                    {/* WhatsApp */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                          WhatsApp Number <span className="text-slate-500 text-[10px] lowercase">(optional)</span>
                        </label>
                        {formData.owner_phone && (
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, owner_whatsapp: prev.owner_phone }))}
                            className="text-[10px] text-[#d4af37] hover:text-[#f5d77f] hover:underline font-semibold transition"
                          >
                            Same as mobile
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <i className="fa-brands fa-whatsapp absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                        <input
                          type="tel"
                          placeholder="Same as mobile if left blank"
                          value={formData.owner_whatsapp}
                          onChange={(e) => setFormData({ ...formData, owner_whatsapp: e.target.value })}
                          className="w-full pl-9 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#d4af37] transition"
                        />
                      </div>
                    </div>

                    {/* Preferred Contact Method */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        Preferred Contact Method
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {["Phone", "WhatsApp", "Email"].map((method) => {
                          const isSelected = formData.preferred_contact_method === method;
                          return (
                            <button
                              type="button"
                              key={method}
                              onClick={() => setFormData({ ...formData, preferred_contact_method: method })}
                              className={`py-2.5 px-4 rounded-xl text-xs font-semibold border transition flex items-center justify-center gap-2 ${
                                isSelected
                                  ? "bg-[#d4af37]/20 border-[#d4af37] text-[#f5d77f]"
                                  : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                              }`}
                            >
                              <i
                                className={`fa-solid ${
                                  method === "Phone" ? "fa-phone" : method === "WhatsApp" ? "fa-comment-dots" : "fa-envelope"
                                } text-xs`}
                              />
                              <span>{method}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e4c272] text-[#0b1528] font-bold text-xs shadow-lg shadow-[#d4af37]/20 hover:brightness-110 transition flex items-center gap-2"
                    >
                      <span>Continue to Property Details</span>
                      <i className="fa-solid fa-arrow-right text-xs" />
                    </button>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* STEP 2: PROPERTY INFORMATION */}
              {/* ========================================================================= */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-white/10 pb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2.5">
                        <i className="fa-solid fa-building text-[#d4af37]" />
                        <span>Step 2: Property Specifications</span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Tell us about your property location, configuration, and expected financial terms.
                      </p>
                    </div>

                    {/* Purpose Toggle */}
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                      {(["Sell", "Rent"] as const).map((p) => {
                        const active = formData.listing_purpose === p;
                        return (
                          <button
                            type="button"
                            key={p}
                            onClick={() => setFormData({ ...formData, listing_purpose: p })}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                              active
                                ? "bg-[#d4af37] text-[#0b1528] shadow-md"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            For {p}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Property Type Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
                      Property Category <span className="text-[#d4af37]">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {PROPERTY_TYPES.map((type) => {
                        const isSelected = formData.property_type === type.id;
                        return (
                          <button
                            type="button"
                            key={type.id}
                            onClick={() => setFormData({ ...formData, property_type: type.id })}
                            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between gap-2 ${
                              isSelected
                                ? "bg-[#d4af37]/20 border-[#d4af37] text-[#f5d77f] shadow-lg shadow-[#d4af37]/10"
                                : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.08]"
                            }`}
                          >
                            <i className={`fa-solid ${type.icon} text-base ${isSelected ? "text-[#d4af37]" : "text-slate-500"}`} />
                            <span className="text-xs font-semibold">{type.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Title & Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Title */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        Listing Title <span className="text-[#d4af37]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Premium 3 BHK Apartment with Garden View in Sun South Rayz"
                        value={formData.property_title}
                        onChange={(e) => {
                          setFormData({ ...formData, property_title: e.target.value });
                          if (fieldErrors.property_title) setFieldErrors(prev => ({ ...prev, property_title: '' }));
                        }}
                        className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none transition ${
                          fieldErrors.property_title
                            ? "border-rose-500/70 focus:border-rose-400 bg-rose-500/5"
                            : "border-white/10 focus:border-[#d4af37]"
                        }`}
                      />
                      {fieldErrors.property_title && (
                        <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-medium">
                          <i className="fa-solid fa-circle-exclamation text-[10px]" />
                          <span>{fieldErrors.property_title}</span>
                        </p>
                      )}
                    </div>

                    {/* Locality */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        Locality / Area (Ahmedabad) <span className="text-[#d4af37]">*</span>
                      </label>
                      <select
                        value={formData.locality}
                        onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                        className="w-full px-3 py-3 bg-[#0c1628] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37] transition"
                      >
                        {AHMEDABAD_LOCALITIES.map((loc) => (
                          <option key={loc} value={loc} className="bg-[#0c1628] text-white">
                            {loc}
                          </option>
                        ))}
                      </select>

                      {formData.locality === "Other Area" && (
                        <input
                          type="text"
                          placeholder="Type your locality / landmark"
                          value={formData.custom_locality}
                          onChange={(e) => setFormData({ ...formData, custom_locality: e.target.value })}
                          className="mt-2 w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#d4af37]"
                        />
                      )}
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    {/* Price / Rent */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        Expected {formData.listing_purpose === "Rent" ? "Monthly Rent (₹)" : "Selling Price (₹)"} <span className="text-[#d4af37]">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#d4af37] font-bold text-xs">
                          ₹
                        </span>
                        <input
                          type="number"
                          required
                          min="0"
                          placeholder={formData.listing_purpose === "Rent" ? "e.g. 35000" : "e.g. 12500000 (1.25 Cr)"}
                          value={formData.expected_price}
                          onChange={(e) => {
                            setFormData({ ...formData, expected_price: e.target.value });
                            if (fieldErrors.expected_price) setFieldErrors(prev => ({ ...prev, expected_price: '' }));
                          }}
                          className={`w-full pl-8 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none font-mono transition ${
                            fieldErrors.expected_price
                              ? "border-rose-500/70 focus:border-rose-400 bg-rose-500/5"
                              : "border-white/10 focus:border-[#d4af37]"
                          }`}
                        />
                      </div>
                      {fieldErrors.expected_price && (
                        <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-medium">
                          <i className="fa-solid fa-circle-exclamation text-[10px]" />
                          <span>{fieldErrors.expected_price}</span>
                        </p>
                      )}
                      {Number(formData.expected_price) > 0 && (
                        <div className="text-[11px] text-[#f5d77f] mt-1 font-semibold flex items-center gap-1">
                          <i className="fa-solid fa-indian-rupee-sign text-[10px]" />
                          <span>
                            {Number(formData.expected_price) >= 10000000
                              ? `${(Number(formData.expected_price) / 10000000).toFixed(2)} Crore`
                              : Number(formData.expected_price) >= 100000
                              ? `${(Number(formData.expected_price) / 100000).toFixed(2)} Lakh`
                              : Number(formData.expected_price).toLocaleString("en-IN")}
                            {formData.listing_purpose === "Rent" ? " / month" : ""}
                          </span>
                        </div>
                      )}
                      {/* Quick price presets */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {(formData.listing_purpose === "Rent"
                          ? [
                              { label: "₹20K", val: "20000" },
                              { label: "₹35K", val: "35000" },
                              { label: "₹50K", val: "50000" },
                              { label: "₹75K", val: "75000" },
                              { label: "₹1L", val: "100000" },
                            ]
                          : [
                              { label: "₹50L", val: "5000000" },
                              { label: "₹85L", val: "8500000" },
                              { label: "₹1.25Cr", val: "12500000" },
                              { label: "₹2Cr", val: "20000000" },
                              { label: "₹3.5Cr", val: "35000000" },
                              { label: "₹5Cr+", val: "50000000" },
                            ]
                        ).map((preset) => (
                          <button
                            type="button"
                            key={preset.val}
                            onClick={() => {
                              setFormData(prev => ({ ...prev, expected_price: preset.val }));
                              if (fieldErrors.expected_price) setFieldErrors(prev => ({ ...prev, expected_price: '' }));
                            }}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border transition ${
                              formData.expected_price === preset.val
                                ? "bg-[#d4af37] text-[#0b1528] border-[#d4af37]"
                                : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Carpet Area */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        Area / Super Built-up
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="e.g. 1650"
                          value={formData.area}
                          onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#d4af37]"
                        />
                        <select
                          value={formData.area_unit}
                          onChange={(e) => setFormData({ ...formData, area_unit: e.target.value })}
                          className="w-28 px-2 py-3 bg-[#0c1628] border border-white/10 rounded-xl text-white text-xs focus:outline-none"
                        >
                          <option value="sq ft">sq ft</option>
                          <option value="sq yards">sq yards</option>
                          <option value="sq m">sq m</option>
                        </select>
                      </div>
                    </div>

                    {/* Conditional Residential Fields: Bedrooms & Bathrooms */}
                    {selectedTypeObj.hasBeds && (
                      <>
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                            Bedrooms (BHK)
                          </label>
                          <select
                            value={formData.bedrooms}
                            onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                            className="w-full px-3 py-3 bg-[#0c1628] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                          >
                            <option value="1">1 BHK</option>
                            <option value="2">2 BHK</option>
                            <option value="3">3 BHK</option>
                            <option value="4">4 BHK</option>
                            <option value="5">5+ BHK</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                            Bathrooms
                          </label>
                          <select
                            value={formData.bathrooms}
                            onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                            className="w-full px-3 py-3 bg-[#0c1628] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                          >
                            <option value="1">1 Bathroom</option>
                            <option value="2">2 Bathrooms</option>
                            <option value="3">3 Bathrooms</option>
                            <option value="4">4 Bathrooms</option>
                            <option value="5">5+ Bathrooms</option>
                          </select>
                        </div>
                      </>
                    )}

                    {/* Furnishing Status (if not plot) */}
                    {formData.property_type !== "Plot" && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                          Furnishing Status
                        </label>
                        <select
                          value={formData.furnishing}
                          onChange={(e) => setFormData({ ...formData, furnishing: e.target.value })}
                          className="w-full px-3 py-3 bg-[#0c1628] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                        >
                          <option value="Unfurnished">Unfurnished</option>
                          <option value="Semi-Furnished">Semi-Furnished</option>
                          <option value="Fully Furnished">Fully Furnished</option>
                        </select>
                      </div>
                    )}

                    {/* Parking */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        Allocated Parking
                      </label>
                      <select
                        value={formData.parking}
                        onChange={(e) => setFormData({ ...formData, parking: e.target.value })}
                        className="w-full px-3 py-3 bg-[#0c1628] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                      >
                        <option value="0">No Dedicated Parking</option>
                        <option value="1">1 Covered / Open Car Parking</option>
                        <option value="2">2 Car Parking Spaces</option>
                        <option value="3">3+ Car Parking Spaces</option>
                      </select>
                    </div>

                    {/* Description */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        Key Features & Description <span className="text-slate-500 text-[10px] lowercase">(optional)</span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Mention tower name, floor level, road facing, balcony view, nearby schools, or any special specifications..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition"
                    >
                      &larr; Back to Owner Info
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e4c272] text-[#0b1528] font-bold text-xs shadow-lg shadow-[#d4af37]/20 hover:brightness-110 transition flex items-center gap-2"
                    >
                      <span>Continue to Upload Photos</span>
                      <i className="fa-solid fa-arrow-right text-xs" />
                    </button>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* STEP 3: PROPERTY PHOTOS */}
              {/* ========================================================================= */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-white/10 pb-4">
                    <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2.5">
                      <i className="fa-solid fa-images text-[#d4af37]" />
                      <span>Step 3: Property Photos & Walkthrough Images</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Upload high-quality images of the living room, bedrooms, kitchen, balcony, and building elevation. (Max 8 images, up to 5MB each).
                    </p>
                  </div>

                  {/* Dropzone */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      if (e.dataTransfer.files) {
                        handleIncomingFiles(Array.from(e.dataTransfer.files));
                      }
                    }}
                    className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition group ${
                      isDragging
                        ? "border-[#d4af37] bg-[#d4af37]/10 scale-[1.01]"
                        : "border-white/15 hover:border-[#d4af37]/50 bg-white/[0.01] hover:bg-white/[0.03]"
                    }`}
                  >
                    <input
                      type="file"
                      id="property-file-input"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="w-14 h-14 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/25 flex items-center justify-center text-xl text-[#d4af37] mx-auto mb-3 group-hover:scale-110 transition">
                      <i className={`fa-solid ${isDragging ? "fa-arrow-down" : "fa-cloud-arrow-up"}`} />
                    </div>
                    <div className="text-sm font-semibold text-white mb-1">
                      {isDragging ? "Drop your photos here" : "Click or drag and drop property photos here"}
                    </div>
                    <div className="text-xs text-slate-400">
                      Supports JPG, PNG, and WEBP formats &bull; Maximum 8 photos
                    </div>
                  </div>

                  {/* Previews Grid */}
                  {previewUrls.length > 0 && (
                    <div className="space-y-3">
                      <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                        <span>Selected Photos ({previewUrls.length} of 8)</span>
                        <span className="text-slate-500 text-[11px]">Primary cover image is marked with a star</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {previewUrls.map((url, idx) => (
                          <div
                            key={idx}
                            className={`relative aspect-video rounded-xl overflow-hidden border bg-black/40 group shadow-lg transition ${
                              idx === 0 ? "border-[#d4af37]/60 ring-2 ring-[#d4af37]/30" : "border-white/15"
                            }`}
                          >
                            <img
                              src={url}
                              alt={`Upload preview ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            {idx === 0 ? (
                              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#d4af37] text-[#0b1528] text-[9px] font-bold uppercase tracking-wider shadow">
                                Cover
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setAsCover(idx)}
                                className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-black/70 hover:bg-[#d4af37] text-gray-300 hover:text-[#0b1528] text-[9px] font-bold uppercase tracking-wider shadow opacity-0 group-hover:opacity-100 transition"
                                title="Set as primary cover photo"
                              >
                                Set Cover
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-rose-600/90 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition shadow hover:bg-rose-500"
                              title="Remove photo"
                            >
                              <i className="fa-solid fa-xmark" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition"
                    >
                      &larr; Back to Property Info
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e4c272] text-[#0b1528] font-bold text-xs shadow-lg shadow-[#d4af37]/20 hover:brightness-110 transition flex items-center gap-2"
                    >
                      <span>Review Details</span>
                      <i className="fa-solid fa-arrow-right text-xs" />
                    </button>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* STEP 4: REVIEW AND SUBMIT */}
              {/* ========================================================================= */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-white/10 pb-4">
                    <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2.5">
                      <i className="fa-solid fa-clipboard-check text-[#d4af37]" />
                      <span>Step 4: Review Your Submission</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Please verify all submitted details before sending them to the Avishkar Realty review team.
                    </p>
                  </div>

                  {/* Summary Card */}
                  <div className="rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden divide-y divide-white/10">
                    {/* Section 1: Property Overview & Financials */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-full bg-[#d4af37]/20 text-[#f5d77f] text-[10px] font-bold uppercase tracking-wider border border-[#d4af37]/40">
                            For {formData.listing_purpose}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">{formData.property_type}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(2)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#d4af37]/20 text-slate-300 hover:text-[#f5d77f] text-xs font-medium border border-white/10 hover:border-[#d4af37]/30 transition"
                          title="Edit property details or price"
                        >
                          <i className="fa-solid fa-pen-to-square text-[11px]" />
                          <span>Edit Details</span>
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                        <div className="text-base font-serif font-bold text-white tracking-wide">
                          {formData.property_title || "Untitled Property"}
                        </div>
                        <div className="text-xl font-bold text-[#f5d77f]">
                          ₹
                          {Number(formData.expected_price) >= 10000000
                            ? `${(Number(formData.expected_price) / 10000000).toFixed(2)} Cr`
                            : Number(formData.expected_price) >= 100000
                            ? `${(Number(formData.expected_price) / 100000).toFixed(2)} Lakh`
                            : Number(formData.expected_price).toLocaleString("en-IN")}
                          {formData.listing_purpose === "Rent" && <span className="text-xs text-slate-400 font-normal"> / month</span>}
                        </div>
                      </div>

                      {/* Specs badges / grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">Locality</span>
                          <span className="text-white font-medium truncate block mt-0.5">
                            {formData.locality === "Other Area" ? formData.custom_locality : formData.locality}, {formData.city}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">Super Built Area</span>
                          <span className="text-white font-medium block mt-0.5">
                            {formData.area ? `${formData.area} ${formData.area_unit}` : "Not specified"}
                          </span>
                        </div>
                        {selectedTypeObj.hasBeds ? (
                          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                            <span className="text-[10px] uppercase font-bold text-slate-500 block">Bedrooms / Baths</span>
                            <span className="text-white font-medium block mt-0.5">
                              {formData.bedrooms} BHK &bull; {formData.bathrooms} Baths
                            </span>
                          </div>
                        ) : (
                          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                            <span className="text-[10px] uppercase font-bold text-slate-500 block">Furnishing</span>
                            <span className="text-white font-medium block mt-0.5">{formData.furnishing}</span>
                          </div>
                        )}
                        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">Parking</span>
                          <span className="text-white font-medium block mt-0.5">
                            {Number(formData.parking) > 0 ? `${formData.parking} Dedicated` : "None / Open"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Owner & Representative Details */}
                    <div className="p-5 space-y-3 bg-white/[0.01]">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                          <i className="fa-solid fa-user-tie text-[#d4af37]" />
                          <span>Owner Contact Information</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#d4af37]/20 text-slate-300 hover:text-[#f5d77f] text-xs font-medium border border-white/10 hover:border-[#d4af37]/30 transition"
                          title="Edit owner contact details"
                        >
                          <i className="fa-solid fa-pen-to-square text-[11px]" />
                          <span>Edit Owner Info</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="text-slate-500 text-[10px] uppercase font-bold block">Owner Name</span>
                          <span className="text-white font-medium mt-0.5 block">{formData.owner_name}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] uppercase font-bold block">Primary Mobile</span>
                          <span className="text-white font-medium mt-0.5 block">{formData.owner_phone}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] uppercase font-bold block">WhatsApp</span>
                          <span className="text-white font-medium mt-0.5 block">
                            {formData.owner_whatsapp || formData.owner_phone}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] uppercase font-bold block">Contact Mode</span>
                          <span className="text-white font-medium mt-0.5 block">{formData.preferred_contact_method}</span>
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Photos Attached Preview */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                          <i className="fa-solid fa-images text-[#d4af37]" />
                          <span>Property Photos ({previewUrls.length} uploaded)</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(3)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#d4af37]/20 text-slate-300 hover:text-[#f5d77f] text-xs font-medium border border-white/10 hover:border-[#d4af37]/30 transition"
                          title="Edit or add more photos"
                        >
                          <i className="fa-solid fa-pen-to-square text-[11px]" />
                          <span>Edit Photos</span>
                        </button>
                      </div>

                      {previewUrls.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-3">
                          {previewUrls.map((url, idx) => (
                            <div
                              key={idx}
                              className={`relative w-20 h-14 rounded-lg overflow-hidden border ${
                                idx === 0 ? "border-[#d4af37] ring-1 ring-[#d4af37]/40" : "border-white/15"
                              }`}
                            >
                              <img src={url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                              {idx === 0 && (
                                <span className="absolute bottom-0 inset-x-0 bg-[#d4af37] text-[#0b1528] text-[8px] font-bold text-center uppercase tracking-wider py-0.5">
                                  Cover
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400 italic">
                          No photos attached yet. You can submit without photos now and share them later via WhatsApp with our team.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Privacy & Verification Disclosure */}
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-slate-300 space-y-2">
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <i className="fa-solid fa-shield-halved text-[#d4af37]" />
                      <span>Privacy and Professional Guarantee</span>
                    </div>
                    <p className="text-slate-400 leading-relaxed">
                      By submitting this form, your property details will be sent directly to Avishkar Realty&apos;s verified property onboarding team in Ahmedabad. Your private phone number and email will never be exposed on the public internet. Our team will verify property authenticity before approving any public listing.
                    </p>
                  </div>

                  {/* Consent Checkbox */}
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/10">
                    <input
                      type="checkbox"
                      id="consent-check"
                      checked={formData.consent_given}
                      onChange={(e) => setFormData({ ...formData, consent_given: e.target.checked })}
                      className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/10 text-[#d4af37] focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="consent-check" className="text-xs text-slate-300 cursor-pointer leading-normal">
                      I confirm that I am the authorized owner or representative of this property, and I give consent to Avishkar Realty to contact me via phone, WhatsApp, or email regarding this submission.
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      disabled={submitting || uploadingImages}
                      onClick={() => setCurrentStep(3)}
                      className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition"
                    >
                      &larr; Back to Photos
                    </button>

                    <button
                      type="submit"
                      disabled={submitting || uploadingImages}
                      className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f5d77f] to-[#b38b25] text-[#0b1528] font-bold text-xs shadow-xl shadow-[#d4af37]/25 hover:brightness-110 active:scale-[0.98] transition flex items-center gap-2.5 disabled:opacity-50"
                    >
                      {submitting || uploadingImages ? (
                        <>
                          <i className="fa-solid fa-circle-notch fa-spin text-sm" />
                          <span>{uploadingImages ? "Uploading Photos..." : "Submitting for Review..."}</span>
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-paper-plane text-xs" />
                          <span>Submit Property for Review</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
