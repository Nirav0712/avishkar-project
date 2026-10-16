import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { validateAdminSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Only Admin, Super Admin, and Sales Manager can export client records
    const { user, errorResponse } = await validateAdminSession(request, [
      'admin',
      'super_admin',
      'sales_manager',
    ]);
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'leads';

    if (type === 'leads') {
      const [rows]: any = await pool.query(`
        SELECT id, name, phone, email, source, status, priority,
               interested_in, preferred_location, budget, property_type,
               assigned_to_name, created_at, last_contact_date, next_followup_date
        FROM leads
        ORDER BY created_at DESC
      `);

      // Convert to CSV
      const headers = [
        'ID',
        'Name',
        'Phone',
        'Email',
        'Source',
        'Status',
        'Priority',
        'Interested In',
        'Location',
        'Budget',
        'Type',
        'Assigned To',
        'Created Date',
      ];
      const csvRows = [headers.join(',')];

      for (const r of rows) {
        const values = [
          r.id,
          `"${(r.name || '').replace(/"/g, '""')}"`,
          `"${(r.phone || '').replace(/"/g, '""')}"`,
          `"${(r.email || '').replace(/"/g, '""')}"`,
          `"${(r.source || '').replace(/"/g, '""')}"`,
          `"${(r.status || '').replace(/"/g, '""')}"`,
          `"${(r.priority || '').replace(/"/g, '""')}"`,
          `"${(r.interested_in || '').replace(/"/g, '""')}"`,
          `"${(r.preferred_location || '').replace(/"/g, '""')}"`,
          `"${(r.budget || '').replace(/"/g, '""')}"`,
          `"${(r.property_type || '').replace(/"/g, '""')}"`,
          `"${(r.assigned_to_name || '').replace(/"/g, '""')}"`,
          `"${r.created_at ? new Date(r.created_at).toISOString().slice(0, 10) : ''}"`,
        ];
        csvRows.push(values.join(','));
      }

      // Log export action in audit_logs
      try {
        await pool.query(
          'INSERT INTO audit_logs (action, target_type, target_id, details) VALUES (?, ?, ?, ?)',
          [
            'EXPORT_LEADS_CSV',
            'leads',
            rows.length,
            `Exported ${rows.length} leads to CSV by ${user?.name} (${user?.email})`,
          ]
        );
      } catch (auditErr) {
        console.error('Audit log error on export:', auditErr);
      }

      const csvData = csvRows.join('\n');
      return new NextResponse(csvData, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="avishkar_leads_${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    if (type === 'submissions') {
      const [rows]: any = await pool.query(`
        SELECT reference_number, owner_name, owner_phone, owner_email,
               listing_purpose, property_type, property_title, locality, city,
               expected_price, area, area_unit, bedrooms, bathrooms,
               furnishing, status, created_at, reviewed_by, reviewed_at
        FROM property_submissions
        ORDER BY created_at DESC
      `);

      const headers = [
        'Reference ID',
        'Owner Name',
        'Owner Phone',
        'Owner Email',
        'Purpose',
        'Property Type',
        'Property Title',
        'Locality',
        'City',
        'Expected Price (INR)',
        'Area',
        'Area Unit',
        'Bedrooms',
        'Bathrooms',
        'Furnishing',
        'Review Status',
        'Submitted Date',
      ];
      const csvRows = [headers.join(',')];

      for (const r of rows) {
        const values = [
          `"${r.reference_number}"`,
          `"${(r.owner_name || '').replace(/"/g, '""')}"`,
          `"${(r.owner_phone || '').replace(/"/g, '""')}"`,
          `"${(r.owner_email || '').replace(/"/g, '""')}"`,
          `"${r.listing_purpose}"`,
          `"${(r.property_type || '').replace(/"/g, '""')}"`,
          `"${(r.property_title || '').replace(/"/g, '""')}"`,
          `"${(r.locality || '').replace(/"/g, '""')}"`,
          `"${(r.city || '').replace(/"/g, '""')}"`,
          Number(r.expected_price) || 0,
          Number(r.area) || 0,
          `"${r.area_unit || 'sq ft'}"`,
          Number(r.bedrooms) || 0,
          Number(r.bathrooms) || 0,
          `"${r.furnishing || 'N/A'}"`,
          `"${r.status}"`,
          `"${r.created_at ? new Date(r.created_at).toISOString().slice(0, 10) : ''}"`,
        ];
        csvRows.push(values.join(','));
      }

      // Log export action in audit_logs
      try {
        await pool.query(
          'INSERT INTO audit_logs (action, target_type, target_id, details) VALUES (?, ?, ?, ?)',
          [
            'EXPORT_SUBMISSIONS_CSV',
            'property_submissions',
            rows.length,
            `Exported ${rows.length} property submissions to CSV by ${user?.name} (${user?.email})`,
          ]
        );
      } catch (auditErr) {
        console.error('Audit log error on export:', auditErr);
      }

      const csvData = csvRows.join('\n');
      return new NextResponse(csvData, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="avishkar_property_submissions_${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    return NextResponse.json({ error: 'Unknown export type' }, { status: 400 });
  } catch (error: any) {
    console.error('Error exporting data:', error);
    return NextResponse.json({ error: error.message || 'Export failed' }, { status: 500 });
  }
}
