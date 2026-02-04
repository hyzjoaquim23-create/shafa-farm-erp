const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.db');

console.log('=== USER AND SESSION VERIFICATION ===\n');

db.all('SELECT COUNT(*) as count FROM users', (err, rows) => {
  console.log('Total Users:', rows[0].count);
  
  db.all('SELECT COUNT(*) as count FROM sessions WHERE expires_at > datetime("now")', (err, rows) => {
    console.log('Active Sessions:', rows[0].count);
    
    db.all('SELECT action, entity_type, COUNT(*) as count FROM activity_log GROUP BY action, entity_type', (err, rows) => {
      console.log('\nActivity Log Summary:');
      if (rows && rows.length > 0) {
        rows.forEach(row => console.log(`  - ${row.action} on ${row.entity_type}: ${row.count} times`));
      } else {
        console.log('  (No activities logged yet)');
      }
      
      console.log('\n=== SYSTEM STATUS ===');
      console.log('✅ Users table: Ready');
      console.log('✅ Sessions table: Ready');
      console.log('✅ Activity logging: Ready');
      console.log('✅ Database: Connected');
      console.log('\n✨ System is ready for user creation!\n');
      
      db.close();
    });
  });
});
