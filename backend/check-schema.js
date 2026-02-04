const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.log('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Database opened successfully');
});

db.serialize(() => {
  db.all("PRAGMA table_info(goats);", (err, rows) => {
    if(err) {
      console.log('Error:', err.message);
    } else {
      if (!rows || rows.length === 0) {
        console.log('No goats table found!');
      } else {
        console.log('Goats table schema:');
        rows.forEach(r => {
          console.log(`  ${r.name} (${r.type})`);
        });
      }
    }
    db.close(() => {
      console.log('Database closed');
    });
  });
});
