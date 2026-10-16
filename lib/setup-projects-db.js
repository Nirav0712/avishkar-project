const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

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

async function setup() {
  const env = loadEnv();
  const pool = mysql.createPool({
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    port: Number(env.DB_PORT) || 3306
  });

  console.log('Verifying projects table structure...');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      location VARCHAR(255) NOT NULL,
      status VARCHAR(100) NOT NULL DEFAULT 'Under Construction',
      zone VARCHAR(100) DEFAULT '',
      bedrooms VARCHAR(100) DEFAULT '2 & 3',
      bathrooms INT DEFAULT 2,
      displayPrice VARCHAR(255) DEFAULT 'Price On Request',
      PlotArea VARCHAR(255) DEFAULT '',
      address TEXT,
      description LONGTEXT,
      image TEXT,
      images LONGTEXT,
      youtubeUrl VARCHAR(500) NULL,
      instagramUrl VARCHAR(500) NULL,
      videoThumbnail VARCHAR(500) NULL,
      videoTitle VARCHAR(255) NULL,
      hasVideo BOOLEAN DEFAULT FALSE,
      featured BOOLEAN DEFAULT FALSE,
      isForSale BOOLEAN DEFAULT TRUE,
      rera TEXT,
      blogId INT NULL,
      unitTypes LONGTEXT,
      amenities LONGTEXT,
      possession VARCHAR(100) NULL,
      totalTowers INT NULL,
      totalFloors INT NULL,
      totalUnits INT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  console.log('Checking projects table in DB...');
  const [rows] = await pool.query('SELECT COUNT(*) as count FROM projects');
  console.log('Current projects count in DB:', rows[0].count);

  await pool.end();
  console.log('Setup finished successfully.');
}

setup().then(() => process.exit(0)).catch(err => {
  console.error('Setup error:', err);
  process.exit(1);
});

