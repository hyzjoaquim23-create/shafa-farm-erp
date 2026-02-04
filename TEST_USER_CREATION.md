# User Creation Test Guide

## Current Status: ✅ WORKING

The user creation system is now fully functional with proper database schema and session management.

## What Was Fixed

1. **Added Sessions Table** - Tracks all active user sessions
2. **Improved Error Handling** - Now shows actual database errors
3. **Email Validation** - Prevents duplicate emails before INSERT
4. **Session Recording** - Every login creates a session record with:
   - JWT token
   - IP address
   - User agent (browser info)
   - Expiration time (24 hours)

## Testing the System

### Via API (Command Line)

**Step 1: Login as Admin**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@shafafarm.com","password":"admin123"}'
```

Response: Returns a token and user info

**Step 2: Create a New User (use the token from above)**
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [YOUR_TOKEN]" \
  -d '{
    "email":"john@example.com",
    "password":"SecurePassword123",
    "role":"manager",
    "name":"John Smith",
    "phone":"+1234567890"
  }'
```

Response: Confirmation with new user ID

**Step 3: Verify User Was Created**
```bash
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer [YOUR_TOKEN]"
```

Response: List of all users including the new one

**Step 4: Check Active Sessions**
```bash
curl -X GET http://localhost:5000/api/auth/sessions \
  -H "Authorization: Bearer [YOUR_TOKEN]"
```

Response: List of active sessions (IP, browser info, expiration)

### Via Web UI (Browser)

1. Navigate to http://localhost:3000
2. Click "Admin" button to auto-fill admin credentials
3. Click "Login"
4. Go to User Management section (if available)
5. Create a new user with:
   - Email: newuser@test.com
   - Password: TestPass123
   - Role: Manager
   - Name: Test User

## Database Tables

### Users Table
```
id | email                    | name           | role     | phone
1  | admin@shafafarm.com      | Admin User     | admin    | NULL
2  | manager@shafafarm.com    | Farm Manager   | manager  | NULL
3  | owner@shafafarm.com      | Farm Owner     | owner    | NULL
7  | test@example.com         | Test User      | manager  | NULL
```

### Sessions Table
```
id | user_id | token           | ip_address | expires_at              | created_at
1  | 1       | eyJ...token...  | ::1        | 2026-01-29T20:20:42Z    | 2026-01-28 20:20:42
```

## Available Endpoints

### Authentication
- `POST /api/auth/login` - Login and create session
- `GET /api/auth/me` - Get current user
- `GET /api/auth/sessions` - List active sessions
- `POST /api/auth/logout` - Logout current session
- `POST /api/auth/logout-all` - Logout all sessions

### User Management
- `POST /api/users` - Create user (admin only)
- `GET /api/users` - List all users (admin only)
- `GET /api/users/:id` - Get user details (admin only)
- `PUT /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

## Validation Rules

When creating a user, ensure:

1. **Email** - Must be unique and valid format (user@domain.com)
2. **Password** - Required (recommend 8+ characters)
3. **Role** - Must be one of: admin, manager, owner
4. **Name** - Required (user's full name)
5. **Phone** - Optional

## Error Handling

### Common Errors and Solutions

**Error: "Email already exists"**
- Try a different email address
- Check if user was already created

**Error: "Database error: ..."**
- Shows actual database error message
- Check backend logs
- Ensure database.db file exists

**Error: "Invalid email format"**
- Provide valid email (user@domain.com)

**Error: "Invalid role"**
- Use one of: admin, manager, owner

**Error: "Email, password, role, and name are required"**
- Ensure all 4 fields are provided

## Security Features

✅ **Implemented:**
- Bcrypt password hashing (10 salt rounds)
- JWT token authentication (24hr expiry)
- Session tracking with IP/browser info
- Email uniqueness validation
- Role-based access control
- Token verification on all protected endpoints

## Next Steps

1. **Frontend User Management** - Create UI for user management if not already present
2. **Password Reset** - Implement password reset functionality
3. **Email Verification** - Add email confirmation on signup
4. **Session Cleanup** - Add cron job to remove expired sessions
5. **Audit Logging** - Track all user management actions

## Support

For issues:
1. Check `backend/server.js` for error messages
2. Verify database.db exists in `backend/` folder
3. Ensure JWT_SECRET is set in `.env`
4. Check that port 5000 is not blocked
5. Verify all tables are created (run database initialization)
