const { ipcMain } = require('electron');
const db = require('../database/db');

const TABLE = 'polishing_orders';

ipcMain.handle(`${TABLE}-getAll`, (_, query = {}) => {
  let sql = `SELECT p.*, jw.order_number as job_work_order, pol.name as polisher_name
             FROM ${TABLE} p
             JOIN job_work_orders jw ON p.parent_job_work_id = jw.id
             JOIN polishers pol ON p.polisher_id = pol.id`;

  const params = [];
  if (query.status) {
    sql += ' WHERE p.status = ?';
    params.push(query.status);
  }
  sql += ' ORDER BY p.created_at DESC';

  const stmt = db.prepare(sql);
  return stmt.all(...params);
});

ipcMain.handle(`${TABLE}-getById`, (event, id) => {
  const stmt = db.prepare(`SELECT * FROM ${TABLE} WHERE id = ?`);
  return stmt.get(id);
});

ipcMain.handle(`${TABLE}-create`, (event, data) => {
  const stmt = db.prepare(`
    INSERT INTO ${TABLE} (order_number, parent_job_work_id, polisher_id, pieces_sent, sent_date, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    data.order_number, data.parent_job_work_id, data.polisher_id,
    data.pieces_sent, data.sent_date, data.notes || ''
  );
  return { id: result.lastInsertRowid, ...data };
});

ipcMain.handle(`${TABLE}-update`, (event, id, data) => {
  const stmt = db.prepare(`
    UPDATE ${TABLE} SET order_number = ?, parent_job_work_id = ?, polisher_id = ?,
    pieces_sent = ?, pieces_received = ?, polishing_rate_per_piece = ?,
    status = ?, sent_date = ?, returned_date = ?, notes = ?
    WHERE id = ?
  `);
  stmt.run(
    data.order_number, data.parent_job_work_id, data.polisher_id,
    data.pieces_sent, data.pieces_received, data.polishing_rate_per_piece || 0,
    data.status, data.sent_date, data.returned_date, data.notes || '', id
  );
  return { id, ...data };
});

ipcMain.handle(`${TABLE}-delete`, (event, id) => {
  const stmt = db.prepare(`DELETE FROM ${TABLE} WHERE id = ?`);
  stmt.run(id);
  return { success: true };
});