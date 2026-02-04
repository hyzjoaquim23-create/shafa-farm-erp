import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import GoatInventory from './pages/GoatInventory';
import GoatManagement from './pages/GoatManagement';
import ChickenManagement from './pages/ChickenManagement';
import PlantManagement from './pages/PlantManagement';
import Expenses from './pages/Expenses';
import ActivityLog from './pages/ActivityLog';
import Reports from './pages/Reports';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import './App.css';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (!token) return <Navigate to="/login" />;
  
  try {
    const parsedUser = JSON.parse(user);
    return parsedUser.role === 'admin' ? children : <Navigate to="/dashboard" />;
  } catch {
    return <Navigate to="/login" />;
  }
}

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  // Check session on app load and periodically
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      // Send session heartbeat to backend
      fetch('http://192.168.43.229:5000/api/auth/verify', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(err => {
        console.warn('Session verification failed:', err);
      });
    }
  }, []);

  return (
    <div className="app-wrapper">
      {!isLoginPage && <Navigation />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/users" 
          element={
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          } 
        />
        <Route 
          path="/inventory" 
          element={
            <ProtectedRoute>
              <GoatInventory />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/goats" 
          element={
            <ProtectedRoute>
              <GoatManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/chickens" 
          element={
            <ProtectedRoute>
              <ChickenManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/plants" 
          element={
            <ProtectedRoute>
              <PlantManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/expenses" 
          element={
            <ProtectedRoute>
              <Expenses />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/reports" 
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/activity-log" 
          element={
            <AdminRoute>
              <ActivityLog />
            </AdminRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
      {!isLoginPage && <Footer />}
    </div>
  );
}

export default App;
