# Activity Log Feature - Quick Start Guide

## 🚀 Getting Started

### Step 1: Start Your Application
```bash
# Terminal 1 - Start Backend
cd backend
npm start
# Should see: Server running on http://localhost:5000

# Terminal 2 - Start Frontend
cd frontend
npm start
# Should see: App running on http://localhost:3000
```

### Step 2: Access Activity Log

1. **Login as Admin**
   - Go to http://localhost:3000/login
   - Use your admin credentials
   - Click Login

2. **Navigate to Activity Log**
   - Click "📋 Activity Log" in the navigation menu (top bar)
   - Wait for page to load

---

## 📋 Feature Overview

### **Main Components**

#### 1. **Statistics Summary** (Top of page)
Shows quick overview cards with activity counts:
- Create on User
- Create on Goat
- Update on User
- Update on Goat
- Delete operations, etc.

#### 2. **Filter Section**
Four filter options:
- **Start Date**: Pick any date to filter from
- **End Date**: Pick any date to filter until
- **Action**: Dropdown (All Actions, Create, Update, Delete)
- **Entity Type**: Dropdown (All Entities, User, Goat)

Buttons:
- **Reset Filters**: Clear all filters
- **📥 Export CSV**: Download filtered logs as CSV

#### 3. **Activity Log Table**
Columns:
- **ID**: Log entry ID
- **Timestamp**: Date and time of activity
- **User**: Name and email of user who made the change
- **Action**: Color-coded badge (Create=Green, Update=Yellow, Delete=Red)
- **Entity**: Color-coded badge (User=Blue, Goat=Purple)
- **Entity ID**: ID of the affected record
- **Description**: What was changed

#### 4. **Pagination**
At bottom:
- **Previous** button (disabled on first page)
- **Page X of Y** indicator
- **Next** button (disabled on last page)

---

## 🧪 Testing Scenarios

### **Test 1: View All Logs**
1. Open Activity Log page
2. Should see table with activities
3. Should see statistics cards at top
4. Scroll down to see more records via pagination

**Expected:** Table displays with real activity data from your database

---

### **Test 2: Filter by Date Range**
1. Click on "Start Date" field
2. Select a date (e.g., January 1, 2024)
3. Click on "End Date" field
4. Select a date (e.g., December 31, 2024)
5. Table should update automatically

**Expected:** Only logs within date range appear

---

### **Test 3: Filter by Action Type**
1. Click "Action" dropdown
2. Select "Create"
3. Table should only show create actions

**Expected:** Only "CREATE" badges appear in Action column

---

### **Test 4: Filter by Entity Type**
1. Click "Entity Type" dropdown
2. Select "User"
3. Table should only show user-related activities

**Expected:** Only "USER" badges appear in Entity column

---

### **Test 5: Combine Multiple Filters**
1. Set Start Date to January 1, 2024
2. Set End Date to June 30, 2024
3. Set Action to "Update"
4. Set Entity Type to "Goat"
5. Table should update with combined filters

**Expected:** Only "Update on Goat" entries between those dates

---

### **Test 6: Reset Filters**
1. Apply several filters
2. Click "Reset Filters" button
3. All filters should be cleared
4. All activities should reappear

**Expected:** Filters cleared, full table visible again

---

### **Test 7: Export CSV**
1. Apply some filters (or use defaults)
2. Click "📥 Export CSV" button
3. File should download: `activity-log-YYYY-MM-DD.csv`
4. Open file in Excel or Google Sheets

**Expected:** 
- File downloads successfully
- Contains headers: ID, Timestamp, User Name, User Email, Action, Entity Type, Entity ID, Description
- Data matches what's shown in table

---

### **Test 8: Pagination**
1. If more than 25 records exist, "Next" button appears
2. Click "Next" 
3. Next 25 records load
4. Click "Previous"
5. First page reappears

**Expected:**
- Page indicator updates (e.g., "Page 1 of 3")
- Data changes when navigating
- Buttons disabled at boundaries

---

