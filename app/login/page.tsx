"use client";
// import { useRouter } from "next/router";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  
  const router = useRouter(); 

const handleSubmit = async (e: any) => {
  e.preventDefault();

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });

  const data = await res.json();
  // alert(data.message || data.error);

  if (res.ok) {
    //Redirect to admin dashboard
    router.push("/admin/dashboard");
  } else {
    alert(data.error || "Login failed");
  }
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
          </h1> */}
          
        </div>

        <h2 className="text-xl text-white font-semibold text-center mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <input
            type="email"
            placeholder="Email Address"
            required
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            onChange={e => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            required
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            onChange={e => setForm({ ...form, password: e.target.value })}
          />

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 transition duration-300 text-black font-semibold p-3 rounded-lg shadow-lg"
          >
            Login
          </button>
        </form>
 
        {/* <p className="text-center text-gray-300 text-sm mt-6">
          Don’t have an account?{" "}
          <a href="/register" className="text-yellow-400 hover:underline">
            Register
          </a>
        </p> */}
      </div>
    </div>
  );
}