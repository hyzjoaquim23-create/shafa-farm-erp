# Quick Start Guide - Shafa Farm ERP

## 🚀 System Status

**✅ Backend**: Running on http://localhost:5000  
**✅ Frontend**: Running on http://localhost:3000  
**✅ Database**: SQLite configured with all tables  

---

## 🔐 Login Credentials

### Demo Accounts Ready to Use:

| Role    | Email                   | Password    |
|---------|-------------------------|-------------|
| Admin   | admin@shafafarm.com     | admin123    |
| Manager | manager@shafafarm.com   | manager123  |
| Owner   | owner@shafafarm.com     | owner123    |

**Access**: http://localhost:3000

---

## 📋 What You Can Do Right Now

### 1️⃣ **As Admin** (admin@shafafarm.com)
- ✅ Manage all users (add, edit, delete)
- ✅ Add/edit/delete goats
- ✅ View goat family tree
- ✅ View inventory statistics
- ✅ Access activity logs

### 2️⃣ **As Manager** (manager@shafafarm.com)
- ✅ Add/edit/delete goats
- ✅ View goat family tree
- ✅ View inventory statistics
- ❌ Cannot manage users

### 3️⃣ **As Owner** (owner@shafafarm.com)
- ✅ View/edit goats
- ✅ View goat family tree
- ✅ View inventory statistics
- ❌ Cannot manage users
- ❌ Cannot delete goats

---

## 🎯 Getting Started - First Steps

### Step 1: Log In
1. Open http://localhost:3000
2. Enter email: `admin@shafafarm.com`
3. Enter password: `admin123`
4. Click **Login**

### Step 2: Add Your First Goat
1. Click **🐐 Goat Management** in the menu
2. Click **+ Add New Goat**
3. Fill in the form:
   - **Name**: e.g., "Bella"
   - **Tag Number**: e.g., "TAG-001"
   - **Date of Birth**: Pick a date
   - **Gender**: Select Male or Female
   - **Breed**: e.g., "Boer" (optional)
   - **Color**: e.g., "White" (optional)
   - **Health Status**: "Healthy"
   - **Breeding Status**: "Non-Breeding" or "Breeding"
   - **Location**: e.g., "Pen A" (optional)
4. Click **Add Goat**

### Step 3: Check Inventory
1. Click **📊 Inventory** in the menu
2. See automatic statistics:
   - Total goats count
   - Gender breakdown
   - Age distribution
   - Health status
   - Breeding status

### Step 4: View Family Tree
1. Click **👨‍👩‍👧‍👦 Family Tree** in the menu
2. See all goats listed
3. Click the **▶** arrow to expand a goat
4. See genealogy information for that goat

### Step 5: Manage Users (Admin)
1. Click **👥 Users** in the menu
2. View all users
3. Click **+ Add New User** to create new farm staff
4. Enter user details and assign role

---

## 🎮 Common Actions

### ✏️ Edit a Goat
1. Go to **🐐 Goat Management**
2. Find the goat card
3. Click the **✎** (edit) button
4. Update the information
5. Click **Update Goat**

### 🗑️ Delete a Goat
1. Go to **🐐 Goat Management**
2. Find the goat card
3. Click the **🗑** (delete) button
4. Confirm in the popup dialog

### 🔍 Search for a Goat
1. Go to **🐐 Goat Management** or **👨‍👩‍👧‍👦 Family Tree**
2. Use the search box at the top
3. Type goat name or tag number
4. Results filter in real-time

### 📊 Filter by Gender
1. Go to **👨‍👩‍👧‍👦 Family Tree**
2. Use the filter dropdown
3. Select: All / Male / Female
4. See filtered results

---

## 📱 Navigation Menu

### Desktop View
Click on menu items at the top:
- 🏠 **Dashboard** - Home page
- 📊 **Inventory** - Statistics
- 🐐 **Goat Management** - Add/edit goats
- 👨‍👩‍👧‍👦 **Family Tree** - Genealogy
- 👥 **Users** - (Admin only)

### Mobile View
- Click **☰** (hamburger) to open menu
- Click menu items to navigate
- User info shown in menu

---

## 🚨 Confirmation Dialogs

### What are they?
Popup windows that ask you to confirm actions before proceeding.

### When do they appear?
- **Deleting a goat**: Confirms you want to delete
- **Deleting a user**: Confirms you want to delete
- **Edit form**: Form submits when you click the button

### How to use:
1. Click the red **Cancel** button to go back
2. Click the red **Delete** button to confirm deletion

---

## 📊 Understanding the Dashboard

