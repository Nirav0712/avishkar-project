"use client";
import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    number: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    alert(data.message || data.error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1c2d] px-4">
      
      {/* Card */}
      <div className="bg-white/10 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-md border border-white/20">
        
        {/* Logo Section */}
        <div className="text-center mb-6">
          <img src="/images/logo.png" alt="" />
          {/* <h1 className="text-3xl font-bold text-yellow-400 tracking-wide">
            Avishkar Realty
          </h1>
          <p className="text-gray-300 text-sm mt-1">
            Your Smile is Our Happiness
          </p> */}
        </div>

        <h2 className="text-xl text-white font-semibold text-center mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <input
            type="text"
            placeholder="Full Name"
            required
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            onChange={e => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="email"
            placeholder="Email Address"
            required
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            onChange={e => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="text"
            placeholder="Phone Number"
            required
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            onChange={e => setForm({ ...form, number: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            required
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            onChange={e => setForm({ ...form, password: e.target.value })}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            required
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
          />

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 transition duration-300 text-black font-semibold p-3 rounded-lg shadow-lg"
          >
            Register
          </button>
        </form>

        <p className="text-center text-gray-300 text-sm mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-yellow-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}