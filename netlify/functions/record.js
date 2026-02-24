const { Pool } = require('pg');

// create a single pool instance that reuses connections
const pool = new Pool({
  connectionString: process.env.PG_URL || process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (err) {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const {
    customer_name,
    amount,
    screenshot_time,
    status,
    transaction_time,
    date,
    upi_id,
  } = body;

  const insertQuery = `
    INSERT INTO phonepe
      (customer_name, amount, screenshot_time, status, transaction_time, date, upi_id)
    VALUES
      ($1,$2,$3,$4,$5,$6,$7)
  `;

  try {
    await pool.query(insertQuery, [
      customer_name,
      amount,
      screenshot_time,
      status,
      transaction_time,
      date,
      upi_id,
    ]);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error('DB insert error', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
