const { ipcMain } = require('electron');
const { all, get, run } = require('../database/dbHelper');

const TABLE = 'raw_material_inward';

ipcMain.handle(`${TABLE}-getAll`, async () => {
  return await all(`
    SELECT r.*, v.name as vendor_name, m.name as material_name
    FROM ${TABLE} r
    JOIN vendors v ON r.vendor_id = v.id
    JOIN material_types m ON r.material_type_id = m.id
    ORDER BY r.created_at DESC
  `);
});

ipcMain.handle(`${TABLE}-getById`, async (_, id) => {
  return await get(`SELECT * FROM ${TABLE} WHERE id = ?`, [id]);
});

ipcMain.handle(`${TABLE}-create`, async (_, data) => {
  const result = await run(
    `INSERT INTO ${TABLE} (batch_number, vendor_id, material_type_id, weight_kg, rate_per_kg, total_amount, purchase_date, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [data.batch_number, data.vendor_id, data.material_type_id,
     data.weight_kg, data.rate_per_kg || 0, data.total_amount || 0,
     data.purchase_date, data.notes || '']
  );
  return { id: result.lastInsertRowid, ...data };
});

ipcMain.handle(`${TABLE}-update`, async (_, id, data) => {
  await run(
    `UPDATE ${TABLE} SET batch_number = ?, vendor_id = ?, material_type_id = ?,
     weight_kg = ?, rate_per_kg = ?, total_amount = ?, purchase_date = ?, notes = ?
     WHERE id = ?`,
    [data.batch_number, data.vendor_id, data.material_type_id,
     data.weight_kg, data.rate_per_kg || 0, data.total_amount || 0,
     data.purchase_date, data.notes || '', id]
  );
  return { id, ...data };
});

ipcMain.handle(`${TABLE}-delete`, async (_, id) => {
  await run(`DELETE FROM ${TABLE} WHERE id = ?`, [id]);
  return { success: true };
});