const { ipcMain } = require('electron');
const db = require('../database/db');

const TABLE = 'raw_material_inward';

ipcMain.handle(`${TABLE}-getAll`, (_, query = {}) => {
  let sql = `SELECT r.*, v.name as vendor_name, m.name as material_name
             FROM ${TABLE} r
             JOIN vendors v ON r.vendor_id = v.id
             JOIN material_types m ON r.material_type_id = m.id`;

  const params = [];
  if (query.vendor_id) {
    sql += ' WHERE r.vendor_id = ?';
    params.push(query.vendor_id);
  }
  sql += ' ORDER BY r.created_at DESC';

  const stmt = db.prepare(sql);
  return stmt.all(...params);
});

ipcMain.handle(`${TABLE}-getById`, (event, id) => {
  const stmt = db.prepare(`SELECT * FROM ${TABLE} WHERE id = ?`);
  return stmt.get(id);
});

ipcMain.handle(`${TABLE}-create`, (event, data) => {
  const stmt = db.prepare(`
    INSERT INTO ${TABLE} (batch_number, vendor_id, material_type_id, weight_kg, rate_per_kg, total_amount, purchase_date, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    data.batch_number, data.vendor_id, data.material_type_id,
    data.weight_kg, data.rate_per_kg || 0, data.total_amount || 0,
    data.purchase_date, data.notes || ''
  );
  return { id: result.lastInsertRowid, ...data };
});

ipcMain.handle(`${TABLE}-update`, (event, id, data) => {
  const stmt = db.prepare(`
    UPDATE ${TABLE} SET batch_number = ?, vendor_id = ?, material_type_id = ?,
    weight_kg = ?, rate_per_kg = ?, total_amount = ?, purchase_date = ?, notes = ?
    WHERE id = ?
  `);
  stmt.run(
    data.batch_number, data.vendor_id, data.material_type_id,
    data.weight_kg, data.rate_per_kg || 0, data.total_amount || 0,
    data.purchase_date, data.notes || '', id
  );
  return { id, ...data };
});

ipcMain.handle(`${TABLE}-delete`, (event, id) => {
  const stmt = db.prepare(`DELETE FROM ${TABLE} WHERE id = ?`);
  stmt.run(id);
  return { success: true };
});