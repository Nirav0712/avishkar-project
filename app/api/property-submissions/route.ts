import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { validateAdminSession } from '@/lib/auth';

// In-memory rate limiting map for public submissions (IP -> timestamps)
const submissionRateLimit = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 10; // max 10 submissions per 15 min per IP

  const timestamps = submissionRateLimit.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < windowMs);

  if (validTimestamps.length >= maxRequests) {
    return false;
  }

  validTimestamps.push(now);
  submissionRateLimit.set(ip, validTimestamps);
  return true;
}

// Phone normalizer
function normalizePhone(rawPhone: string): string {
  let cleaned = rawPhone.replace(/[\s\-\(\)]/g, '').trim();
  if (cleaned.startsWith('+91')) {
    cleaned = cleaned.substring(3);
  } else if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = cleaned.substring(1);
  }
  return cleaned;
}

// Generate unique reference number: AVP-YYYYMM-XXXX
function generateReferenceNumber(): string {
  const d = new Date();
  const yearMonth = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`;
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `AVP-${yearMonth}-${randomSuffix}`;
}

// =========================================================================
// 1. PUBLIC: SUBMIT PROPERTY FOR REVIEW (POST)
// =========================================================================
export async function POST(request: NextRequest) {
  try {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many submissions from your connection. Please wait a few minutes before submitting again.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const {
      owner_name,
      owner_phone,
      owner_email,
      owner_whatsapp,
      preferred_contact_method = 'Phone',
      listing_purpose = 'Sell',
      property_type,
      property_title,
      locality,
      city = 'Ahmedabad',
      address,
      expected_price,
      area = 0,
      area_unit = 'sq ft',
      bedrooms = 0,
      bathrooms = 0,
      furnishing,
      parking = 0,
      description,
      images = [],
      consent_given,
    } = body;

    // Server-side validation
    if (!owner_name || String(owner_name).trim().length < 2) {
      return NextResponse.json({ error: 'Please enter a valid owner full name.' }, { status: 400 });
    }

    if (!owner_phone || String(owner_phone).trim().length < 8) {
      return NextResponse.json({ error: 'Please provide a valid contact mobile number.' }, { status: 400 });
    }

    if (!property_title || String(property_title).trim().length < 4) {
      return NextResponse.json({ error: 'Please provide a clear property title.' }, { status: 400 });
    }

    if (!locality || String(locality).trim().length < 2) {
      return NextResponse.json({ error: 'Locality or area is required.' }, { status: 400 });
    }

    if (!property_type) {
      return NextResponse.json({ error: 'Please select a property type.' }, { status: 400 });
    }

    if (!['Sell', 'Rent'].includes(listing_purpose)) {
      return NextResponse.json({ error: 'Listing purpose must be either Sell or Rent.' }, { status: 400 });
    }

    const priceNum = Number(expected_price);
    if (isNaN(priceNum) || priceNum <= 0) {
      return NextResponse.json({ error: 'Please enter a valid expected price or monthly rent.' }, { status: 400 });
    }

    if (!consent_given) {
      return NextResponse.json({ error: 'Consent to contact regarding this property is required.' }, { status: 400 });
    }

    const normalizedOwnerPhone = normalizePhone(String(owner_phone));
    const normalizedWhatsApp = owner_whatsapp ? normalizePhone(String(owner_whatsapp)) : null;
    const cleanImages = Array.isArray(images) ? JSON.stringify(images) : '[]';

    // Generate unique reference
    let referenceNumber = generateReferenceNumber();
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 5) {
      attempts++;
      const [existingRef] = await pool.query<RowDataPacket[]>(
        'SELECT id FROM property_submissions WHERE reference_number = ?',
        [referenceNumber]
      );
      if (existingRef.length === 0) {
        isUnique = true;
      } else {
        referenceNumber = generateReferenceNumber();
      }
    }

    // 1. Insert into property_submissions
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO property_submissions (
        reference_number, owner_name, owner_phone, owner_email, owner_whatsapp,
        preferred_contact_method, listing_purpose, property_type, property_title,
        locality, city, address, expected_price, area, area_unit, bedrooms,
        bathrooms, furnishing, parking, description, images, status, consent_given, ip_address
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending Review', 1, ?)`,
      [
        referenceNumber,
        String(owner_name).trim(),
        normalizedOwnerPhone,
        owner_email ? String(owner_email).trim() : null,
        normalizedWhatsApp,
        preferred_contact_method,
        listing_purpose,
        property_type,
        String(property_title).trim(),
        String(locality).trim(),
        String(city).trim() || 'Ahmedabad',
        address ? String(address).trim() : null,
        priceNum,
        Number(area) || 0,
        area_unit || 'sq ft',
        Number(bedrooms) || 0,
        Number(bathrooms) || 0,
        furnishing || null,
        Number(parking) || 0,
        description ? String(description).trim() : null,
        cleanImages,
        ip,
      ]
    );

    const submissionId = result.insertId;

    // 2. CRM INTEGRATION (Module 5): Synchronize as Lead
    let leadId: number | null = null;
    try {
      const [existingLead] = await pool.query<RowDataPacket[]>(
        'SELECT id, name, status, notes FROM leads WHERE phone = ? ORDER BY id DESC LIMIT 1',
        [normalizedOwnerPhone]
      );

      const leadNotes = `[Property Submission ${referenceNumber}]
Purpose: ${listing_purpose}
Type: ${property_type}
Title: ${property_title}
Location: ${locality}, ${city}
Expected: ₹${priceNum.toLocaleString('en-IN')}
Area: ${area} ${area_unit}`;

      if (existingLead.length > 0) {
        leadId = existingLead[0].id;
        const updatedNotes = `${existingLead[0].notes || ''}\n\n[${new Date().toISOString().slice(0, 10)}] ${leadNotes}`.trim();

        await pool.query(
          `UPDATE leads SET
            last_contact_date = NOW(),
            notes = ?,
            interested_in = COALESCE(?, interested_in),
            preferred_location = COALESCE(?, preferred_location),
            property_type = COALESCE(?, property_type)
          WHERE id = ?`,
          [updatedNotes, `${listing_purpose}: ${property_title}`, locality, property_type, leadId]
        );

        await pool.query(
          'INSERT INTO crm_activities (lead_id, action, description, performed_by) VALUES (?, ?, ?, ?)',
          [leadId, 'Property Submission', `Owner submitted new property for review (${referenceNumber})`, 'List Your Property']
        );
      } else {
        const [leadResult] = await pool.query<ResultSetHeader>(
          `INSERT INTO leads (
            name, email, phone, source, status, priority,
            interested_in, preferred_location, budget, property_type,
            notes, last_contact_date, next_followup_date
          ) VALUES (?, ?, ?, 'List Your Property', 'New', 'High', ?, ?, ?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY))`,
          [
            String(owner_name).trim(),
            owner_email ? String(owner_email).trim() : null,
            normalizedOwnerPhone,
            `${listing_purpose}: ${property_title}`,
            locality,
            `₹${priceNum.toLocaleString('en-IN')}`,
            property_type,
            leadNotes,
          ]
        );

        leadId = leadResult.insertId;

        // Auto schedule follow up task for property onboarding team
        await pool.query(
          `INSERT INTO follow_ups (lead_id, type, due_date, notes, created_by)
           VALUES (?, 'Call', DATE_ADD(NOW(), INTERVAL 1 DAY), ?, 'Property Submissions System')`,
          [leadId, `Verify and review property submission details with owner for ${referenceNumber}`]
        );

        await pool.query(
          'INSERT INTO crm_activities (lead_id, action, description, performed_by) VALUES (?, ?, ?, ?)',
          [leadId, 'Lead Created', `Owner registered property listing for review (${referenceNumber})`, 'List Your Property']
        );
      }

      // Link lead_id back to property_submissions
      if (leadId) {
        await pool.query('UPDATE property_submissions SET lead_id = ? WHERE id = ?', [leadId, submissionId]);
      }
    } catch (crmErr) {
      console.error('CRM synchronization warning in property submission:', crmErr);
    }

    return NextResponse.json({
      success: true,
      reference_number: referenceNumber,
      submissionId,
      message: 'Thank you for submitting your property. Our real estate team will review your details and contact you if additional information is required.',
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error submitting property in POST /api/property-submissions:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while saving your property submission. Please try again.' },
      { status: 500 }
    );
  }
}

