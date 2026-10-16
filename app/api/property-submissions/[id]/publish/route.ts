import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { validateAdminSession } from '@/lib/auth';

// POST /api/property-submissions/[id]/publish (Protected Admin)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, errorResponse } = await validateAdminSession(request, ['admin', 'super_admin']);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const submissionId = Number(id);

    if (isNaN(submissionId)) {
      return NextResponse.json({ error: 'Invalid submission ID' }, { status: 400 });
    }

    // 1. Fetch submission
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM property_submissions WHERE id = ? LIMIT 1',
      [submissionId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Property submission not found' }, { status: 404 });
    }

    const submission = rows[0];

    // Prevent duplicate publication
    if (submission.published_property_id && submission.status === 'Published') {
      return NextResponse.json(
        {
          error: `This property submission has already been published as Property #${submission.published_property_id}. Duplicate publication is prevented.`,
          published_property_id: submission.published_property_id,
        },
        { status: 409 }
      );
    }

    const body = await request.json();
    const {
      title = submission.property_title,
      price = submission.expected_price,
      location = submission.locality,
      type = submission.property_type,
      category = submission.listing_purpose === 'Rent' ? 'Rental' : 'Residential',
      status = submission.listing_purpose === 'Rent' ? 'For Rent' : 'For Sale',
      bedrooms = submission.bedrooms,
      bathrooms = submission.bathrooms,
      area = submission.area,
      areaUnit = submission.area_unit || 'sq ft',
      featured = false,
      image,
      images,
      description = submission.description,
      yearBuilt = new Date().getFullYear(),
      parking = submission.parking,
      transaction = submission.listing_purpose === 'Rent' ? 'rent' : 'resale',
    } = body;

    // Validate required fields for public listing
    if (!title || String(title).trim().length < 3) {
      return NextResponse.json({ error: 'A public title is required.' }, { status: 400 });
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      return NextResponse.json({ error: 'A valid price/rent is required.' }, { status: 400 });
    }

    if (!location) {
      return NextResponse.json({ error: 'Location is required.' }, { status: 400 });
    }

    // Process image URLs
    let parsedImages: string[] = [];
    if (images && Array.isArray(images)) {
      parsedImages = images;
    } else if (typeof submission.images === 'string') {
      try {
        parsedImages = JSON.parse(submission.images);
      } catch {
        parsedImages = [];
      }
    }

    const primaryImage =
      image ||
      (parsedImages.length > 0
        ? parsedImages[0]
        : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80');

    const imageString = parsedImages.length > 0 ? parsedImages.join(',') : primaryImage;

    // 2. Insert into properties table (WITHOUT leaking owner phone or email)
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO properties (
        title, price, location, type, category, status, bedrooms, bathrooms, area,
        areaUnit, featured, image, images, description, yearBuilt, parking, transaction
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        String(title).trim(),
        numericPrice,
        String(location).trim(),
        type || 'Apartment',
        category || 'Residential',
        status || 'For Sale',
        Number(bedrooms) || 0,
        Number(bathrooms) || 0,
        Number(area) || 0,
        areaUnit || 'sq ft',
        featured ? 1 : 0,
        imageString,
        JSON.stringify(parsedImages),
        description ? String(description).trim() : null,
        Number(yearBuilt) || new Date().getFullYear(),
        Number(parking) || 0,
        transaction || 'resale',
      ]
    );

    const publishedPropertyId = result.insertId;

    // 3. Update property_submissions record
    await pool.query(
      `UPDATE property_submissions SET
        status = 'Published',
        published_property_id = ?,
        published_at = NOW(),
        published_by = ?,
        reviewed_at = NOW(),
        reviewed_by = ?
      WHERE id = ?`,
      [publishedPropertyId, user?.name || 'Admin', user?.name || 'Admin', submissionId]
    );

    // 4. Audit Log & CRM Activity
    try {
      await pool.query(
        'INSERT INTO audit_logs (action, target_type, target_id, details) VALUES (?, ?, ?, ?)',
        [
          'PUBLISH_PROPERTY_SUBMISSION',
          'property',
          publishedPropertyId,
          `Submission ${submission.reference_number} published as Property #${publishedPropertyId} by ${user?.name}`,
        ]
      );

      if (submission.lead_id) {
        await pool.query(
          'INSERT INTO crm_activities (lead_id, action, description, performed_by) VALUES (?, ?, ?, ?)',
          [
            submission.lead_id,
            'Listing Published',
            `Property listing published publicly on website as Property #${publishedPropertyId}`,
            user?.name || 'Admin',
          ]
        );
      }
    } catch {}

    return NextResponse.json({
      success: true,
      message: `Property "${title}" published successfully to the website!`,
      propertyId: publishedPropertyId,
      publicUrl: `/properties/${publishedPropertyId}`,
      submissionId,
      reference_number: submission.reference_number,
    });
  } catch (error: any) {
    console.error('Error publishing property submission in POST /api/property-submissions/[id]/publish:', error);
    return NextResponse.json(
      { error: 'Failed to publish property listing. Please try again.' },
      { status: 500 }
    );
  }
}
