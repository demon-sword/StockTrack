const { initDatabase } = require('./database/migrations');

initDatabase().then(() => {
  console.log('Database ready');
}).catch((err) => {
  console.error('Database init error:', err);
});