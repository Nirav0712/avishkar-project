import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      source = 'Website Form',
      property_id = null,
      project_id = null,
      interested_in = '',
      preferred_location = '',
      budget = '',
      property_type = '',
      notes = '',
      priority = 'Medium'
    } = body;

    // Validate required fields
    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and Phone number are required' },
        { status: 400 }
      );
    }

    const cleanPhone = String(phone).trim();
    const cleanName = String(name).trim();
    const cleanEmail = email ? String(email).trim() : null;

    // Check for recent duplicate lead (within last 30 days) with same phone number
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id, name, status, notes FROM leads WHERE phone = ? ORDER BY id DESC LIMIT 1',
      [cleanPhone]
    );

    let leadId: number;
    let isExisting = false;

    if (existing.length > 0) {
      isExisting = true;
      leadId = existing[0].id;
      const updatedNotes = `${existing[0].notes || ''}\n[${new Date().toISOString().slice(0, 10)}] Repeated Enquiry: ${interested_in || notes || 'Contact Form submission'}`.trim();

      await pool.query(
        `UPDATE leads SET 
          last_contact_date = NOW(),
          notes = ?,
          interested_in = COALESCE(?, interested_in),
          preferred_location = COALESCE(?, preferred_location),
          budget = COALESCE(?, budget),
          property_type = COALESCE(?, property_type)
        WHERE id = ?`,
        [updatedNotes, interested_in || null, preferred_location || null, budget || null, property_type || null, leadId]
      );

      // Log activity
      await pool.query(
        'INSERT INTO crm_activities (lead_id, action, description, performed_by) VALUES (?, ?, ?, ?)',
        [leadId, 'Repeated Enquiry', `Customer submitted new enquiry via ${source}: ${interested_in || notes || 'Details requested'}`, 'Website System']
      );
    } else {
      // Insert fresh new lead
      const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO leads (
          name, email, phone, source, status, priority,
          property_id, project_id, interested_in, preferred_location,
          budget, property_type, notes, last_contact_date, next_followup_date
        ) VALUES (?, ?, ?, ?, 'New', ?, ?, ?, ?, ?, ?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY))`,
        [
          cleanName,
          cleanEmail,
          cleanPhone,
          source,
          priority,
          property_id ? Number(property_id) : null,
          project_id ? Number(project_id) : null,
          interested_in || null,
          preferred_location || null,
          budget || null,
          property_type || null,
          notes || null
        ]
      );

      leadId = result.insertId;

      // Automatically schedule initial call follow-up for the sales team
      await pool.query(
        `INSERT INTO follow_ups (lead_id, type, due_date, notes, created_by)
         VALUES (?, 'Call', DATE_ADD(NOW(), INTERVAL 1 DAY), 'Initial contact: discuss requirements and property options', 'Auto Lead System')`,
        [leadId]
      );

      // Log lead creation in activity stream
      await pool.query(
        'INSERT INTO crm_activities (lead_id, action, description, performed_by) VALUES (?, ?, ?, ?)',
        [leadId, 'Lead Created', `New lead captured from ${source} (${interested_in || 'General Enquiry'})`, 'Website System']
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Enquiry received successfully! Our real estate specialist will contact you shortly.',
      leadId,
      isExisting
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error processing enquiry in /api/enquire:', error);
    return NextResponse.json(
      { error: 'An error occurred while saving your enquiry. Please try again or reach out on WhatsApp.' },
      { status: 500 }
    );
  }
}
