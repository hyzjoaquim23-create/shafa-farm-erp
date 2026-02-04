# 🎯 Status Management - Quick Reference Card

## Feature Quick Start

### **Three Actions Available:**

```
┌─────────────────────────────────────────┐
│         STATUS MANAGEMENT MODAL         │
├─────────────────────────────────────────┤
│                                         │
│  [🏥 Health]  [💰 Sold]  [🪦 Dead]    │
│                                         │
│  Pick one above ↑                       │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🏥 Health Status Update

**Click:** 🏥 Health Status  
**Select:** Healthy | Sick | Injured | Pregnant  
**Result:** Status updates, goat stays in inventory  

```javascript
// What happens in database:
UPDATE goats SET health_status = 'sick' WHERE id = 1;
```

**Icons:**
- 🟢 = Healthy
- 🔴 = Sick  
- 🟡 = Injured
- 🤰 = Pregnant

---

## 💰 Mark as Sold

**Click:** 💰 Mark as Sold  
**Enter:**
- Price: `25000` (for K 25,000.00)
- Date: Defaults to today  

**Result:** Goat disappears from inventory, revenue tracked

```javascript
// What happens in database:
UPDATE goats SET 
  is_sold = 1,
  sold_price = 25000,
  date_sold = '2024-01-15'
WHERE id = 1;
```

**Display in Stock Overview:**
```
💰 Sold: 1 goat
Revenue: K 25,000.00
```

---

## 🪦 Mark as Dead

**Click:** 🪦 Mark as Dead  
**Enter:** Confirm date (defaults to today)  
**Result:** Goat disappears from inventory, mortality recorded

```javascript
// What happens in database:
UPDATE goats SET 
  is_dead = 1,
  date_of_death = '2024-01-15'
WHERE id = 1;
```

**Display in Stock Overview:**
```
🪦 Deceased: 1 goat
```

---

## 📍 Where to Find It

### **On Goat Card:**
```
┌──────────────────────┐
│ #G001 | ♀ Female    │
├──────────────────────┤
│ Breed: Boer          │
│ DOB: 2021-03-15      │
│ Health: 🟢 Healthy   │
├──────────────────────┤
│ [⚕️] [👨‍👩‍👦] [✎] [🗑]    │
│  ↑                    │
│  CLICK THIS BUTTON    │
└──────────────────────┘
```

### **In Stock Overview:**
```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ 🐐 Total 44 │  │ 💰 Sold 1   │  │ 🪦 Dead 0   │
│             │  │ K 25,000.00 │  │             │
└─────────────┘  └─────────────┘  └─────────────┘
```

---

## 🔄 Data Changes

### **Before Selling a Goat:**
```
Inventory:      45 goats
- Healthy:      40
- Sick:         3
- Pregnant:     2

Sold:           0 goats
Dead:           0 goats
Revenue:        K 0
```

### **After Selling One Goat for K 25,000:**
```
Inventory:      44 goats
- Healthy:      39
- Sick:         3
- Pregnant:     2

Sold:           1 goat
Dead:           0 goats
Revenue:        K 25,000.00
```

---

## ✨ Quick Tips

| Tip | Action |
|-----|--------|
| **Goat not visible?** | Check if marked sold/dead in history |
| **Wrong price entered?** | Not reversible from UI (use admin panel) |
| **Need history?** | Check Activity Log tab |
| **Mobile user?** | Modal responsive, tap to expand |
| **Date in future?** | Can't save - use today or past date |

---

## 🔐 Who Can Use It?

| Role | Access |
|------|--------|
| **Owner** | ❌ Can't update (view only) |
| **Manager** | ✅ Full access |
| **Admin** | ✅ Full access |
| **Staff** | ❌ Can't update (view only) |

---

## 📋 What Gets Logged

Every action is recorded:
```
Date: 2024-01-15 14:23:45
User: John (Manager)
Action: Mark as Sold
Goat: #G001 - Boer Female
Details: Sold for K 25,000.00 on 2024-01-15
```

---

## 💾 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Tab** | Navigate form fields |
| **Enter** | Submit form |
| **Esc** | Close modal |
| **↑↓** | Dropdown selection |

---

## 🎯 Common Workflows

### **Workflow 1: Animal Gets Sick**
```
1. Find goat in Inventory
2. Click ⚕️ 
3. Click 🏥 Health Status
4. Select 🔴 Sick
5. Click "Update"
✓ Status updated, goat still visible
```

### **Workflow 2: Sell an Animal**
```
1. Find goat in Inventory
2. Click ⚕️
3. Click 💰 Mark as Sold
4. Enter price: 25000
5. Date auto-filled (today)
6. Click "Mark as Sold"
✓ Goat hidden, revenue tracked
```

### **Workflow 3: Animal Dies**
```
1. Find goat in Inventory
2. Click ⚕️
3. Click 🪦 Mark as Dead
4. Confirm date (today)
5. Click "Mark as Dead"
✓ Goat hidden, mortality recorded
```

---

## 📊 Stock Overview Interpretation

```
Total Goats: 44
├─ Active in inventory
├─ Excludes: sold & dead
└─ Uses: is_sold=0 AND is_dead=0

Sold Goats: 5
├─ Count of sold animals
├─ Not in inventory
└─ Uses: is_sold=1

Sold Revenue: K 125,000.00
├─ Sum of all selling prices
├─ Only active sales
└─ Format: K X,XXX.XX

Deceased Goats: 2
├─ Count of dead animals
├─ Not in inventory
└─ Uses: is_dead=1
```

---

## 🚨 Important Notes

⚠️ **Once marked sold or dead:**
- Can't be unmarked from interface
- Removed from inventory permanently
- Only visible in historical records
- Contact admin if reversal needed

✅ **Health status updates:**
- Can be changed anytime
- Don't remove goat from inventory
- Immediately visible in Stock Overview
- All changes logged

---

## 📞 Getting Help

**Where to Check:**
1. **Stock Overview** - See if goat is listed there
2. **Activity Log** - Search for goat number (#G001)
3. **Quick Guide** - Full user instructions
4. **Manager** - Ask about permissions

---

## 🔢 Input Format Reference

| Field | Format | Example |
|-------|--------|---------|
| **Price** | Numbers only | `25000` or `25000.50` |
| **Date** | YYYY-MM-DD | `2024-01-15` |
| **Status** | Dropdown only | Select from list |
| **Tag Number** | Auto filled | Can't change |

---

## ⏱️ Time-Saving Tips

1. **Batch view**: Check Stock Overview for all sold/dead
2. **Quick update**: Health status takes <30 seconds
3. **Report usage**: Use Stock Overview instead of manual counting
4. **Audit check**: Activity Log has all changes with timestamps

---

## 🎓 Learning Path

**Beginner Level:**
1. Read this quick ref card
2. Try updating health status
3. Check Stock Overview

**Intermediate Level:**
1. Record your first sale
2. Check Activity Log for proof
3. Review revenue in dashboard

**Advanced Level:**
1. Analyze sales trends
2. Calculate mortality rates
3. Generate reports

---

## ✅ Verification Checklist

After updating status:
- [ ] Modal closed without errors
- [ ] Success message appeared
- [ ] Goat visible/hidden as expected
- [ ] Stock Overview updated
- [ ] Activity Log shows change

---

**Last Updated**: January 15, 2024  
**Version**: 1.0  
**Status**: Production Ready ✅

---

## 📱 Mobile Tips

- **Small screen?** Modal still works
- **Touch targets** sized for fingers
- **Scrollable** if form extends below
- **Portrait mode** works best
- **Landscape mode** also supported

---

**Your farm is ready to track goat status professionally!** 🐐
