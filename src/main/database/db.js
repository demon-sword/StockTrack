const path = require('path');
const fs = require('fs');
const { app } = require('electron');
const initSqlJs = require('sql.js');

const dbPath = path.join(app.getPath('userData'), 'inventory.db');

let db = null;

async function getDb() {
  if (db) return db;

  const SQL = await initSqlJs({
    locateFile: (file) => {
      return path.join(__dirname, '../../../node_modules/sql.js/dist/', file);
    }
  });

  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  return db;
}

function saveDb() {
  if (!db) return;
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  } catch (err) {
    console.error('Failed to save database:', err);
  }
}

module.exports = { getDb, saveDb };