### **Test 9: Statistics Cards**
1. Look at top of page
2. Each card shows: number and "action on entity_type"
3. Examples:
   - "25" "create on user"
   - "18" "update on goat"
   - "3" "delete on user"

**Expected:**
- Numbers match count in table when filters applied
- Cards display in grid layout
- Different colors for each card

---

### **Test 10: Non-Admin Access**
1. Login as a regular (non-admin) user
2. Look at navigation menu
3. "📋 Activity Log" link should NOT appear
4. Try accessing `/activity-log` directly in URL
5. Should redirect to dashboard

**Expected:**
- Admin users see "📋 Activity Log" link
- Non-admin users don't see link
- Direct URL access denied for non-admins

---

## 🐛 Common Issues & Solutions

### **Issue: "No activity logs found"**
**Cause:** Database has no activity entries yet
**Solution:** 
- Create a new user
- Update a user
- Create a new goat
- These actions will populate the activity log
- Refresh the Activity Log page

### **Issue: CSV file is empty or corrupted**
**Cause:** Browser security or export error
**Solution:**
- Check browser console (F12) for errors
- Try with a smaller date range
- Check if you have data to export

### **Issue: Pagination doesn't work**
**Cause:** API might not be returning full pagination data
**Solution:**
- Check browser console for API errors
- Refresh the page
- Verify backend is running

### **Issue: Filters not working**
**Cause:** Date format issue
**Solution:**
- Use date picker (don't type dates manually)
- Format should be: YYYY-MM-DD
- Clear filters and try again

### **Issue: Can't access page (white screen)**
**Cause:** JavaScript error or missing dependencies
**Solution:**
- Check browser console (F12) → Console tab
- Look for red error messages
- Restart frontend with: `npm start`

---

## 📊 Sample Data to Test With

If you don't have activity logs, create some test data:

### **Create Test Users:**
1. Go to "👥 Users" page
2. Add 2-3 test users
   - test1@farm.com / Password123!
   - test2@farm.com / Password123!
3. Each creates an activity log entry

### **Update Test Data:**
1. Go to "👥 Users" page
2. Edit user details (name, email, role)
3. Each update creates activity log entry

### **Create Test Goats:**
1. Go to "🐐 Goat Management" page
2. Add 2-3 goats with different details
3. Each creates activity log entry

### **Then Test Activity Log:**
After creating ~10 records, activity log will show data for filtering

---

## 📞 Database Check

To verify activities are being logged, open your SQLite database:

```sql
-- Check if activity_log table exists
SELECT COUNT(*) FROM activity_log;

-- See recent activities
SELECT id, action, entity_type, entity_id, timestamp 
FROM activity_log 
ORDER BY timestamp DESC 
LIMIT 10;

-- See activities by type
SELECT action, entity_type, COUNT(*) as count
FROM activity_log
GROUP BY action, entity_type;
```

---

## ✨ Key Features Checklist

- [x] View all activities in table format
- [x] Filter by date range (start & end date)
- [x] Filter by action type (create/update/delete)
- [x] Filter by entity type (user/goat)
- [x] Pagination for large datasets
- [x] Statistics summary cards
- [x] Export to CSV file
- [x] Admin-only access control
- [x] Responsive design (mobile/tablet/desktop)
- [x] Color-coded activity types
- [x] User information display
- [x] Professional UI styling

---

## 🎯 Next Steps

1. **Test the feature** with your data
2. **Check for errors** in browser console (F12)
3. **Try all filters** to ensure they work
4. **Export a CSV** and open in Excel
5. **Test on mobile** to check responsive design
6. **Report any issues** with specific steps to reproduce

---

## 📚 Related Files

- Frontend Component: `frontend/src/pages/ActivityLog.jsx`
- Styling: `frontend/src/pages/ActivityLog.css`
- Backend API: `backend/server.js` (lines 883-1044)
- Full Documentation: `ACTIVITY_LOG_FEATURE.md`

---

**Enjoy your new Activity Log feature! 🎉**
