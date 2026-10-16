import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { validateAdminSession } from '@/lib/auth';

// GET single property (Public)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM properties WHERE id = ?', [id]);

        if (rows.length === 0) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }

        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error('Database error in GET /api/properties/[id]:', error);
        return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 });
    }
}

// PUT update property (Protected - Admin only)
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { user, errorResponse } = await validateAdminSession(request, ['admin', 'super_admin']);
        if (errorResponse) return errorResponse;

        const { id } = await params;
        const body = await request.json();
        const {
            title, price, location, type, status, bedrooms, bathrooms, area,
            featured, image, description, yearBuilt, parking
        } = body;

        await pool.query<ResultSetHeader>(
            `UPDATE properties SET
        title = ?, price = ?, location = ?, type = ?, status = ?,
        bedrooms = ?, bathrooms = ?, area = ?, featured = ?,
        image = ?, description = ?, yearBuilt = ?, parking = ?
      WHERE id = ?`,
            [
                title, price, location, type, status, bedrooms, bathrooms, area,
                featured ? 1 : 0, image, description, yearBuilt, parking, id
            ]
        );

        return NextResponse.json({ id, ...body });
    } catch (error) {
        console.error('Database error in PUT /api/properties/[id]:', error);
        return NextResponse.json({ error: 'Failed to update property' }, { status: 500 });
    }
}

// DELETE property (Protected - Admin only)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { user, errorResponse } = await validateAdminSession(request, ['admin', 'super_admin']);
        if (errorResponse) return errorResponse;

        const { id } = await params;

        // Log deletion into audit_logs before removing
        try {
            await pool.query(
                'INSERT INTO audit_logs (action, target_type, target_id, details) VALUES (?, ?, ?, ?)',
                ['DELETE_PROPERTY', 'property', id, `Property ID ${id} deleted by ${user?.name}`]
            );
        } catch {}

        await pool.query('DELETE FROM properties WHERE id = ?', [id]);
        return NextResponse.json({ message: 'Property deleted successfully' });
    } catch (error) {
        console.error('Database error in DELETE /api/properties/[id]:', error);
        return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 });
    }
}
