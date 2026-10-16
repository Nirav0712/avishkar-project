import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { validateAdminSession } from '@/lib/auth';

// 1. GET SINGLE SUBMISSION (Protected Admin)
export async function GET(
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

    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM property_submissions WHERE id = ? LIMIT 1',
      [submissionId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Property submission not found' }, { status: 404 });
    }

    const submission = rows[0];
    let parsedImages: string[] = [];
    try {
      parsedImages = typeof submission.images === 'string' ? JSON.parse(submission.images) : (submission.images || []);
    } catch {
      parsedImages = [];
    }

    // Also fetch linked published property if exists
    let publishedProperty = null;
    if (submission.published_property_id) {
      const [propRows] = await pool.query<RowDataPacket[]>(
        'SELECT id, title, price, location, type, status, image FROM properties WHERE id = ? LIMIT 1',
        [submission.published_property_id]
      );
      if (propRows.length > 0) {
        publishedProperty = propRows[0];
      }
    }

    // Also fetch linked lead activities if exists
    let leadActivities: any[] = [];
    if (submission.lead_id) {
      const [actRows] = await pool.query<RowDataPacket[]>(
        'SELECT id, action, description, performed_by, created_at FROM crm_activities WHERE lead_id = ? ORDER BY id DESC LIMIT 10',
        [submission.lead_id]
      );
      leadActivities = actRows;
    }

    return NextResponse.json({
      submission: {
        ...submission,
        expected_price: Number(submission.expected_price),
        images: parsedImages,
      },
      publishedProperty,
      leadActivities,
    });
  } catch (error: any) {
    console.error('Error in GET /api/property-submissions/[id]:', error);
    return NextResponse.json({ error: 'Failed to fetch submission details' }, { status: 500 });
  }
}

// 2. UPDATE STATUS & ADMIN NOTES (Protected Admin)
export async function PATCH(
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

    const body = await request.json();
    const { status, admin_notes, adminNotes, assigned_to, assigned_to_name } = body;
    const incomingNotes = admin_notes !== undefined ? admin_notes : adminNotes;

    const allowedStatuses = [
      'Pending Review',
      'Under Review',
      'Approved',
      'Rejected',
      'Published',
      'Archived',
    ];

    if (status && !allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Fetch existing submission
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id, reference_number, status, admin_notes, lead_id FROM property_submissions WHERE id = ? LIMIT 1',
      [submissionId]
    );

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Property submission not found' }, { status: 404 });
    }

    const current = existing[0];
    const newStatus = status || current.status;
    const newNotes = incomingNotes !== undefined ? incomingNotes : current.admin_notes;

    await pool.query(
      `UPDATE property_submissions SET
        status = ?,
        admin_notes = ?,
        assigned_to = COALESCE(?, assigned_to),
        assigned_to_name = COALESCE(?, assigned_to_name),
        reviewed_at = NOW(),
        reviewed_by = ?
      WHERE id = ?`,
      [newStatus, newNotes, assigned_to || null, assigned_to_name || null, user?.name || 'Admin', submissionId]
    );

    // Audit log
    try {
      await pool.query(
        'INSERT INTO audit_logs (action, target_type, target_id, details) VALUES (?, ?, ?, ?)',
        [
          'UPDATE_SUBMISSION_STATUS',
          'property_submission',
          submissionId,
          `Status changed from "${current.status}" to "${newStatus}" for ${current.reference_number} by ${user?.name}`,
        ]
      );

      // CRM Activity log if lead exists
      if (current.lead_id) {
        await pool.query(
          'INSERT INTO crm_activities (lead_id, action, description, performed_by) VALUES (?, ?, ?, ?)',
          [
            current.lead_id,
            'Status Changed',
            `Property submission status updated to "${newStatus}" by ${user?.name}`,
            user?.name || 'Admin',
          ]
        );
      }
    } catch {}

    return NextResponse.json({
      success: true,
      message: `Property submission ${current.reference_number} updated to "${newStatus}".`,
      status: newStatus,
      admin_notes: newNotes,
    });
  } catch (error: any) {
    console.error('Error in PATCH /api/property-submissions/[id]:', error);
    return NextResponse.json({ error: 'Failed to update property submission' }, { status: 500 });
  }
}
