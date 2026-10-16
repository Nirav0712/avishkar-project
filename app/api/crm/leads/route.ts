import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ResultSetHeader } from 'mysql2';
import { validateAdminSession } from '@/lib/auth';

// GET /api/crm/leads - list leads with filtering, search, and pagination
export async function GET(request: NextRequest) {
  try {
    const { user, errorResponse } = await validateAdminSession(request);
    if (errorResponse) return errorResponse;
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const source = searchParams.get('source') || '';
    const priority = searchParams.get('priority') || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '25')));
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const params: any[] = [];

    if (search.trim()) {
      conditions.push('(name LIKE ? OR phone LIKE ? OR email LIKE ? OR interested_in LIKE ? OR preferred_location LIKE ?)');
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term, term);
    }

    if (status && status !== 'all') {
      conditions.push('status = ?');
      params.push(status);
    }

    if (source && source !== 'all') {
      conditions.push('source = ?');
      params.push(source);
    }

    if (priority && priority !== 'all') {
      conditions.push('priority = ?');
      params.push(priority);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const [countResult]: any = await pool.query(
      `SELECT COUNT(*) as total FROM leads ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    // Get paginated leads
    const [rows]: any = await pool.query(
      `SELECT * FROM leads ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return NextResponse.json({
      leads: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error: any) {
    console.error('Database error in GET /api/crm/leads:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch leads' }, { status: 500 });
  }
}

// POST /api/crm/leads - manually add lead from admin
export async function POST(request: NextRequest) {
  try {
    const { user, errorResponse } = await validateAdminSession(request);
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const {
      name,
      email,
      phone,
      source = 'Direct Walk-in',
      status = 'New',
      priority = 'Medium',
      interested_in,
      preferred_location,
      budget,
      property_type,
      notes,
      assigned_to_name
    } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and Phone are required' }, { status: 400 });
    }

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO leads (
        name, email, phone, source, status, priority,
        interested_in, preferred_location, budget, property_type,
        notes, assigned_to_name, last_contact_date, next_followup_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY))`,
      [
        name,
        email || null,
        phone,
        source,
        status,
        priority,
        interested_in || null,
        preferred_location || null,
        budget || null,
        property_type || null,
        notes || null,
        assigned_to_name || 'Unassigned'
      ]
    );

    const leadId = result.insertId;

    // Log activity
    await pool.query(
      'INSERT INTO crm_activities (lead_id, action, description, performed_by) VALUES (?, ?, ?, ?)',
      [leadId, 'Lead Created', `Lead created manually in CRM (${name})`, 'Admin User']
    );

    // Initial follow-up task
    await pool.query(
      `INSERT INTO follow_ups (lead_id, type, due_date, notes, created_by)
       VALUES (?, 'Call', DATE_ADD(NOW(), INTERVAL 1 DAY), 'Follow up on requirement discussion', 'Admin User')`,
      [leadId]
    );

    return NextResponse.json({ id: leadId, ...body }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating lead in /api/crm/leads:', error);
    return NextResponse.json({ error: error.message || 'Failed to create lead' }, { status: 500 });
  }
}
