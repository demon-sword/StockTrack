const db = require('./database/db');
const { initDatabase } = require('./database/migrations');

// Initialize database when main process starts
initDatabase();

console.log('Database ready');