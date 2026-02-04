import React from 'react';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-bottom">
          <p>&copy; {currentYear} Shafa Farm. All rights reserved.</p>
          <p className="footer-version">v1.0.0</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
