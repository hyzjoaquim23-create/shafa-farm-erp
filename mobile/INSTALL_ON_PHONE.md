# 📱 STEP-BY-STEP: Build & Install on Your Phone

## 🎯 Goal: Get the app on your Android phone in 20 minutes

---

## PART 1: PREPARE YOUR PHONE (5 minutes)

### Step 1: Enable Unknown Sources
For Android to allow app installation from APK files:

1. **Open Settings** on your phone
2. Go to **Security** (or **Apps & permissions**)
3. Find **Unknown sources** or **Install unknown apps**
4. **Enable it** for your file manager
5. Confirm the warning

### Step 2: Prepare Connection
You'll need:
- USB cable (to transfer APK), OR
- Cloud storage account (Google Drive, OneDrive), OR
- Email account

---

## PART 2: BUILD THE APP (10-15 minutes)

### Step 1: Open Terminal in Mobile Folder

**Windows:**
```
Press: Windows + R
Type: cmd
Press: Enter
Type: cd c:\Users\hyz26\shafa farm - Copy (2)\mobile
Press: Enter
```

**Or simply:**
- Open File Explorer
- Navigate to `mobile` folder
- Right-click empty space
- Select "Open PowerShell here" or "Open Command Prompt here"

### Step 2: Login to Expo (First Time Only)

```bash
eas auth:signin
```

**What happens:**
- Browser opens
- Sign in with Expo account (create if needed)
- Return to terminal
- You're authenticated!

### Step 3: Build the App

```bash
eas build --platform android
```

**What to expect:**
- Terminal shows: "Building Android APK..."
- Progress bar appears
- Wait 10-15 minutes
- You'll see: "✓ Build #123 finished successfully"
- Download link provided

### Step 4: Download the APK

Option A: **Copy from terminal link**
- Click link shown in terminal
- Browser opens
- Click download

Option B: **Use list command**
```bash
eas build:list
```
- Find your latest build
- Click download link

**File saved to**: `Downloads` folder (usually)

---

## PART 3: TRANSFER TO PHONE (2-5 minutes)

### Method 1: USB Cable (Fastest)

**Steps:**
1. Connect phone to computer with USB cable
2. On phone: Select "File Transfer" mode (may appear as popup)
3. On computer: File Explorer opens showing phone storage
4. Copy APK file to phone (Documents, Downloads, or root)
5. Safely eject phone

### Method 2: Email

**Steps:**
1. Right-click APK file
2. Select "Send to" → "Mail"
3. Email to yourself
4. Open email on phone
5. Tap "Download" or attachment

### Method 3: Cloud Storage (Google Drive)

**Steps:**
1. Open Google Drive website
2. Click "New" → "File upload"
3. Select your APK
4. Upload completes
5. On phone: Open Drive
6. Find APK → Tap to download

### Method 4: Share (Easiest!)

**Windows:**
1. Right-click APK file
2. Select "Share"
3. Choose: Phone, Gmail, Drive, etc.

---

## PART 4: INSTALL ON PHONE (2-3 minutes)

### Step 1: Find the APK

On your phone:
1. Open **File Manager** app
2. Look in: **Downloads**, **Documents**, or **Drive**
3. Find: `Shafa Farm` APK file

### Step 2: Start Installation

1. **Tap the APK file**
2. Message appears: "Install from unknown source?"
3. Tap **Install** button
4. Watch progress bar
5. Tap **Open** when done

### Step 3: Grant Permissions

The app may ask for:
- Camera access (for future features)
- Storage access
- Location (for future features)

Tap **Allow** for each (you can disable later)

---

## PART 5: FIRST LAUNCH (2 minutes)

### Step 1: Open the App

1. Find **Shafa Farm** icon on home screen
2. Tap to open
3. Wait for app to start (first launch is slower)

### Step 2: Login

**Credentials:**
```
Email: admin@farm.com
Password: password123
```

### Step 3: Configure Backend (IMPORTANT!)

The app needs to know where your backend server is:

1. Tap **Settings** (bottom right)
2. Look for: **Backend Configuration** or **API Settings**
3. Enter your server IP address: `http://YOUR_IP:5000`
4. Tap **Save**
5. Return to app

**Alternative:** Edit before building
- Open: `src/api.js`
- Change: `API_BASE_URL` to your IP
- Rebuild app

### Step 4: Test the App

