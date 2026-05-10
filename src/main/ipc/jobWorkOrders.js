const { ipcMain } = require('electron');
const db = require('../database/db');

const TABLE = 'job_work_orders';

ipcMain.handle(`${TABLE}-getAll`, (_, query = {}) => {
  let sql = `SELECT j.*, i.batch_number, jw.name as job_worker_name, v.name as vendor_name
             FROM ${TABLE} j
             JOIN raw_material_inward i ON j.parent_inward_id = i.id
             JOIN job_workers jw ON j.job_worker_id = jw.id
             JOIN raw_material_inward ri ON j.parent_inward_id = ri.id
             JOIN vendors v ON ri.vendor_id = v.id`;

  const params = [];
  if (query.status) {
    sql += ' WHERE j.status = ?';
    params.push(query.status);
  }
  sql += ' ORDER BY j.created_at DESC';

  const stmt = db.prepare(sql);
  return stmt.all(...params);
});

ipcMain.handle(`${TABLE}-getById`, (event, id) => {
  const stmt = db.prepare(`SELECT * FROM ${TABLE} WHERE id = ?`);
  return stmt.get(id);
});

ipcMain.handle(`${TABLE}-create`, (event, data) => {
  const stmt = db.prepare(`
    INSERT INTO ${TABLE} (order_number, parent_inward_id, job_worker_id, weight_sent_kg, sent_date, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    data.order_number, data.parent_inward_id, data.job_worker_id,
    data.weight_sent_kg, data.sent_date, data.notes || ''
  );
  return { id: result.lastInsertRowid, ...data };
});

ipcMain.handle(`${TABLE}-update`, (event, id, data) => {
  const stmt = db.prepare(`
    UPDATE ${TABLE} SET order_number = ?, parent_inward_id = ?, job_worker_id = ?,
    weight_sent_kg = ?, pieces_received = ?, actual_conversion_rate = ?,
    status = ?, sent_date = ?, returned_date = ?, notes = ?
    WHERE id = ?
  `);
  stmt.run(
    data.order_number, data.parent_inward_id, data.job_worker_id,
    data.weight_sent_kg, data.pieces_received, data.actual_conversion_rate,
    data.status, data.sent_date, data.returned_date, data.notes || '', id
  );
  return { id, ...data };
});

ipcMain.handle(`${TABLE}-delete`, (event, id) => {
  const stmt = db.prepare(`DELETE FROM ${TABLE} WHERE id = ?`);
  stmt.run(id);
  return { success: true };
});