const { ipcMain } = require('electron');
const { all, get, run } = require('../database/dbHelper');

const TABLE = 'customers';

ipcMain.handle(`${TABLE}-getAll`, async () => {
  return await all(`SELECT * FROM ${TABLE} ORDER BY name ASC`);
});

ipcMain.handle(`${TABLE}-getById`, async (_, id) => {
  return await get(`SELECT * FROM ${TABLE} WHERE id = ?`, [id]);
});

ipcMain.handle(`${TABLE}-create`, async (_, data) => {
  const result = await run(
    `INSERT INTO ${TABLE} (name, contact, phone, email) VALUES (?, ?, ?, ?)`,
    [data.name, data.contact || '', data.phone || '', data.email || '']
  );
  return { id: result.lastInsertRowid, ...data };
});

ipcMain.handle(`${TABLE}-update`, async (_, id, data) => {
  await run(
    `UPDATE ${TABLE} SET name = ?, contact = ?, phone = ?, email = ? WHERE id = ?`,
    [data.name, data.contact || '', data.phone || '', data.email || '', id]
  );
  return { id, ...data };
});

ipcMain.handle(`${TABLE}-delete`, async (_, id) => {
  await run(`DELETE FROM ${TABLE} WHERE id = ?`, [id]);
  return { success: true };
});