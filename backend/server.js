require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const PDFDocument = require('pdfkit');
const { db, initializeDatabase } = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

// Error handling for uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize database
console.log('Initializing database...');
try {
  initializeDatabase();
} catch (err) {
  console.error('Error initializing database:', err);
}
console.log('Database initialization started');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  try {
    const bearerToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    const decoded = jwt.verify(bearerToken, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Middleware to verify admin role
const verifyAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Helper function to log activities
const logActivity = (userId, action, entityType, entityId, oldValue = null, newValue = null, description = null) => {
  db.run(
    `INSERT INTO activity_log (user_id, action, entity_type, entity_id, old_value, new_value, description) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [userId, action, entityType, entityId, oldValue, newValue, description],
    (err) => {
      if (err) {
        console.error('Activity log error:', err);
      }
    }
  );
};

// ==================== AUTHENTICATION ====================

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      console.error('Login error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Create session record
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');

    db.run(
      'INSERT INTO sessions (user_id, token, ip_address, user_agent, expires_at) VALUES (?, ?, ?, ?, ?)',
      [user.id, token, ipAddress, userAgent, expiresAt.toISOString()],
      (err) => {
        if (err) {
          console.error('Session creation error:', err);
          // Continue even if session creation fails
        }
      }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    });
  });
});

// Get current user endpoint
app.get('/api/auth/me', verifyToken, (req, res) => {
  res.json({ user: req.user });
});

// Verify session endpoint (for heartbeat)
app.get('/api/auth/verify', verifyToken, (req, res) => {
  // Update last_activity for session
  const token = req.headers['authorization']?.slice(7) || '';
  db.run('UPDATE sessions SET last_activity = datetime("now") WHERE token = ? AND expires_at > datetime("now")', [token], (err) => {
    if (err) {
      console.error('Session update error:', err);
    }
  });
  res.json({ valid: true, user: req.user });
});

// Get active user count (for admin dashboard)
app.get('/api/auth/active-users', verifyToken, verifyAdmin, (req, res) => {
  db.get(
    'SELECT COUNT(DISTINCT user_id) as activeCount FROM sessions WHERE expires_at > datetime("now")',
    (err, result) => {
      if (err) {
        console.error('Active users count error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ activeCount: result.activeCount || 0 });
    }
  );
});

// Get user's active sessions
app.get('/api/auth/sessions', verifyToken, (req, res) => {
  db.all(
    'SELECT id, ip_address, user_agent, created_at, last_activity, expires_at FROM sessions WHERE user_id = ? AND expires_at > datetime("now") ORDER BY last_activity DESC',
    [req.user.id],
    (err, sessions) => {
      if (err) {
        console.error('Session fetch error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ sessions });
    }
  );
});

// Logout all sessions for a user
app.post('/api/auth/logout-all', verifyToken, (req, res) => {
  db.run('DELETE FROM sessions WHERE user_id = ?', [req.user.id], (err) => {
    if (err) {
      console.error('Session deletion error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'All sessions logged out successfully' });
  });
});

// Logout endpoint
app.post('/api/auth/logout', verifyToken, (req, res) => {
  const token = req.headers['authorization']?.slice(7) || '';
  
  // Delete session from database
  db.run('DELETE FROM sessions WHERE token = ?', [token], (err) => {
    if (err) {
      console.error('Session deletion error:', err);
    }
  });
  
  res.json({ message: 'Logged out successfully' });
});

// ==================== DASHBOARD ====================

// Dashboard endpoint
app.get('/api/dashboard', verifyToken, (req, res) => {
  const roleGreetings = {
    admin: 'Welcome Admin! You have full system access.',
    manager: 'Welcome Farm Manager! Manage farm operations here.',
    owner: 'Welcome Farm Owner! View your farm overview.'
  };

  res.json({
    message: roleGreetings[req.user.role] || 'Welcome!',
    user: req.user
  });
});

// ==================== USER MANAGEMENT (ADMIN ONLY) ====================

// Get all users (admin only)
app.get('/api/users', verifyToken, verifyAdmin, (req, res) => {
  db.all(
    'SELECT id, email, role, name, phone, created_at, updated_at FROM users',
    (err, users) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ users });
    }
  );
});

// Get single user (admin only)
app.get('/api/users/:id', verifyToken, verifyAdmin, (req, res) => {
  db.get(
    'SELECT id, email, role, name, phone, created_at, updated_at FROM users WHERE id = ?',
    [req.params.id],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ user });
    }
  );
});

// Create user (admin only)
app.post('/api/users', verifyToken, verifyAdmin, (req, res) => {
  const { email, password, role, name, phone } = req.body;

  if (!email || !password || !role || !name) {
    return res.status(400).json({ error: 'Email, password, role, and name are required' });
  }

  if (!['admin', 'manager', 'owner'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Check if email already exists first
  db.get('SELECT id FROM users WHERE email = ?', [email], (err, row) => {
    if (err) {
      console.error('Email check error:', err);
      return res.status(500).json({ error: 'Database error checking email' });
    }

    if (row) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    db.run(
      'INSERT INTO users (email, password, role, name, phone) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, role, name, phone || null],
      function(err) {
        if (err) {
          console.error('User creation error:', err);
          if (err.message && err.message.includes('UNIQUE')) {
            return res.status(400).json({ error: 'Email already exists' });
          }
          return res.status(500).json({ error: `Database error: ${err.message}` });
        }

        logActivity(req.user.id, 'create', 'user', this.lastID, null, JSON.stringify({ email, role, name }), `Created user: ${name} (${email})`);

        res.status(201).json({
          message: 'User created successfully',
          user: { id: this.lastID, email, role, name, phone }
        });
      }
    );
  });
});

// Update user (admin only)
app.put('/api/users/:id', verifyToken, verifyAdmin, (req, res) => {
  const { email, role, name, phone, password } = req.body;
  const userId = req.params.id;

  if (!email || !role || !name) {
    return res.status(400).json({ error: 'Email, role, and name are required' });
  }

  if (!['admin', 'manager', 'owner'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  // Get old values first
  db.get('SELECT * FROM users WHERE id = ?', [userId], (err, oldUser) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!oldUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    let updateQuery = 'UPDATE users SET email = ?, role = ?, name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP';
    let updateParams = [email, role, name, phone || null];

    if (password) {
      const hashedPassword = bcrypt.hashSync(password, 10);
      updateQuery += ', password = ?';
      updateParams.push(hashedPassword);
    }

    updateQuery += ' WHERE id = ?';
    updateParams.push(userId);

    db.run(updateQuery, updateParams, function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: 'Email already exists' });
        }
        return res.status(500).json({ error: 'Database error' });
      }

      const changes = [];
      if (oldUser.email !== email) changes.push(`email: ${oldUser.email} → ${email}`);
      if (oldUser.role !== role) changes.push(`role: ${oldUser.role} → ${role}`);
      if (oldUser.name !== name) changes.push(`name: ${oldUser.name} → ${name}`);
      if (oldUser.phone !== phone) changes.push(`phone: ${oldUser.phone} → ${phone}`);

      logActivity(req.user.id, 'update', 'user', userId, JSON.stringify(oldUser), JSON.stringify({ email, role, name, phone }), `Updated user: ${changes.join(', ')}`);

      res.json({
        message: 'User updated successfully',
        user: { id: userId, email, role, name, phone }
      });
    });
  });
});

// Delete user (admin only)
app.delete('/api/users/:id', verifyToken, verifyAdmin, (req, res) => {
  const userId = req.params.id;

  // Prevent deleting yourself
  if (req.user.id === parseInt(userId)) {
    return res.status(400).json({ error: 'Cannot delete your own account' });
  }

  db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    db.run('DELETE FROM users WHERE id = ?', [userId], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      logActivity(req.user.id, 'delete', 'user', userId, JSON.stringify(user), null, `Deleted user: ${user.name} (${user.email})`);

      res.json({ message: 'User deleted successfully' });
    });
  });
});

// ==================== GOAT MANAGEMENT ====================

// Get all goats
app.get('/api/goats', verifyToken, (req, res) => {
  db.all(
    `SELECT id, tag_number, date_of_birth, gender, breed, color, 
            health_status, location, weight, breeding_status, notes, created_at, updated_at,
            is_sold, sold_price, date_sold, is_dead, date_of_death FROM goats ORDER BY tag_number`,
    (err, goats) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      // Calculate age for each goat
      const goatsWithAge = goats.map(goat => {
        const dob = new Date(goat.date_of_birth);
        const age = Math.floor((new Date() - dob) / (1000 * 60 * 60 * 24 * 365.25));
        return { ...goat, age };
      });

      res.json({ goats: goatsWithAge });
    }
  );
});

// Get goat inventory stats
app.get('/api/goats/stats/inventory', verifyToken, (req, res) => {
  db.all('SELECT gender, health_status, breeding_status, date_of_birth, is_sold, is_dead, sold_price, date_sold, date_of_death FROM goats', (err, goats) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    // Filter to only active goats for inventory stats (not sold or dead)
    const activeGoats = goats.filter(g => !g.is_sold && !g.is_dead);
    const soldGoats = goats.filter(g => g.is_sold);
    const deadGoats = goats.filter(g => g.is_dead);

    const stats = {
      total: activeGoats.length,
      totalSold: soldGoats.length,
      soldRevenue: soldGoats.reduce((sum, g) => sum + (g.sold_price || 0), 0),
      totalDead: deadGoats.length,
      byGender: { male: 0, female: 0 },
      byHealthStatus: { healthy: 0, sick: 0, pregnant: 0, injured: 0 },
      byBreedingStatus: { breeding: 0, 'non-breeding': 0, retired: 0 },
      byAgeGroup: { kids: 0, yearlings: 0, adults: 0 },
      byAgeGroupMale: { kids: 0, yearlings: 0, adults: 0 },
      byAgeGroupFemale: { kids: 0, yearlings: 0, adults: 0 }
    };

    const now = new Date();

    activeGoats.forEach(goat => {
      // By gender
      if (goat.gender === 'male') stats.byGender.male++;
      if (goat.gender === 'female') stats.byGender.female++;

      // By health
      stats.byHealthStatus[goat.health_status]++;

      // By breeding status
      stats.byBreedingStatus[goat.breeding_status]++;

      // By age group
      const dob = new Date(goat.date_of_birth);
      const ageMonths = (now - dob) / (1000 * 60 * 60 * 24 * 30.44);
      let ageGroup = 'adults';
      if (ageMonths < 12) ageGroup = 'kids';
      else if (ageMonths < 24) ageGroup = 'yearlings';

      stats.byAgeGroup[ageGroup]++;
      if (goat.gender === 'male') stats.byAgeGroupMale[ageGroup]++;
      if (goat.gender === 'female') stats.byAgeGroupFemale[ageGroup]++;
    });

    res.json({ stats });
  });
});

// Get single goat with family tree
app.get('/api/goats/:id', verifyToken, (req, res) => {
  db.get(
    `SELECT id, tag_number, date_of_birth, gender, breed, color, 
            health_status, location, weight, breeding_status, notes, created_at, updated_at FROM goats WHERE id = ?`,
    [req.params.id],
    (err, goat) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!goat) {
        return res.status(404).json({ error: 'Goat not found' });
      }

      // Get parents and children
      db.all(
        `SELECT gp.id, gp.tag_number, gp.gender, gp.breed, gp.date_of_birth,
                g.relationship_type FROM goat_pedigree g 
         JOIN goats gp ON g.parent_goat_id = gp.id WHERE g.goat_id = ?`,
        [req.params.id],
        (err, parents) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }

          db.all(
            `SELECT gc.id, gc.tag_number, gc.gender, gc.breed, gc.date_of_birth,
                    g.relationship_type FROM goat_pedigree g 
             JOIN goats gc ON g.goat_id = gc.id WHERE g.parent_goat_id = ?`,
            [req.params.id],
            (err, children) => {
              if (err) {
                return res.status(500).json({ error: 'Database error' });
              }

              const dob = new Date(goat.date_of_birth);
              const age = Math.floor((new Date() - dob) / (1000 * 60 * 60 * 24 * 365.25));

              res.json({
                goat: { ...goat, age },
                parents,
                children
              });
            }
          );
        }
      );
    }
  );
});

// Create goat
app.post('/api/goats', verifyToken, (req, res) => {
  const { tag_number, date_of_birth, gender, breed, color, health_status, location, weight, breeding_status, notes } = req.body;

  if (!tag_number || !date_of_birth || !gender) {
    return res.status(400).json({ error: 'Tag number, date of birth, and gender are required' });
  }

  db.run(
    `INSERT INTO goats (tag_number, date_of_birth, gender, breed, color, health_status, location, weight, breeding_status, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [tag_number, date_of_birth, gender, breed || null, color || null, health_status || 'healthy', location || null, weight || null, breeding_status || 'non-breeding', notes || null],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: 'Tag number already exists' });
        }
        return res.status(500).json({ error: 'Database error' });
      }

      logActivity(req.user.id, 'create', 'goat', this.lastID, null, JSON.stringify({ tag_number, gender }), `Created goat: #${tag_number}`);

      res.status(201).json({
        message: 'Goat created successfully',
        goat: { id: this.lastID, tag_number, date_of_birth, gender, breed, color, health_status, location, weight, breeding_status, notes }
      });
    }
  );
});

