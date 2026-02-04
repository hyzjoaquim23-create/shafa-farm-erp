# 📱 Build & Install Guide - Shafa Farm Mobile App

## 🎯 BUILD OPTIONS

You have two options to get the app on your phone:

### Option 1: Easy Build (Recommended) ⭐ 
Build in the cloud using EAS - No special setup needed, works on Windows/Mac/Linux.

### Option 2: Local Build
Build locally on your computer - Requires Android Studio/Xcode setup.

---

## OPTION 1: EAS Cloud Build (RECOMMENDED) ⭐

### Step 1: Create Expo Account
If you don't have one already:
```bash
eas auth:signin
# Or create new account:
eas auth:signup
```

### Step 2: Build for Android (APK)
```bash
eas build --platform android --local
```

**This will:**
- ✅ Compile your app on Expo's servers
- ✅ Create an APK file for Android
- ✅ Download the APK to your computer
- ✅ Ready to install on any Android phone

**Time: ~10-15 minutes**

### Step 3: Install on Your Phone

#### Option A: Direct APK Install
1. Look for the downloaded APK file
2. Transfer to your Android phone via:
   - USB cable
   - Email
   - Cloud storage (Google Drive, OneDrive)
   - AirDrop (if Mac)
3. On phone: Open file manager → Find APK → Tap to install
4. Allow installation from unknown sources if prompted

#### Option B: Scan & Install (Easiest)
After build completes:
```bash
# The build command will show a QR code
# Scan with your phone to download APK
```

---

## OPTION 2: Local Build (Advanced)

### For Android (Windows/Mac/Linux)

#### Requirements
- Node.js and npm (already have)
- Android SDK (from Android Studio)
- Java Development Kit (JDK)
- ~5GB free space

#### Build Steps
```bash
cd mobile

# Build APK locally
eas build --platform android --local
```

#### Install
1. APK saved to: `./dist/`
2. Transfer to Android phone
3. Install like Option 1

---

## BUILDING FOR iOS (Mac Only)

### Requirements
- Mac with Xcode
- Apple Developer Account
- iOS device or simulator

### Build Steps
```bash
# iOS build
eas build --platform ios

# Or for IPA file:
eas build --platform ios --local
```

### Install
- **Simulator**: Installs automatically
- **Real Device**: Use TestFlight or enterprise distribution

---

## QUICK START BUILD

### The Easiest Path (5 Steps):

```bash
# 1. Navigate to mobile folder
cd "c:\Users\hyz26\shafa farm - Copy (2)\mobile"

# 2. Login to Expo (one-time)
eas auth:signin

# 3. Build for Android
eas build --platform android

# 4. Wait for build to complete (~10 minutes)
# You'll get a link to download APK

# 5. Transfer APK to phone and install
```

---

## INSTALLATION STEPS

### Android Phone Installation

#### Method 1: USB Cable (Fastest)
1. Connect Android phone to computer via USB
2. File transfer mode: Enable on phone
3. Copy APK to phone storage
4. On phone: Open file manager
5. Navigate to APK file
6. Tap to install
7. Tap "Install" on permission screen

#### Method 2: Email
1. APK file → Right-click → Send to → Mail
2. Send to yourself
3. Open email on phone
4. Download attachment
5. Open file → Install

#### Method 3: Google Drive / OneDrive
1. Upload APK to cloud storage
2. Open on phone
3. Download and install

#### Method 4: AirDrop (Mac to iPhone)
1. Right-click APK
2. Share → AirDrop
3. Select your iPhone
4. Install from app store

---

## TROUBLESHOOTING BUILD

### Issue: "EAS not authenticated"
```bash
# Login to Expo
eas auth:signin
```

### Issue: "No credentials"
```bash
# Create credentials
eas credentials
```

### Issue: Build Failed
1. Check internet connection
2. Update EAS CLI: `npm install -g eas-cli@latest`
3. Try again: `eas build --platform android`

### Issue: APK Won't Install
1. Enable "Unknown sources" on phone
2. Check Android version compatible
3. Clear app data if already installed
4. Try reinstalling

---

## AFTER INSTALLATION

### First Launch
1. Open Shafa Farm app
2. Login with credentials:
   ```
   Email: admin@farm.com
   Password: password123
   ```
3. Grant permissions (camera, storage, etc.)
4. Start using!

### Configure Backend (Important!)
Before using:
1. In app: Go to Settings
2. Update backend IP address
3. Point to your server

Or edit before building:
- Edit `src/api.js`
- Update `API_BASE_URL` IP
- Rebuild

