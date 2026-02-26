import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, number, password, confirmPassword } = await req.json();

    // Validation
    if (!name || !email || !number || !password || !confirmPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    // Check if email already exists
    const [existing]: any = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO register (name, email, phone, password) VALUES (?, ?, ?, ?)",
      [name, email, number, hashedPassword]
    );

    return NextResponse.json({ message: "User registered successfully ✅" });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}