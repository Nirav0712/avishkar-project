import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { validateAdminSession } from '@/lib/auth';

// GET all properties (Public)
export async function GET() {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM properties ORDER BY created_at DESC');
        return NextResponse.json(rows);
    } catch (error) {
        console.error('Database error in GET /api/properties:', error);
        return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
    }
}

// POST new property (Protected - Admin only)
export async function POST(request: NextRequest) {
    try {
        const { user, errorResponse } = await validateAdminSession(request, ['admin', 'super_admin']);
        if (errorResponse) return errorResponse;

        const body = await request.json();
        const {
            title, price, location, type, category, status, bedrooms, bathrooms, area,
            featured, image, description, yearBuilt, parking, transaction
        } = body;

        if (!title || !price || !location) {
            return NextResponse.json({ error: 'Title, price, and location are required' }, { status: 400 });
        }

        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO properties (
        title, price, location, type, category, status, bedrooms, bathrooms, area,
        featured, image, description, yearBuilt, parking, transaction
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                title, price, location, type, category, status, bedrooms, bathrooms, area,
                featured ? 1 : 0, image, description, yearBuilt, parking, transaction
            ]
        );

        // Audit log
        try {
            await pool.query(
                'INSERT INTO audit_logs (action, target_type, target_id, details) VALUES (?, ?, ?, ?)',
                ['CREATE_PROPERTY', 'property', result.insertId, `Property "${title}" created by ${user?.name}`]
            );
        } catch {}

        return NextResponse.json({ id: result.insertId, ...body }, { status: 201 });
    } catch (error) {
        console.error('Database error in POST /api/properties:', error);
        return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
    }
}
