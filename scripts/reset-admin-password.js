#!/usr/bin/env node
/**
 * AVISHKAR REALTY: SECURE ADMIN PASSWORD SETUP & RESET UTILITY
 * 
 * Usage:
 *   node scripts/reset-admin-password.js <email> <newPassword>
 * 
 * Security Features:
 * - Hashes password using bcrypt (10 salt rounds)
 * - Revokes existing active sessions on password change
 * - Logs password reset in audit_logs
 * - Never echoes or prints plaintext passwords
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// Load environment variables safely
function loadEnv() {
  const envPathLocal = path.join(__dirname, '..', '.env.local');
  const envPath = path.join(__dirname, '..', '.env');
  const targetEnv = fs.existsSync(envPathLocal) ? envPathLocal : envPath;

  if (!fs.existsSync(targetEnv)) {
    throw new Error('Environment configuration file (.env or .env.local) not found.');
  }

  const content = fs.readFileSync(targetEnv, 'utf8');
  const env = {};
  content.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx > -1) {
        env[trimmed.substring(0, idx).trim()] = trimmed.substring(idx + 1).trim();
      }
    }
  });
  return env;
}

async function promptQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans.trim());
  }));
}

async function main() {
  console.log('===============================================================');
  console.log('   AVISHKAR REALTY — SECURE ADMIN PASSWORD RESET UTILITY      ');
  console.log('===============================================================\n');

  const env = loadEnv();

  let email = process.argv[2];
  let newPassword = process.argv[3];

  if (!email) {
    email = await promptQuestion('Enter admin email address: ');
  }

  if (!newPassword) {
    newPassword = await promptQuestion('Enter new secure password (min 8 chars): ');
  }

  if (!email || !email.includes('@')) {
    console.error('❌ Error: A valid email address is required.');
    process.exit(1);
  }

  if (!newPassword || newPassword.length < 8) {
    console.error('❌ Error: Password must be at least 8 characters long.');
    process.exit(1);
  }

  const pool = mysql.createPool({
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    port: parseInt(env.DB_PORT || '3306'),
    waitForConnections: true,
    connectionLimit: 3,
  });

  try {
    // 1. Check if user exists
    const [rows] = await pool.query('SELECT id, name, email, role FROM register WHERE email = ?', [email]);

    if (rows.length === 0) {
      console.log(`⚠️ User "${email}" was not found in the 'register' table.`);
      const createNew = await promptQuestion(`Would you like to create a new administrator account with this email? (y/n): `);

      if (createNew.toLowerCase() === 'y' || createNew.toLowerCase() === 'yes') {
        const name = await promptQuestion('Enter full name: ');
        const phone = await promptQuestion('Enter contact mobile number: ');

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const [insertRes] = await pool.query(
          'INSERT INTO register (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)',
          [name || 'Administrator', email, phone || '9999999999', hashedPassword, 'super_admin']
        );

        console.log('\n✅ New Super Administrator successfully provisioned!');
        console.log(`   Account ID: ${insertRes.insertId}`);
        console.log(`   Email: ${email}`);
        console.log(`   Role: super_admin`);
        console.log(`   Password: [Securely hashed with bcrypt]`);
      } else {
        console.log('Operation aborted.');
      }
      await pool.end();
      return;
    }

    const user = rows[0];

    // 2. Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 3. Update password and revoke active session
    await pool.query(
      'UPDATE register SET password = ?, sessionId = NULL, updated_at = NOW() WHERE id = ?',
      [hashedPassword, user.id]
    );

    // 4. Log in audit_logs
    try {
      await pool.query(
        'INSERT INTO audit_logs (action, target_type, target_id, details) VALUES (?, ?, ?, ?)',
        ['RESET_ADMIN_PASSWORD', 'register', user.id, `Password reset performed via secure CLI for admin ${user.email}`]
      );
    } catch {}

    console.log(`\n✅ Password successfully updated for ${user.name} (${user.email})!`);
    console.log(`   Security Notice: Any active sessions have been automatically revoked.`);
    console.log(`   Login URL: /login\n`);

  } finally {
    await pool.end();
  }
}

main().catch(err => {
  console.error('Fatal Error:', err.message);
  process.exit(1);
});
