const { ipcMain } = require('electron');
const { all, get, run } = require('../database/dbHelper');

const TABLE = 'material_types';

ipcMain.handle(`${TABLE}-getAll`, async () => {
  return await all(`SELECT * FROM ${TABLE} ORDER BY name ASC`);
});

ipcMain.handle(`${TABLE}-getById`, async (_, id) => {
  return await get(`SELECT * FROM ${TABLE} WHERE id = ?`, [id]);
});

ipcMain.handle(`${TABLE}-create`, async (_, data) => {
  const result = await run(
    `INSERT INTO ${TABLE} (name, default_conversion_rate) VALUES (?, ?)`,
    [data.name, data.default_conversion_rate || 10]
  );
  return { id: result.lastInsertRowid, ...data };
});

ipcMain.handle(`${TABLE}-update`, async (_, id, data) => {
  await run(
    `UPDATE ${TABLE} SET name = ?, default_conversion_rate = ? WHERE id = ?`,
    [data.name, data.default_conversion_rate || 10, id]
  );
  return { id, ...data };
});

ipcMain.handle(`${TABLE}-delete`, async (_, id) => {
  await run(`DELETE FROM ${TABLE} WHERE id = ?`, [id]);
  return { success: true };
});