import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { validateAdminSession } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, errorResponse } = await validateAdminSession(request);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const [rows]: any = await pool.query('SELECT * FROM leads WHERE id = ?', [id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const lead = rows[0];

    // Fetch activities for this lead
    const [activities]: any = await pool.query(
      'SELECT * FROM crm_activities WHERE lead_id = ? ORDER BY created_at DESC',
      [id]
    );

    // Fetch follow-ups for this lead
    const [followups]: any = await pool.query(
      'SELECT * FROM follow_ups WHERE lead_id = ? ORDER BY due_date DESC',
      [id]
    );

    // Fetch deals for this lead
    const [deals]: any = await pool.query(
      'SELECT * FROM crm_deals WHERE lead_id = ? ORDER BY created_at DESC',
      [id]
    );

    return NextResponse.json({
      lead,
      activities: activities || [],
      followups: followups || [],
      deals: deals || []
    });

  } catch (error: any) {
    console.error('Error in GET /api/crm/leads/[id]:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch lead' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, errorResponse } = await validateAdminSession(request);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const body = await request.json();
    const {
      name,
      email,
      phone,
      source,
      status,
      priority,
      interested_in,
      preferred_location,
      budget,
      property_type,
      notes,
      assigned_to_name,
      next_followup_date,
      performed_by = user?.name || 'Admin User'
    } = body;

    // Get old lead data to see what changed for activity logging
    const [currentRows]: any = await pool.query('SELECT * FROM leads WHERE id = ?', [id]);
    if (currentRows.length === 0) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }
    const oldLead = currentRows[0];

    await pool.query(
      `UPDATE leads SET
        name = COALESCE(?, name),
        email = COALESCE(?, email),
        phone = COALESCE(?, phone),
        source = COALESCE(?, source),
        status = COALESCE(?, status),
        priority = COALESCE(?, priority),
        interested_in = COALESCE(?, interested_in),
        preferred_location = COALESCE(?, preferred_location),
        budget = COALESCE(?, budget),
        property_type = COALESCE(?, property_type),
        notes = COALESCE(?, notes),
        assigned_to_name = COALESCE(?, assigned_to_name),
        next_followup_date = COALESCE(?, next_followup_date)
      WHERE id = ?`,
      [
        name,
        email,
        phone,
        source,
        status,
        priority,
        interested_in,
        preferred_location,
        budget,
        property_type,
        notes,
        assigned_to_name,
        next_followup_date,
        id
      ]
    );

    // Track status change in activities if changed
    if (status && status !== oldLead.status) {
      await pool.query(
        'INSERT INTO crm_activities (lead_id, action, description, performed_by) VALUES (?, ?, ?, ?)',
        [id, 'Pipeline Stage Changed', `Stage moved from '${oldLead.status}' to '${status}'`, performed_by]
      );
    } else if (assigned_to_name && assigned_to_name !== oldLead.assigned_to_name) {
      await pool.query(
        'INSERT INTO crm_activities (lead_id, action, description, performed_by) VALUES (?, ?, ?, ?)',
        [id, 'Executive Assigned', `Assigned to ${assigned_to_name}`, performed_by]
      );
    } else {
      await pool.query(
        'INSERT INTO crm_activities (lead_id, action, description, performed_by) VALUES (?, ?, ?, ?)',
        [id, 'Lead Updated', 'Details updated in CRM', performed_by]
      );
    }

    return NextResponse.json({ success: true, message: 'Lead updated successfully' });

  } catch (error: any) {
    console.error('Error updating lead in PUT /api/crm/leads/[id]:', error);
    return NextResponse.json({ error: error.message || 'Failed to update lead' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, errorResponse } = await validateAdminSession(request, ['admin', 'super_admin']);
    if (errorResponse) return errorResponse;

    const { id } = await params;

    // Log deletion into audit_logs before removing
    await pool.query(
      `INSERT INTO audit_logs (action, target_type, target_id, details)
       VALUES ('DELETE_LEAD', 'lead', ?, ?)`,
      [id, `Lead deleted from CRM by ${user?.name || 'Admin'} (${user?.email || 'N/A'})`]
    );

    await pool.query('DELETE FROM follow_ups WHERE lead_id = ?', [id]);
    await pool.query('DELETE FROM crm_activities WHERE lead_id = ?', [id]);
    await pool.query('DELETE FROM crm_deals WHERE lead_id = ?', [id]);
    await pool.query('DELETE FROM leads WHERE id = ?', [id]);

    return NextResponse.json({ success: true, message: 'Lead and associated records deleted' });

  } catch (error: any) {
    console.error('Error deleting lead:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete lead' }, { status: 500 });
  }
}
