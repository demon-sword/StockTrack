const { ipcMain } = require('electron');
const { all, get } = require('../database/dbHelper');

ipcMain.handle('reports-stock', async () => {
  const rawMaterial = await all(`SELECT material_type_id, SUM(weight_kg) as total_kg FROM raw_material_inward GROUP BY material_type_id`);
  const semiFinished = await all(`
    SELECT jw.parent_inward_id, mi.material_type_id, SUM(jw.pieces_received) as total_pieces
    FROM job_work_orders jw
    JOIN raw_material_inward mi ON jw.parent_inward_id = mi.id
    WHERE jw.status = 'completed'
    GROUP BY jw.parent_inward_id
  `);
  const finishedGoods = await all(`
    SELECT ri.material_type_id, SUM(po.pieces_received) as total_pieces
    FROM polishing_orders po
    JOIN job_work_orders jw ON po.parent_job_work_id = jw.id
    JOIN raw_material_inward ri ON jw.parent_inward_id = ri.id
    WHERE po.status = 'completed'
    GROUP BY ri.material_type_id
  `);
  return { rawMaterial, semiFinished, finishedGoods };
});

ipcMain.handle('reports-pending-jobs', async () => {
  const pendingJobWork = await get(`SELECT COUNT(*) as count, SUM(weight_sent_kg) as total_kg FROM job_work_orders WHERE status = 'in-progress'`);
  const pendingPolishing = await get(`SELECT COUNT(*) as count, SUM(pieces_sent) as total_pieces FROM polishing_orders WHERE status = 'in-progress'`);
  return { pendingJobWork, pendingPolishing };
});

ipcMain.handle('reports-batch-traceability', async (_, batchNumber) => {
  const inward = await get(`
    SELECT r.*, v.name as vendor_name, m.name as material_name
    FROM raw_material_inward r
    JOIN vendors v ON r.vendor_id = v.id
    JOIN material_types m ON r.material_type_id = m.id
    WHERE r.batch_number = ?
  `, [batchNumber]);
  if (!inward) return null;
  const jobWorks = await all(`
    SELECT j.*, jw.name as job_worker_name FROM job_work_orders j
    JOIN job_workers jw ON j.job_worker_id = jw.id
    WHERE j.parent_inward_id = ?
  `, [inward.id]);
  return { inward, jobWorks };
});

ipcMain.handle('reports-export-all', async () => {
  const tables = ['vendors', 'job_workers', 'polishers', 'customers', 'material_types',
    'raw_material_inward', 'job_work_orders', 'polishing_orders', 'sales'];
  const data = {};
  for (const table of tables) {
    data[table] = await all(`SELECT * FROM ${table}`);
  }
  return data;
});