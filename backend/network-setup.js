#!/usr/bin/env node

/**
 * Network Access Configuration Guide
 * 
 * Your machine IP: 192.168.43.229
 * 
 * Access from same network:
 * - Frontend: http://192.168.43.229:3000
 * - Backend:  http://192.168.43.229:5000
 * 
 * Both frontend and backend are now configured to accept connections
 * from devices on your network (iPad, phone, etc.)
 * 
 * Make sure:
 * 1. Backend is running on port 5000
 * 2. Frontend is running on port 3000
 * 3. All devices are on the same Wi-Fi network
 * 4. Firewall allows incoming connections on ports 3000 and 5000
 */

console.log(`
╔══════════════════════════════════════════════════════════════╗
║          SHAFA FARM ERP - NETWORK ACCESS ENABLED             ║
╚══════════════════════════════════════════════════════════════╝

📱 Network Configuration:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Machine IP Address: 192.168.43.229

✅ Frontend Access:
   • Local (this machine): http://localhost:3000
   • Network (iPad/Phone): http://192.168.43.229:3000

✅ Backend Access:
   • Local (this machine): http://localhost:5000
   • Network (iPad/Phone): http://192.168.43.229:5000

📋 Requirements:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ All devices must be on the SAME Wi-Fi network
✓ Firewall must allow connections on ports 3000 and 5000
✓ Backend must be running (npm start in backend folder)
✓ Frontend must be running (npm start in frontend folder)

🔧 Configuration Applied:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Frontend API URL: http://192.168.43.229:5000/api
✅ Backend listening on: 0.0.0.0:5000 (all interfaces)
✅ CORS enabled on backend

🧪 Testing from another device:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Open browser on iPad/Phone
2. Go to: http://192.168.43.229:3000
3. Log in with admin credentials
4. Test with: admin@shafafarm.com / admin123

⚠️  Note: IP address 192.168.43.229 is specific to YOUR network.
   If the machine's IP changes, you'll need to reconfigure.

╚══════════════════════════════════════════════════════════════╝
`);