---

## BUILD COMMANDS REFERENCE

```bash
# Android APK
eas build --platform android

# Android local build
eas build --platform android --local

# iOS
eas build --platform ios

# iOS local build (Mac only)
eas build --platform ios --local

# Both platforms
eas build

# Check build status
eas build:list

# Download specific build
eas build:download
```

---

## APK LOCATION

After build completes:

### Windows
```
Downloads folder or current directory
Look for: Shafa Farm Mobile App.apk
or
shafa-farm-mobile-<version>.apk
```

### Mac
```
Downloads folder
Look for: Shafa Farm Mobile App.apk
```

### Linux
```
Current directory
Look for: shafa-farm-mobile-<version>.apk
```

---

## FILE SIZES

| Build | Size | Download Time |
|-------|------|----------------|
| APK | ~50-100 MB | 5-10 min |
| IPA | ~100-150 MB | 10-15 min |

---

## DEVICE REQUIREMENTS

### Android
- Android 5.0+ (API 21+)
- 100+ MB free space
- RAM: 2GB minimum

### iOS
- iOS 14.0+
- 100+ MB free space
- iPhone 11 or newer (recommended)

---

## BUILD ENVIRONMENT SETUP

### Before First Build

#### Windows
1. Install Node.js
2. Install EAS CLI: `npm install -g eas-cli`
3. Install Android SDK (via Android Studio)
4. Set ANDROID_HOME environment variable

#### Mac
1. Install Node.js
2. Install EAS CLI: `npm install -g eas-cli`
3. Install Xcode (from App Store)
4. Install CocoaPods: `sudo gem install cocoapods`

#### Linux
1. Install Node.js
2. Install EAS CLI: `npm install -g eas-cli`
3. Install Android SDK
4. Set ANDROID_HOME environment variable

---

## CREDENTIALS & SECURITY

### First Build
```bash
# Create credentials (required once)
eas credentials

# Follow prompts:
# - Create new keystore? YES
# - Store on Expo servers? YES (recommended)
```

This creates secure credentials for signing your app.

### Re-use Credentials
Next builds automatically use stored credentials.

---

## VERSION UPDATES

### Build New Version
1. Update `app.json` version
2. Build again: `eas build --platform android`
3. New APK will have new version number

### Installing Over Old Version
- New version automatically replaces old
- No need to uninstall first
- All app data preserved

---

## OFFLINE BUILD (No Internet)

If you're offline:
```bash
# Use local build
eas build --platform android --local

# Requires:
# - Android SDK installed
# - No internet needed (after setup)
```

---

## ADVANCED OPTIONS

### Custom Build Configuration
Edit `eas.json` for:
- Custom icons
- Custom splash screens
- Environment-specific builds
- Signing certificates

### Environment Variables
Add to `.env.production`:
```
API_BASE_URL=https://yourserver.com/api
ENABLE_NOTIFICATIONS=true
```

---

## SUPPORT & HELP

### Getting Help
1. Check build logs: `eas build:list`
2. View errors in console
3. Check Expo docs: https://docs.expo.dev/
4. Verify backend is running

### Common Issues
- **Won't connect to backend**: Check IP address in code
- **Installation fails**: Enable unknown sources
- **App crashes on startup**: Check backend is running

---

## NEXT STEPS

1. **Build**: `eas build --platform android`
2. **Wait**: ~10-15 minutes
3. **Download**: APK file
4. **Transfer**: To your phone
5. **Install**: Tap and confirm
6. **Configure**: Update backend IP
7. **Enjoy**: Start using app!

---

## QUICK CHECKLIST

Before building:
- [ ] Backend server IP ready
- [ ] Expo account created
- [ ] Node.js installed
- [ ] EAS CLI installed
- [ ] Good internet connection
- [ ] Phone ready to receive

---

## ESTIMATED TIMELINE

| Step | Time |
|------|------|
| EAS Login | 1 min |
| Build Process | 10-15 min |
| Download APK | 2-5 min |
| Transfer to Phone | 1-2 min |
| Install on Phone | 1-2 min |
| **Total** | **15-25 min** |

---

## FINAL NOTES

✅ **Cloud Build (Recommended)**: Easiest, works everywhere
✅ **No Setup Needed**: EAS handles everything
✅ **Free Tier**: Includes monthly builds
✅ **Automatic Updates**: Can push updates to users

---

**Ready to build? Run this command:**

```bash
cd mobile
eas build --platform android
```

**That's it! Your app will be built and ready to install! 🚀**

---

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Status**: Ready to Build
