# 🔐 EXPO ACCOUNT SETUP & LOGIN

## ⚠️ REQUIRED BEFORE BUILDING

Before you can build your app, you need an Expo account.

---

## OPTION 1: Create Free Expo Account (Easiest) ⭐

### Step 1: Go to Expo Website
```
https://expo.dev/
```

### Step 2: Click "Sign Up"
- Enter **email address**
- Create **password**
- Click "Create account"
- Check email for confirmation link
- Click link to verify

### Step 3: Login to EAS CLI

In your terminal (in mobile folder):

```bash
eas login
```

**What happens:**
1. Browser opens automatically
2. Shows Expo login page
3. Sign in with your new account
4. Authorize EAS Build
5. Page shows: "Authorization successful!"
6. Return to terminal (should say "Logged in!")

---

## OPTION 2: Use Existing Expo Account

If you already have an Expo account:

```bash
eas login
```

**Then:**
1. Browser opens
2. Sign in with your credentials
3. Authorize app
4. Done!

---

## VERIFY LOGIN

Check if logged in:

```bash
eas whoami
```

**Expected output:**
```
You are logged in as your-username
```

---

## RESET/LOGOUT

If you need to login to different account:

```bash
eas logout
eas auth:signin
```

---

## FREE vs PAID

### Expo Free Plan✅
- **Builds**: 30 per month (free)
- **Users**: 1 user
- **Platforms**: Android & iOS
- **Perfect for**: Development & testing

### Expo Paid Plan
- **Builds**: Unlimited
- **Users**: Unlimited
- **Advanced features**
- **Cost**: $99/month

**For now: Free plan is perfect!**

---

## TROUBLESHOOTING LOGIN

### Issue: "Browser won't open"
```bash
# Try manual link - copy this into your browser:
eas login --interactive
```

### Issue: "Email not receiving confirmation"
1. Check spam folder
2. Resend verification email on Expo site
3. Try again

### Issue: "Authorization failed"
1. Clear browser cookies
2. Try again with fresh login
3. Check email/password correct

---

## NEXT STEPS

### After Login
1. ✅ Account created
2. ✅ Logged in via CLI
3. ✅ Ready to build

### Start Building
```bash
cd mobile
eas build --platform android
```

---

## QUICK START SEQUENCE

```bash
# 1. Go to mobile folder
cd mobile

# 2. Login (opens browser)
eas login

# 3. Verify logged in
eas whoami

# 4. Start build
eas build --platform android
```

**That's it! The app will build and you can download the APK!**

---

**Don't have 10 minutes to create account? Here's the link:**

**Sign up here:** https://expo.dev/signup

**Then run:**
```bash
eas auth:signin
```

---

**Status**: Login required before building  
**Time needed**: 5 minutes for account + login
