const { app, BrowserWindow } = require('electron');
const path = require('path');

// Always load from dist folder (pre-built)
require('./src/main/ipc/vendors');
require('./src/main/ipc/jobWorkers');
require('./src/main/ipc/polishers');
require('./src/main/ipc/customers');
require('./src/main/ipc/materialTypes');
require('./src/main/ipc/rawMaterialInward');
require('./src/main/ipc/jobWorkOrders');
require('./src/main/ipc/polishingOrders');
require('./src/main/ipc/sales');
require('./src/main/ipc/reports');

// Initialize database
try {
  require('./src/main/initDb');
} catch (e) {
  console.error('DB Init error:', e);
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Always load from dist folder
  mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));

  // Open DevTools automatically
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});