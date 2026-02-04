const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Failed to open database:', err.message);
    process.exit(1);
  }
});

const tables = ['users','goats','vaccines','vaccination_records','expenses','activity_log','sessions','goat_pedigree'];

function checkNext(i) {
  if (i >= tables.length) {
    db.close();
    return;
  }
  const t = tables[i];
  db.get(`SELECT COUNT(*) AS cnt FROM ${t}`, (err, row) => {
    if (err) {
      console.log(`${t}: ERROR (${err.message})`);
    } else {
      console.log(`${t}: ${row.cnt}`);
    }
    checkNext(i+1);
  });
}

console.log('Inspecting database:', dbPath);
checkNext(0);