// Update goat
app.put('/api/goats/:id', verifyToken, (req, res) => {
  const { tag_number, date_of_birth, gender, breed, color, health_status, location, weight, breeding_status, notes } = req.body;
  const goatId = req.params.id;

  if (!tag_number || !date_of_birth || !gender) {
    return res.status(400).json({ error: 'Tag number, date of birth, and gender are required' });
  }

  db.get('SELECT * FROM goats WHERE id = ?', [goatId], (err, oldGoat) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!oldGoat) {
      return res.status(404).json({ error: 'Goat not found' });
    }

    db.run(
      `UPDATE goats SET tag_number = ?, date_of_birth = ?, gender = ?, breed = ?, color = ?, 
                        health_status = ?, location = ?, weight = ?, breeding_status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [tag_number, date_of_birth, gender, breed || null, color || null, health_status || 'healthy', location || null, weight || null, breeding_status || 'non-breeding', notes || null, goatId],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            return res.status(400).json({ error: 'Tag number already exists' });
          }
          return res.status(500).json({ error: 'Database error' });
        }

        logActivity(req.user.id, 'update', 'goat', goatId, JSON.stringify(oldGoat), JSON.stringify({ tag_number, gender }), `Updated goat: #${tag_number}`);

        res.json({
          message: 'Goat updated successfully',
          goat: { id: goatId, tag_number, date_of_birth, gender, breed, color, health_status, location, weight, breeding_status, notes }
        });
      }
    );
  });
});

// Delete goat
app.delete('/api/goats/:id', verifyToken, (req, res) => {
  const goatId = req.params.id;

  db.get('SELECT * FROM goats WHERE id = ?', [goatId], (err, goat) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!goat) {
      return res.status(404).json({ error: 'Goat not found' });
    }

    db.run('DELETE FROM goats WHERE id = ?', [goatId], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      logActivity(req.user.id, 'delete', 'goat', goatId, JSON.stringify(goat), null, `Deleted goat: #${goat.tag_number}`);

      res.json({ message: 'Goat deleted successfully' });
    });
  });
});

