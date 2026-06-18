const { ipcMain } = require('electron');
const { all, get, run } = require('../database/dbHelper');

const TABLE = 'polishing_orders';

ipcMain.handle(`${TABLE}-getAll`, async () => {
  return await all(`
    SELECT p.*, jw.order_number as job_work_order, pol.name as polisher_name
    FROM ${TABLE} p
    JOIN job_work_orders jw ON p.parent_job_work_id = jw.id
    JOIN polishers pol ON p.polisher_id = pol.id
    ORDER BY p.created_at DESC
  `);
});

ipcMain.handle(`${TABLE}-getById`, async (_, id) => {
  return await get(`SELECT * FROM ${TABLE} WHERE id = ?`, [id]);
});

ipcMain.handle(`${TABLE}-create`, async (_, data) => {
  const result = await run(
    `INSERT INTO ${TABLE} (order_number, parent_job_work_id, polisher_id, pieces_sent, sent_date, notes)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [data.order_number, data.parent_job_work_id, data.polisher_id,
     data.pieces_sent, data.sent_date, data.notes || '']
  );
  return { id: result.lastInsertRowid, ...data };
});

ipcMain.handle(`${TABLE}-update`, async (_, id, data) => {
  await run(
    `UPDATE ${TABLE} SET order_number = ?, parent_job_work_id = ?, polisher_id = ?,
     pieces_sent = ?, pieces_received = ?, polishing_rate_per_piece = ?,
     status = ?, sent_date = ?, returned_date = ?, notes = ?
     WHERE id = ?`,
    [data.order_number, data.parent_job_work_id, data.polisher_id,
     data.pieces_sent, data.pieces_received || null, data.polishing_rate_per_piece || 0,
     data.status || 'in-progress', data.sent_date, data.returned_date || null,
     data.notes || '', id]
  );
  return { id, ...data };
});

ipcMain.handle(`${TABLE}-delete`, async (_, id) => {
  await run(`DELETE FROM ${TABLE} WHERE id = ?`, [id]);
  return { success: true };
});