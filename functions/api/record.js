import { neon } from '@neondatabase/serverless';

const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
});

export async function onRequestPost({ request, env }) {
  const databaseUrl = env.PG_URL || env.DATABASE_URL;
  if (!databaseUrl) return json({ error: 'Database is not configured' }, 500);

  let data;
  try { data = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }
  const { customer_name, amount, screenshot_time, status, transaction_time, date, upi_id } = data || {};
  if (!customer_name || !amount) return json({ error: 'Missing required fields' }, 400);

  try {
    const sql = neon(databaseUrl);
    await sql`
      INSERT INTO phonepe
        (customer_name, amount, screenshot_time, status, transaction_time, date, upi_id)
      VALUES
        (${customer_name}, ${amount}, ${screenshot_time || ''}, ${status || ''},
         ${transaction_time || ''}, ${date || null}, ${upi_id || ''})
    `;
    return json({ success: true });
  } catch (error) {
    console.error('DB insert error:', error);
    return json({ error: 'Database error' }, 500);
  }
}
