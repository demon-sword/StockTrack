const { getDb, saveDb } = require('./db');

// Run a SELECT query and return all rows as objects
async function all(sql, params = []) {
  const db = await getDb();
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

// Run a SELECT query and return single row
async function get(sql, params = []) {
  const rows = await all(sql, params);
  return rows[0] || null;
}

// Run INSERT/UPDATE/DELETE and return lastInsertRowid
async function run(sql, params = []) {
  const db = await getDb();
  db.run(sql, params);
  const result = db.exec('SELECT last_insert_rowid() as id');
  saveDb();
  const lastId = result[0]?.values[0]?.[0] || null;
  return { lastInsertRowid: lastId };
}

module.exports = { all, get, run };