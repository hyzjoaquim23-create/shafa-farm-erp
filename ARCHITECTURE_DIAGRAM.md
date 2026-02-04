# System Architecture - User & Session Management

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER CREATION FLOW                        │
└─────────────────────────────────────────────────────────────────┘

1. ADMIN LOGIN
   ┌──────────────────┐
   │ POST /auth/login │
   │ email + password │
   └────────┬─────────┘
            │
            ▼
   ┌────────────────────┐
   │  Validate password  │  <─── bcrypt comparison
   │  (bcrypt.compare)  │
   └────────┬───────────┘
            │
            ▼
   ┌────────────────────────┐
   │  Generate JWT token    │
   │  (24hr expiration)     │
   └────────┬───────────────┘
            │
            ▼
   ┌────────────────────────────┐
   │  Create session record     │
   │  - Store token            │
   │  - Record IP address      │
   │  - Record user agent      │
   │  - Set expiration         │
   └────────┬───────────────────┘
            │
            ▼
   ┌──────────────────────┐
   │  Return token to     │
   │  client (browser)    │
   └──────────────────────┘


2. CREATE NEW USER
   ┌───────────────────────────┐
   │  POST /api/users          │
   │  + Bearer token (header)  │
   └──────────┬────────────────┘
              │
              ▼
   ┌─────────────────────────┐
   │  Verify JWT token       │
   │  Check expiration       │
   │  Extract user info      │
   └──────────┬──────────────┘
              │
              ▼
   ┌─────────────────────┐
   │  Check admin role   │
   │  Authorization      │
   └──────────┬──────────┘
              │
              ▼
   ┌────────────────────────┐
   │  Validate input:       │
   │  - Email format        │
   │  - Required fields     │
   │  - Valid role          │
   └──────────┬─────────────┘
              │
              ▼
   ┌────────────────────────┐
   │  Check email exists    │
   │  SELECT from users     │
   └──────────┬─────────────┘
              │
         ┌────┴────┐
         │          │
    EXISTS      NOT EXISTS
         │          │
         ▼          ▼
    ❌ Error    ✅ Continue
              │
              ▼
   ┌────────────────────────┐
   │  Hash password         │
   │  bcrypt.hash(10 salt)  │
   └──────────┬─────────────┘
              │
              ▼
   ┌────────────────────────┐
   │  Insert user record    │
   │  INSERT INTO users     │
   └──────────┬─────────────┘
              │
              ▼
   ┌────────────────────────┐
   │  Log activity          │
   │  INSERT INTO activity_ │
   │  log (create action)   │
   └──────────┬─────────────┘
              │
              ▼
   ┌────────────────────────┐
   │  Return success with   │
   │  new user ID           │
   └────────────────────────┘
```

## Database Schema Diagram

```
┌─────────────────────────────────────┐
│            USERS TABLE              │
├─────────────────────────────────────┤
│ id (INT, PRIMARY KEY)               │
│ email (TEXT, UNIQUE)                │
│ password (TEXT, hashed)             │
│ role (TEXT: admin|manager|owner)    │
│ name (TEXT)                         │
│ phone (TEXT, optional)              │
│ created_at (DATETIME)               │
│ updated_at (DATETIME)               │
└──────────────┬──────────────────────┘
               │
               │ 1:Many
               │
               ▼
┌─────────────────────────────────────┐
│          SESSIONS TABLE             │
├─────────────────────────────────────┤
│ id (INT, PRIMARY KEY)               │
│ user_id (INT, FOREIGN KEY) ─────────┼─► References users.id
│ token (TEXT, UNIQUE)                │
│ ip_address (TEXT)                   │
│ user_agent (TEXT)                   │
│ expires_at (DATETIME)               │
│ created_at (DATETIME)               │
│ last_activity (DATETIME)            │
└─────────────────────────────────────┘

               │
               │ 1:Many
               │
               ▼
┌─────────────────────────────────────┐
│       ACTIVITY_LOG TABLE            │
├─────────────────────────────────────┤
│ id (INT, PRIMARY KEY)               │
│ user_id (INT, FOREIGN KEY) ─────────┼─► References users.id
│ action (TEXT: create|update|delete) │
│ entity_type (TEXT: user|goat)       │
│ entity_id (INT)                     │
│ old_value (TEXT, optional)          │
│ new_value (TEXT, optional)          │
│ description (TEXT, optional)        │
│ timestamp (DATETIME)                │
└─────────────────────────────────────┘
```

## Security Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                   SECURITY LAYERS                            │
└──────────────────────────────────────────────────────────────┘

Layer 1: PASSWORD STORAGE
├─ Input: Plain text password "SecurePass123"
├─ Process: bcrypt hash (salt rounds: 10)
└─ Storage: Hash in database (never plain text)

Layer 2: AUTHENTICATION
├─ Login: Verify password with bcrypt.compareSync()
├─ Token: Generate JWT with user info
├─ Expiry: 24 hours from creation
└─ Secret: Environment variable (JWT_SECRET)

Layer 3: SESSION TRACKING
├─ Creation: Store token in sessions table
├─ IP Address: Recorded for location awareness
├─ User Agent: Recorded for device tracking
├─ Expiration: Checked on token validation
└─ Cleanup: Can logout to delete session

Layer 4: AUTHORIZATION
├─ Token Verification: Check JWT validity
├─ Role Check: Verify admin role for protected endpoints
├─ Expiration Check: Reject expired tokens
└─ Database: Verify session still active

Layer 5: INPUT VALIDATION
├─ Email: Format validation (user@domain.com)
├─ Required Fields: Check all mandatory fields provided
├─ Password: Bcrypt hash before storing
├─ Role: Enum validation (admin|manager|owner)
└─ Uniqueness: Email must be unique
```

