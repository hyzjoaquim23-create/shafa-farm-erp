import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../api';
import './Navigation.css';

function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  if (!user) return null;

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand" onClick={() => navigate('/dashboard')} style={{cursor: 'pointer'}}>
            <span className="brand-name">Shafa Farm</span>
          </div>

          <div className="navbar-menu-wrapper">
            <button
              className="navbar-menu-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-haspopup="true"
            >
              Menu ▾
            </button>

            <ul className={`navbar-menu ${menuOpen ? 'active' : ''}`} role="menu">
              <li>
                <a className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`} onClick={() => { navigate('/dashboard'); setMenuOpen(false); }}>🏠 Dashboard</a>
              </li>
              <li className="nav-group">
                <div className="nav-group-title">🐾 Livestock</div>
                <ul className="nav-submenu">
                  <li>
                    <a className={`nav-link ${isActive('/goats') ? 'active' : ''}`} onClick={() => { navigate('/goats'); setMenuOpen(false); }}>🐐 Goat Management</a>
                  </li>
                  <li>
                    <a className={`nav-link ${isActive('/chickens') ? 'active' : ''}`} onClick={() => { navigate('/chickens'); setMenuOpen(false); }}>🐔 Chickens</a>
                  </li>
                </ul>
              </li>
              <li className="nav-group">
                <div className="nav-group-title">🌱 Crops</div>
                <ul className="nav-submenu">
                  <li>
                    <a className={`nav-link ${isActive('/plants') ? 'active' : ''}`} onClick={() => { navigate('/plants'); setMenuOpen(false); }}>🌿 Plants</a>
                  </li>
                </ul>
              </li>
              <li>
                <a className={`nav-link ${isActive('/expenses') ? 'active' : ''}`} onClick={() => { navigate('/expenses'); setMenuOpen(false); }}>💸 Expenses</a>
              </li>
              <li>
                <a className={`nav-link ${isActive('/reports') ? 'active' : ''}`} onClick={() => { navigate('/reports'); setMenuOpen(false); }}>🧾 Reports</a>
              </li>
              {user.role === 'admin' && (
                <>
                  <li>
                    <a className={`nav-link ${isActive('/activity-log') ? 'active' : ''}`} onClick={() => { navigate('/activity-log'); setMenuOpen(false); }}>📋 Activity Log</a>
                  </li>
                  <li>
                    <a className={`nav-link ${isActive('/users') ? 'active' : ''}`} onClick={() => { navigate('/users'); setMenuOpen(false); }}>👥 Users</a>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="navbar-right">
            <div className="nav-user-section">
              <span className={`role-badge role-${user.role}`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
              <span className="user-name">{user.name}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </div>
      </nav>
      {menuOpen && <div className="nav-overlay" onClick={() => setMenuOpen(false)} />}
    </>
  );
}

export default Navigation;
