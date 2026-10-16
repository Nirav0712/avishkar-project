import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';

export interface AuthenticatedUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  sessionId: string;
}

export interface AuthResult {
  user: AuthenticatedUser | null;
  errorResponse: NextResponse | null;
}

/**
 * Validates the current admin/CRM session from HTTP cookies or Authorization header.
 * Enforces role-based access control if requiredRoles is provided.
 */
export async function validateAdminSession(
  request?: Request,
  requiredRoles?: string[]
): Promise<AuthResult> {
  try {
    let token: string | undefined;

    // 1. Try reading from Next.js cookies
    try {
      const cookieStore = await cookies();
      token = cookieStore.get('token')?.value;
    } catch {
      // Fallback if cookies() is unavailable in context
    }

    // 2. Fallback to Authorization header or Cookie header on request
    if (!token && request) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      } else {
        const cookieHeader = request.headers.get('cookie') || '';
        const match = cookieHeader.match(/token=([^;]+)/);
        if (match) {
          token = match[1];
        }
      }
    }

    if (!token) {
      return {
        user: null,
        errorResponse: NextResponse.json(
          { error: 'Unauthorized: Authentication required to access CRM APIs' },
          { status: 401 }
        ),
      };
    }

    if (!process.env.JWT_SECRET) {
      console.error('CRITICAL: JWT_SECRET environment variable is missing.');
      return {
        user: null,
        errorResponse: NextResponse.json(
          { error: 'Server authentication configuration error' },
          { status: 500 }
        ),
      };
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err: any) {
      return {
        user: null,
        errorResponse: NextResponse.json(
          { error: 'Unauthorized: Session is invalid or has expired' },
          { status: 401 }
        ),
      };
    }

    const { id, sessionId } = decoded;

    if (!id || !sessionId) {
      return {
        user: null,
        errorResponse: NextResponse.json(
          { error: 'Unauthorized: Invalid token payload' },
          { status: 401 }
        ),
      };
    }

    // Verify session in MySQL database
    const [rows]: any = await pool.query(
      'SELECT id, name, email, phone, role, sessionId FROM register WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return {
        user: null,
        errorResponse: NextResponse.json(
          { error: 'Unauthorized: Account does not exist' },
          { status: 401 }
        ),
      };
    }

    const dbUser = rows[0];

    // Ensure session ID matches the currently active session in DB
    if (dbUser.sessionId !== sessionId) {
      return {
        user: null,
        errorResponse: NextResponse.json(
          { error: 'Unauthorized: Session revoked or superseded by another login' },
          { status: 401 }
        ),
      };
    }

    const user: AuthenticatedUser = {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      phone: dbUser.phone,
      role: dbUser.role || 'admin',
      sessionId: dbUser.sessionId,
    };

    // Role-Based Access Control verification
    if (requiredRoles && requiredRoles.length > 0) {
      const normalizedUserRole = (user.role || '').toLowerCase();
      const hasPermission = requiredRoles.some(
        (role) => role.toLowerCase() === normalizedUserRole || normalizedUserRole === 'super_admin' || normalizedUserRole === 'admin'
      );

      if (!hasPermission) {
        return {
          user: null,
          errorResponse: NextResponse.json(
            { error: `Forbidden: Your role (${user.role}) does not have permission to perform this action` },
            { status: 403 }
          ),
        };
      }
    }

    return { user, errorResponse: null };
  } catch (error: any) {
    console.error('Auth verification error:', error);
    return {
      user: null,
      errorResponse: NextResponse.json(
        { error: 'Internal authentication error', details: error.message },
        { status: 500 }
      ),
    };
  }
}