## Request/Response Flow with Sessions

```
CLIENT REQUEST                    SERVER PROCESSING              DATABASE
─────────────────────────────────────────────────────────────────────────

1. LOGIN FLOW
┌──────────────────┐
│ POST /auth/login │
│ {email, password}│
└────────┬─────────┘
         │
         ├──────────────► Find user by email ────► Query users table
         │                                         │
         │                ◄───────────────────────┘
         │                │
         │                ├──────► Compare password with stored hash
         │                │
         ├──────────────► Generate JWT token
         │
         ├──────────────► Create session ────────► INSERT into sessions
         │                                        │ - token
         │                                        │ - user_id
         │                                        │ - ip_address
         │                                        │ - expires_at
         │                                        │
         │                ◄───────────────────────┘
         │
◄────────┴──────────────► Return {token, user}

JWT Token Structure:
┌─────────────────────────────────────────┐
│ Header: {alg: "HS256", type: "JWT"}    │
│ Payload: {                              │
│   id: 1,                                │
│   email: "admin@...",                   │
│   role: "admin",                        │
│   name: "Admin User",                   │
│   iat: 1769631642,                      │
│   exp: 1769718042                       │
│ }                                       │
│ Signature: HMACSHA256(...)              │
└─────────────────────────────────────────┘


2. PROTECTED REQUEST FLOW (Create User)
┌────────────────────┐
│ POST /api/users    │
│ + Authorization:   │
│   Bearer {token}   │
└────────┬───────────┘
         │
         ├──────────────► Verify JWT token
         │                ├─ Check signature
         │                ├─ Check expiration
         │                └─ Extract claims (id, role)
         │
         ├──────────────► Check admin role
         │                (role === 'admin')
         │
         ├──────────────► Validate inputs
         │                ├─ Email format
         │                ├─ Required fields
         │                └─ Valid role
         │
         ├──────────────► Check email not exists ──► Query users table
         │                                          WHERE email = ?
         │
         ├──────────────► Hash password
         │                bcrypt.hash(password, 10)
         │
         ├──────────────► Insert user ────────────► INSERT into users
         │                                          │
         │                                          └─ Return user.id
         │
         ├──────────────► Log activity ──────────► INSERT into activity_log
         │                                         {
         │                                           user_id: 1 (admin),
         │                                           action: 'create',
         │                                           entity_type: 'user',
         │                                           entity_id: 7
         │                                         }
         │
◄────────┴──────────────► Return {message, user}
```

## Error Handling Flow

```
USER CREATION ERROR PATHS
─────────────────────────────────────────────────

Request received
    │
    ├─► Missing token?
    │   └─► 403: No token provided
    │
    ├─► Invalid token?
    │   └─► 401: Invalid token
    │
    ├─► Not admin?
    │   └─► 403: Admin access required
    │
    ├─► Missing fields?
    │   └─► 400: Fields required
    │
    ├─► Invalid email format?
    │   └─► 400: Invalid email format
    │
    ├─► Email already exists?
    │   └─► 400: Email already exists
    │
    ├─► Database error?
    │   └─► 500: Database error: {error message}
    │       └─ Also logged to console for debugging
    │
    └─► Success?
        └─► 201: User created successfully
            {message, user}
```

## Session Lifecycle

```
TIMELINE: Session Expiration
──────────────────────────────────────────────

Login at:    2026-01-28 20:20:42
             │
             ├─ Token issued
             ├─ Session created
             └─ expires_at set to 24h later
                │
                ├─ 2026-01-28 20:20:43 - Session is ACTIVE
                ├─ 2026-01-28 23:00:00 - Session is ACTIVE
                ├─ 2026-01-29 12:00:00 - Session is ACTIVE
                │
Expires at: 2026-01-29 20:20:42
             │
             ├─ Token is INVALID (expired)
             ├─ Session cannot be used
             └─ User must login again
                │
             OR Logout earlier
                │
                ├─ DELETE FROM sessions WHERE token = ?
                ├─ Session is DELETED
                └─ Token is immediately invalid
```

## Concurrent User Scenario

```
SCENARIO: Multiple Users Creating Accounts
────────────────────────────────────────────────

User A (Admin)              User B (Manager)        User C (User)
└─ Login                    └─ Can't create users   └─ Can't create users
   └─ Get token                                       
      └─ POST /api/users    
         ├─ Email check ◄─────────────────┐
         │  (john@...)                    │ 
         │                           Tries to create
         ├─ Insert user             john@... too!
         │  ID: 7                    │
         │                           ├─ No token
         ├─ Create session          │  └─ 403 Error
         │  (User A logged in)      │
         │                      ◄───┘ EMAIL CHECK
         └─ Success                 │
                                    ├─ User B query finds
                                    │  john@... from User A
                                    │
                                    ├─ Returns error:
                                    │  "Email already exists"
                                    │
                                    └─ 400 Error

Result: Race condition avoided!
        Only one john@... account created
```

---

This architecture ensures:
✅ Secure password storage
✅ Proper authentication & authorization
✅ Session tracking for security
✅ Audit logging of actions
✅ Error handling with detailed messages
✅ Protection against race conditions
✅ Production-ready security
