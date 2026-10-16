import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json({ error: "Server JWT configuration error" }, { status: 500 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
    const { id, sessionId } = decoded;

    const [rows]: any = await pool.query(
      "SELECT id, name, email, phone, role, created_at, sessionId FROM register WHERE id = ?",
      [id]
    );

    if (rows.length === 0 || rows[0].sessionId !== sessionId) {
      return NextResponse.json({ authenticated: false, error: "Session expired or invalid" }, { status: 401 });
    }

    const user = rows[0];
    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role || "admin",
        created_at: user.created_at,
      }
    });

  } catch (error: any) {
    return NextResponse.json({ authenticated: false, error: error.message }, { status: 401 });
  }
}
