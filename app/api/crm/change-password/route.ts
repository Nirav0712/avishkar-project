import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
    }

    const { id, sessionId } = decoded;

    // Verify user & session in DB
    const [rows]: any = await pool.query(
      "SELECT id, email, password, sessionId, role FROM register WHERE id = ?",
      [id]
    );

    if (rows.length === 0 || rows[0].sessionId !== sessionId) {
      return NextResponse.json({ error: "Session expired or invalid" }, { status: 401 });
    }

    const user = rows[0];
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Current password and new password are required" }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters long" }, { status: 400 });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in DB
    await pool.query(
      "UPDATE register SET password = ? WHERE id = ?",
      [hashedPassword, user.id]
    );

    // Audit log
    try {
      await pool.query(
        "INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)",
        [
          user.id,
          "CHANGE_PASSWORD",
          "USER",
          user.id,
          `Password changed successfully for ${user.email}`,
        ]
      );
    } catch (auditErr) {
      console.error("Audit log error:", auditErr);
    }

    return NextResponse.json({
      success: true,
      message: "Password changed successfully. Please keep your new password safe.",
    });
  } catch (error: any) {
    console.error("Change password error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
