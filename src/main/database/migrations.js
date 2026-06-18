const { getDb, saveDb } = require('./db');

const migrations = [
  `CREATE TABLE IF NOT EXISTS vendors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    contact TEXT,
    phone TEXT,
    email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  `CREATE TABLE IF NOT EXISTS job_workers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    contact TEXT,
    phone TEXT,
    payment_rate_per_kg REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  `CREATE TABLE IF NOT EXISTS polishers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    contact TEXT,
    phone TEXT,
    payment_rate_per_piece REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  `CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    contact TEXT,
    phone TEXT,
    email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  `CREATE TABLE IF NOT EXISTS material_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    default_conversion_rate REAL DEFAULT 10,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  `CREATE TABLE IF NOT EXISTS raw_material_inward (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    batch_number TEXT NOT NULL UNIQUE,
    vendor_id INTEGER NOT NULL,
    material_type_id INTEGER NOT NULL,
    weight_kg REAL NOT NULL,
    rate_per_kg REAL DEFAULT 0,
    total_amount REAL DEFAULT 0,
    purchase_date DATE NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id),
    FOREIGN KEY (material_type_id) REFERENCES material_types(id)
  )`,

  `CREATE TABLE IF NOT EXISTS job_work_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number TEXT NOT NULL UNIQUE,
    parent_inward_id INTEGER NOT NULL,
    job_worker_id INTEGER NOT NULL,
    weight_sent_kg REAL NOT NULL,
    pieces_received INTEGER,
    actual_conversion_rate REAL,
    status TEXT DEFAULT 'in-progress',
    sent_date DATE NOT NULL,
    returned_date DATE,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_inward_id) REFERENCES raw_material_inward(id),
    FOREIGN KEY (job_worker_id) REFERENCES job_workers(id)
  )`,

  `CREATE TABLE IF NOT EXISTS polishing_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number TEXT NOT NULL UNIQUE,
    parent_job_work_id INTEGER NOT NULL,
    polisher_id INTEGER NOT NULL,
    pieces_sent INTEGER NOT NULL,
    pieces_received INTEGER,
    polishing_rate_per_piece REAL DEFAULT 0,
    status TEXT DEFAULT 'in-progress',
    sent_date DATE NOT NULL,
    returned_date DATE,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_job_work_id) REFERENCES job_work_orders(id),
    FOREIGN KEY (polisher_id) REFERENCES polishers(id)
  )`,

  `CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_number TEXT NOT NULL UNIQUE,
    customer_id INTEGER,
    sale_date DATE NOT NULL,
    pieces_sold INTEGER NOT NULL,
    rate_per_piece REAL DEFAULT 0,
    total_amount REAL DEFAULT 0,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
  )`,

  `CREATE TABLE IF NOT EXISTS material_movements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    movement_type TEXT NOT NULL,
    reference_id INTEGER NOT NULL,
    batch_number TEXT,
    material_type_id INTEGER NOT NULL,
    quantity_in REAL DEFAULT 0,
    quantity_out REAL DEFAULT 0,
    quantity_balance REAL DEFAULT 0,
    location TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
];

async function initDatabase() {
  const db = await getDb();
  migrations.forEach((sql) => db.run(sql));
  saveDb();
  console.log('Database initialized successfully');
}

module.exports = { initDatabase };