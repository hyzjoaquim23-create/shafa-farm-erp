# Mobile App Setup & Installation Guide

## Quick Start (5 minutes)

### 1. Install Expo CLI
```bash
npm install -g expo-cli
```

### 2. Navigate to Mobile Directory
```bash
cd mobile
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Update Backend URL
Edit `src/api.js` and replace:
```javascript
const API_BASE_URL = 'http://192.168.43.229:5000/api';
```
With your actual backend IP address.

### 5. Start the App
```bash
npm start
```

### 6. Run on Device/Emulator
- **iOS**: Press `i` to open iOS simulator or scan QR code
- **Android**: Press `a` to open Android emulator or scan QR code

---

## Detailed Setup Guide

### Requirements

#### System Requirements
- Windows, macOS, or Linux
- Node.js 14+ (check with `node --version`)
- npm 6+ (check with `npm --version`)

#### Mobile Device/Emulator
- iOS: Xcode installed (macOS only)
- Android: Android Studio installed

---

## Installation Steps

### Step 1: Install Node.js & npm

**Windows/Mac/Linux:**
1. Download from https://nodejs.org/
2. Install LTS version
3. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Step 2: Install Expo CLI

```bash
npm install -g expo-cli
```

Verify:
```bash
expo --version
```

### Step 3: Clone/Setup Mobile App

```bash
cd "c:\Users\hyz26\shafa farm - Copy (2)\mobile"
```

### Step 4: Install Mobile App Dependencies

```bash
npm install
```

This installs:
- React Native
- React Navigation
- Axios for API calls
- AsyncStorage for local storage
- Vector Icons
- Chart Kit for analytics

### Step 5: Configure Backend Connection

**Edit: `src/api.js`**

Find this line:
```javascript
const API_BASE_URL = 'http://192.168.43.229:5000/api';
```

Replace IP address with your backend server:
```javascript
const API_BASE_URL = 'http://YOUR_IP:5000/api';
```

**Find Your IP:**

Windows:
```bash
ipconfig
```
Look for "IPv4 Address" under your network adapter.

macOS/Linux:
```bash
ifconfig
```

### Step 6: Start Development Server

```bash
npm start
```

This opens Expo Dev Tools with a QR code.

### Step 7: Run on Device

#### Option A: Using Expo Go (Easiest)

**iOS:**
1. Download "Expo Go" from App Store
2. Open app
3. Scan QR code from terminal
4. App loads automatically

**Android:**
1. Download "Expo Go" from Play Store
2. Open app
3. Scan QR code from terminal
4. App loads automatically

#### Option B: Using Emulator

**iOS Simulator (Mac only):**
```bash
npm run ios
```

**Android Emulator:**
```bash
npm run android
```

---

## First Launch Checklist

- [ ] Backend server is running
- [ ] Backend IP is correct in `src/api.js`
- [ ] Device has internet connection
- [ ] Device can reach backend IP and port 5000
- [ ] Expo Go app is installed on device

## Login Credentials

```
Email: admin@farm.com
Password: password123
```

---

## Troubleshooting

### Issue: "Cannot find module 'react-native'"

**Solution:**
```bash
npm install
```

### Issue: "Backend connection failed"

**Check:**
1. Backend server running? (`node backend/server.js`)
2. IP address correct in `src/api.js`?
3. Port 5000 accessible?
4. Firewall blocking?

**Test connection:**
```bash
# Windows
ping YOUR_BACKEND_IP

# macOS/Linux
ping YOUR_BACKEND_IP
```

### Issue: "Blank white screen"

**Solution:**
1. Hard refresh: Quit Expo Go and restart
2. Clear cache: `npm start -- --clear`
3. Check console: Look for red error messages

### Issue: "App crashes on load"

**Check:**
1. All dependencies installed: `npm install`
2. No syntax errors in edited files
3. Correct file paths
4. Backend returning valid responses

### Issue: "Login fails"

**Check:**
1. Backend server running?
2. Correct credentials?
3. Backend responding to `/auth/login`?
4. Check backend logs for errors

---

## Development Workflow

### Hot Reload
Changes automatically reload when you save files. Press `r` in terminal to manually refresh.

### Debug Mode
Press `d` in terminal for debug menu:
- Inspect network requests
- View React component tree
- Toggle slow animation

### View Logs
```bash
npm start
# Logs appear in terminal
```

---

## Building for Production

### Create Expo Account
```bash
expo register
# Or log in if you have account
expo login
```

### Build APK (Android)
```bash
eas build --platform android
```

### Build IPA (iOS)
```bash
eas build --platform ios
```

### Install on Device
```bash
# Android: Install APK directly
# iOS: Use TestFlight or Xcode
```

---

## Project Structure

```
mobile/
├── src/
│   ├── api.js                    ← Backend API calls
│   ├── context/
│   │   └── AuthContext.js        ← Login state
│   ├── navigation/
│   │   └── RootNavigator.js      ← Screen navigation
│   ├── screens/                  ← All screens
│   └── services/
│       └── storageService.js     ← Local storage
├── App.js                        ← Entry point
├── app.json                      ← Expo config
├── package.json                  ← Dependencies
└── README.md                     ← Documentation
```

---

## Next Steps

1. **Explore the app** - Test all features
2. **Customize** - Update colors, branding
3. **Add features** - Implement more screens
4. **Test thoroughly** - QA before production
5. **Deploy** - Build APK/IPA for stores

---

## Support Resources

- **Expo Docs**: https://docs.expo.dev/
- **React Native**: https://reactnative.dev/
- **Your Backend API**: `http://YOUR_IP:5000`

---

## Common Commands

```bash
# Start development
npm start

# iOS simulator
npm run ios

# Android emulator
npm run android

# Clear cache and restart
npm start -- --clear

# Install dependencies
npm install

# Update dependencies
npm update
```

---

## Notes

- App requires active internet connection
- Backend server must be running
- Some features may require specific permissions
- Test on real device before production

---

**Last Updated:** February 2026
**Version:** 1.0.0
