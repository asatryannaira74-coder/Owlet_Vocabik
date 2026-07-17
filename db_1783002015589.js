const { Pool } = require('pg');

// Replit-ը ինքնաշխատ տրամադրում է DATABASE_URL փոփոխականը, երբ կպցված է PostgreSQL տվյալների բազան
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;
