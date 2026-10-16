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

        const row = rows[0];
        let primary = row.image;
        let allImages = row.images;

        if (typeof primary === 'string' && primary.includes(',')) {
            const splitUrls = primary.split(',').map((s: string) => s.trim()).filter(Boolean);
            primary = splitUrls[0] || '';
            if (!allImages) {
                allImages = JSON.stringify(splitUrls);
            }
        } else if (typeof primary === 'string' && primary.startsWith('[') && primary.endsWith(']')) {
            try {
                const arr = JSON.parse(primary);
                if (Array.isArray(arr) && arr.length > 0) {
                    primary = arr[0];
                    if (!allImages) allImages = JSON.stringify(arr);
                }
            } catch {}
        }

        return NextResponse.json({
            ...row,
            price: Number(row.price) || 0,
            bedrooms: Number(row.bedrooms) || 0,
            bathrooms: Number(row.bathrooms) || 0,
            area: Number(row.area) || 0,
            parking: Number(row.parking) || 0,
            featured: row.featured === 1 || row.featured === true,
            image: primary || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
            images: allImages || null,
        });
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
            title, price, location, type, category, status, bedrooms, bathrooms, area,
            areaUnit, featured, image, images, description, yearBuilt, parking, transaction
        } = body;

        const cleanTitle = typeof title === 'string' ? title.trim() : '';
        const cleanLocation = typeof location === 'string' ? location.trim() : '';
        const numericPrice = typeof price === 'string' ? parseFloat(price.replace(/,/g, '')) : Number(price);

        if (!cleanTitle || cleanTitle.length < 3) {
            return NextResponse.json({ error: 'Property title is required (minimum 3 characters)' }, { status: 400 });
        }

        if (isNaN(numericPrice) || numericPrice <= 0) {
            return NextResponse.json({ error: 'Please enter a valid property price or monthly rent' }, { status: 400 });
        }

        if (!cleanLocation) {
            return NextResponse.json({ error: 'Location is required' }, { status: 400 });
        }

        let cleanImagesStr: string | null = null;
        let primaryImage: string = typeof image === 'string' ? image.trim() : '';

        if (Array.isArray(images) && images.length > 0) {
            cleanImagesStr = JSON.stringify(images);
            if (!primaryImage) primaryImage = images[0];
        } else if (typeof images === 'string' && images.trim()) {
            cleanImagesStr = images.trim();
            if (!primaryImage) primaryImage = cleanImagesStr.split(',')[0].trim();
        }

        if (!primaryImage) {
            primaryImage = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80';
        }

        const safeCategory = category || 'Residential';
        const safeType = type || 'Apartment';
        const safeStatus = status || 'For Sale';
        const safeBedrooms = Number(bedrooms) || 0;
        const safeBathrooms = Number(bathrooms) || 0;
        const safeArea = Number(area) || 0;
        const safeAreaUnit = areaUnit || 'sqft';
        const safeFeatured = featured ? 1 : 0;
        const safeDescription = description ? String(description).trim() : null;
        const safeYearBuilt = Number(yearBuilt) || new Date().getFullYear();
        const safeParking = Number(parking) || 0;
        const safeTransaction = transaction || (safeStatus === 'For Rent' ? 'rent' : 'resale');

        await pool.query<ResultSetHeader>(
            `UPDATE properties SET
                title = ?, price = ?, location = ?, type = ?, category = ?, status = ?,
                bedrooms = ?, bathrooms = ?, area = ?, areaUnit = ?, featured = ?,
                image = ?, images = ?, description = ?, yearBuilt = ?, parking = ?, transaction = ?
            WHERE id = ?`,
            [
                cleanTitle,
                numericPrice,
                cleanLocation,
                safeType,
                safeCategory,
                safeStatus,
                safeBedrooms,
                safeBathrooms,
                safeArea,
                safeAreaUnit,
                safeFeatured,
                primaryImage,
                cleanImagesStr,
                safeDescription,
                safeYearBuilt,
                safeParking,
                safeTransaction,
                id
            ]
        );

        // Audit log
        try {
            await pool.query(
                'INSERT INTO audit_logs (user_id, user_name, action, target_type, target_id, details) VALUES (?, ?, ?, ?, ?, ?)',
                [user?.id || null, user?.name || 'Admin', 'UPDATE_PROPERTY', 'property', String(id), `Property "${cleanTitle}" updated by ${user?.name}`]
            );
        } catch (auditErr) {
            console.error('Failed to write audit log:', auditErr);
        }

        return NextResponse.json({
            id: Number(id),
            title: cleanTitle,
            price: numericPrice,
            location: cleanLocation,
            type: safeType,
            category: safeCategory,
            status: safeStatus,
            bedrooms: safeBedrooms,
            bathrooms: safeBathrooms,
            area: safeArea,
            areaUnit: safeAreaUnit,
            featured: Boolean(safeFeatured),
            image: primaryImage,
            images: cleanImagesStr,
            description: safeDescription,
            yearBuilt: safeYearBuilt,
            parking: safeParking,
            transaction: safeTransaction,
        });
    } catch (error: any) {
        console.error('Database error in PUT /api/properties/[id]:', error);
        return NextResponse.json({ error: error.message || 'Failed to update property' }, { status: 500 });
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
                'INSERT INTO audit_logs (user_id, user_name, action, target_type, target_id, details) VALUES (?, ?, ?, ?, ?, ?)',
                [user?.id || null, user?.name || 'Admin', 'DELETE_PROPERTY', 'property', String(id), `Property ID ${id} deleted by ${user?.name}`]
            );
        } catch (auditErr) {
            console.error('Failed to write audit log on property delete:', auditErr);
        }

        await pool.query('DELETE FROM properties WHERE id = ?', [id]);
        return NextResponse.json({ message: 'Property deleted successfully' });
    } catch (error) {
        console.error('Database error in DELETE /api/properties/[id]:', error);
        return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 });
    }
}
