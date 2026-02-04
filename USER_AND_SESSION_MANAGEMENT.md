# User and Session Management System

## Overview

The Shafa Farm ERP system includes a comprehensive user and session management system with proper database structure, authentication, and session tracking.

## Database Schema

### Users Table
Stores user account information with role-based access control.

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('admin', 'manager', 'owner')),
  name TEXT NOT NULL,
  phone TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

**Fields:**
- `id`: Unique user identifier
- `email`: User's email (must be unique)
- `password`: Bcrypt-hashed password (10 salt rounds)
- `role`: One of three roles:
  - `admin`: Full system access, can manage users
  - `manager`: Farm operations management
  - `owner`: Farm overview and reporting
- `name`: User's full name
- `phone`: Optional phone number
- `created_at`: Account creation timestamp
- `updated_at`: Last profile update timestamp

### Sessions Table
Tracks active user sessions for security and session management.

```sql
CREATE TABLE sessions (
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
```

**Fields:**
- `id`: Session identifier
- `user_id`: Reference to users table
- `token`: JWT token for this session
- `ip_address`: IP address where session was created
- `user_agent`: Browser/client information
- `expires_at`: Session expiration time (24 hours from login)
- `created_at`: Session creation timestamp
- `last_activity`: Last time session was used

## Default Users

Three demo accounts are automatically seeded on first run:

| Email | Password | Role | Name |
|-------|----------|------|------|
| admin@shafafarm.com | admin123 | admin | Admin User |
| manager@shafafarm.com | manager123 | manager | Farm Manager |
| owner@shafafarm.com | owner123 | owner | Farm Owner |

## Authentication Endpoints

### Login
**POST** `/api/auth/login`

Create a new session and obtain a JWT token.

**Request:**
```json
{
  "email": "admin@shafafarm.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@shafafarm.com",
    "role": "admin",
    "name": "Admin User"
  }
}
```

**Features:**
- Validates email and password
- Creates session record in database
- Records IP address and user agent
- Returns JWT token valid for 24 hours

### Get Current User
**GET** `/api/auth/me`

Retrieve the authenticated user's information.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "admin@shafafarm.com",
    "role": "admin",
    "name": "Admin User",
    "iat": 1769631642,
    "exp": 1769718042
  }
}
```

### Get Active Sessions
**GET** `/api/auth/sessions`

List all active sessions for the current user.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "sessions": [
    {
      "id": 1,
      "ip_address": "::1",
      "user_agent": "Mozilla/5.0...",
      "created_at": "2026-01-28 20:20:42",
      "last_activity": "2026-01-28 20:20:42",
      "expires_at": "2026-01-29T20:20:42.691Z"
    }
  ]
}
```

### Logout (Single Session)
**POST** `/api/auth/logout`

Logout the current session and delete it from the database.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

### Logout All Sessions
**POST** `/api/auth/logout-all`

Logout all active sessions for the current user.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "message": "All sessions logged out successfully"
}
```

## User Management Endpoints

### Create User (Admin Only)
**POST** `/api/users`

Create a new user account.

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Request:**
```json
{
  "email": "newuser@example.com",
  "password": "securePassword123",
  "role": "manager",
  "name": "John Doe",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 4,
    "email": "newuser@example.com",
    "role": "manager",
    "name": "John Doe",
    "phone": "+1234567890"
  }
}
```

**Validation:**
- Email must be unique
- Email format validation
- Password required (6+ characters recommended)
- Role must be one of: admin, manager, owner
- Name required
- Phone optional

**Error Responses:**
- `400` - Email already exists
- `400` - Invalid email format
- `400` - Missing required fields
- `403` - User not authenticated or not admin
- `500` - Database error

### Get All Users (Admin Only)
**GET** `/api/users`

List all users in the system.

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "users": [
    {
      "id": 1,
      "email": "admin@shafafarm.com",
      "role": "admin",
      "name": "Admin User",
      "phone": null,
      "created_at": "2026-01-28 20:19:58",
      "updated_at": "2026-01-28 20:19:58"
    },
    ...
  ]
}
```

### Get Single User (Admin Only)
**GET** `/api/users/:id`

Get details of a specific user.

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "admin@shafafarm.com",
    "role": "admin",
    "name": "Admin User",
    "phone": null,
    "created_at": "2026-01-28 20:19:58",
    "updated_at": "2026-01-28 20:19:58"
  }
}
```

### Update User (Admin Only)
**PUT** `/api/users/:id`

Update user information.

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Request:**
```json
{
  "email": "newemail@example.com",
  "name": "Updated Name",
  "role": "owner",
  "phone": "+9876543210",
  "password": "newPassword123"
}
```

**Response:**
```json
{
  "message": "User updated successfully",
  "user": {
    "id": 2,
    "email": "newemail@example.com",
    "role": "owner",
    "name": "Updated Name",
    "phone": "+9876543210"
  }
}
```

### Delete User (Admin Only)
**DELETE** `/api/users/:id`

Delete a user account and all associated sessions.

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

**Notes:**
- Deletes user and all associated sessions
- Logs deletion activity
- Cannot delete yourself

## Security Features

### Password Security
- Passwords are hashed using bcryptjs with 10 salt rounds
- Original passwords are never stored
- Passwords are validated during login using bcrypt comparison

### Token Management
- JWT tokens include user ID, email, role, and name
- Tokens expire after 24 hours
- Sessions are tracked in the database for additional security
- IP address and user agent are recorded for session verification

### Access Control
- Admin-only endpoints require `admin` role
- Token verification middleware checks JWT validity
- All protected routes require valid token

### Session Cleanup
- Sessions include expiration timestamps
- Expired sessions can be identified and cleaned up
- Logout removes session from database immediately
- Logout-all removes all user sessions for security

## Error Handling

### Database Errors
All database operations include proper error handling:
- Email uniqueness violations
- Database connection errors
- Detailed error messages in development

### Authentication Errors
- `400` - Missing email or password
- `401` - Invalid credentials
- `403` - No token provided / insufficient permissions
- `500` - Server error

## Best Practices

1. **Always send tokens in Authorization header:**
   ```
   Authorization: Bearer {token}
   ```

2. **Use strong passwords:**
   - Minimum 8 characters
   - Mix of uppercase, lowercase, numbers, and symbols

3. **Handle token expiration:**
   - Tokens expire after 24 hours
   - Implement token refresh or re-login flow in frontend

4. **Monitor sessions:**
   - Use `/api/auth/sessions` to check active sessions
   - Use logout-all for security compromises

5. **Change passwords regularly:**
   - Encourage users to update passwords
   - Use `/api/users/:id` update endpoint

## Testing

### Login Test
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@shafafarm.com","password":"admin123"}'
```

### Create User Test
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "email":"newuser@example.com",
    "password":"password123",
    "role":"manager",
    "name":"New User"
  }'
```

### Get Sessions Test
```bash
curl -X GET http://localhost:5000/api/auth/sessions \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Database Location

The SQLite database is stored at:
```
c:\Users\hyz26\shafa farm\backend\database.db
```

To reset the database, delete `database.db` and restart the server.

## Environment Variables

The system uses `.env` file for configuration:
```
PORT=5000
JWT_SECRET=your_jwt_secret_key
```

Make sure to set a strong `JWT_SECRET` in production.
