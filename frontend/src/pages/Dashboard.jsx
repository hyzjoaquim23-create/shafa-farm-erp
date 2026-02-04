import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardData, getActiveUsers } from '../api';
import './Dashboard.css';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeSessionsCount, setActiveSessionsCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    if (!storedUser) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // Fetch dashboard data
      getDashboardData().then((response) => {
        setMessage(response.data.message);
        setLoading(false);
      }).catch((error) => {
        console.error('Error fetching dashboard:', error);
        setLoading(false);
      });

      // Fetch active users count if admin
      if (parsedUser.role === 'admin') {
        getActiveUsers().then((response) => {
          setActiveSessionsCount(response.data.activeCount || 0);
        }).catch((error) => {
          console.error('Error fetching active users:', error);
        });
      }
    } catch (error) {
      console.error('Error parsing user:', error);
      navigate('/login');
    }
  }, [navigate]);

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <main className="dashboard-main">
        <div className="welcome-section">
          <h2>Welcome to your Dashboard</h2>
          <p className="welcome-message">{message}</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>User Information</h3>
            <div className="info-item">
              <span className="label">Email:</span>
              <span className="value">{user.email}</span>
            </div>
            <div className="info-item">
              <span className="label">Role:</span>
              <span className="value">{user.role}</span>
            </div>
            <div className="info-item">
              <span className="label">ID:</span>
              <span className="value">#{user.id}</span>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>Quick Stats</h3>
            {user.role === 'admin' && (
              <>
                <div className="stat-item">
                  <span className="stat-label">System Status:</span>
                  <span className="stat-value success">Online</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Users Connected:</span>
                  <span className="stat-value">{activeSessionsCount}</span>
                </div>
              </>
            )}
            {user.role === 'manager' && (
              <>
                <div className="stat-item">
                  <span className="stat-label">Farm Status:</span>
                  <span className="stat-value success">Active</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Tasks Today:</span>
                  <span className="stat-value">5</span>
                </div>
              </>
            )}
            {user.role === 'owner' && (
              <>
                <div className="stat-item">
                  <span className="stat-label">Farm Status:</span>
                  <span className="stat-value success">Active</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Last Update:</span>
                  <span className="stat-value">Today</span>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
