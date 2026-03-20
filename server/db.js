const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'boardertrack.db'));

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS boarders (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    entry_date TEXT,
    time_in TEXT,
    time_out TEXT,
    time_out_date TEXT,
    status TEXT DEFAULT 'unpaid',
    amount REAL DEFAULT 0,
    amount_paid REAL DEFAULT 0,
    month_year TEXT,
    notes TEXT,
    created_date TEXT DEFAULT (datetime('now')),
    updated_date TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY,
    monthly_rate REAL DEFAULT 0,
    currency TEXT DEFAULT '₱',
    summary_overrides TEXT DEFAULT '{}',
    created_date TEXT DEFAULT (datetime('now')),
    updated_date TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    bill_name TEXT NOT NULL,
    date TEXT,
    amount REAL DEFAULT 0,
    receipt_url TEXT,
    notes TEXT,
    month_year TEXT,
    created_date TEXT DEFAULT (datetime('now')),
    updated_date TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS activity_log (
    id TEXT PRIMARY KEY,
    action TEXT,
    entity_type TEXT,
    entity_id TEXT,
    entity_name TEXT,
    user_email TEXT,
    amount REAL,
    old_values TEXT,
    new_values TEXT,
    changes_summary TEXT,
    created_date TEXT DEFAULT (datetime('now')),
    updated_date TEXT DEFAULT (datetime('now'))
  );
`);

// Insert default settings if none exist
const existingSettings = db.prepare('SELECT id FROM settings LIMIT 1').get();
if (!existingSettings) {
  const { v4: uuidv4 } = require('uuid');
  db.prepare(`INSERT INTO settings (id, monthly_rate, currency) VALUES (?, ?, ?)`).run(uuidv4(), 3000, '₱');
}

console.log('✅ Database initialized');

module.exports = db;
