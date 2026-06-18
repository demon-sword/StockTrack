const path = require('path');
const fs = require('fs');
const initSqlJs = require('sql.js');

const dbPath = path.join(__dirname, '../../../inventory.db');

let db = null;

async function getDb() {
  if (db) return db;

  const SQL = await initSqlJs();

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
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

module.exports = { getDb, saveDb };