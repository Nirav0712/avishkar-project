import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { validateAdminSession } from '@/lib/auth';
import { parseYouTubeUrl, parseInstagramUrl } from '@/lib/video';

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

    const hasVideo = Boolean(
        row.hasVideo === 1 || 
        row.hasVideo === true || 
        Boolean(row.youtubeUrl && row.youtubeUrl.trim()) || 
        Boolean(row.instagramUrl && row.instagramUrl.trim())
    );

    return {
        ...row,
        featured: Boolean(row.featured === 1 || row.featured === true || row.featured === '1'),
        isForSale: Boolean(row.isForSale === 1 || row.isForSale === true || row.isForSale === '1' || row.isForSale === undefined),
        images,
        unitTypes,
        amenities,
        hasVideo,
        youtubeUrl: row.youtubeUrl || null,
        instagramUrl: row.instagramUrl || null,
        videoThumbnail: row.videoThumbnail || null,
        videoTitle: row.videoTitle || null,
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

        const project = parseProjectRow(rows[0]);
        return NextResponse.json(project);
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
        const { user, errorResponse } = await validateAdminSession(request, ['admin', 'super_admin']);
        if (errorResponse) return errorResponse;

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
            youtubeUrl = '',
            instagramUrl = '',
            videoThumbnail = '',
            videoTitle = '',
            hasVideo = false,
        } = body;

        if (!title || !location) {
            return NextResponse.json({ error: 'Title and location are required' }, { status: 400 });
        }

        // Validate and normalize video URLs if provided
        let cleanYoutube = youtubeUrl?.trim() || null;
        let cleanInstagram = instagramUrl?.trim() || null;

        if (cleanYoutube) {
            const parsedYt = parseYouTubeUrl(cleanYoutube);
            if (!parsedYt) {
                return NextResponse.json({ error: 'Invalid YouTube URL. Please provide a valid YouTube Shorts, youtu.be or watch URL.' }, { status: 400 });
            }
            cleanYoutube = parsedYt.originalUrl;
            if (!videoThumbnail && parsedYt.thumbnailUrl) {
                videoThumbnail = parsedYt.thumbnailUrl;
            }
        }

        if (cleanInstagram) {
            const parsedIg = parseInstagramUrl(cleanInstagram);
            if (!parsedIg) {
                return NextResponse.json({ error: 'Invalid Instagram URL. Please provide a valid Instagram Reel or Post link.' }, { status: 400 });
            }
            cleanInstagram = parsedIg.originalUrl;
        }

        const isVideoActive = Boolean(hasVideo || cleanYoutube || cleanInstagram);

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
                totalUnits = ?,
                youtubeUrl = ?,
                instagramUrl = ?,
                videoThumbnail = ?,
                videoTitle = ?,
                hasVideo = ?
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
                cleanYoutube,
                cleanInstagram,
                videoThumbnail || null,
                videoTitle || null,
                isVideoActive ? 1 : 0,
                id,
            ]
        );

        return NextResponse.json({
            id: Number(id),
            ...body,
            slug,
            youtubeUrl: cleanYoutube,
            instagramUrl: cleanInstagram,
            videoThumbnail,
            videoTitle,
            hasVideo: isVideoActive,
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
        const { user, errorResponse } = await validateAdminSession(request, ['admin', 'super_admin']);
        if (errorResponse) return errorResponse;

        const { id } = await params;

        try {
            await pool.query(
                'INSERT INTO audit_logs (action, target_type, target_id, details) VALUES (?, ?, ?, ?)',
                ['DELETE_PROJECT', 'project', id, `Project ID ${id} deleted by ${user?.name}`]
            );
        } catch {}

        await pool.query('DELETE FROM projects WHERE id = ?', [id]);
        return NextResponse.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Database error in DELETE /api/projects/[id]:', error);
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}