1. You're on the **Dashboard**
2. See farm statistics? ✅ Working!
3. Tap **Goats** tab
4. See goat list? ✅ Backend connected!

---

## ✅ SUCCESS CHECKLIST

- [ ] Android "Unknown sources" enabled
- [ ] EAS CLI installed and logged in
- [ ] App built successfully
- [ ] APK downloaded
- [ ] Transferred to phone
- [ ] Installed on phone
- [ ] App opens without errors
- [ ] Can login with demo account
- [ ] Dashboard shows data
- [ ] Backend IP configured

---

## 🆘 TROUBLESHOOTING

### Build Won't Start

**Problem:** "EAS not authenticated"
```bash
# Solution:
eas auth:signin
```

**Problem:** "No project found"
```bash
# Make sure you're in the mobile folder:
cd mobile
eas build --platform android
```

---

### APK Won't Download

**Problem:** Link expired or not showing
```bash
# Solution:
eas build:list
# Click the download link from the list
```

---

### Installation Fails on Phone

**Problem 1:** "Unknown sources not enabled"
- Go to Settings → Security
- Enable "Unknown sources"
- Try installing again

**Problem 2:** "Not enough space"
- Free up 150MB+ on phone
- Try installing again

**Problem 3:** "App already installed"
- Uninstall old version first
- Then install new APK

---

### App Won't Start

**Problem 1:** "Blank white screen"
- Force stop app
- Clear cache (Settings → Apps → Shafa Farm → Clear Cache)
- Reopen app

**Problem 2:** "Crashes immediately"
- Check backend is running
- Check backend IP is correct
- Verify internet connection

**Problem 3:** "Won't login"
- Verify credentials: admin@farm.com / password123
- Ensure backend server is running
- Check IP address in Settings

---

### Can't Connect to Backend

**Problem:** "Network error" or "Connection refused"

**Solutions:**
1. Check backend is running:
   ```bash
   # On backend folder:
   node server.js
   ```

2. Verify IP address:
   ```bash
   # On Windows:
   ipconfig
   # Find IPv4 Address
   ```

3. Update in app:
   - Settings → Backend Configuration
   - Enter correct IP: `http://YOUR_IP:5000`

4. Both devices on same network:
   - Phone WiFi: Same as computer
   - Firewall: Allow port 5000

---

## 📱 DEVICE REQUIREMENTS

**Android Version:**
- Android 5.0 or newer
- Most phones from 2015+

**Storage:**
- 150MB free space
- APK is ~50-100MB

**Network:**
- WiFi or mobile data
- Good connection recommended

---

## 🚀 QUICK COMMAND REFERENCE

```bash
# Navigate to mobile folder
cd mobile

# Login (first time)
eas auth:signin

# Build APK
eas build --platform android

# Check build status
eas build:list

# Download specific build
eas build:download

# View all builds
eas build:list --limit 10
```

---

## 📊 ESTIMATED TIMELINE

| Step | Time | Details |
|------|------|---------|
| Prepare phone | 3-5 min | Enable unknown sources |
| Build app | 10-15 min | EAS cloud build |
| Download APK | 2-5 min | Internet download |
| Transfer | 1-2 min | USB or cloud upload |
| Install | 2-3 min | Phone installation |
| Configure | 1-2 min | Set backend IP |
| **Total** | **19-32 min** | Varies by speed |

---

## 💡 PRO TIPS

1. **While building:** Get coffee ☕
2. **USB transfer:** Fastest method
3. **Multiple phones:** Build once, install on many
4. **Update app:** Rebuild and reinstall (old version uninstalls)
5. **Offline:** Preload APK before traveling

---

## 🎯 WHAT'S NEXT

After first install:

1. ✅ Explore all features
2. ✅ Test on different devices
3. ✅ Customize app name/colors
4. ✅ Share with team
5. ✅ Gather feedback
6. ✅ Plan updates

---

## 📞 NEED HELP?

- **Build issue?** See: [BUILD_AND_INSTALL.md](BUILD_AND_INSTALL.md)
- **Phone issue?** See troubleshooting above
- **Backend issue?** Check backend logs
- **Feature question?** See: [README.md](README.md)

---

**Ready? Let's go! 🚀**

```bash
cd mobile
eas build --platform android
```

**That's it! Follow the steps above and you'll have the app on your phone in 20 minutes!**

---

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Difficulty**: ⭐⭐ (Easy to Medium)
