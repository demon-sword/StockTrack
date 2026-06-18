const { ipcMain } = require('electron');
const { all, get, run } = require('../database/dbHelper');

const TABLE = 'sales';

ipcMain.handle(`${TABLE}-getAll`, async () => {
  return await all(`
    SELECT s.*, c.name as customer_name
    FROM ${TABLE} s
    LEFT JOIN customers c ON s.customer_id = c.id
    ORDER BY s.sale_date DESC, s.created_at DESC
  `);
});

ipcMain.handle(`${TABLE}-getById`, async (_, id) => {
  return await get(`SELECT * FROM ${TABLE} WHERE id = ?`, [id]);
});

ipcMain.handle(`${TABLE}-create`, async (_, data) => {
  const result = await run(
    `INSERT INTO ${TABLE} (invoice_number, customer_id, sale_date, pieces_sold, rate_per_piece, total_amount, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [data.invoice_number, data.customer_id || null, data.sale_date,
     data.pieces_sold, data.rate_per_piece || 0, data.total_amount || 0,
     data.notes || '']
  );
  return { id: result.lastInsertRowid, ...data };
});

ipcMain.handle(`${TABLE}-update`, async (_, id, data) => {
  await run(
    `UPDATE ${TABLE} SET invoice_number = ?, customer_id = ?, sale_date = ?,
     pieces_sold = ?, rate_per_piece = ?, total_amount = ?, notes = ?
     WHERE id = ?`,
    [data.invoice_number, data.customer_id || null, data.sale_date,
     data.pieces_sold, data.rate_per_piece || 0, data.total_amount || 0,
     data.notes || '', id]
  );
  return { id, ...data };
});

ipcMain.handle(`${TABLE}-delete`, async (_, id) => {
  await run(`DELETE FROM ${TABLE} WHERE id = ?`, [id]);
  return { success: true };
});