// =========================================================================
// 2. ADMIN ONLY: GET SUBMISSIONS WITH FILTERS, SEARCH, & COUNTERS (GET)
// =========================================================================
export async function GET(request: NextRequest) {
  try {
    const { user, errorResponse } = await validateAdminSession(request, ['admin', 'super_admin']);
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit')) || 20));
    const offset = (page - 1) * limit;

    const status = searchParams.get('status') || 'All';
    const purpose = searchParams.get('purpose') || 'All';
    const type = searchParams.get('type') || 'All';
    const search = (searchParams.get('search') || '').trim();
    const sortBy = searchParams.get('sortBy') || 'latest';

    // 1. Fetch dashboard status counters in parallel
    const [countersRow] = await pool.query<RowDataPacket[]>(`
      SELECT 
        COUNT(*) AS total,
        SUM(CASE WHEN status = 'Pending Review' THEN 1 ELSE 0 END) AS pendingReview,
        SUM(CASE WHEN status = 'Under Review' THEN 1 ELSE 0 END) AS underReview,
        SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) AS approved,
        SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) AS rejected,
        SUM(CASE WHEN status = 'Published' THEN 1 ELSE 0 END) AS published,
        SUM(CASE WHEN status = 'Archived' THEN 1 ELSE 0 END) AS archived
      FROM property_submissions
    `);

    const counters = {
      total: Number(countersRow[0]?.total || 0),
      pendingReview: Number(countersRow[0]?.pendingReview || 0),
      underReview: Number(countersRow[0]?.underReview || 0),
      approved: Number(countersRow[0]?.approved || 0),
      rejected: Number(countersRow[0]?.rejected || 0),
      published: Number(countersRow[0]?.published || 0),
      archived: Number(countersRow[0]?.archived || 0),
    };

    // 2. Construct dynamic filtered query
    const whereConditions: string[] = [];
    const queryParams: any[] = [];

    if (status !== 'All') {
      whereConditions.push('status = ?');
      queryParams.push(status);
    }

    if (purpose !== 'All') {
      whereConditions.push('listing_purpose = ?');
      queryParams.push(purpose);
    }

    if (type !== 'All') {
      whereConditions.push('property_type = ?');
      queryParams.push(type);
    }

    if (search) {
      whereConditions.push(
        '(reference_number LIKE ? OR owner_name LIKE ? OR owner_phone LIKE ? OR locality LIKE ? OR property_title LIKE ?)'
      );
      const searchWildcard = `%${search}%`;
      queryParams.push(searchWildcard, searchWildcard, searchWildcard, searchWildcard, searchWildcard);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Total filtered count
    const [countResult] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS totalFiltered FROM property_submissions ${whereClause}`,
      queryParams
    );
    const totalFiltered = Number(countResult[0]?.totalFiltered || 0);

    // Sorting
    let orderBy = 'created_at DESC';
    if (sortBy === 'oldest') orderBy = 'created_at ASC';
    else if (sortBy === 'price_high') orderBy = 'expected_price DESC';
    else if (sortBy === 'price_low') orderBy = 'expected_price ASC';

    // Query data
    const dataParams = [...queryParams, limit, offset];
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
        id, reference_number, owner_name, owner_phone, owner_email, owner_whatsapp,
        preferred_contact_method, listing_purpose, property_type, property_title,
        locality, city, address, expected_price, area, area_unit, bedrooms,
        bathrooms, furnishing, parking, description, images, status, admin_notes,
        assigned_to, assigned_to_name, lead_id, published_property_id,
        published_at, published_by, reviewed_at, reviewed_by, consent_given,
        created_at, updated_at
      FROM property_submissions
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?`,
      dataParams
    );

    // Safely parse JSON images
    const submissions = rows.map((r) => {
      let parsedImages: string[] = [];
      try {
        if (typeof r.images === 'string') {
          parsedImages = JSON.parse(r.images);
        } else if (Array.isArray(r.images)) {
          parsedImages = r.images;
        }
      } catch {
        parsedImages = [];
      }
      return {
        ...r,
        expected_price: Number(r.expected_price),
        images: parsedImages,
      };
    });

    return NextResponse.json({
      counters,
      submissions,
      pagination: {
        page,
        limit,
        totalItems: totalFiltered,
        totalPages: Math.ceil(totalFiltered / limit) || 1,
      },
    });

  } catch (error: any) {
    console.error('Error fetching property submissions in GET /api/property-submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property submissions directory.' },
      { status: 500 }
    );
  }
}
