const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Create database tables
const initializeDatabase = () => {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('admin', 'manager', 'owner')),
        name TEXT NOT NULL,
        phone TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Users table creation error:', err);
      } else {
        console.log('Users table created/verified');
      }
    });

    // Goats table
    db.run(`
      CREATE TABLE IF NOT EXISTS goats (
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
        is_sold INTEGER DEFAULT 0,
        sold_price REAL,
        date_sold DATE,
        is_dead INTEGER DEFAULT 0,
        date_of_death DATE,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Goats table creation error:', err);
      } else {
        console.log('Goats table created/verified');
      }
    });

  // Goat Pedigree (Family Tree) table
  db.run(`
    CREATE TABLE IF NOT EXISTS goat_pedigree (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      goat_id INTEGER NOT NULL,
      parent_goat_id INTEGER NOT NULL,
      relationship_type TEXT NOT NULL CHECK(relationship_type IN ('sire', 'dam')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (goat_id) REFERENCES goats(id) ON DELETE CASCADE,
      FOREIGN KEY (parent_goat_id) REFERENCES goats(id) ON DELETE CASCADE,
      UNIQUE(goat_id, parent_goat_id, relationship_type)
    )
  `, (err) => {
    if (err) {
      console.error('Goat pedigree table creation error:', err);
    } else {
      console.log('Goat pedigree table created/verified');
    }
  });

  // Sessions table
  db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT UNIQUE NOT NULL,
      ip_address TEXT,
      user_agent TEXT,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) {
      console.error('Sessions table creation error:', err);
    } else {
      console.log('Sessions table created/verified');
    }
  });

  // Activity Log table
  db.run(`
    CREATE TABLE IF NOT EXISTS activity_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      action TEXT NOT NULL CHECK(action IN ('create', 'update', 'delete')),
      entity_type TEXT NOT NULL CHECK(entity_type IN ('user', 'goat', 'vaccine', 'vaccination', 'chicken', 'plant')),
      entity_id INTEGER NOT NULL,
      old_value TEXT,
      new_value TEXT,
      description TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `, (err) => {
    if (err) {
      console.error('Activity log table creation error:', err);
    } else {
      console.log('Activity log table created/verified');
    }
  });
  
  // Vaccines table
  db.run(`
    CREATE TABLE IF NOT EXISTS vaccines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      manufacturer TEXT,
      disease_protection TEXT,
      dosage TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Vaccines table creation error:', err);
    } else {
      console.log('Vaccines table created/verified');
    }
  });

  // Vaccination Records table
  db.run(`
    CREATE TABLE IF NOT EXISTS vaccination_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      goat_id INTEGER NOT NULL,
      vaccine_id INTEGER NOT NULL,
      vaccination_date DATE NOT NULL,
      next_due_date DATE,
      veterinarian_name TEXT,
      batch_number TEXT,
      route TEXT CHECK(route IN ('oral', 'injection', 'intranasal')),
      site TEXT,
      notes TEXT,
      user_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (goat_id) REFERENCES goats(id) ON DELETE CASCADE,
      FOREIGN KEY (vaccine_id) REFERENCES vaccines(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `, (err) => {
    if (err) {
      console.error('Vaccination records table creation error:', err);
    } else {
      console.log('Vaccination records table created/verified');
    }
  });
  
  // Expenses table
  db.run(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      amount REAL NOT NULL,
      date DATE NOT NULL,
      category TEXT,
      notes TEXT,
      user_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `, (err) => {
    if (err) {
      console.error('Expenses table creation error:', err);
    } else {
      console.log('Expenses table created/verified');
    }
  });

  // Chickens table
  db.run(`
    CREATE TABLE IF NOT EXISTS chickens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      tag_number TEXT UNIQUE,
      date_of_birth DATE,
      gender TEXT CHECK(gender IN ('male', 'female')),
      breed TEXT,
      color TEXT,
      health_status TEXT DEFAULT 'healthy' CHECK(health_status IN ('healthy', 'sick', 'injured')),
      location TEXT,
      weight REAL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Chickens table creation error:', err);
    } else {
      console.log('Chickens table created/verified');
    }
  });

  // Plants table
  db.run(`
    CREATE TABLE IF NOT EXISTS plants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      species TEXT,
      planting_date DATE,
      stage TEXT DEFAULT 'seedling',
      location TEXT,
      health_status TEXT DEFAULT 'healthy',
      yield_estimate TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Plants table creation error:', err);
    } else {
      console.log('Plants table created/verified');
    }
  });
  }); // Close db.serialize()

  // Add missing columns to goats table if they don't exist
  setTimeout(() => {
    console.log('Checking for missing columns in goats table...');
    db.all("PRAGMA table_info(goats);", (err, columns) => {
      if (err) {
        console.error('Error checking goats table schema:', err);
        return;
      }
      
      if (!columns) {
        console.error('No columns found in goats table');
        return;
      }
      
      const columnNames = columns.map(c => c.name);
      const requiredColumns = [
        { name: 'is_sold', type: 'INTEGER DEFAULT 0' },
        { name: 'sold_price', type: 'REAL' },
        { name: 'date_sold', type: 'DATE' },
        { name: 'is_dead', type: 'INTEGER DEFAULT 0' },
        { name: 'date_of_death', type: 'DATE' }
      ];

      let migrationsNeeded = 0;
      requiredColumns.forEach(col => {
        if (!columnNames.includes(col.name)) {
          migrationsNeeded++;
          console.log(`Adding missing column: ${col.name}`);
          db.run(`ALTER TABLE goats ADD COLUMN ${col.name} ${col.type}`, (err) => {
            if (err) {
              console.error(`Error adding ${col.name} column:`, err);
            } else {
              console.log(`Successfully added ${col.name} column to goats table`);
            }
          });
        }
      });
      
      if (migrationsNeeded === 0) {
        console.log('All required columns already exist in goats table');
      }
    });
  }, 500);
  
  // Seed default users after tables are created
  setTimeout(() => {
    console.log('Starting to seed default users...');
    try {
      seedDefaultUsers();
      // Give async operations time to complete before continuing
      setTimeout(() => {
        console.log('Seeding complete - initialization finished');
      }, 1000);
    } catch (err) {
      console.error('Error during seeding:', err);
    }
  }, 600);
};

// Seed default users
const seedDefaultUsers = () => {
  const users = [
    { email: 'admin@shafafarm.com', password: 'admin123', role: 'admin', name: 'Admin User' },
    { email: 'manager@shafafarm.com', password: 'manager123', role: 'manager', name: 'Farm Manager' },
    { email: 'owner@shafafarm.com', password: 'owner123', role: 'owner', name: 'Farm Owner' }
  ];

  users.forEach(user => {
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    db.run(
      'INSERT OR IGNORE INTO users (email, password, role, name) VALUES (?, ?, ?, ?)',
      [user.email, hashedPassword, user.role, user.name],
      (err) => {
        if (err) {
          console.error('Seeding error:', err);
        } else {
          console.log(`Default user ${user.email} seeded`);
        }
      }
    );
  });
};

module.exports = {
  db,
  initializeDatabase,
  seedDefaultUsers
};
