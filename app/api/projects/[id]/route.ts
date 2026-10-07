import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

function parseProjectRow(row: any) {
    let images: string[] = [];
    if (typeof row.images === 'string') {
        try {
            images = JSON.parse(row.images);
        } catch {
            images = row.images ? row.images.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
        }
    } else if (Array.isArray(row.images)) {
        images = row.images;
    }

    let unitTypes: any[] = [];
    if (typeof row.unitTypes === 'string') {
        try {
            unitTypes = JSON.parse(row.unitTypes);
        } catch {
            unitTypes = [];
        }
    } else if (Array.isArray(row.unitTypes)) {
        unitTypes = row.unitTypes;
    }

    let amenities: string[] = [];
    if (typeof row.amenities === 'string') {
        try {
            amenities = JSON.parse(row.amenities);
        } catch {
            amenities = row.amenities ? row.amenities.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
        }
    } else if (Array.isArray(row.amenities)) {
        amenities = row.amenities;
    }

    return {
        ...row,
        featured: Boolean(row.featured === 1 || row.featured === true || row.featured === '1'),
        isForSale: Boolean(row.isForSale === 1 || row.isForSale === true || row.isForSale === '1' || row.isForSale === undefined),
        images,
        unitTypes,
        amenities,
    };
}

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

// GET single project by id or slug
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const isNumeric = /^\d+$/.test(id);

        const [rows] = isNumeric
            ? await pool.query<RowDataPacket[]>('SELECT * FROM projects WHERE id = ?', [id])
            : await pool.query<RowDataPacket[]>('SELECT * FROM projects WHERE slug = ?', [id]);

        if (rows.length === 0) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json(parseProjectRow(rows[0]));
    } catch (error) {
        console.error('Database error in GET /api/projects/[id]:', error);
        return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
    }
}

// PUT update project
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        let {
            title,
            slug,
            location,
            status = 'Under Construction',
            zone = '',
            bedrooms = '2 & 3',
            bathrooms = 2,
            displayPrice = 'Price On Request',
            PlotArea = '',
            address = '',
            description = '',
            image = '',
            images = [],
            featured = false,
            isForSale = true,
            rera = '',
            blogId = null,
            unitTypes = [],
            amenities = [],
            possession = '',
            totalTowers = null,
            totalFloors = null,
            totalUnits = null,
        } = body;

        if (!title || !location) {
            return NextResponse.json({ error: 'Title and location are required' }, { status: 400 });
        }

        if (!slug || slug.trim() === '') {
            slug = generateSlug(title);
        } else {
            slug = generateSlug(slug);
        }

        const imagesJson = JSON.stringify(Array.isArray(images) ? images : (images ? [images] : []));
        const unitTypesJson = JSON.stringify(Array.isArray(unitTypes) ? unitTypes : []);
        const amenitiesJson = JSON.stringify(Array.isArray(amenities) ? amenities : []);

        await pool.query<ResultSetHeader>(
            `UPDATE projects SET
                title = ?,
                slug = ?,
                location = ?,
                status = ?,
                zone = ?,
                bedrooms = ?,
                bathrooms = ?,
                displayPrice = ?,
                PlotArea = ?,
                address = ?,
                description = ?,
                image = ?,
                images = ?,
                featured = ?,
                isForSale = ?,
                rera = ?,
                blogId = ?,
                unitTypes = ?,
                amenities = ?,
                possession = ?,
                totalTowers = ?,
                totalFloors = ?,
                totalUnits = ?
            WHERE id = ?`,
            [
                title,
                slug,
                location,
                status,
                zone,
                String(bedrooms || '2 & 3'),
                Number(bathrooms) || 2,
                displayPrice,
                PlotArea,
                address,
                description,
                image,
                imagesJson,
                featured ? 1 : 0,
                isForSale ? 1 : 0,
                rera,
                blogId ? Number(blogId) : null,
                unitTypesJson,
                amenitiesJson,
                possession || null,
                totalTowers ? Number(totalTowers) : null,
                totalFloors ? Number(totalFloors) : null,
                totalUnits ? Number(totalUnits) : null,
                id,
            ]
        );

        return NextResponse.json({
            id: Number(id),
            ...body,
            slug,
        });
    } catch (error: any) {
        console.error('Database error in PUT /api/projects/[id]:', error);
        return NextResponse.json({ error: error.message || 'Failed to update project' }, { status: 500 });
    }
}

// DELETE project
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await pool.query('DELETE FROM projects WHERE id = ?', [id]);
        return NextResponse.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Database error in DELETE /api/projects/[id]:', error);
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}
