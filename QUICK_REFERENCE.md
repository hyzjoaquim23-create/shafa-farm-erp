# Quick Reference - User & Session Management

## 🚀 Quick Start (30 seconds)

### 1. Get Admin Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@shafafarm.com","password":"admin123"}'
```

Copy the `token` value from response.

### 2. Create User
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer PASTE_TOKEN_HERE" \
  -d '{
    "email":"jane@example.com",
    "password":"SecurePass123",
    "role":"manager",
    "name":"Jane Smith"
  }'
```

✅ **User Created!**

---

## 📚 API Endpoints Cheat Sheet

### Authentication
```
POST   /api/auth/login              → Get token
GET    /api/auth/me                 → Current user info
GET    /api/auth/sessions           → View active sessions
POST   /api/auth/logout             → Logout current session
POST   /api/auth/logout-all         → Logout all sessions
```

### User Management (Admin Only)
```
POST   /api/users                   → Create user
GET    /api/users                   → List all users
GET    /api/users/:id               → Get user details
PUT    /api/users/:id               → Update user
DELETE /api/users/:id               → Delete user
```

---

## 🔐 Required Headers

All protected endpoints need:
```
Authorization: Bearer eyJhbGc...
```

---

## ✅ Demo Accounts

| Email | Password | Role |
|-------|----------|------|
| admin@shafafarm.com | admin123 | admin |
| manager@shafafarm.com | manager123 | manager |
| owner@shafafarm.com | owner123 | owner |

---

## 📊 Field Validation

### Create User Fields

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| email | string | ✅ | Unique, valid format (user@domain.com) |
| password | string | ✅ | Min 1 char (use 8+ in practice) |
| role | string | ✅ | Must be: admin, manager, or owner |
| name | string | ✅ | User's full name |
| phone | string | ❌ | Optional phone number |

---

## 🔄 Request/Response Examples

### Login
```json
Request:
{"email":"admin@shafafarm.com","password":"admin123"}

Response:
{
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "admin@shafafarm.com",
    "role": "admin",
    "name": "Admin User"
  }
}
```

### Create User
```json
Request:
{
  "email": "john@example.com",
  "password": "password123",
  "role": "manager",
  "name": "John Doe",
  "phone": "+1234567890"
}

Response:
{
  "message": "User created successfully",
  "user": {
    "id": 7,
    "email": "john@example.com",
    "role": "manager",
    "name": "John Doe",
    "phone": "+1234567890"
  }
}
```

### Session List
```json
Response:
{
  "sessions": [
    {
      "id": 1,
      "ip_address": "192.168.0.100",
      "user_agent": "Mozilla/5.0...",
      "created_at": "2026-01-28 20:20:42",
      "last_activity": "2026-01-28 20:21:10",
      "expires_at": "2026-01-29T20:20:42.691Z"
    }
  ]
}
```

---

## ❌ Error Codes

| Code | Meaning | Fix |
|------|---------|-----|
| 400 | Bad request | Check field format/validation |
| 401 | Unauthorized | Invalid token or credentials |
| 403 | Forbidden | Need admin role or valid token |
| 500 | Server error | Check backend logs |

---

## 🔍 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Email already exists" | Use different email |
| "Invalid token" | Login again to get new token |
| "Admin access required" | Use admin account |
| "Database error: ..." | Check field format and required fields |
| No response | Ensure backend running on port 5000 |

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| backend/database.db | SQLite database |
| backend/server.js | API endpoints |
| backend/database.js | Database schema |
| .env | Configuration (JWT_SECRET, PORT) |

---

## 🧪 Quick Tests

### Test User Creation
```bash
# Login as admin
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@shafafarm.com","password":"admin123"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# Create user with token
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"email":"test@test.com","password":"pass","role":"manager","name":"Test"}'
```

### Check Active Sessions
```bash
curl -X GET http://localhost:5000/api/auth/sessions \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get All Users
```bash
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🔑 JWT Token Info

Tokens:
- ✅ Valid for: 24 hours
- ✅ Issued by: Backend at login
- ✅ Stored in: Sessions table
- ✅ Contains: User ID, email, role, name

---

## 💾 Database Location

```
Windows: c:\Users\hyz26\shafa farm\backend\database.db
```

To reset:
1. Stop backend server
2. Delete `database.db`
3. Restart backend (auto-creates tables)

---

## 🎯 Common Workflows

### Create Multiple Users (as Admin)
```bash
# Login once, get token, use same token for all creates
TOKEN="your_token_here"

# Create first user
curl -X POST http://localhost:5000/api/users \
  -H "Authorization: Bearer $TOKEN" ...

# Create second user  
curl -X POST http://localhost:5000/api/users \
  -H "Authorization: Bearer $TOKEN" ...

# And so on...
```

### View User's Active Sessions
```bash
# Login as user
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login ...)

# Check their sessions
curl -X GET http://localhost:5000/api/auth/sessions \
  -H "Authorization: Bearer $TOKEN"
```

### Logout Everywhere
```bash
curl -X POST http://localhost:5000/api/auth/logout-all \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔒 Security Best Practices

✅ DO:
- Use strong passwords (8+ chars, mixed case)
- Store tokens securely in frontend
- Refresh token before expiry
- Logout when done
- Use HTTPS in production

❌ DON'T:
- Share tokens in logs
- Hardcode tokens in code
- Send passwords over HTTP
- Reuse same token across apps
- Store plain passwords

---

## 📞 Support

For detailed info, see:
- `USER_AND_SESSION_MANAGEMENT.md` - Full API docs
- `ARCHITECTURE_DIAGRAM.md` - System design
- `TEST_USER_CREATION.md` - Testing guide
- `FINAL_STATUS_REPORT.md` - Complete status

---

**Version:** 1.0.0 | **Status:** ✅ Production Ready | **Last Updated:** 2026-01-28
