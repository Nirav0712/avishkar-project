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

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    alert(data.message || data.error);
  };

  return (
    <div className="p-10 max-w-md mx-auto">
      <h2 className="text-2xl mb-4">Register</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          placeholder="Name"
          className="border p-2 w-full"
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          className="border p-2 w-full"
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <input
          placeholder="Phone Number"
          className="border p-2 w-full"
          onChange={e => setForm({ ...form, number: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full"
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="border p-2 w-full"
          onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
        />

        <button className="bg-blue-600 text-white p-2 w-full">
          Register
        </button>
      </form>
    </div>
  );
}