-- =============================================================
-- Offline POS & Inventory Management System — Database Schema
-- Applied at startup by database.ts (idempotent / CREATE IF NOT EXISTS)
-- =============================================================

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- -------------------------------------------------------------
-- products
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  category    TEXT    NOT NULL DEFAULT '',
  price       REAL    NOT NULL DEFAULT 0,
  quantity    INTEGER NOT NULL DEFAULT 0,
  min_stock   INTEGER NOT NULL DEFAULT 0,
  barcode     TEXT    UNIQUE,
  description TEXT    NOT NULL DEFAULT '',
  updated_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

-- -------------------------------------------------------------
-- customers
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS customers (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  name    TEXT NOT NULL,
  phone   TEXT NOT NULL DEFAULT '',
  email   TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  notes   TEXT NOT NULL DEFAULT ''
);

-- -------------------------------------------------------------
-- users  (staff accounts)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  name  TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  role  TEXT NOT NULL DEFAULT 'cashier'   -- admin | manager | cashier
);

-- -------------------------------------------------------------
-- sales  (invoice header)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sales (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp       TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  cashier_user_id INTEGER NOT NULL REFERENCES users(id),
  customer_id     INTEGER REFERENCES customers(id),   -- nullable
  total           REAL    NOT NULL DEFAULT 0,
  mode            TEXT    NOT NULL DEFAULT 'single'   -- single | dual
);

-- -------------------------------------------------------------
-- sale_items  (invoice line items)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sale_items (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  sale_id     INTEGER NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  product_id  INTEGER NOT NULL REFERENCES products(id),
  qty         INTEGER NOT NULL DEFAULT 1,
  unit_price  REAL    NOT NULL DEFAULT 0
);

-- -------------------------------------------------------------
-- assets  (equipment / fixed-asset register)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS assets (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  name            TEXT NOT NULL,
  category        TEXT NOT NULL DEFAULT '',
  brand           TEXT NOT NULL DEFAULT '',
  quantity        INTEGER NOT NULL DEFAULT 1,
  condition       TEXT NOT NULL DEFAULT 'good',    -- good | fair | poor
  status          TEXT NOT NULL DEFAULT 'active',  -- active | disposed | maintenance
  purchase_price  REAL NOT NULL DEFAULT 0,
  purchase_date   TEXT NOT NULL DEFAULT '',
  warranty_expiry TEXT NOT NULL DEFAULT '',
  issued_by       TEXT NOT NULL DEFAULT '',
  issue_date      TEXT NOT NULL DEFAULT '',
  issued_to       TEXT NOT NULL DEFAULT ''
);

-- -------------------------------------------------------------
-- settings  (single-row application configuration)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS settings (
  id                    INTEGER PRIMARY KEY CHECK (id = 1),  -- enforces single row
  shop_name             TEXT NOT NULL DEFAULT '',
  shop_email            TEXT NOT NULL DEFAULT '',
  registration_number   TEXT NOT NULL DEFAULT '',
  currency              TEXT NOT NULL DEFAULT 'USD',
  logo_path             TEXT NOT NULL DEFAULT '',
  bill_logo_path        TEXT NOT NULL DEFAULT '',
  admin_password_hash   TEXT NOT NULL DEFAULT ''
);

-- Seed the single settings row if it doesn't exist yet
INSERT OR IGNORE INTO settings (id) VALUES (1);
