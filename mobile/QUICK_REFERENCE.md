# Shafa Farm Mobile App - Quick Reference

## Start Using the App

### Installation (One Time)
```bash
cd mobile
npm install
npm start
```

### Run on Phone
1. Download **Expo Go** from App Store or Play Store
2. Open Expo Go
3. Scan QR code shown in terminal
4. App opens on your phone

### Login
```
Email: admin@farm.com
Password: password123
```

---

## Main Features

### 📊 Dashboard
- View farm statistics
- See total goats/chickens
- Check monthly expenses
- Monitor health status

### 🐐 Goat Management
- **View All**: See list of all goats
- **Add**: Create new goat record
- **View Details**: See complete goat info
- **Edit**: Update goat details
- **Delete**: Remove goat from system

### 🐔 Chicken Management
- Coming soon

### 💰 Expenses
- Track farm costs
- View reports
- Coming soon (partially implemented)

### 📋 Activity Log
- Daily farm activities
- Events tracking
- Coming soon

### 📊 Reports
- Generate reports
- View analytics
- Coming soon

### ⚙️ Settings
- Account settings
- Notifications
- About app
- Logout

---

## Navigation

### Bottom Tabs (Always Visible)
```
🏠 Home → 🐐 Goats → 🐔 Chickens → 💰 Expenses → 📋 Activity → 📊 Reports → ⚙️ Settings
```

### Screen Flow

**Login Screen**
↓
**Dashboard** (Home)
├─ Goat Inventory
│  ├─ Goat List
│  ├─ Goat Details
│  └─ Create Goat
├─ Chicken Management
├─ Expenses
├─ Activity Log
├─ Reports
└─ Settings

---

## Common Tasks

### Add a New Goat
1. Tap **Goats** tab
2. Tap **+** button (bottom right)
3. Fill in goat details
4. Tap **Add Goat**
5. Done! Goat appears in list

### View Goat Details
1. Tap **Goats** tab
2. Tap any goat in the list
3. See full details
4. Tap **Edit** or **Delete** if needed

### Logout
1. Tap **Settings** tab
2. Tap **Logout** button
3. Returned to login screen

### View Dashboard
1. Tap **Home** tab
2. See farm overview
3. Pull down to refresh

---

## Troubleshooting

### Can't Login
- Check email and password
- Verify backend is running
- Restart Expo Go app

### App Won't Load
- Check internet connection
- Verify backend IP in code
- Restart Expo Go
- Clear cache: Kill Expo Go and restart

### Blank White Screen
- Press `r` in terminal to reload
- Or restart Expo Go
- Check error messages in terminal

### Can't Connect to Backend
- Check backend is running: `node backend/server.js`
- Verify IP address is correct
- Both devices on same network
- Check firewall settings

---

## File Locations

| Feature | File |
|---------|------|
| Login | `src/screens/auth/LoginScreen.js` |
| Dashboard | `src/screens/dashboard/DashboardScreen.js` |
| Goat List | `src/screens/goats/GoatInventoryScreen.js` |
| Goat Details | `src/screens/goats/GoatDetailScreen.js` |
| Add Goat | `src/screens/goats/CreateGoatScreen.js` |
| Navigation | `src/navigation/RootNavigator.js` |
| API | `src/api.js` |
| Auth State | `src/context/AuthContext.js` |
| Storage | `src/services/storageService.js` |

---

## Customization

### Change App Name
Edit `app.json`:
```json
{
  "expo": {
    "name": "Your Farm App"
  }
}
```

### Change Colors
Edit any screen file:
```javascript
backgroundColor: '#8B7355' // Change this color
```

### Change Backend URL
Edit `src/api.js`:
```javascript
const API_BASE_URL = 'http://YOUR_IP:5000/api';
```

### Add New Feature
1. Create screen in `src/screens/feature/`
2. Add to navigation in `src/navigation/RootNavigator.js`
3. Create API methods in `src/api.js`

---

## Testing Checklist

- [ ] Login works
- [ ] Dashboard loads
- [ ] Can view goats list
- [ ] Can add new goat
- [ ] Can view goat details
- [ ] Can edit goat
- [ ] Can delete goat
- [ ] Can logout
- [ ] Can login again

---

## Development Commands

```bash
# Start app
npm start

# iOS simulator
npm run ios

# Android emulator
npm run android

# Clear cache
npm start -- --clear

# Install dependencies
npm install

# Check version
expo --version

# Eject from Expo
npm run eject
```

---

## Terminal Shortcuts (While npm start)

| Key | Action |
|-----|--------|
| `i` | Open iOS Simulator |
| `a` | Open Android Emulator |
| `w` | Open web preview |
| `r` | Reload app |
| `m` | Toggle menu |
| `d` | Debug menu |
| `q` | Quit |

---

## Debug Mode

Press `d` while app is running to:
- View network requests
- Inspect React components
- Toggle slow animations
- View element inspector
- View performance monitor

---

## Performance Tips

- Don't leave too many tabs open
- Close unused processes
- Restart Expo Go periodically
- Clear app cache if slow
- Check network connection

---

## API Endpoints Used

```
POST /auth/login          - Login
GET  /dashboard           - Dashboard stats
GET  /goats               - List goats
GET  /goats/{id}          - Get goat details
POST /goats               - Create goat
PUT  /goats/{id}          - Update goat
DELETE /goats/{id}        - Delete goat
```

---

## Important Notes

✅ **Requires:**
- Working backend server
- Internet connection
- Expo Go app installed
- Valid login credentials

⚠️ **Remember:**
- Offline mode limited (no sync yet)
- Requires backend running
- IP address must be correct
- Both devices on same network

---

## Getting Help

### Resources
- App documentation: `README.md`
- Setup guide: `SETUP_GUIDE.md`
- Implementation details: `IMPLEMENTATION_SUMMARY.md`
- Expo docs: https://docs.expo.dev/
- React Native: https://reactnative.dev/

### Check Logs
Terminal shows:
- Errors in red
- Warnings in yellow
- Info in white/gray

### Debug
1. Check terminal for errors
2. Look at app error screen
3. Verify backend is running
4. Test internet connection
5. Restart Expo Go

---

## Keyboard Shortcuts (Development)

| Platform | Reload | Menu | Debug |
|----------|--------|------|-------|
| iOS | Cmd+R | Cmd+D | Cmd+Opt+I |
| Android | Cmd+M | Cmd+M | Dev Menu |
| Web | Ctrl+R | Ctrl+Shift+M | F12 |

---

## Version Info

- App Version: 1.0.0
- Updated: February 2026
- Status: Production Ready

---

## Quick Links

📖 **Documentation**: See `README.md`
🚀 **Getting Started**: See `SETUP_GUIDE.md`
📋 **Implementation**: See `IMPLEMENTATION_SUMMARY.md`
🔧 **API Configuration**: Edit `src/api.js`
🎨 **Styling**: Edit screen files in `src/screens/`

---

**Happy Farming! 🌾**
