/**
 * AVISHKAR REALTY: TEST DATA SAFETY & ISOLATION GUARD
 * 
 * Purpose:
 * Prevents automated test scripts from mutating or deleting genuine client data.
 * Enforces strict pattern matching (e.g., 'TEST_%' prefix, '@test-runner.invalid' domain)
 * before any database deletion or modification query is allowed to execute.
 */

function validateTestProperty(property) {
  if (!property || typeof property !== 'object') {
    throw new Error('Safety Guard Rejection: Invalid property object.');
  }
  const title = property.title || '';
  if (!title.startsWith('TEST_') && !title.includes('[Automated Test]')) {
    throw new Error(`Safety Guard Violation: Refusing to touch genuine property "${title}" (ID: ${property.id}). Only titles with "TEST_" are test records.`);
  }
  return true;
}

function validateTestLead(lead) {
  if (!lead || typeof lead !== 'object') {
    throw new Error('Safety Guard Rejection: Invalid lead object.');
  }
  const email = (lead.email || '').toLowerCase();
  const name = lead.name || '';
  const isTest = email.endsWith('@test-runner.invalid') || name.startsWith('TEST_');
  if (!isTest) {
    throw new Error(`Safety Guard Violation: Refusing to touch genuine client lead "${name}" <${email}> (ID: ${lead.id}).`);
  }
  return true;
}

function validateTestSubmission(submission) {
  if (!submission || typeof submission !== 'object') {
    throw new Error('Safety Guard Rejection: Invalid submission object.');
  }
  const ref = submission.reference_number || '';
  const owner = submission.owner_name || '';
  const isTest = ref.startsWith('TEST-') || owner.startsWith('TEST_') || owner.includes('(Test)');
  if (!isTest) {
    throw new Error(`Safety Guard Violation: Refusing to touch genuine property submission "${ref}" (Owner: ${owner}).`);
  }
  return true;
}

/**
 * Safe delete helper that enforces SQL WHERE guards
 */
async function safeDeleteTestProperty(pool, propertyId) {
  const [rows] = await pool.query('SELECT id, title FROM properties WHERE id = ?', [propertyId]);
  if (rows.length === 0) return { deleted: false, reason: 'Not found' };
  
  validateTestProperty(rows[0]);
  
  // Guarded query: requires title to match test pattern at the SQL level
  const [res] = await pool.query("DELETE FROM properties WHERE id = ? AND (title LIKE 'TEST_%' OR title LIKE '%[Automated Test]%')", [propertyId]);
  return { deleted: res.affectedRows > 0, id: propertyId };
}

async function safeDeleteTestLead(pool, leadId) {
  const [rows] = await pool.query('SELECT id, name, email FROM leads WHERE id = ?', [leadId]);
  if (rows.length === 0) return { deleted: false, reason: 'Not found' };
  
  validateTestLead(rows[0]);
  
  // Clean follow_ups & activities for this test lead first
  await pool.query('DELETE FROM follow_ups WHERE lead_id = ?', [leadId]);
  await pool.query('DELETE FROM crm_activities WHERE lead_id = ?', [leadId]);
  
  // Guarded delete query
  const [res] = await pool.query("DELETE FROM leads WHERE id = ? AND (name LIKE 'TEST_%' OR email LIKE '%@test-runner.invalid')", [leadId]);
  return { deleted: res.affectedRows > 0, id: leadId };
}

async function safeDeleteTestSubmission(pool, submissionId) {
  const [rows] = await pool.query('SELECT id, reference_number, owner_name FROM property_submissions WHERE id = ?', [submissionId]);
  if (rows.length === 0) return { deleted: false, reason: 'Not found' };
  
  validateTestSubmission(rows[0]);
  
  const [res] = await pool.query("DELETE FROM property_submissions WHERE id = ? AND (reference_number LIKE 'TEST-%' OR owner_name LIKE 'TEST_%' OR owner_name LIKE '%(Test)%')", [submissionId]);
  return { deleted: res.affectedRows > 0, id: submissionId };
}

module.exports = {
  validateTestProperty,
  validateTestLead,
  validateTestSubmission,
  safeDeleteTestProperty,
  safeDeleteTestLead,
  safeDeleteTestSubmission,
};
