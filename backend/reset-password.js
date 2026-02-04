const bcrypt = require('bcryptjs');
const { db } = require('./database');

// Function to reset a user's password
const resetPassword = (email, newPassword) => {
  const hashedPassword = bcrypt.hashSync(newPassword, 10);
  
  db.run(
    'UPDATE users SET password = ? WHERE email = ?',
    [hashedPassword, email],
    function(err) {
      if (err) {
        console.error('Error resetting password:', err);
        process.exit(1);
      }
      if (this.changes === 0) {
        console.error(`User with email ${email} not found`);
        process.exit(1);
      }
      console.log(`✅ Password reset successfully for ${email}`);
      console.log(`New password: ${newPassword}`);
      db.close();
      process.exit(0);
    }
  );
};

// Get email and password from command line arguments
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.log('Usage: node reset-password.js <email> <new-password>');
  console.log('Example: node reset-password.js admin@shafafarm.com admin123');
  process.exit(1);
}

console.log(`Resetting password for ${email}...`);
resetPassword(email, password);
