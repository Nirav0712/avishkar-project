import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { validateAdminSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { user, errorResponse } = await validateAdminSession(request);
    if (errorResponse) return errorResponse;

    // Execute all queries in parallel for ultra-fast response
    const [
      [counts],
      [byStatus],
      [bySource],
      [followUpStats],
      [dealStats],
      [propertyCount],
      [projectCount],
      [recentActivities],
      [upcomingTasks],
    ]: any = await Promise.all([
      // 1. Total leads, new today, new this month
      pool.query(`
        SELECT 
          COUNT(*) as totalLeads,
          SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as newToday,
          SUM(CASE WHEN MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE()) THEN 1 ELSE 0 END) as newThisMonth,
          SUM(CASE WHEN status = 'Qualified' THEN 1 ELSE 0 END) as qualifiedLeads,
          SUM(CASE WHEN status = 'Won' THEN 1 ELSE 0 END) as wonLeads
        FROM leads
      `),
      // 2. Leads by status
      pool.query(`
        SELECT status, COUNT(*) as count 
        FROM leads 
        GROUP BY status
      `),
      // 3. Leads by source
      pool.query(`
        SELECT source, COUNT(*) as count 
        FROM leads 
        GROUP BY source
      `),
      // 4. Follow-ups stats
      pool.query(`
        SELECT 
          SUM(CASE WHEN completed = 0 AND DATE(due_date) < CURDATE() THEN 1 ELSE 0 END) as overdueFollowups,
          SUM(CASE WHEN completed = 0 AND DATE(due_date) = CURDATE() THEN 1 ELSE 0 END) as todayFollowups,
          SUM(CASE WHEN completed = 0 AND DATE(due_date) > CURDATE() THEN 1 ELSE 0 END) as upcomingFollowups
        FROM follow_ups
      `),
      // 5. Deals & Pipeline stats
      pool.query(`
        SELECT 
          COUNT(*) as totalDeals,
          SUM(CASE WHEN stage NOT IN ('Won', 'Lost') THEN 1 ELSE 0 END) as activeDeals,
          COALESCE(SUM(CASE WHEN stage NOT IN ('Won', 'Lost') THEN deal_value ELSE 0 END), 0) as pipelineValue,
          COALESCE(SUM(CASE WHEN stage = 'Won' THEN deal_value ELSE 0 END), 0) as wonValue
        FROM crm_deals
      `),
      // 6. Properties count
      pool.query('SELECT COUNT(*) as count FROM properties'),
      // 7. Projects count
      pool.query('SELECT COUNT(*) as count FROM projects'),
      // 8. Recent activities (latest 10)
      pool.query(`
        SELECT a.*, l.name as lead_name, l.phone as lead_phone
        FROM crm_activities a
        LEFT JOIN leads l ON a.lead_id = l.id
        ORDER BY a.created_at DESC
        LIMIT 10
      `),
      // 9. Upcoming follow-up tasks (latest 6)
      pool.query(`
        SELECT f.*, l.name as lead_name, l.phone as lead_phone, l.status as lead_status
        FROM follow_ups f
        JOIN leads l ON f.lead_id = l.id
        WHERE f.completed = 0
        ORDER BY f.due_date ASC
        LIMIT 6
      `),
    ]);

    // Conversion rate calculation
    const total = Number(counts[0].totalLeads) || 0;
    const won = Number(counts[0].wonLeads) || 0;
    const conversionRate = total > 0 ? ((won / total) * 100).toFixed(1) : '0.0';

    const metricsPayload = {
      totalLeads: total,
      newLeadsToday: Number(counts[0].newToday) || 0,
      newToday: Number(counts[0].newToday) || 0,
      newLeadsThisMonth: Number(counts[0].newThisMonth) || 0,
      newThisMonth: Number(counts[0].newThisMonth) || 0,
      qualifiedLeads: Number(counts[0].qualifiedLeads) || 0,
      wonLeads: won,
      conversionRate: Number(conversionRate),
      overdueFollowUps: Number(followUpStats[0].overdueFollowups) || 0,
      todayFollowUps: Number(followUpStats[0].todayFollowups) || 0,
      upcomingFollowups: Number(followUpStats[0].upcomingFollowups) || 0,
      totalDeals: Number(dealStats[0].totalDeals) || 0,
      activeDeals: Number(dealStats[0].activeDeals) || 0,
      pipelineValue: Number(dealStats[0].pipelineValue) || 0,
      wonValue: Number(dealStats[0].wonValue) || 0,
      totalProperties: Number(propertyCount[0].count) || 0,
      totalProjects: Number(projectCount[0].count) || 0,
      sourceBreakdown: bySource || [],
      statusBreakdown: byStatus || [],
      recentActivities: recentActivities || [],
      upcomingTasks: upcomingTasks || [],
    };

    return NextResponse.json({
      ...metricsPayload,
      metrics: metricsPayload,
      byStatus: byStatus || [],
      bySource: bySource || [],
      recentActivities: recentActivities || [],
      upcomingTasks: upcomingTasks || [],
    });
  } catch (error: any) {
    console.error('Error fetching CRM dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve CRM dashboard metrics', details: error.message },
      { status: 500 }
    );
  }
}
