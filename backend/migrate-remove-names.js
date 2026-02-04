const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

const migrateDatabase = () => {
  db.serialize(() => {
    // Check if name column exists
    db.all("PRAGMA table_info(goats)", (err, rows) => {
      if (err) {
        console.error('Error checking table structure:', err);
        return;
      }

      const hasNameColumn = rows && rows.some(row => row.name === 'name');
      
      if (!hasNameColumn) {
        console.log('Name column already removed or table does not exist');
        db.close();
        return;
      }

      console.log('Starting migration: Removing name column from goats table...');

      // Create a new table without the name column
      db.run(`
        CREATE TABLE goats_new (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          tag_number TEXT UNIQUE NOT NULL,
          date_of_birth DATE NOT NULL,
          gender TEXT NOT NULL CHECK(gender IN ('male', 'female')),
          breed TEXT,
          color TEXT,
          health_status TEXT DEFAULT 'healthy' CHECK(health_status IN ('healthy', 'sick', 'pregnant', 'injured')),
          location TEXT,
          weight REAL,
          breeding_status TEXT DEFAULT 'non-breeding' CHECK(breeding_status IN ('breeding', 'non-breeding', 'retired')),
          notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Error creating new goats table:', err);
          return;
        }

        console.log('New goats_new table created');

        // Copy data from old table to new table (excluding name)
        db.run(`
          INSERT INTO goats_new (id, tag_number, date_of_birth, gender, breed, color, health_status, location, weight, breeding_status, notes, created_at, updated_at)
          SELECT id, tag_number, date_of_birth, gender, breed, color, health_status, location, weight, breeding_status, notes, created_at, updated_at
          FROM goats
        `, (err) => {
          if (err) {
            console.error('Error copying data to new table:', err);
            return;
          }

          console.log('Data copied to new table');

          // Drop old table
          db.run('DROP TABLE goats', (err) => {
            if (err) {
              console.error('Error dropping old table:', err);
              return;
            }

            console.log('Old goats table dropped');

            // Rename new table to original name
            db.run('ALTER TABLE goats_new RENAME TO goats', (err) => {
              if (err) {
                console.error('Error renaming table:', err);
                return;
              }

              console.log('✅ Migration complete! Name column removed from goats table');
              console.log('All goats now identified by tag_number only');
              
              // Verify the change
              db.all("PRAGMA table_info(goats)", (err, rows) => {
                if (err) {
                  console.error('Error verifying table structure:', err);
                } else {
                  console.log('\nNew table structure:');
                  rows.forEach(row => {
                    console.log(`  - ${row.name}: ${row.type}`);
                  });
                }
                
                db.close();
              });
            });
          });
        });
      });
    });
  });
};

migrateDatabase();
