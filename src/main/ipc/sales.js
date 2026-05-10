const { ipcMain } = require('electron');
const db = require('../database/db');

const TABLE = 'sales';

ipcMain.handle(`${TABLE}-getAll`, (_, query = {}) => {
  let sql = `SELECT s.*, c.name as customer_name
             FROM ${TABLE} s
             LEFT JOIN customers c ON s.customer_id = c.id`;

  const params = [];
  if (query.customer_id) {
    sql += ' WHERE s.customer_id = ?';
    params.push(query.customer_id);
  }
  if (query.from_date && query.to_date) {
    sql += sql.includes('WHERE') ? ' AND ' : ' WHERE ';
    sql += 's.sale_date BETWEEN ? AND ?';
    params.push(query.from_date, query.to_date);
  }
  sql += ' ORDER BY s.sale_date DESC, s.created_at DESC';

  const stmt = db.prepare(sql);
  return stmt.all(...params);
});

ipcMain.handle(`${TABLE}-getById`, (event, id) => {
  const stmt = db.prepare(`SELECT * FROM ${TABLE} WHERE id = ?`);
  return stmt.get(id);
});

ipcMain.handle(`${TABLE}-create`, (event, data) => {
  const stmt = db.prepare(`
    INSERT INTO ${TABLE} (invoice_number, customer_id, sale_date, pieces_sold, rate_per_piece, total_amount, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    data.invoice_number, data.customer_id || null, data.sale_date,
    data.pieces_sold, data.rate_per_piece || 0, data.total_amount || 0,
    data.notes || ''
  );
  return { id: result.lastInsertRowid, ...data };
});

ipcMain.handle(`${TABLE}-update`, (event, id, data) => {
  const stmt = db.prepare(`
    UPDATE ${TABLE} SET invoice_number = ?, customer_id = ?, sale_date = ?,
    pieces_sold = ?, rate_per_piece = ?, total_amount = ?, notes = ?
    WHERE id = ?
  `);
  stmt.run(
    data.invoice_number, data.customer_id, data.sale_date,
    data.pieces_sold, data.rate_per_piece || 0, data.total_amount || 0,
    data.notes || '', id
  );
  return { id, ...data };
});

ipcMain.handle(`${TABLE}-delete`, (event, id) => {
  const stmt = db.prepare(`DELETE FROM ${TABLE} WHERE id = ?`);
  stmt.run(id);
  return { success: true };
});