import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const { email, password } = await req.json();

    const [rows]: any = await db.query(
      "SELECT * FROM register WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    // Generate a unique session ID
    const sessionId = randomUUID();

    // Store the sessionId in the database
    await db.query("UPDATE register SET sessionId = ? WHERE id = ?", [
      sessionId,
      user.id,
    ]);

    // Sign the JWT
    const token = jwt.sign(
      { id: user.id, sessionId },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    // Set the token as an HttpOnly cookie
    const response = NextResponse.json({ message: "Login successful ✅" });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
