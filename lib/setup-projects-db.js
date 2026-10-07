const mysql = require('mysql2/promise');

async function setup() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306
  });

  console.log('Creating projects table if not exists...');
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

  console.log('Checking if projects table already has data...');
  const [rows] = await pool.query('SELECT COUNT(*) as count FROM projects');
  console.log('Current projects count in DB:', rows[0].count);

  console.log('Setup finished successfully.');
}

setup().then(() => process.exit(0)).catch(err => {
  console.error('Setup error:', err);
  process.exit(1);
});
