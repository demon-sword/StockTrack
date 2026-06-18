const { ipcMain } = require('electron');
const { all, get, run } = require('../database/dbHelper');

const TABLE = 'job_workers';

ipcMain.handle(`${TABLE}-getAll`, async () => {
  return await all(`SELECT * FROM ${TABLE} ORDER BY name ASC`);
});

ipcMain.handle(`${TABLE}-getById`, async (_, id) => {
  return await get(`SELECT * FROM ${TABLE} WHERE id = ?`, [id]);
});

ipcMain.handle(`${TABLE}-create`, async (_, data) => {
  const result = await run(
    `INSERT INTO ${TABLE} (name, contact, phone, payment_rate_per_kg) VALUES (?, ?, ?, ?)`,
    [data.name, data.contact || '', data.phone || '', data.payment_rate_per_kg || 0]
  );
  return { id: result.lastInsertRowid, ...data };
});

ipcMain.handle(`${TABLE}-update`, async (_, id, data) => {
  await run(
    `UPDATE ${TABLE} SET name = ?, contact = ?, phone = ?, payment_rate_per_kg = ? WHERE id = ?`,
    [data.name, data.contact || '', data.phone || '', data.payment_rate_per_kg || 0, id]
  );
  return { id, ...data };
});

ipcMain.handle(`${TABLE}-delete`, async (_, id) => {
  await run(`DELETE FROM ${TABLE} WHERE id = ?`, [id]);
  return { success: true };
});