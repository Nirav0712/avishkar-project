/**
 * Pure offline unit test for safety guards.
 * Zero database connections, zero mutations.
 */
const {
  validateTestProperty,
  validateTestLead,
  validateTestSubmission,
} = require('./test-safety-guard');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`[PASS] ${message}`);
  } else {
    failed++;
    console.error(`[FAIL] ${message}`);
  }
}

// 1. Genuine property must be BLOCKED
try {
  validateTestProperty({ id: 19, title: 'Shine Superb Apartments, Gota, Ahmedabad' });
  assert(false, 'Should block genuine property');
} catch (e) {
  assert(true, 'Genuine property was successfully blocked: ' + e.message);
}

// 2. Test property must be ALLOWED
try {
  validateTestProperty({ id: 999, title: 'TEST_Luxury Penthouse' });
  assert(true, 'Test property with TEST_ prefix allowed');
} catch (e) {
  assert(false, 'Failed to allow test property: ' + e.message);
}

// 3. Genuine client lead must be BLOCKED
try {
  validateTestLead({ id: 1, name: 'Vikram Patel', email: 'vikram.patel@example.com' });
  assert(false, 'Should block genuine client lead');
} catch (e) {
  assert(true, 'Genuine client lead was successfully blocked: ' + e.message);
}

// 4. Test lead must be ALLOWED
try {
  validateTestLead({ id: 999, name: 'TEST_Runner', email: 'runner@test-runner.invalid' });
  assert(true, 'Test lead with @test-runner.invalid allowed');
} catch (e) {
  assert(false, 'Failed to allow test lead: ' + e.message);
}

// 5. Genuine submission must be BLOCKED
try {
  validateTestSubmission({ id: 5, reference_number: 'AVISH-20261015-XYZ1', owner_name: 'Harsh Vardhan' });
  assert(false, 'Should block genuine submission');
} catch (e) {
  assert(true, 'Genuine submission was successfully blocked: ' + e.message);
}

console.log(`\nResults: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
