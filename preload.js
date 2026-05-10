const { contextBridge, ipcRenderer } = require('electron');

// All handlers use the table name as the channel prefix
const api = {
  vendors: {
    getAll: () => ipcRenderer.invoke('vendors-getAll'),
    getById: (id) => ipcRenderer.invoke('vendors-getById', id),
    create: (data) => ipcRenderer.invoke('vendors-create', data),
    update: (id, data) => ipcRenderer.invoke('vendors-update', id, data),
    delete: (id) => ipcRenderer.invoke('vendors-delete', id),
  },
  jobWorkers: {
    getAll: () => ipcRenderer.invoke('job_workers-getAll'),
    getById: (id) => ipcRenderer.invoke('job_workers-getById', id),
    create: (data) => ipcRenderer.invoke('job_workers-create', data),
    update: (id, data) => ipcRenderer.invoke('job_workers-update', id, data),
    delete: (id) => ipcRenderer.invoke('job_workers-delete', id),
  },
  polishers: {
    getAll: () => ipcRenderer.invoke('polishers-getAll'),
    getById: (id) => ipcRenderer.invoke('polishers-getById', id),
    create: (data) => ipcRenderer.invoke('polishers-create', data),
    update: (id, data) => ipcRenderer.invoke('polishers-update', id, data),
    delete: (id) => ipcRenderer.invoke('polishers-delete', id),
  },
  customers: {
    getAll: () => ipcRenderer.invoke('customers-getAll'),
    getById: (id) => ipcRenderer.invoke('customers-getById', id),
    create: (data) => ipcRenderer.invoke('customers-create', data),
    update: (id, data) => ipcRenderer.invoke('customers-update', id, data),
    delete: (id) => ipcRenderer.invoke('customers-delete', id),
  },
  materialTypes: {
    getAll: () => ipcRenderer.invoke('material_types-getAll'),
    getById: (id) => ipcRenderer.invoke('material_types-getById', id),
    create: (data) => ipcRenderer.invoke('material_types-create', data),
    update: (id, data) => ipcRenderer.invoke('material_types-update', id, data),
    delete: (id) => ipcRenderer.invoke('material_types-delete', id),
  },
  rawMaterialInward: {
    getAll: () => ipcRenderer.invoke('raw_material_inward-getAll'),
    getById: (id) => ipcRenderer.invoke('raw_material_inward-getById', id),
    create: (data) => ipcRenderer.invoke('raw_material_inward-create', data),
    update: (id, data) => ipcRenderer.invoke('raw_material_inward-update', id, data),
    delete: (id) => ipcRenderer.invoke('raw_material_inward-delete', id),
  },
  jobWorkOrders: {
    getAll: () => ipcRenderer.invoke('job_work_orders-getAll'),
    getById: (id) => ipcRenderer.invoke('job_work_orders-getById', id),
    create: (data) => ipcRenderer.invoke('job_work_orders-create', data),
    update: (id, data) => ipcRenderer.invoke('job_work_orders-update', id, data),
    delete: (id) => ipcRenderer.invoke('job_work_orders-delete', id),
  },
  polishingOrders: {
    getAll: () => ipcRenderer.invoke('polishing_orders-getAll'),
    getById: (id) => ipcRenderer.invoke('polishing_orders-getById', id),
    create: (data) => ipcRenderer.invoke('polishing_orders-create', data),
    update: (id, data) => ipcRenderer.invoke('polishing_orders-update', id, data),
    delete: (id) => ipcRenderer.invoke('polishing_orders-delete', id),
  },
  sales: {
    getAll: () => ipcRenderer.invoke('sales-getAll'),
    getById: (id) => ipcRenderer.invoke('sales-getById', id),
    create: (data) => ipcRenderer.invoke('sales-create', data),
    update: (id, data) => ipcRenderer.invoke('sales-update', id, data),
    delete: (id) => ipcRenderer.invoke('sales-delete', id),
  },
  reports: {
    getAll: () => ipcRenderer.invoke('reports-export-all'),
    getStock: () => ipcRenderer.invoke('reports-stock'),
    getPendingJobs: () => ipcRenderer.invoke('reports-pending-jobs'),
    getBatchTraceability: (batchNumber) => ipcRenderer.invoke('reports-batch-traceability', batchNumber),
    exportAll: () => ipcRenderer.invoke('reports-export-all'),
  },
};

contextBridge.exposeInMainWorld('electronAPI', api);