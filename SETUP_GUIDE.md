# 📚 Setup & Installation Guide

Complete guide for setting up and running the Shafa Farm ERP System locally.

---

## 📋 Prerequisites

- **Node.js**: v14 or higher ([download](https://nodejs.org/))
- **npm**: Comes with Node.js
- **Git**: For cloning the repository ([download](https://git-scm.com/))
- **SQLite3**: Database engine (included with Node.js SQLite packages)

---

## 🔧 Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/hyzjoaquim23-create/shafa-farm-erp.git
cd "shafa farm -"
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
npm install
```

**Key Backend Files:**
- `server.js` - Main Express application
- `database.js` - SQLite database initialization
- `package.json` - Dependencies (express, jwt, bcrypt, sqlite3)

### 3. Frontend Setup

In a new terminal, navigate to the frontend directory:

```bash
cd frontend
npm install
```

**Key Frontend Files:**
- `src/App.jsx` - Main React component
- `src/api.js` - API client for backend communication
- `src/pages/` - Page components (Dashboard, GoatManagement, Reports, etc.)
- `src/components/` - Reusable components (Navigation, Footer)

### 4. Start Both Services

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
✅ Backend running on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
✅ Frontend running on `http://localhost:3000`

---

## 🚀 Running the Application

### Quick Start (Default Test Account)

1. Open `http://localhost:3000` in your browser
2. Login with:
   - **Email**: `admin@shafafarm.com`
   - **Password**: `admin123`
3. Navigate the application using the main menu

### Dashboard Features

Once logged in, access:

- **📊 Dashboard**: System overview and statistics
- **🐐 Goat Management**: Add, edit, delete goats
- **🐔 Chicken Management**: Add, edit, delete chickens
- **👨‍👩‍👧‍👦 Family Tree**: View breeding genealogy
- **📈 Inventory**: Real-time statistics and reports
- **📋 Activity Log**: Track all system changes
- **👥 User Management** (Admin Only): Create/manage users

---

## 🗄️ Database Setup

The system uses **SQLite** for data storage. Database initialization is automatic on first backend startup.

**Database Location**: `backend/farm.db`

### Database Schema

The database includes tables for:
- Users (authentication)
- Goats (inventory + status + breeding info)
- Chickens (inventory + status)
- Family Trees (genealogy records)
- Activity Logs (audit trail)

### Seeding Demo Data

To populate with sample data, run:

```bash
cd backend
node seed-demo-data.js
```

---

## 🔐 Authentication Details

### JWT Tokens

- Tokens expire after 24 hours
- Token stored in browser localStorage
- Automatic logout on expiration
- Password hashing with bcrypt

### User Roles & Permissions

| Feature | Admin | Manager | Owner |
|---------|-------|---------|-------|
| Manage Users | ✅ | ❌ | ❌ |
| Add/Edit Animals | ✅ | ✅ | ✅ |
| Delete Animals | ✅ | ✅ | ❌ |
| View Reports | ✅ | ✅ | ✅ |
| View Activity Log | ✅ | ✅ | ❌ |
| Reactivate Deactivated Animals | ✅ | ✅ | ❌ |

---

## 📝 Creating New Users

1. Login as **Admin**
2. Navigate to **User Management**
3. Click **Add New User**
4. Fill in:
   - First Name
   - Last Name
   - Email
   - Password
   - Role (Admin, Manager, or Owner)
5. Click **Create User**

**Default Admin Email**: `admin@shafafarm.com`

---

## 🐐 Goat Management Features

### Adding a Goat

1. Go to **Goat Management**
2. Click **Add New Goat**
3. Fill in required fields:
   - Name
   - Date of Birth (or Age)
   - Breed
   - Gender
4. Optional:
   - Parents (for genealogy tracking)
   - Health Status
   - Breeding Status
5. Click **Save**

### Status Management

- **Health Status**: Healthy, Sick, Injured, Pregnant
- **Breeding Status**: Breeding, Non-Breeding, Retired
- **Availability**: Active, Sold, Dead

### Genealogy Tracking

- Assign parents when creating goats
- Automatic family tree generation
- Multi-generational lineage support

---

## 📊 Reports & Inventory

### Dashboard Statistics

Real-time calculations showing:
- Total goat and chicken count
- Age group breakdown (Kids, Yearlings, Adults)
- Health status distribution
- Breeding status overview
- Revenue from sold animals
- Deaths and reasons

### Generating Reports

1. Go to **Inventory** or **Reports**
2. Select filters:
   - Date range
   - Animal type
   - Status
3. Click **Generate Report**
4. Export as PDF

---

## 🐛 Troubleshooting

### Issue: Backend won't start

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### Issue: Frontend can't connect to backend

**Check**:
- Backend running on `http://localhost:5000`
- CORS headers properly configured
- No firewall blocking localhost traffic

### Issue: Login fails

**Solutions**:
- Clear browser cache and localStorage
- Restart both backend and frontend
- Verify default user exists: `admin@shafafarm.com`

### Issue: Database corrupted

**Reset**:
```bash
cd backend
rm farm.db
npm start  # Will recreate empty database
node seed-demo-data.js  # Repopulate
```

---

## 🏗️ Building for Production

### Frontend Production Build

```bash
cd frontend
npm run build
```

Output: `frontend/build/` directory (ready for deployment)

### Environment Configuration

Create `.env` file in backend directory:

```
NODE_ENV=production
PORT=5000
JWT_SECRET=your-secret-key-here
DATABASE_PATH=./farm.db
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoint

**POST** `/auth/login`
```json
{
  "email": "admin@shafafarm.com",
  "password": "admin123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@shafafarm.com",
    "role": "Admin"
  }
}
```

### Protected Endpoints

All endpoints (except login/signup) require JWT token in header:

```
Authorization: Bearer <token>
```

---

## 🔗 Useful Links

- **GitHub Repository**: https://github.com/hyzjoaquim23-create/shafa-farm-erp
- **Main Documentation**: README.md
- **Quick Reference**: QUICK_REFERENCE_CARD.md

---

## 💡 Tips & Best Practices

1. **Regular Backups**: Export data periodically
2. **User Management**: Create role-specific accounts for better tracking
3. **Activity Logs**: Review regularly for audit purposes
4. **Genealogy**: Maintain accurate parent records for breeding insights
5. **Reports**: Generate monthly summaries for decision making

---

## 🆘 Need Help?

- Check the troubleshooting section above
- Review the browser console for errors (F12)
- Verify backend logs in the terminal
- Ensure all prerequisites are installed

