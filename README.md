# 🐐 Shafa Farm ERP System

A comprehensive agricultural management system for goat and chicken farming with user management, inventory tracking, family tree genealogy, activity logging, and role-based access control.

## 📋 Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Default Accounts](#default-accounts)
- [System Capabilities](#system-capabilities)
- [Tech Stack](#tech-stack)
- [Running the System](#running-the-system)

---

## ✨ Features

### 🔐 **Authentication & Authorization**
- JWT-based user authentication
- Role-based access control (Admin, Manager, Owner)
- Secure password management
- Protected routes and endpoints

### 👥 **User Management** (Admin Only)
- Create, edit, and delete users
- Assign user roles and permissions
- Activity tracking for all user changes
- View all system users

### 🐐 **Goat Management**
- Complete CRUD operations for goat records
- Health status tracking (Healthy, Sick, Injured, Pregnant)
- Breeding status management (Breeding, Non-Breeding, Retired)
- Mark goats as sold or dead with date tracking
- Add parent relationships for genealogy tracking

### 🐔 **Chicken Management**
- Similar management system for chicken inventory
- Status and health tracking

### 👨‍👩‍👧‍👦 **Family Tree & Genealogy**
- Multi-generation pedigree tracking
- Parent-child relationship management
- Genetic lineage visualization
- Breeding history records

### 📊 **Inventory & Reports**
- Real-time inventory dashboard with statistics
- Age group distribution (Kids, Yearlings, Adults)
- Health status breakdown
- Breeding status analysis
- Sold/dead goat tracking with revenue calculation
- Professional PDF report generation
- Activity log with filtering and export

### 📋 **Activity Logging**
- Comprehensive audit trail of all system changes
- Filterable by date, action type, and entity
- CSV export functionality
- User action tracking

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- npm or yarn
- Git

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/hyzjoaquim23-create/shafa-farm-erp.git
   cd "shafa farm -"
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm start
   ```
   Server runs on `http://localhost:5000`

3. **Frontend Setup** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm start
   ```
   Frontend runs on `http://localhost:3000`

---

## 📁 Project Structure

```
shafa farm/
├── backend/
│   ├── server.js              # Express API server
│   ├── database.js            # SQLite database configuration
│   ├── package.json           # Backend dependencies
│   └── *.js                   # API endpoints and utilities
├── frontend/
│   ├── src/
│   │   ├── pages/             # React pages (Dashboard, GoatManagement, Reports, etc.)
│   │   ├── components/        # Reusable components (Navigation, Footer)
│   │   ├── api.js             # API client
│   │   └── App.jsx            # Main App component
│   ├── public/
│   ├── package.json           # Frontend dependencies
│   └── build/                 # Production build
├── README.md                  # This file
└── SETUP_GUIDE.md             # Detailed setup instructions
```

---

## 🔓 Default Test Accounts

| Role    | Email                  | Password   |
|---------|------------------------|-----------|
| Admin   | admin@shafafarm.com    | admin123  |
| Manager | manager@shafafarm.com  | manager123|
| Owner   | owner@shafafarm.com    | owner123  |

**Access**: http://localhost:3000

---

## 📊 System Capabilities by Role

### Admin (Full Access)
- ✅ Manage all users (create, edit, delete)
- ✅ Add/edit/delete goats and chickens
- ✅ View family tree and genealogy
- ✅ Access all reports and inventory statistics
- ✅ View complete activity logs
- ✅ Reactivate deactivated goats/chickens

### Manager
- ✅ Add/edit/delete goats and chickens
- ✅ View family tree and genealogy
- ✅ View inventory statistics and reports
- ❌ Cannot manage users

### Owner
- ✅ View and edit goats/chickens
- ✅ View family tree
- ✅ View inventory statistics
- ❌ Cannot delete goats/chickens
- ❌ Cannot manage users

---

## 🛠 Tech Stack

- **Frontend**: React 18, Axios, Chart.js, React Router
- **Backend**: Node.js, Express.js, SQLite
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: SQLite with comprehensive schema
- **PDF Generation**: PDFKit for report export

---

## 🎯 Running the System

### Development Mode

**Terminal 1 (Backend):**
```bash
cd backend
npm start
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm start
```

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
```

Output in `frontend/build/` ready for deployment

---

## 📖 Additional Resources

- See `SETUP_GUIDE.md` for detailed installation and troubleshooting
- See `QUICK_REFERENCE_CARD.md` for feature quick reference

---

## 🤝 Contributing

Feel free to fork, modify, and improve this system for your agricultural operations.

## 📝 License

© 2026 Shafa Farm ERP System

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```
   The application will open on `http://localhost:3000`

## How to Use

1. Open the login page
2. Choose a demo account or enter credentials manually
3. Click "Login" to authenticate
4. Access the dashboard based on your role
5. Click "Logout" to exit

## API Endpoints

- **POST** `/api/auth/login` - User login
- **GET** `/api/auth/me` - Get current user (requires token)
- **POST** `/api/auth/logout` - Logout
- **GET** `/api/dashboard` - Get dashboard data (requires token)
- **GET** `/api/health` - Health check

## Technologies Used

- **Backend**: Node.js, Express.js, SQLite3, JWT, bcryptjs
- **Frontend**: React 18, React Router, Axios
- **Authentication**: JWT with localStorage
- **Database**: SQLite

## Security Notes

- Change the JWT_SECRET in `.env` before production
- Use HTTPS in production
- Implement rate limiting for login attempts
- Add password complexity requirements
- Implement token refresh mechanism

## Next Steps

After successful login, you can extend the system with:
- Farm management features
- Inventory tracking
- Worker management
- Financial reports
- Crop monitoring
- And more...

