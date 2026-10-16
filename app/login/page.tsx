"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        window.location.href = "/admin/dashboard";
      } else {
        setError(data.error || "Invalid credentials. Please verify your email and password.");
        setLoading(false);
      }
    } catch (err: any) {
      setError("A connection error occurred: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-[#070e1b]">
      {/* Dynamic ambient background glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#d4af37]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#3b82f6]/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Decorative architectural grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Main Glass Card */}
      <div className="relative w-full max-w-md glass-card rounded-3xl p-8 sm:p-10 border border-white/15 shadow-2xl backdrop-blur-2xl z-10 text-white">
        
        {/* Top Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#d4af37] via-[#f5d77f] to-[#b38b25] flex items-center justify-center shadow-lg shadow-[#d4af37]/25 group-hover:scale-105 transition-transform duration-300">
              <span className="font-serif text-[#0b1528] font-black text-xl tracking-wider">A</span>
            </div>
            <div className="text-left">
              <span className="font-serif text-lg tracking-[0.2em] font-bold text-white block">AVISHKAR</span>
              <span className="text-[9px] tracking-[0.3em] text-[#d4af37] uppercase font-semibold block -mt-1">REALTY • AHMEDABAD</span>
            </div>
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Secure Management Portal</span>
          </div>

          <h1 className="text-2xl font-serif font-bold text-white tracking-tight">Admin & CRM Login</h1>
          <p className="text-xs text-gray-400 mt-1">Authorized personnel and sales executive sign-in</p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
            <i className="fa-solid fa-circle-exclamation mt-0.5 text-sm shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                <i className="fa-regular fa-envelope" />
              </span>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="name@avishkarrealty.in"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition duration-200"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                <i className="fa-solid fa-lock" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-11 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition text-sm"
              >
                <i className={showPassword ? "fa-regular fa-eye-slash" : "fa-regular fa-eye"} />
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#d4af37] via-[#f5d77f] to-[#d4af37] hover:brightness-110 text-[#0b1528] font-bold text-sm rounded-xl shadow-lg shadow-[#d4af37]/20 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin text-sm" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to CRM</span>
                  <i className="fa-solid fa-arrow-right text-xs" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Security & Return links */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col items-center gap-3 text-center">
          <p className="text-[11px] text-gray-400 flex items-center gap-1.5">
            <i className="fa-solid fa-shield-halved text-[#d4af37]" />
            <span>256-bit SSL encrypted • Role-based authorization</span>
          </p>
          <Link
            href="/"
            className="text-xs text-gray-400 hover:text-[#d4af37] transition duration-200 flex items-center gap-1.5"
          >
            <i className="fa-solid fa-arrow-left text-[10px]" />
            <span>Return to Public Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}