# Shafa Farm ERP System

A complete farm management ERP system with authentication and role-based access control.

## Project Structure

```
shafa farm/
├── backend/          # Node.js/Express API server
├── frontend/         # React web application
└── README.md
```

## Features

- **User Authentication**: Secure login with JWT tokens
- **Role-Based Access Control**: Admin, Manager, and Owner roles
- **SQLite Database**: User data persistence
- **Responsive UI**: Modern, mobile-friendly interface
- **Protected Routes**: Dashboard accessible only to authenticated users

## Default Test Accounts

| Role    | Email                  | Password   |
|---------|------------------------|-----------|
| Admin   | admin@shafafarm.com    | admin123  |
| Manager | manager@shafafarm.com  | manager123|
| Owner   | owner@shafafarm.com    | owner123  |

## Getting Started

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5000`

### Frontend Setup

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

