import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ResultSetHeader } from 'mysql2';
import { validateAdminSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { user, errorResponse } = await validateAdminSession(request);
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all'; // 'today', 'overdue', 'upcoming', 'all'

    let whereClause = '';
    if (filter === 'today') {
      whereClause = 'WHERE f.completed = 0 AND DATE(f.due_date) = CURDATE()';
    } else if (filter === 'overdue') {
      whereClause = 'WHERE f.completed = 0 AND DATE(f.due_date) < CURDATE()';
    } else if (filter === 'upcoming') {
      whereClause = 'WHERE f.completed = 0 AND DATE(f.due_date) > CURDATE()';
    } else if (filter === 'pending') {
      whereClause = 'WHERE f.completed = 0';
    }

    const [rows]: any = await pool.query(`
      SELECT f.*, 
             f.type as task_type,
             f.due_date as scheduled_at,
             CASE WHEN f.completed = 1 THEN 'Completed' ELSE 'Pending' END as status,
             l.name as lead_name, 
             l.phone as lead_phone, 
             l.status as lead_status, 
             l.interested_in as property_title
      FROM follow_ups f
      JOIN leads l ON f.lead_id = l.id
      ${whereClause}
      ORDER BY f.completed ASC, f.due_date ASC
      LIMIT 100
    `);

    // Return both format: array directly and { followups: [...] }
    const responseData = Object.assign(rows, { followups: rows });
    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error('Error fetching followups:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch follow-ups' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, errorResponse } = await validateAdminSession(request);
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const lead_id = body.lead_id;
    const task_type = body.task_type || body.type || 'Call';
    const due_date = body.due_date || body.scheduled_at;
    const notes = body.notes || '';
    const created_by = body.created_by || user?.name || 'Admin';

    if (!lead_id || !due_date) {
      return NextResponse.json({ error: 'Lead ID and Due Date (or scheduled_at) are required' }, { status: 400 });
    }

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO follow_ups (lead_id, type, due_date, notes, created_by)
       VALUES (?, ?, ?, ?, ?)`,
      [lead_id, task_type, due_date, notes, created_by]
    );

    // Update lead's next_followup_date
    await pool.query(
      'UPDATE leads SET next_followup_date = ? WHERE id = ?',
      [due_date, lead_id]
    );

    // Activity log
    await pool.query(
      'INSERT INTO crm_activities (lead_id, action, description, performed_by) VALUES (?, ?, ?, ?)',
      [lead_id, 'FOLLOWUP_SCHEDULED', `Scheduled ${task_type} for ${due_date}: ${notes}`, created_by]
    );

    return NextResponse.json(
      { success: true, message: 'Follow-up created successfully', id: result.insertId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating followup:', error);
    return NextResponse.json({ error: error.message || 'Failed to create follow-up' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { user, errorResponse } = await validateAdminSession(request);
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const { id, completed, status } = body;

    if (!id) {
      return NextResponse.json({ error: 'Follow-up ID is required' }, { status: 400 });
    }

    const isCompleted = status === 'Completed' ? 1 : (completed !== undefined ? (completed ? 1 : 0) : 1);
    const completedAt = isCompleted ? new Date() : null;

    await pool.query(
      'UPDATE follow_ups SET completed = ?, completed_at = ? WHERE id = ?',
      [isCompleted, completedAt, id]
    );

    return NextResponse.json({ success: true, message: 'Follow-up status updated' });
  } catch (error: any) {
    console.error('Error updating followup:', error);
    return NextResponse.json({ error: error.message || 'Failed to update follow-up' }, { status: 500 });
  }
}
