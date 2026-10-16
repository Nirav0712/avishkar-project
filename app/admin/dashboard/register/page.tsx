"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterExecutivePage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    number: "",
    password: "",
    confirmPassword: "",
    role: "sales_executive",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (form.password !== form.confirmPassword) {
      setMessage({ text: "Passwords do not match.", isError: true });
      return;
    }

    if (form.password.length < 8) {
      setMessage({ text: "Password must be at least 8 characters long.", isError: true });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ text: data.message || "User registered successfully!", isError: false });
        setForm({
          name: "",
          email: "",
          number: "",
          password: "",
          confirmPassword: "",
          role: "sales_executive",
        });
      } else {
        setMessage({ text: data.error || "Registration failed.", isError: true });
      }
    } catch (err: any) {
      setMessage({ text: "An error occurred: " + err.message, isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-[#070e1b] overflow-hidden text-white">
      {/* Dynamic ambient glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#d4af37]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#3b82f6]/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative w-full max-w-lg glass-card rounded-3xl p-8 sm:p-10 border border-white/15 shadow-2xl backdrop-blur-2xl z-10">
        <div className="text-center mb-6">
          <Link href="/admin/dashboard" className="inline-flex items-center gap-2 mb-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] via-[#f5d77f] to-[#b38b25] flex items-center justify-center shadow-lg shadow-[#d4af37]/25">
              <span className="font-serif text-[#0b1528] font-black text-lg">A</span>
            </div>
            <div className="text-left">
              <span className="font-serif text-sm tracking-widest font-bold text-white block">AVISHKAR REALTY</span>
              <span className="text-[9px] tracking-[0.25em] text-[#d4af37] uppercase font-semibold block -mt-1">ADMINISTRATIVE PROVISIONING</span>
            </div>
          </Link>

          <h1 className="text-xl font-serif font-bold text-white">Register Team Member</h1>
          <p className="text-xs text-gray-400 mt-1">Create an authorized sales executive or manager account</p>
        </div>

        {message && (
          <div
            className={`mb-5 p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
              message.isError
                ? "bg-rose-500/10 border-rose-500/25 text-rose-300"
                : "bg-emerald-500/10 border-emerald-500/25 text-emerald-300"
            }`}
          >
            <i className={`fa-solid ${message.isError ? "fa-circle-exclamation" : "fa-circle-check"}`} />
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Priyesh Patel"
              className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="name@avishkarrealty.in"
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={form.number}
                onChange={(e) => setForm({ ...form, number: e.target.value })}
                placeholder="+91 98250 12345"
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Access Role
            </label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#0c1626] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#d4af37]"
            >
              <option value="sales_executive">Sales Executive (Leads & Follow-ups)</option>
              <option value="sales_manager">Sales Manager (Pipeline & Assignments)</option>
              <option value="admin">Administrator (Full Access)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                Temporary Password *
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min 8 characters"
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                Confirm Password *
              </label>
              <input
                type="password"
                required
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="Repeat password"
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#d4af37] via-[#f5d77f] to-[#d4af37] text-[#0b1528] font-bold text-xs rounded-xl shadow-lg shadow-[#d4af37]/20 hover:brightness-110 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin" />
                  <span>Registering Member...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-user-check" />
                  <span>Register Team Member</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <Link
            href="/admin/dashboard"
            className="text-xs text-gray-400 hover:text-[#d4af37] transition flex items-center justify-center gap-1.5"
          >
            <i className="fa-solid fa-arrow-left text-[10px]" />
            <span>Return to Admin Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}