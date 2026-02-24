# PhonePe Screenshot App

This project generates a transaction receipt image and records information in a PostgreSQL database via Netlify functions whenever the "Download as PNG" button is pressed.

## Setup

1. **Initialize Node project**
   ```bash
   cd path/to/phone_pe_screenshot-main
   npm init -y
   ```

2. **Install dependencies**
   ```bash
   npm install pg netlify-cli dotenv
   ```

3. **Environment variable**
   Create a `.env` file in the project root (already provided) and put the Neon/Postgres URL:
   ```env
   PG_URL="postgresql://neondb_owner:npg_VjQUeDagK0O9@ep-steep-fire-ae637xly-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
   ```
   The `.gitignore` already ignores `.env` and `node_modules`.

4. **Database schema**
   Run the SQL script to create the `phonepe` table:
   ```bash
   psql "$PG_URL" -f create_phonepe_table.sql
   ```
   (or copy the contents of the file and run manually).

## Local Development

- Start the Netlify development server to serve the static site and the function endpoint:
  ```bash
  npx netlify dev
  ```
  or you can add a script to `package.json`:
  ```json
  "scripts": {
    "dev": "netlify dev"
  }
  ```
  then run `npm run dev`.

- Open `http://localhost:8888` in your browser. Fill out the form and click **Download as PNG** to generate the image; the same action will POST a record to the `record` function.

- The function will insert a row into the `phonepe` table with columns for customer name, amount, screenshot time, status, transaction time, date, UPI ID, and a timestamp (`created_at`).

## Notes

- In production, set the `PG_URL` (or `DATABASE_URL`) environment variable in Netlify's dashboard under Site Settings → Build & deploy → Environment.
- The `netlify.toml` file directs builds to use `netlify/functions` as the function directory.