### Inventory Dashboard Shows:
1. **Total Count**: All goats on farm
2. **Gender**: Male (♂) vs Female (♀) split
3. **Age Groups**:
   - Kids (< 1 year)
   - Yearlings (1-2 years)
   - Adults (2+ years)
4. **Health Status**: Healthy, Sick, Pregnant, Injured
5. **Breeding Status**: Breeding, Non-Breeding, Retired
6. **Summary Metrics**: Efficiency scores

---

## 🔑 Key Features

### 🏷️ Tag Numbers
- Each goat must have a **unique** tag number
- Examples: TAG-001, G-001, SHAFA-01
- Used for quick identification

### 📅 Age Auto-Calculated
- Enter date of birth
- Age in years calculated automatically
- Age group (Kid/Yearling/Adult) assigned automatically

### 👪 Family Relationships
- Track Sires (fathers)
- Track Dams (mothers)
- View multiple generations

### 📝 Activity Tracking
- Every change is logged
- Admin can view activity logs
- See who changed what and when

---

## ⚠️ Important Notes

### Unique Fields
These cannot be duplicated:
- **Tag Numbers**: Each goat's tag must be unique
- **Email Addresses**: Each user's email must be unique

### Confirmation Dialogs
Always appear for:
- Deleting goats
- Deleting users
- Check the details before confirming!

### Data Integrity
- Deleted goats cannot be recovered
- All genealogy records cascade delete
- Activity logs keep permanent record of deletions

---

## 🆘 Troubleshooting

### "User not found" - Can't log in
- Check spelling of email
- Check caps lock on password
- Confirm email exists in system

### "Tag number already exists"
- Each tag must be unique
- Choose a different tag number
- Check existing goats

### Can't see Users menu
- Only Admin accounts see Users link
- Log out and log in as admin@shafafarm.com

### Changes don't appear
- Page may need refresh
- Logout and login again
- Check browser console for errors

### Family tree is empty
- No goats added yet, or
- No pedigree relationships recorded yet
- Add goats first, then establish relationships

---

## 🔄 Workflow Examples

### Adding a New Goat to the Farm

```
1. Click 🐐 Goat Management
2. Click + Add New Goat
3. Fill name: "Daisy"
4. Fill tag: "TAG-002"
5. Pick birth date
6. Select gender: Female
7. Click Add Goat
8. See card appear on screen
9. Check 📊 Inventory to see stats update
```

### Recording a Goat's Parents

```
1. Click 🐐 Goat Management
2. Find daughter goat, click ✎ (edit)
3. Note: Parent links added via Family Tree page
4. OR edit goat and note parents in "Notes" field
5. Save changes
```

### Managing Farm Staff

```
1. Click 👥 Users (Admin only)
2. Click + Add New User
3. Enter: Name, Email, Role, Password
4. Click Create User
5. New staff can now log in
6. To edit: Click ✎ button on user row
7. To remove: Click 🗑 button and confirm
```

---

## 💾 Data Backup Notes

### SQLite Database Location
```
c:\Users\hyz26\shafa farm\backend\database.db
```

### Backup Recommendations
1. Weekly backup of database.db file
2. Keep copies in secure location
3. Test restore procedures

### Activity Log
All changes permanently recorded in activity_log table:
- Who made the change
- What changed
- When it happened
- Old and new values

---

## 🎓 Tips & Tricks

### Keyboard Shortcuts
- **Tab**: Move between form fields
- **Enter**: Submit form
- **Escape**: Close modal (sometimes)

### Smart Tagging
Use consistent naming:
- TAG-001, TAG-002, TAG-003 (sequential)
- G-F-001 (Goat-Female-001)
- G-M-001 (Goat-Male-001)

### Date Input
Click the date field to open calendar picker - easier than typing!

### Mobile Friendly
- All pages work on phones
- Touch-friendly buttons
- Hamburger menu on mobile

---

## 📞 Need Help?

### Check These First:
1. Are you logged in?
2. Do you have the right role?
3. Is the data filled correctly?
4. Check browser console (F12) for errors

### System Info:
- **Backend**: Node.js + Express
- **Database**: SQLite3
- **Frontend**: React 18
- **Ports**: 5000 (backend), 3000 (frontend)

---

## 🎯 Next Steps

1. ✅ Add 5-10 test goats to explore features
2. ✅ Try inventory statistics
3. ✅ View family tree
4. ✅ As admin, try managing users
5. ✅ Test logout and login with different roles
6. ✅ Explore activity logs

**Your Shafa Farm ERP is ready to use!** 🐐🌾
