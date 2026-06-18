const { ipcMain } = require('electron');
const { all, get, run } = require('../database/dbHelper');

const TABLE = 'job_work_orders';

ipcMain.handle(`${TABLE}-getAll`, async () => {
  return await all(`
    SELECT j.*, i.batch_number, jw.name as job_worker_name, v.name as vendor_name
    FROM ${TABLE} j
    JOIN raw_material_inward i ON j.parent_inward_id = i.id
    JOIN job_workers jw ON j.job_worker_id = jw.id
    JOIN vendors v ON i.vendor_id = v.id
    ORDER BY j.created_at DESC
  `);
});

ipcMain.handle(`${TABLE}-getById`, async (_, id) => {
  return await get(`SELECT * FROM ${TABLE} WHERE id = ?`, [id]);
});

ipcMain.handle(`${TABLE}-create`, async (_, data) => {
  const result = await run(
    `INSERT INTO ${TABLE} (order_number, parent_inward_id, job_worker_id, weight_sent_kg, sent_date, notes)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [data.order_number, data.parent_inward_id, data.job_worker_id,
     data.weight_sent_kg, data.sent_date, data.notes || '']
  );
  return { id: result.lastInsertRowid, ...data };
});

ipcMain.handle(`${TABLE}-update`, async (_, id, data) => {
  await run(
    `UPDATE ${TABLE} SET order_number = ?, parent_inward_id = ?, job_worker_id = ?,
     weight_sent_kg = ?, pieces_received = ?, actual_conversion_rate = ?,
     status = ?, sent_date = ?, returned_date = ?, notes = ?
     WHERE id = ?`,
    [data.order_number, data.parent_inward_id, data.job_worker_id,
     data.weight_sent_kg, data.pieces_received || null, data.actual_conversion_rate || null,
     data.status || 'in-progress', data.sent_date, data.returned_date || null,
     data.notes || '', id]
  );
  return { id, ...data };
});

ipcMain.handle(`${TABLE}-delete`, async (_, id) => {
  await run(`DELETE FROM ${TABLE} WHERE id = ?`, [id]);
  return { success: true };
});