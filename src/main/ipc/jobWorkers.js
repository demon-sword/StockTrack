const { ipcMain } = require('electron');
const db = require('../database/db');

const TABLE = 'job_workers';

ipcMain.handle(`${TABLE}-getAll`, () => {
  const stmt = db.prepare(`SELECT * FROM ${TABLE} ORDER BY name ASC`);
  return stmt.all();
});

ipcMain.handle(`${TABLE}-getById`, (event, id) => {
  const stmt = db.prepare(`SELECT * FROM ${TABLE} WHERE id = ?`);
  return stmt.get(id);
});

ipcMain.handle(`${TABLE}-create`, (event, data) => {
  const stmt = db.prepare(`INSERT INTO ${TABLE} (name, contact, phone, payment_rate_per_kg) VALUES (?, ?, ?, ?)`);
  const result = stmt.run(data.name, data.contact, data.phone, data.payment_rate_per_kg || 0);
  return { id: result.lastInsertRowid, ...data };
});

ipcMain.handle(`${TABLE}-update`, (event, id, data) => {
  const stmt = db.prepare(`UPDATE ${TABLE} SET name = ?, contact = ?, phone = ?, payment_rate_per_kg = ? WHERE id = ?`);
  stmt.run(data.name, data.contact, data.phone, data.payment_rate_per_kg || 0, id);
  return { id, ...data };
});

ipcMain.handle(`${TABLE}-delete`, (event, id) => {
  const stmt = db.prepare(`DELETE FROM ${TABLE} WHERE id = ?`);
  stmt.run(id);
  return { success: true };
});