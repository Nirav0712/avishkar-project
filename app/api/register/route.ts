import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { validateAdminSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    // Check if any admin already exists in the system
    const [adminCount]: any = await db.query("SELECT COUNT(*) as count FROM register");
    const count = adminCount[0]?.count || 0;

    let executingUser: any = null;

    // If admins already exist, only an authenticated Super Admin or Admin can provision new team members
    if (count > 0) {
      const { user, errorResponse } = await validateAdminSession(req, ['admin', 'super_admin']);
      if (errorResponse) return errorResponse;
      executingUser = user;
    }

    const { name, email, number, password, confirmPassword, role } = await req.json();

    // Validation
    if (!name || !email || !number || !password || !confirmPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 });
    }

    // Check if email already exists in register
    const [existing]: any = await db.query(
      "SELECT id FROM register WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return NextResponse.json({ error: "Email is already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const assignedRole = role || "sales_executive";

    const [result]: any = await db.query(
      "INSERT INTO register (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, number, hashedPassword, assignedRole]
    );

    // Audit log
    try {
      await db.query(
        "INSERT INTO audit_logs (action, target_type, target_id, details) VALUES (?, ?, ?, ?)",
        [
          "PROVISION_USER",
          "register",
          result.insertId,
          `User ${name} (${email}) provisioned with role "${assignedRole}" by ${executingUser?.name || 'Initial Setup'}`,
        ]
      );
    } catch {}

    return NextResponse.json({
      success: true,
      message: `User ${name} registered successfully with role "${assignedRole}" ✅`,
    });
  } catch (error: any) {
    console.error("Register API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}