// Update goat health status
app.patch('/api/goats/:id/health-status', verifyToken, (req, res) => {
  const { health_status } = req.body;
  const goatId = req.params.id;

  console.log('PATCH /api/goats/:id/health-status called with:', { goatId, health_status });

  if (!['healthy', 'sick', 'injured', 'pregnant'].includes(health_status)) {
    console.log('Invalid health status:', health_status);
    return res.status(400).json({ error: 'Invalid health status' });
  }

  db.get('SELECT * FROM goats WHERE id = ?', [goatId], (err, goat) => {
    if (err) {
      console.log('Database error fetching goat:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!goat) {
      console.log('Goat not found:', goatId);
      return res.status(404).json({ error: 'Goat not found' });
    }

    // Prevent males from being marked as pregnant
    if (health_status === 'pregnant' && goat.gender === 'male') {
      return res.status(400).json({ error: 'Only female goats can be marked as pregnant' });
    }

    // Prevent updating sold or dead goats
    if (goat.is_sold || goat.is_dead) {
      const status = goat.is_sold ? 'sold' : 'dead';
      console.log(`Cannot update health status - goat is marked as ${status}`);
      return res.status(400).json({ error: `Cannot update health status for a ${status} goat. Only admin can reactivate.` });
    }

    console.log('Updating goat health status from', goat.health_status, 'to', health_status);
    db.run(
      'UPDATE goats SET health_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [health_status, goatId],
      function(err) {
        if (err) {
          console.log('Database error updating goat:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        console.log('Successfully updated health status');
        logActivity(req.user.id, 'update', 'goat', goatId, JSON.stringify({ health_status: goat.health_status }), JSON.stringify({ health_status }), `Updated health status to: ${health_status}`);

        res.json({ message: 'Health status updated', goat: { ...goat, health_status } });
      }
    );
  });
});

// Mark goat as sold
app.patch('/api/goats/:id/sold', verifyToken, (req, res) => {
  const { sold_price, date_sold } = req.body;
  const goatId = req.params.id;

  console.log('PATCH /api/goats/:id/sold called with:', { goatId, sold_price, date_sold });

  if (!sold_price || !date_sold) {
    console.log('Missing required fields:', { sold_price, date_sold });
    return res.status(400).json({ error: 'Sold price and date are required' });
  }

  db.get('SELECT * FROM goats WHERE id = ?', [goatId], (err, goat) => {
    if (err) {
      console.log('Database error fetching goat:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!goat) {
      console.log('Goat not found:', goatId);
      return res.status(404).json({ error: 'Goat not found' });
    }

    // Prevent marking a dead goat as sold
    if (goat.is_dead) {
      console.log('Cannot mark dead goat as sold');
      return res.status(400).json({ error: 'Cannot mark a dead goat as sold' });
    }

    // Prevent re-marking an already sold goat
    if (goat.is_sold) {
      console.log('Goat is already marked as sold');
      return res.status(400).json({ error: 'This goat is already marked as sold' });
    }

    console.log('Marking goat as sold:', { goatId, sold_price, date_sold });
    db.run(
      'UPDATE goats SET is_sold = 1, sold_price = ?, date_sold = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [sold_price, date_sold, goatId],
      function(err) {
        if (err) {
          console.log('Database error updating goat:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        console.log('Successfully marked goat as sold');
        logActivity(req.user.id, 'update', 'goat', goatId, JSON.stringify({ is_sold: 0 }), JSON.stringify({ is_sold: 1, sold_price, date_sold }), `Marked goat as sold for K${sold_price}`);

        res.json({ message: 'Goat marked as sold', goat: { ...goat, is_sold: 1, sold_price, date_sold } });
      }
    );
  });
});

// Mark goat as dead
app.patch('/api/goats/:id/dead', verifyToken, (req, res) => {
  const { date_of_death, cause } = req.body;
  const goatId = req.params.id;

  console.log('PATCH /api/goats/:id/dead called with:', { goatId, date_of_death });

  if (!date_of_death) {
    console.log('Missing date of death');
    return res.status(400).json({ error: 'Date of death is required' });
  }

  db.get('SELECT * FROM goats WHERE id = ?', [goatId], (err, goat) => {
    if (err) {
      console.log('Database error fetching goat:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!goat) {
      console.log('Goat not found:', goatId);
      return res.status(404).json({ error: 'Goat not found' });
    }

    // Prevent marking a sold goat as dead
    if (goat.is_sold) {
      console.log('Cannot mark sold goat as dead');
      return res.status(400).json({ error: 'Cannot mark a sold goat as dead' });
    }

    // Prevent re-marking an already dead goat
    if (goat.is_dead) {
      console.log('Goat is already marked as dead');
      return res.status(400).json({ error: 'This goat is already marked as dead' });
    }

    console.log('Marking goat as dead:', { goatId, date_of_death, cause });
    // Append cause to notes
    const newNotes = (goat.notes || '') + (cause ? `\nDeath cause: ${cause}` : '');
    db.run(
      'UPDATE goats SET is_dead = 1, date_of_death = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [date_of_death, newNotes, goatId],
      function(err) {
        if (err) {
          console.log('Database error updating goat:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        console.log('Successfully marked goat as dead');
        logActivity(req.user.id, 'update', 'goat', goatId, JSON.stringify({ is_dead: 0, notes: goat.notes }), JSON.stringify({ is_dead: 1, date_of_death, notes: newNotes }), `Marked goat as dead on ${date_of_death}${cause ? ' - cause: ' + cause : ''}`);

        res.json({ message: 'Goat marked as dead', goat: { ...goat, is_dead: 1, date_of_death, notes: newNotes } });
      }
    );
  });
});

// Reactivate a goat (admin only) - remove sold or dead status
app.patch('/api/goats/:id/reactivate', verifyToken, verifyAdmin, (req, res) => {
  const goatId = req.params.id;

  console.log('PATCH /api/goats/:id/reactivate called with:', { goatId, userId: req.user.id });

  db.get('SELECT * FROM goats WHERE id = ?', [goatId], (err, goat) => {
    if (err) {
      console.log('Database error fetching goat:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!goat) {
      console.log('Goat not found:', goatId);
      return res.status(404).json({ error: 'Goat not found' });
    }

    // Check if goat is actually sold or dead
    if (!goat.is_sold && !goat.is_dead) {
      console.log('Goat is not marked as sold or dead');
      return res.status(400).json({ error: 'This goat is not marked as sold or dead' });
    }

    console.log('Reactivating goat:', { goatId, was_sold: goat.is_sold, was_dead: goat.is_dead });
    
    // Reset sold and dead status
    db.run(
      'UPDATE goats SET is_sold = 0, is_dead = 0, sold_price = NULL, date_sold = NULL, date_of_death = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [goatId],
      function(err) {
        if (err) {
          console.log('Database error reactivating goat:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        console.log('Successfully reactivated goat');
        const statusWas = goat.is_sold ? 'sold' : 'dead';
        logActivity(req.user.id, 'update', 'goat', goatId, JSON.stringify({ is_sold: goat.is_sold, is_dead: goat.is_dead }), JSON.stringify({ is_sold: 0, is_dead: 0 }), `Reactivated goat (was marked as ${statusWas})`);

        res.json({ message: 'Goat reactivated successfully', goat: { ...goat, is_sold: 0, is_dead: 0, sold_price: null, date_sold: null, date_of_death: null } });
      }
    );
  });
});

// Add pedigree relationship
app.post('/api/goats/:id/pedigree', verifyToken, (req, res) => {
  const { parent_goat_id, relationship_type } = req.body;
  const goatId = req.params.id;

  if (!parent_goat_id || !relationship_type) {
    return res.status(400).json({ error: 'Parent goat ID and relationship type are required' });
  }

  if (!['sire', 'dam'].includes(relationship_type)) {
    return res.status(400).json({ error: 'Invalid relationship type (must be sire or dam)' });
  }

  // Check if trying to add a dam and one already exists
  if (relationship_type === 'dam') {
    db.get(
      'SELECT id FROM goat_pedigree WHERE goat_id = ? AND relationship_type = ?',
      [goatId, 'dam'],
      (err, existingDam) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        if (existingDam) {
          return res.status(400).json({ 
            error: 'This goat already has a mother (dam) assigned. Please replace the existing one first.' 
          });
        }

        // Proceed with insertion
        insertPedigree(goatId, parent_goat_id, relationship_type);
      }
    );
  } else {
    insertPedigree(goatId, parent_goat_id, relationship_type);
  }

  function insertPedigree(goatId, parent_goat_id, relationship_type) {
    db.run(
      'INSERT INTO goat_pedigree (goat_id, parent_goat_id, relationship_type) VALUES (?, ?, ?)',
      [goatId, parent_goat_id, relationship_type],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            return res.status(400).json({ error: 'This relationship already exists' });
          }
          return res.status(500).json({ error: 'Database error' });
        }

        logActivity(req.user.id, 'create', 'goat', goatId, null, JSON.stringify({ parent_goat_id, relationship_type }), `Added ${relationship_type} to goat`);

        res.status(201).json({
          message: 'Pedigree relationship added successfully',
          pedigree: { id: this.lastID, goat_id: goatId, parent_goat_id, relationship_type }
        });
      }
    );
  }
});

// Remove pedigree relationship
app.delete('/api/goats/:id/pedigree/:pedigreeId', verifyToken, (req, res) => {
  db.run('DELETE FROM goat_pedigree WHERE id = ?', [req.params.pedigreeId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Pedigree relationship not found' });
    }

    logActivity(req.user.id, 'delete', 'goat', req.params.id, null, null, `Removed pedigree relationship`);

    res.json({ message: 'Pedigree relationship removed successfully' });
  });
});

// Handle pregnancy delivery - add baby goat and update mother's health
app.post('/api/goats/:id/deliver', verifyToken, (req, res) => {
  const motherId = req.params.id;
  const { tag_number, gender, breed, color } = req.body;

  console.log('POST /api/goats/:id/deliver called:', { motherId, tag_number, gender, breed, color });

  if (!tag_number || !gender) {
    return res.status(400).json({ error: 'Tag number and gender are required' });
  }

  // Get mother goat
  db.get('SELECT * FROM goats WHERE id = ?', [motherId], (err, mother) => {
    if (err) {
      console.log('Error fetching mother:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!mother) {
      return res.status(404).json({ error: 'Mother goat not found' });
    }

    // Check if mother is pregnant
    if (mother.health_status !== 'pregnant') {
      console.log('Mother goat is not pregnant');
      return res.status(400).json({ error: 'Only pregnant goats can deliver' });
    }

    // Add baby goat
    db.run(
      `INSERT INTO goats (tag_number, date_of_birth, gender, breed, color, health_status, location, breeding_status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [tag_number, new Date().toISOString().split('T')[0], gender, breed || mother.breed, color || mother.color, 'healthy', mother.location, 'non-breeding', `Born from goat #${mother.tag_number}`],
      function(err) {
        if (err) {
          console.log('Error creating baby goat:', err);
          return res.status(500).json({ error: 'Failed to create baby goat' });
        }

        const babyId = this.lastID;

        // Update mother's health to healthy
        db.run(
          'UPDATE goats SET health_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          ['healthy', motherId],
          (err) => {
            if (err) {
              console.log('Error updating mother health:', err);
              return res.status(500).json({ error: 'Failed to update mother health' });
            }

            // Add pedigree relationship (mother is dam)
            db.run(
              `INSERT INTO goat_pedigree (goat_id, parent_goat_id, relationship_type)
               VALUES (?, ?, ?)`,
              [babyId, motherId, 'dam'],
              (err) => {
                if (err) {
                  console.log('Error adding pedigree:', err);
                  // Don't fail the whole operation if pedigree fails
                }

                logActivity(req.user.id, 'create', 'goat', babyId, null, JSON.stringify({ tag_number, gender, breed, color }), `Created baby goat #${tag_number} from pregnant goat #${mother.tag_number}`);
                logActivity(req.user.id, 'update', 'goat', motherId, JSON.stringify({ health_status: 'pregnant' }), JSON.stringify({ health_status: 'healthy' }), `Recorded delivery - mother health updated to healthy`);

                res.json({
                  message: 'Delivery recorded successfully',
                  baby: { id: babyId, tag_number, gender, breed, color, health_status: 'healthy', date_of_birth: new Date().toISOString().split('T')[0] },
                  mother: { ...mother, health_status: 'healthy' }
                });
              }
            );
          }
        );
      }
    );
  });
});

// ==================== REPORTS - PDF GENERATION ====================

// Generate PDF report for dead/sold goats
app.post('/api/reports/dead-sold-pdf', verifyToken, (req, res) => {
  const { startDate, endDate, includeType } = req.body;
  
  // Build query based on filters
  let query = 'SELECT * FROM goats WHERE (is_dead = 1 OR is_sold = 1)';
  let params = [];
  
  if (includeType === 'dead') {
    query = 'SELECT * FROM goats WHERE is_dead = 1';
  } else if (includeType === 'sold') {
    query = 'SELECT * FROM goats WHERE is_sold = 1';
  }
  
  // Apply date filtering
  if (startDate && endDate) {
    query += ` AND (
      (is_dead = 1 AND date_of_death BETWEEN ? AND ?)
      OR (is_sold = 1 AND date_sold BETWEEN ? AND ?)
    )`;
    params = [startDate, endDate, startDate, endDate];
  } else if (startDate) {
    query += ` AND (
      (is_dead = 1 AND date_of_death >= ?)
      OR (is_sold = 1 AND date_sold >= ?)
    )`;
    params = [startDate, startDate];
  } else if (endDate) {
    query += ` AND (
      (is_dead = 1 AND date_of_death <= ?)
      OR (is_sold = 1 AND date_sold <= ?)
    )`;
    params = [endDate, endDate];
  }
  
  query += ' ORDER BY date_of_death DESC, date_sold DESC';
  
  db.all(query, params, (err, goats) => {
    if (err) {
      return res.status(400).json({ message: 'Error fetching goats', error: err.message });
    }
    
    // Create PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margin: 40
    });
    
    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="shafa-farm-dead-sold-report-${Date.now()}.pdf"`);
    
    // Pipe the PDF to response
    doc.pipe(res);
    
    // Add header with farm branding
    doc.fontSize(28)
      .font('Helvetica-Bold')
      .text('SHAFA FARM', { align: 'center' })
      .fontSize(12)
      .font('Helvetica')
      .text('Professional Livestock Management Report', { align: 'center' });
    
    // Add decorative line
    doc.moveTo(40, doc.y + 5)
      .lineTo(555, doc.y + 5)
      .stroke();
    
    doc.moveDown();
    
    // Add report title and metadata
    doc.fontSize(14)
      .font('Helvetica-Bold')
      .text('Dead & Sold Goats Report', { align: 'left' });
    
    doc.fontSize(10)
      .font('Helvetica')
      .text(`Generated: ${new Date().toLocaleString('en-US')}`, { align: 'left' });
    
    if (startDate || endDate) {
      let dateRange = 'Date Range: ';
      if (startDate && endDate) {
        dateRange += `${startDate} to ${endDate}`;
      } else if (startDate) {
        dateRange += `From ${startDate}`;
      } else if (endDate) {
        dateRange += `Until ${endDate}`;
      }
      doc.text(dateRange, { align: 'left' });
    }
    
    doc.moveDown(0.5);
    
    // Add summary statistics
    const deadCount = goats.filter(g => g.is_dead).length;
    const soldCount = goats.filter(g => g.is_sold).length;
    const totalSoldPrice = goats.filter(g => g.is_sold).reduce((sum, g) => sum + (g.sold_price || 0), 0);
    
    const summaryBox = {
      x: 40,
      y: doc.y,
      width: 515,
      height: 60
    };
    
    doc.rect(summaryBox.x, summaryBox.y, summaryBox.width, summaryBox.height).stroke();
    
    doc.fontSize(10)
      .font('Helvetica-Bold')
      .text('SUMMARY', summaryBox.x + 10, summaryBox.y + 8);
    
    doc.font('Helvetica')
      .fontSize(9)
      .text(`Total Records: ${goats.length}  |  Dead: ${deadCount}  |  Sold: ${soldCount}  |  Total Sales Value: $${totalSoldPrice.toFixed(2)}`, 
        summaryBox.x + 10, summaryBox.y + 25);
    
    doc.moveDown(3);
    
    // Add table header
    const tableTop = doc.y;
    const col1 = 50;
    const col2 = 130;
    const col3 = 200;
    const col4 = 280;
    const col5 = 360;
    const col6 = 450;
    
    doc.fontSize(10)
      .font('Helvetica-Bold');
    
    doc.text('Tag #', col1, tableTop);
    doc.text('Gender', col2, tableTop);
    doc.text('Breed', col3, tableTop);
    doc.text('Status', col4, tableTop);
    doc.text('Date', col5, tableTop);
    doc.text('Price', col6, tableTop);
    
    // Add table header line
    doc.moveTo(40, tableTop + 15)
      .lineTo(555, tableTop + 15)
      .stroke();
    
    // Add goat data rows
    let yPosition = tableTop + 25;
    const pageHeight = doc.page.height - 40;
    
    doc.font('Helvetica')
      .fontSize(9);
    
    goats.forEach((goat) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = 40;
        
        // Redraw table header on new page
        doc.fontSize(10)
          .font('Helvetica-Bold');
        
        doc.text('Tag #', col1, yPosition);
        doc.text('Gender', col2, yPosition);
        doc.text('Breed', col3, yPosition);
        doc.text('Status', col4, yPosition);
        doc.text('Date', col5, yPosition);
        doc.text('Price', col6, yPosition);
        
        doc.moveTo(40, yPosition + 15)
          .lineTo(555, yPosition + 15)
          .stroke();
        
        yPosition += 25;
        doc.font('Helvetica')
          .fontSize(9);
      }
      
      const status = goat.is_dead ? 'DEAD' : 'SOLD';
      const date = goat.is_dead ? goat.date_of_death : goat.date_sold;
      const price = goat.is_sold ? (goat.sold_price ? `$${goat.sold_price.toFixed(2)}` : 'N/A') : '-';
      
      doc.text(goat.tag_number || '-', col1, yPosition);
      doc.text((goat.gender || '-').substring(0, 1).toUpperCase(), col2, yPosition);
      doc.text(goat.breed || '-', col3, yPosition);
      doc.text(status, col4, yPosition);
      doc.text(date || '-', col5, yPosition);
      doc.text(price, col6, yPosition);
      
      yPosition += 15;
    });
    
    // Add footer
    doc.fontSize(9)
      .font('Helvetica')
      .text('This is an official report generated by Shafa Farm ERP System', 40, doc.page.height - 30, { align: 'center' });
    
    // Finalize PDF
    doc.end();
  });
});

// Get dead/sold goats summary
app.get('/api/reports/dead-sold-summary', verifyToken, (req, res) => {
  const { startDate, endDate } = req.query;
  
  let query = 'SELECT * FROM goats WHERE (is_dead = 1 OR is_sold = 1)';
  let params = [];
  
  if (startDate && endDate) {
    query += ` AND (
      (is_dead = 1 AND date_of_death BETWEEN ? AND ?)
      OR (is_sold = 1 AND date_sold BETWEEN ? AND ?)
    )`;
    params = [startDate, endDate, startDate, endDate];
  }
  
  db.all(query, params, (err, goats) => {
    if (err) {
      return res.status(400).json({ message: 'Error fetching goats', error: err.message });
    }
    
    const goatsList = goats || [];
    const deadGoats = goatsList.filter(g => g.is_dead);
    const soldGoats = goatsList.filter(g => g.is_sold);
    const totalSalesValue = soldGoats.reduce((sum, g) => sum + (g.sold_price || 0), 0);
    
    res.json({
      total: goatsList.length,
      dead: deadGoats.length,
      sold: soldGoats.length,
      totalSalesValue,
      goats: goatsList
    });
  });
});

  // Reproductive metrics report
  app.get('/api/reports/reproductive', verifyToken, (req, res) => {
    db.all('SELECT id, date_of_birth, gender, health_status, notes FROM goats', (err, goats) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      const now = new Date();
      const adultFemales = goats.filter(g => g.gender === 'female' && g.date_of_birth && ((now - new Date(g.date_of_birth)) / (1000*60*60*24*365.25)) >= 1);
      const pregnantFemales = adultFemales.filter(g => (g.health_status || '').toLowerCase() === 'pregnant');
      const pregnancyPrevalence = adultFemales.length ? (pregnantFemales.length / adultFemales.length) * 100 : 0;

      // births last 12 months
      const birthsMap = {};
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
        birthsMap[key] = 0;
      }
      goats.forEach(g => {
        if (!g.date_of_birth) return;
        const d = new Date(g.date_of_birth);
        const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
        if (key in birthsMap) birthsMap[key]++;
      });

      // inter-birth intervals via goat_pedigree
      db.all("SELECT g.id as child_id, g.date_of_birth as child_dob, p.parent_goat_id as dam_id FROM goats g JOIN goat_pedigree p ON g.id = p.goat_id WHERE p.relationship_type = 'dam' AND g.date_of_birth IS NOT NULL", (err2, rows) => {
        if (err2) return res.status(500).json({ error: 'Database error' });

        const dams = {};
        rows.forEach(r => {
          if (!r.dam_id) return;
          dams[r.dam_id] = dams[r.dam_id] || [];
          dams[r.dam_id].push(new Date(r.child_dob));
        });

        const intervals = [];
        Object.keys(dams).forEach(did => {
          const dates = dams[did].sort((a,b) => a - b);
          if (dates.length < 2) return;
          for (let i = 1; i < dates.length; i++) {
            const months = (dates[i] - dates[i-1]) / (1000*60*60*24*30.44);
            intervals.push(months);
          }
        });

        const avgInterBirthMonths = intervals.length ? (intervals.reduce((s,v) => s+v,0) / intervals.length) : null;

        res.json({
          pregnancyPrevalence: Math.round(pregnancyPrevalence*100)/100,
          adultFemales: adultFemales.length,
          pregnantFemales: pregnantFemales.length,
          birthsByMonth: birthsMap,
          interBirthIntervalsMonths: intervals,
          avgInterBirthMonths: avgInterBirthMonths ? Math.round(avgInterBirthMonths*10)/10 : null
        });
      });
    });
  });

  // Genetic / pedigree analysis
  app.get('/api/reports/genetic', verifyToken, (req, res) => {
    db.all('SELECT id FROM goats', (err, goats) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      db.all('SELECT goat_id, parent_goat_id, relationship_type FROM goat_pedigree', (err2, edges) => {
        if (err2) return res.status(500).json({ error: 'Database error' });

        const parents = {}; // goat_id -> [parent ids]
        edges.forEach(e => {
          parents[e.goat_id] = parents[e.goat_id] || [];
          parents[e.goat_id].push(e.parent_goat_id);
        });

        const collectAncestors = (id, depth, seen) => {
          if (!id || depth === 0) return [];
          const p = parents[id] || [];
          let res = [];
          p.forEach(pid => {
            if (!pid) return;
            if (!seen.has(pid)) {
              res.push(pid);
              seen.add(pid);
              res = res.concat(collectAncestors(pid, depth-1, seen));
            }
          });
          return res;
        };

        const flagged = [];
        let totalAncestorsKnown = 0;
        goats.forEach(g => {
          const seen = new Set();
          const anc = collectAncestors(g.id, 3, seen);
          totalAncestorsKnown += anc.length;
          const parentList = parents[g.id] || [];
          let inbred = false;
          if (parentList.length >= 2) {
            const a1 = new Set(collectAncestors(parentList[0], 3, new Set()));
            const a2 = new Set(collectAncestors(parentList[1], 3, new Set()));
            for (let x of a1) if (a2.has(x)) { inbred = true; break; }
          }
          if (inbred) flagged.push({ goatId: g.id, ancestorsKnown: anc.length });
        });

        const avgAncestors = goats.length ? Math.round((totalAncestorsKnown / goats.length) * 100) / 100 : 0;

        res.json({ flaggedInbreedingCount: flagged.length, flagged, avgAncestorsKnown: avgAncestors });
      });
    });
  });

// ==================== CHICKEN MANAGEMENT ====================

// Get all chickens
app.get('/api/chickens', verifyToken, (req, res) => {
  db.all(
    `SELECT id, name, tag_number, date_of_birth, gender, breed, color, health_status, location, weight, notes, created_at, updated_at FROM chickens ORDER BY name`,
    (err, chickens) => {
      if (err) {
        console.error('Chickens fetch error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      const chickensWithAge = (chickens || []).map(c => {
        let age = null;
        if (c.date_of_birth) {
          try {
            const dob = new Date(c.date_of_birth);
            age = Math.floor((new Date() - dob) / (1000 * 60 * 60 * 24 * 365.25));
          } catch (e) {
            age = null;
          }
        }
        return { ...c, age };
      });

      res.json({ chickens: chickensWithAge });
    }
  );
});

// Get single chicken
app.get('/api/chickens/:id', verifyToken, (req, res) => {
  db.get('SELECT * FROM chickens WHERE id = ?', [req.params.id], (err, chicken) => {
    if (err) {
      console.error('Chicken fetch error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!chicken) return res.status(404).json({ error: 'Chicken not found' });

    let age = null;
    if (chicken.date_of_birth) {
      try { age = Math.floor((new Date() - new Date(chicken.date_of_birth)) / (1000 * 60 * 60 * 24 * 365.25)); } catch (e) { age = null; }
    }

    res.json({ chicken: { ...chicken, age } });
  });
});

// Create chicken
app.post('/api/chickens', verifyToken, (req, res) => {
  const { name, tag_number, date_of_birth, gender, breed, color, health_status, location, weight, notes } = req.body;

  if (!name) return res.status(400).json({ error: 'Name is required' });

  db.run(
    `INSERT INTO chickens (name, tag_number, date_of_birth, gender, breed, color, health_status, location, weight, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, tag_number || null, date_of_birth || null, gender || null, breed || null, color || null, health_status || 'healthy', location || null, weight || null, notes || null],
    function(err) {
      if (err) {
        if (err.message && err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: 'Tag number already exists' });
        }
        console.error('Chicken creation error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      logActivity(req.user.id, 'create', 'chicken', this.lastID, null, JSON.stringify({ name, tag_number }), `Created chicken: ${name}`);

      res.status(201).json({ message: 'Chicken created', chicken: { id: this.lastID, name, tag_number, date_of_birth, gender, breed, color, health_status, location, weight, notes } });
    }
  );
});

// Update chicken
app.put('/api/chickens/:id', verifyToken, (req, res) => {
  const chickenId = req.params.id;
  const { name, tag_number, date_of_birth, gender, breed, color, health_status, location, weight, notes } = req.body;

  if (!name) return res.status(400).json({ error: 'Name is required' });

  db.get('SELECT * FROM chickens WHERE id = ?', [chickenId], (err, oldChicken) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!oldChicken) return res.status(404).json({ error: 'Chicken not found' });

    db.run(
      `UPDATE chickens SET name = ?, tag_number = ?, date_of_birth = ?, gender = ?, breed = ?, color = ?, health_status = ?, location = ?, weight = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [name, tag_number || null, date_of_birth || null, gender || null, breed || null, color || null, health_status || 'healthy', location || null, weight || null, notes || null, chickenId],
      function(err) {
        if (err) {
          if (err.message && err.message.includes('UNIQUE')) return res.status(400).json({ error: 'Tag number already exists' });
          console.error('Chicken update error:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        logActivity(req.user.id, 'update', 'chicken', chickenId, JSON.stringify(oldChicken), JSON.stringify(req.body), `Updated chicken: ${name}`);

        res.json({ message: 'Chicken updated', chicken: { id: chickenId, name, tag_number, date_of_birth, gender, breed, color, health_status, location, weight, notes } });
      }
    );
  });
});

// Delete chicken
app.delete('/api/chickens/:id', verifyToken, (req, res) => {
  const chickenId = req.params.id;
  db.get('SELECT * FROM chickens WHERE id = ?', [chickenId], (err, chicken) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!chicken) return res.status(404).json({ error: 'Chicken not found' });

    db.run('DELETE FROM chickens WHERE id = ?', [chickenId], function(err) {
      if (err) return res.status(500).json({ error: 'Database error' });

      logActivity(req.user.id, 'delete', 'chicken', chickenId, JSON.stringify(chicken), null, `Deleted chicken: ${chicken.name}`);
      res.json({ message: 'Chicken deleted' });
    });
  });
});

// ==================== PLANT MANAGEMENT ====================

// Get all plants
app.get('/api/plants', verifyToken, (req, res) => {
  db.all(
    `SELECT id, name, species, planting_date, stage, location, health_status, yield_estimate, notes, created_at, updated_at FROM plants ORDER BY name`,
    (err, plants) => {
      if (err) {
        console.error('Plants fetch error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ plants: plants || [] });
    }
  );
});

// Get single plant
app.get('/api/plants/:id', verifyToken, (req, res) => {
  db.get('SELECT * FROM plants WHERE id = ?', [req.params.id], (err, plant) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!plant) return res.status(404).json({ error: 'Plant not found' });
    res.json({ plant });
  });
});

// Create plant
app.post('/api/plants', verifyToken, (req, res) => {
  const { name, species, planting_date, stage, location, health_status, yield_estimate, notes } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  db.run(
    `INSERT INTO plants (name, species, planting_date, stage, location, health_status, yield_estimate, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, species || null, planting_date || null, stage || 'seedling', location || null, health_status || 'healthy', yield_estimate || null, notes || null],
    function(err) {
      if (err) {
        console.error('Plant creation error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      logActivity(req.user.id, 'create', 'plant', this.lastID, null, JSON.stringify(req.body), `Created plant: ${name}`);
      res.status(201).json({ message: 'Plant created', plant: { id: this.lastID, name, species, planting_date, stage, location, health_status, yield_estimate, notes } });
    }
  );
});

// Update plant
app.put('/api/plants/:id', verifyToken, (req, res) => {
  const plantId = req.params.id;
  const { name, species, planting_date, stage, location, health_status, yield_estimate, notes } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  db.get('SELECT * FROM plants WHERE id = ?', [plantId], (err, oldPlant) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!oldPlant) return res.status(404).json({ error: 'Plant not found' });

    db.run(
      `UPDATE plants SET name = ?, species = ?, planting_date = ?, stage = ?, location = ?, health_status = ?, yield_estimate = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [name, species || null, planting_date || null, stage || 'seedling', location || null, health_status || 'healthy', yield_estimate || null, notes || null, plantId],
      function(err) {
        if (err) {
          console.error('Plant update error:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        logActivity(req.user.id, 'update', 'plant', plantId, JSON.stringify(oldPlant), JSON.stringify(req.body), `Updated plant: ${name}`);
        res.json({ message: 'Plant updated', plant: { id: plantId, name, species, planting_date, stage, location, health_status, yield_estimate, notes } });
      }
    );
  });
});

// Delete plant
app.delete('/api/plants/:id', verifyToken, (req, res) => {
  const plantId = req.params.id;
  db.get('SELECT * FROM plants WHERE id = ?', [plantId], (err, plant) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!plant) return res.status(404).json({ error: 'Plant not found' });

    db.run('DELETE FROM plants WHERE id = ?', [plantId], function(err) {
      if (err) return res.status(500).json({ error: 'Database error' });
      logActivity(req.user.id, 'delete', 'plant', plantId, JSON.stringify(plant), null, `Deleted plant: ${plant.name}`);
      res.json({ message: 'Plant deleted' });
    });
  });
});

// ==================== FAMILY TREE ====================

// ==================== EXPENSES ====================

// Get expenses (all roles can view)
app.get('/api/expenses', verifyToken, (req, res) => {
  db.all(
    `SELECT e.*, u.name as user_name FROM expenses e LEFT JOIN users u ON e.user_id = u.id ORDER BY date DESC`,
    [],
    (err, rows) => {
      if (err) {
        console.error('Expenses fetch error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ expenses: rows });
    }
  );
});

// Create expense (manager and admin only)
app.post('/api/expenses', verifyToken, (req, res) => {
  const { title, amount, date, category, notes } = req.body;

  if (!title || !amount || !date) {
    return res.status(400).json({ error: 'Title, amount, and date are required' });
  }

  if (!['admin', 'manager'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Insufficient privileges' });
  }

  db.run(
    'INSERT INTO expenses (title, amount, date, category, notes, user_id) VALUES (?, ?, ?, ?, ?, ?)',
    [title, amount, date, category || null, notes || null, req.user.id],
    function(err) {
      if (err) {
        console.error('Expense creation error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      logActivity(req.user.id, 'create', 'expense', this.lastID, null, JSON.stringify({ title, amount, date }), `Created expense: ${title}`);

      res.status(201).json({ message: 'Expense created', expense: { id: this.lastID, title, amount, date, category, notes, user_id: req.user.id } });
    }
  );
});

// Update expense (manager and admin only)
app.put('/api/expenses/:id', verifyToken, (req, res) => {
  const { title, amount, date, category, notes } = req.body;
  const expenseId = req.params.id;

  if (!['admin', 'manager'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Insufficient privileges' });
  }

  db.get('SELECT * FROM expenses WHERE id = ?', [expenseId], (err, oldExpense) => {
    if (err) {
      console.error('Expense lookup error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!oldExpense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    db.run(
      `UPDATE expenses SET title = ?, amount = ?, date = ?, category = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [title || oldExpense.title, amount || oldExpense.amount, date || oldExpense.date, category || oldExpense.category, notes || oldExpense.notes, expenseId],
      function(err) {
        if (err) {
          console.error('Expense update error:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        logActivity(req.user.id, 'update', 'expense', expenseId, JSON.stringify(oldExpense), JSON.stringify({ title, amount, date, category, notes }), `Updated expense: ${expenseId}`);

        res.json({ message: 'Expense updated' });
      }
    );
  });
});

// Delete expense (manager and admin only)
app.delete('/api/expenses/:id', verifyToken, (req, res) => {
  const expenseId = req.params.id;

  if (!['admin', 'manager'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Insufficient privileges' });
  }

  db.get('SELECT * FROM expenses WHERE id = ?', [expenseId], (err, expense) => {
    if (err) {
      console.error('Expense lookup error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    db.run('DELETE FROM expenses WHERE id = ?', [expenseId], function(err) {
      if (err) {
        console.error('Expense deletion error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      logActivity(req.user.id, 'delete', 'expense', expenseId, JSON.stringify(expense), null, `Deleted expense: ${expense.title}`);

      res.json({ message: 'Expense deleted' });
    });
  });
});

// ==================== VACCINATION ROUTES ====================

// Get all vaccines
app.get('/api/vaccines', verifyToken, (req, res) => {
  db.all('SELECT * FROM vaccines ORDER BY name', (err, vaccines) => {
    if (err) {
      console.error('Vaccines fetch error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ vaccines: vaccines || [] });
  });
});

// Create a new vaccine
app.post('/api/vaccines', verifyToken, (req, res) => {
  if (!['admin', 'manager'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Insufficient privileges' });
  }

  const { name, description, manufacturer, disease_protection, dosage } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Vaccine name is required' });
  }

  db.run(
    'INSERT INTO vaccines (name, description, manufacturer, disease_protection, dosage) VALUES (?, ?, ?, ?, ?)',
    [name, description || null, manufacturer || null, disease_protection || null, dosage || null],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: 'Vaccine already exists' });
        }
        console.error('Vaccine creation error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      logActivity(req.user.id, 'create', 'vaccine', this.lastID, null, JSON.stringify(req.body), `Created vaccine: ${name}`);
      res.json({ message: 'Vaccine created', id: this.lastID });
    }
  );
});

// Get all vaccination records
app.get('/api/vaccinations', verifyToken, (req, res) => {
  db.all(
    `SELECT vr.*, g.tag_number as goat_tag, v.name as vaccine_name, 
            v.disease_protection, u.name as recorded_by
     FROM vaccination_records vr
     JOIN goats g ON vr.goat_id = g.id
     JOIN vaccines v ON vr.vaccine_id = v.id
     LEFT JOIN users u ON vr.user_id = u.id
     ORDER BY vr.vaccination_date DESC`,
    (err, records) => {
      if (err) {
        console.error('Vaccinations fetch error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ vaccinations: records || [] });
    }
  );
});

// Get vaccinations for a specific goat
app.get('/api/vaccinations/goat/:id', verifyToken, (req, res) => {
  const goatId = req.params.id;

  db.all(
    `SELECT vr.*, v.name as vaccine_name, v.disease_protection, u.name as recorded_by
     FROM vaccination_records vr
     JOIN vaccines v ON vr.vaccine_id = v.id
     LEFT JOIN users u ON vr.user_id = u.id
     WHERE vr.goat_id = ?
     ORDER BY vr.vaccination_date DESC`,
    [goatId],
    (err, records) => {
      if (err) {
        console.error('Goat vaccinations fetch error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ vaccinations: records || [] });
    }
  );
});

// Create a vaccination record
app.post('/api/vaccinations', verifyToken, (req, res) => {
  if (!['admin', 'manager'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Insufficient privileges' });
  }

  const { goat_id, vaccine_id, vaccination_date, next_due_date, veterinarian_name, batch_number, route, site, notes } = req.body;

  if (!goat_id || !vaccine_id || !vaccination_date) {
    return res.status(400).json({ error: 'Goat ID, vaccine ID, and vaccination date are required' });
  }

  // Verify goat exists
  db.get('SELECT id FROM goats WHERE id = ?', [goat_id], (err, goat) => {
    if (err || !goat) {
      return res.status(404).json({ error: 'Goat not found' });
    }

    db.run(
      `INSERT INTO vaccination_records 
       (goat_id, vaccine_id, vaccination_date, next_due_date, veterinarian_name, batch_number, route, site, notes, user_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [goat_id, vaccine_id, vaccination_date, next_due_date || null, veterinarian_name || null, batch_number || null, route || null, site || null, notes || null, req.user.id],
      function(err) {
        if (err) {
          console.error('Vaccination record creation error:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        logActivity(req.user.id, 'create', 'goat', goat_id, null, JSON.stringify(req.body), `Recorded vaccination for goat ID: ${goat_id}`);
        res.json({ message: 'Vaccination recorded', id: this.lastID });
      }
    );
  });
});

// Update vaccination record
app.put('/api/vaccinations/:id', verifyToken, (req, res) => {
  if (!['admin', 'manager'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Insufficient privileges' });
  }

  const recordId = req.params.id;
  const { vaccine_id, vaccination_date, next_due_date, veterinarian_name, batch_number, route, site, notes } = req.body;

  db.get('SELECT * FROM vaccination_records WHERE id = ?', [recordId], (err, oldRecord) => {
    if (err || !oldRecord) {
      return res.status(404).json({ error: 'Vaccination record not found' });
    }

    db.run(
      `UPDATE vaccination_records 
       SET vaccine_id = ?, vaccination_date = ?, next_due_date = ?, veterinarian_name = ?, batch_number = ?, route = ?, site = ?, notes = ?
       WHERE id = ?`,
      [vaccine_id, vaccination_date, next_due_date || null, veterinarian_name || null, batch_number || null, route || null, site || null, notes || null, recordId],
      (err) => {
        if (err) {
          console.error('Vaccination record update error:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        logActivity(req.user.id, 'update', 'goat', oldRecord.goat_id, JSON.stringify(oldRecord), JSON.stringify(req.body), `Updated vaccination record: ${recordId}`);
        res.json({ message: 'Vaccination record updated' });
      }
    );
  });
});

// Delete vaccination record
app.delete('/api/vaccinations/:id', verifyToken, (req, res) => {
  if (!['admin', 'manager'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Insufficient privileges' });
  }

  const recordId = req.params.id;

  db.get('SELECT * FROM vaccination_records WHERE id = ?', [recordId], (err, record) => {
    if (err || !record) {
      return res.status(404).json({ error: 'Vaccination record not found' });
    }

    db.run('DELETE FROM vaccination_records WHERE id = ?', [recordId], (err) => {
      if (err) {
        console.error('Vaccination record deletion error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      logActivity(req.user.id, 'delete', 'goat', record.goat_id, JSON.stringify(record), null, `Deleted vaccination record: ${recordId}`);
      res.json({ message: 'Vaccination record deleted' });
    });
  });
});

// Get complete family tree
app.get('/api/family-tree', verifyToken, (req, res) => {
  db.all(
    `SELECT g.id, g.tag_number, g.gender, g.breed, g.date_of_birth,
            p.id as parent_id, p.tag_number as parent_tag,
            gp.relationship_type FROM goats g
     LEFT JOIN goat_pedigree gp ON g.id = gp.goat_id
     LEFT JOIN goats p ON gp.parent_goat_id = p.id
     ORDER BY g.tag_number`,
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      // Structure the data
      const familyTree = {};
      rows.forEach(row => {
        if (!familyTree[row.id]) {
          familyTree[row.id] = {
            id: row.id,
            name: row.name,
            tag_number: row.tag_number,
            gender: row.gender,
            breed: row.breed,
            date_of_birth: row.date_of_birth,
            parents: []
          };
        }
        if (row.parent_id) {
          familyTree[row.id].parents.push({
            id: row.parent_id,
            name: row.parent_name,
            tag_number: row.parent_tag,
            relationship_type: row.relationship_type
          });
        }
      });

      res.json({ familyTree: Object.values(familyTree) });
    }
  );
});

// Get goat genealogy (full family tree with all generations)
app.get('/api/family-tree/:id/genealogy', verifyToken, (req, res) => {
  const goatId = req.params.id;

  // Recursive function to get all ancestors
  const getAllAncestors = (id, visited = new Set(), callback) => {
    if (visited.has(id)) {
      return callback(null, []);
    }
    visited.add(id);

    db.all(
      `SELECT gp.id, gp.tag_number, gp.gender, gp.breed, gp.date_of_birth, g.relationship_type
       FROM goat_pedigree g
       JOIN goats gp ON g.parent_goat_id = gp.id
       WHERE g.goat_id = ?`,
      [id],
      (err, parents) => {
        if (err) {
          return callback(err, null);
        }

        if (parents.length === 0) {
          return callback(null, []);
        }

        let allAncestors = [...parents];
        let completed = 0;

        if (parents.length === 0) {
          return callback(null, allAncestors);
        }

        parents.forEach(parent => {
          getAllAncestors(parent.id, visited, (err, grandParents) => {
            if (err) {
              return callback(err, null);
            }
            allAncestors = allAncestors.concat(grandParents);
            completed++;
            if (completed === parents.length) {
              callback(null, allAncestors);
            }
          });
        });
      }
    );
  };

  // Recursive function to get all descendants
  const getAllDescendants = (id, visited = new Set(), callback) => {
    if (visited.has(id)) {
      return callback(null, []);
    }
    visited.add(id);

    db.all(
      `SELECT gc.id, gc.tag_number, gc.gender, gc.breed, gc.date_of_birth
       FROM goat_pedigree g
       JOIN goats gc ON g.goat_id = gc.id
       WHERE g.parent_goat_id = ?`,
      [id],
      (err, children) => {
        if (err) {
          return callback(err, null);
        }

        if (children.length === 0) {
          return callback(null, []);
        }

        let allDescendants = [...children];
        let completed = 0;

        children.forEach(child => {
          getAllDescendants(child.id, visited, (err, grandChildren) => {
            if (err) {
              return callback(err, null);
            }
            allDescendants = allDescendants.concat(grandChildren);
            completed++;
            if (completed === children.length) {
              callback(null, allDescendants);
            }
          });
        });

        if (children.length === 0) {
          callback(null, allDescendants);
        }
      }
    );
  };

  // Get the goat's own information
  db.get('SELECT id, tag_number, gender, breed, date_of_birth FROM goats WHERE id = ?', [goatId], (err, goat) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!goat) {
      return res.status(404).json({ error: 'Goat not found' });
    }

    getAllAncestors(goatId, new Set(), (err, ancestors) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      getAllDescendants(goatId, new Set(), (err, descendants) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        // Remove duplicates
        const uniqueAncestors = ancestors.filter((ancestor, index, self) =>
          index === self.findIndex(a => a.id === ancestor.id)
        );

        const uniqueDescendants = descendants.filter((descendant, index, self) =>
          index === self.findIndex(d => d.id === descendant.id)
        );

        // Fetch direct parents (sire/dam) so they can be prioritized in the ancestors list
        db.all(
          `SELECT gp.id, gp.tag_number, gp.gender, gp.breed, gp.date_of_birth, g.relationship_type
           FROM goat_pedigree g
           JOIN goats gp ON g.parent_goat_id = gp.id
           WHERE g.goat_id = ?`,
          [goatId],
          (err, directParents) => {
            if (err) {
              return res.status(500).json({ error: 'Database error' });
            }

            const uniqueDirectParents = (directParents || []).filter((p, i, s) => i === s.findIndex(x => x.id === p.id));

            // Order ancestors so direct parents appear first
            const orderedAncestors = [
              ...uniqueDirectParents,
              ...uniqueAncestors.filter(a => !uniqueDirectParents.some(p => p.id === a.id))
            ];

            // Fetch direct children (immediate offspring) — these should be shown as "Offspring"
            db.all(
              `SELECT gc.id, gc.tag_number, gc.gender, gc.breed, gc.date_of_birth, g.relationship_type
               FROM goat_pedigree g
               JOIN goats gc ON g.goat_id = gc.id
               WHERE g.parent_goat_id = ?`,
              [goatId],
              (err, directChildren) => {
                if (err) {
                  return res.status(500).json({ error: 'Database error' });
                }

                const uniqueDirectChildren = (directChildren || []).filter((c, i, s) => i === s.findIndex(x => x.id === c.id));

                // For compatibility: keep a full descendants list (all generations) under `allDescendants`,
                // but return only direct children in `descendants` so the frontend shows immediate offspring only.
                // Also include `directParents` so frontend can reliably pick immediate parents (sire/dam).
                res.json({
                  goat: goat,
                  ancestors: orderedAncestors,
                  directParents: uniqueDirectParents,
                  descendants: uniqueDirectChildren,
                  allDescendants: uniqueDescendants,
                  ancestorsByGeneration: {},
                  descendantsByGeneration: {},
                  totalAncestors: uniqueAncestors.length,
                  totalDescendants: uniqueDescendants.length
                });
              }
            );
          }
        );
      });
    });
  });
});

// ==================== ACTIVITY LOG ====================

// Get activity log
app.get('/api/activity-log', verifyToken, verifyAdmin, (req, res) => {
  const limit = req.query.limit || 100;
  const offset = req.query.offset || 0;

  db.all(
    `SELECT al.id, al.user_id, u.name as user_name, al.action, al.entity_type, al.entity_id, 
            al.description, al.timestamp FROM activity_log al
     LEFT JOIN users u ON al.user_id = u.id
     ORDER BY al.timestamp DESC LIMIT ? OFFSET ?`,
    [limit, offset],
    (err, logs) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ logs });
    }
  );
});

// Get activity log for specific entity
app.get('/api/activity-log/:entityType/:entityId', verifyToken, (req, res) => {
  const { entityType, entityId } = req.params;

  db.all(
    `SELECT al.id, al.user_id, u.name as user_name, al.action, al.entity_type, al.entity_id, 
            al.description, al.timestamp FROM activity_log al
     LEFT JOIN users u ON al.user_id = u.id
     WHERE al.entity_type = ? AND al.entity_id = ?
     ORDER BY al.timestamp DESC`,
    [entityType, entityId],
    (err, logs) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ logs });
    }
  );
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// ==================== ACTIVITY LOG (ADMIN ONLY) ====================

// Get activity logs with optional filtering
app.get('/api/activity-log', verifyToken, verifyAdmin, (req, res) => {
  const { startDate, endDate, action, entityType, page = 1, limit = 50 } = req.query;
  
  let query = `
    SELECT 
      al.id, al.user_id, al.action, al.entity_type, al.entity_id, 
      al.old_value, al.new_value, al.description, al.timestamp,
      u.name as user_name, u.email as user_email
    FROM activity_log al
    LEFT JOIN users u ON al.user_id = u.id
    WHERE 1=1
  `;
  
  const params = [];
  
  if (startDate) {
    query += ' AND DATE(al.timestamp) >= ?';
    params.push(startDate);
  }
  
  if (endDate) {
    query += ' AND DATE(al.timestamp) <= ?';
    params.push(endDate);
  }
  
  if (action) {
    query += ' AND al.action = ?';
    params.push(action);
  }
  
  if (entityType) {
    query += ' AND al.entity_type = ?';
    params.push(entityType);
  }
  
  query += ' ORDER BY al.timestamp DESC';
  
  const offset = (parseInt(page) - 1) * parseInt(limit);
  query += ' LIMIT ? OFFSET ?';
  params.push(parseInt(limit), offset);
  
  db.all(query, params, (err, logs) => {
    if (err) {
      console.error('Activity log fetch error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) as count FROM activity_log al WHERE 1=1';
    const countParams = [];
    
    if (startDate) {
      countQuery += ' AND DATE(al.timestamp) >= ?';
      countParams.push(startDate);
    }
    if (endDate) {
      countQuery += ' AND DATE(al.timestamp) <= ?';
      countParams.push(endDate);
    }
    if (action) {
      countQuery += ' AND al.action = ?';
      countParams.push(action);
    }
    if (entityType) {
      countQuery += ' AND al.entity_type = ?';
      countParams.push(entityType);
    }
    
    db.get(countQuery, countParams, (err, result) => {
      if (err) {
        console.error('Count error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      res.json({
        logs,
        pagination: {
          total: result.count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(result.count / parseInt(limit))
        }
      });
    });
  });
});

// Get activity log summary/statistics
app.get('/api/activity-log/stats/summary', verifyToken, verifyAdmin, (req, res) => {
  db.all(`
    SELECT 
      action, 
      entity_type, 
      COUNT(*) as count
    FROM activity_log
    GROUP BY action, entity_type
  `, [], (err, stats) => {
    if (err) {
      console.error('Stats fetch error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ stats });
  });
});

// Get activity log for specific date range (for PDF export)
app.get('/api/activity-log/export', verifyToken, verifyAdmin, (req, res) => {
  const { startDate, endDate, action, entityType } = req.query;
  
  let query = `
    SELECT 
      al.id, al.user_id, al.action, al.entity_type, al.entity_id, 
      al.old_value, al.new_value, al.description, al.timestamp,
      u.name as user_name, u.email as user_email
    FROM activity_log al
    LEFT JOIN users u ON al.user_id = u.id
    WHERE 1=1
  `;
  
  const params = [];
  
  if (startDate) {
    query += ' AND DATE(al.timestamp) >= ?';
    params.push(startDate);
  }
  
  if (endDate) {
    query += ' AND DATE(al.timestamp) <= ?';
    params.push(endDate);
  }
  
  if (action) {
    query += ' AND al.action = ?';
    params.push(action);
  }
  
  if (entityType) {
    query += ' AND al.entity_type = ?';
    params.push(entityType);
  }
  
  query += ' ORDER BY al.timestamp DESC';
  
  db.all(query, params, (err, logs) => {
    if (err) {
      console.error('Export fetch error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ logs, exportDate: new Date().toISOString() });
  });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Listening on 0.0.0.0:${PORT}`);
}).on('error', (err) => {
  console.error('[ERROR EVENT] Listen error:', err);
  console.error('[ERROR EVENT] Stack:', err.stack);
  console.log('[ERROR EVENT] Calling process.exit(1)...');
  process.exit(1);
}).on('listening', () => {
  console.log('[LISTENING EVENT] Server is successfully listening');
}).on('close', () => {
  console.log('[CLOSE EVENT] Server closed');
});

process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT EXCEPTION]', err);
  console.error('[UNCAUGHT EXCEPTION] Stack:', err.stack);
  console.log('[UNCAUGHT EXCEPTION] Calling process.exit(1)...');
  process.exit(1);
});

