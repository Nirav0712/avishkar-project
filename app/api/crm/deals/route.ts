import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ResultSetHeader } from 'mysql2';
import { validateAdminSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { user, errorResponse } = await validateAdminSession(request);
    if (errorResponse) return errorResponse;

    const [rows]: any = await pool.query(`
      SELECT d.*, 
             d.title as deal_name,
             l.name as lead_name, 
             l.phone as lead_phone, 
             l.email as lead_email,
             p.title as property_title, 
             p.price as property_listed_price
      FROM crm_deals d
      LEFT JOIN leads l ON d.lead_id = l.id
      LEFT JOIN properties p ON d.property_id = p.id
      ORDER BY d.created_at DESC
    `);

    const responseData = Object.assign(rows, { deals: rows });
    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error('Error fetching deals:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch deals' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, errorResponse } = await validateAdminSession(request);
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const lead_id = body.lead_id || null;
    const title = body.title || body.deal_name;
    const property_id = body.property_id || null;
    const deal_value = body.deal_value || 0;
    const stage = body.stage || 'Proposal';
    const assigned_agent = body.assigned_agent || user?.name || 'Sales Team';
    const expected_close_date = body.expected_close_date || null;
    const notes = body.notes || '';

    if (!title) {
      return NextResponse.json({ error: 'Deal title (or deal_name) is required' }, { status: 400 });
    }

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO crm_deals (
        lead_id, title, property_id, deal_value, stage,
        assigned_agent, expected_close_date, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        lead_id ? Number(lead_id) : null,
        title,
        property_id ? Number(property_id) : null,
        Number(deal_value) || 0,
        stage,
        assigned_agent,
        expected_close_date || null,
        notes
      ]
    );

    if (lead_id) {
      await pool.query(
        'INSERT INTO crm_activities (lead_id, deal_id, action, description, performed_by) VALUES (?, ?, ?, ?, ?)',
        [lead_id, result.insertId, 'DEAL_CREATED', `Deal "${title}" created for ₹${deal_value}`, assigned_agent]
      );
    }

    return NextResponse.json(
      { success: true, message: 'Deal created successfully', id: result.insertId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating deal:', error);
    return NextResponse.json({ error: error.message || 'Failed to create deal' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { user, errorResponse } = await validateAdminSession(request);
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const { id, stage, loss_reason, deal_value } = body;

    if (!id) {
      return NextResponse.json({ error: 'Deal ID is required' }, { status: 400 });
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (stage) {
      updates.push('stage = ?');
      values.push(stage);
    }
    if (loss_reason !== undefined) {
      updates.push('loss_reason = ?');
      values.push(loss_reason);
    }
    if (deal_value !== undefined) {
      updates.push('deal_value = ?');
      values.push(Number(deal_value));
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    values.push(id);
    await pool.query(`UPDATE crm_deals SET ${updates.join(', ')} WHERE id = ?`, values);

    // If won, also update lead status
    if (stage === 'Closed Won' || stage === 'Won') {
      const [dealRows]: any = await pool.query('SELECT lead_id, title FROM crm_deals WHERE id = ?', [id]);
      if (dealRows.length > 0 && dealRows[0].lead_id) {
        await pool.query('UPDATE leads SET status = "Won" WHERE id = ?', [dealRows[0].lead_id]);
      }
    }

    return NextResponse.json({ success: true, message: 'Deal updated successfully' });
  } catch (error: any) {
    console.error('Error updating deal:', error);
    return NextResponse.json({ error: error.message || 'Failed to update deal' }, { status: 500 });
  }
}
