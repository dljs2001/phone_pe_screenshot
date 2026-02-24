-- SQL script to create the `phonepe` table
-- run this using `psql` and the connection string provided in your .env file

CREATE TABLE IF NOT EXISTS phonepe (
    id SERIAL PRIMARY KEY,
    customer_name TEXT NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    screenshot_time TIME NOT NULL,
    status TEXT NOT NULL,
    transaction_time TIME NOT NULL,
    date DATE NOT NULL,
    upi_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
