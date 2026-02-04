const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.log('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Database opened successfully');
});

db.serialize(() => {
  db.all("SELECT name FROM sqlite_master WHERE type='table';", (err, rows) => {
    if(err) {
      console.log('Error:', err.message);
    } else {
      if (!rows || rows.length === 0) {
        console.log('No tables found in database!');
      } else {
        console.log('Tables in database:');
        rows.forEach(r => {
          console.log(`  - ${r.name}`);
        });
      }
    }
    db.close();
  });
});
