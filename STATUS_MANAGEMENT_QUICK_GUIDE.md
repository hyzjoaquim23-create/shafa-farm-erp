# 🐐 Status Management - Quick Reference Guide

## 🎯 Feature Overview

Complete lifecycle management for goats with three status types:

```
┌─────────────────────────────────────────────────────┐
│         GOAT LIFECYCLE TRACKING SYSTEM              │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ACTIVE GOAT                                        │
│  (in inventory)                                     │
│       │                                             │
│       ├──→ 🏥 HEALTH UPDATE                        │
│       │    (healthy/sick/injured/pregnant)         │
│       │                                             │
│       ├──→ 💰 MARK AS SOLD                         │
│       │    (price + date_sold)                     │
│       │    └──→ Removed from Inventory             │
│       │         Listed in Stock Overview           │
│       │         Revenue tracked                    │
│       │                                             │
│       └──→ 🪦 MARK AS DEAD                         │
│            (date_of_death)                         │
│            └──→ Removed from Inventory             │
│                 Tracked in Mortality               │
│                 Records preserved                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 📱 How to Use

### **1. Opening Status Management Modal**

Find the goat card in the Inventory tab:

```
┌──────────────────────────────┐
│ #G001 | ♀ Female            │
├──────────────────────────────┤
│ Breed: Boer                  │
│ DOB: 2021-03-15              │
│ Health: 🟢 Healthy           │
├──────────────────────────────┤
│ [⚕️] [👨‍👩‍👦] [✎] [🗑]    │
│ ^                             │
│ Click this button             │
└──────────────────────────────┘
```

### **2. Status Management Modal Opens**

```
┌─────────────────────────────────┐
│ ⚕️ Manage Status - #G001      × │
├─────────────────────────────────┤
│ [🏥 Health] [💰 Sold] [🪦 Dead] │
├─────────────────────────────────┤
│                                 │
│ Select an action above to       │
│ manage this goat's status       │
│                                 │
│         [Cancel]                │
└─────────────────────────────────┘
```

---

## ⚙️ **Option 1: Health Status Update**

### Click 🏥 Health Status

```
┌─────────────────────────────────┐
│ ⚕️ Manage Status - #G001      × │
├─────────────────────────────────┤
│ [🏥 Health*] [💰 Sold] [🪦 Dead]│
├─────────────────────────────────┤
│ Health Status *                 │
│ ┌─────────────────────────────┐ │
│ │ 🟢 Healthy ▼               │ │
│ │ 🔴 Sick                    │ │
│ │ 🟡 Injured                 │ │
│ │ 🤰 Pregnant                │ │
│ └─────────────────────────────┘ │
│                                 │
│    [Cancel] [Update Status]     │
└─────────────────────────────────┘
```

### Steps:
1. Click dropdown to see options
2. Select new status (e.g., 🔴 Sick)
3. Click "Update Health Status"
4. Goat remains in inventory
5. Status reflected in Stock Overview

### What Happens:
- ✅ Health status updated immediately
- ✅ Activity log recorded
- ✅ Stock Overview health counts updated
- ✅ Goat remains visible in inventory

---

## 💰 **Option 2: Mark as Sold**

### Click 💰 Mark as Sold

```
┌─────────────────────────────────┐
│ ⚕️ Manage Status - #G001      × │
├─────────────────────────────────┤
│ [🏥 Health] [💰 Sold*] [🪦 Dead]│
├─────────────────────────────────┤
│ Selling Price (K) *             │
│ ┌─────────────────────────────┐ │
│ │ [______________________]   │ │
│ │ Enter price in Kwacha       │ │
│ └─────────────────────────────┘ │
│                                 │
│ Date Sold *                     │
│ ┌─────────────────────────────┐ │
│ │ 2024-01-15 (today)         │ │
│ └─────────────────────────────┘ │
│                                 │
│ ℹ️ Sold goats will be removed   │
│ from the inventory but tracked  │
│ in Stock Overview.              │
│                                 │
│    [Cancel] [Mark as Sold]      │
└─────────────────────────────────┘
```

### Steps:
1. Enter selling price in Kwacha (K)
   - Example: `25000` for K 25,000.00
2. Date defaults to today (change if needed)
3. Click "Mark as Sold"
4. Goat disappears from inventory
5. Revenue added to Stock Overview

### What Happens:
- ✅ Goat removed from Inventory tab
- ✅ Added to "Sold Goats" count in Stock Overview
- ✅ Revenue accumulated (K 25,000.00)
- ✅ Sales record preserved in database
- ✅ Activity logged with price

### Example:
```
Before:         After:
[Active: 45]    [Active: 44]
[Sold: 0]  →    [Sold: 1]
[Revenue: 0]    [Revenue: K 25,000.00]
```

---

## 🪦 **Option 3: Mark as Dead**

### Click 🪦 Mark as Dead

```
┌─────────────────────────────────┐
│ ⚕️ Manage Status - #G001      × │
├─────────────────────────────────┤
│ [🏥 Health] [💰 Sold] [🪦 Dead*]│
├─────────────────────────────────┤
│ Date of Death *                 │
│ ┌─────────────────────────────┐ │
│ │ 2024-01-15 (today)         │ │
│ └─────────────────────────────┘ │
│                                 │
│ ⚠️ This action will record the  │
│ goat's death and remove it from │
│ active inventory.               │
│                                 │
│    [Cancel] [Mark as Dead]      │
└─────────────────────────────────┘
```

### Steps:
1. Date defaults to today (change if needed)
2. Click "Mark as Dead"
3. Goat disappears from inventory
4. Recorded as deceased in Stock Overview
5. Mortality record preserved

### What Happens:
- ✅ Goat removed from Inventory tab
- ✅ Added to "Deceased" count in Stock Overview
- ✅ Death date recorded in database
- ✅ Mortality tracking updated
- ✅ Activity logged with death date

### Example:
```
Before:           After:
[Active: 45]      [Active: 44]
[Deceased: 0] →   [Deceased: 1]
```

---

## 📊 Stock Overview Changes

### Main Stats Section

```
┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│ 🐐 Total       │  │ 💰 Sold        │  │ 🪦 Deceased    │
│ 44 Goats       │  │ 1 Goat         │  │ 1 Goat         │
│                │  │ K 25,000.00    │  │                │
└────────────────┘  └────────────────┘  └────────────────┘
```

### What Each Card Shows:

**Total Goats (🐐)**
- Count of active goats in inventory
- Excludes sold and dead goats

**Sold (💰)**
- Number of goats that have been sold
- Total revenue from all sales
- Displayed as "K X,XXX.XX"

**Deceased (🪦)**
- Number of goats that have died
- Separate tracking for mortality analysis

---

## 🔢 Statistics Calculations

### Important Update:

**All percentages now calculated for ACTIVE goats only:**

```
OLD CALCULATION (❌ Before):
Health Healthy: 40 / 45 = 88.9%
(This was counting ALL goats)

NEW CALCULATION (✅ After):
Health Healthy: 40 / 44 = 90.9%
(Only counts active goats, excludes sold & dead)

Result: More accurate health metrics!
```

### Why This Matters:

When you sell or lose an animal:
- Total inventory decreases
- Other percentages recalculate
- Herd statistics stay accurate
- Better insight into active herd health

---

## 🎨 Visual Indicators

### Goat Card Status Badges

```
Health Status:          Breeding Status:
🟢 Healthy              👫 Breeding
🔴 Sick                 ✗ Non-Breeding
🟡 Injured              ⏸ Retired
🤰 Pregnant
```

### Modal Action Buttons

```
Button Style When Inactive:    Button Style When Selected:
┌─────────────────────┐        ┌─────────────────────┐
│ 🏥 Health Status    │        │ 🏥 Health Status    │
│ (white bg, gray     │   →    │ (green bg, white    │
│  border)            │        │  text, bold)        │
└─────────────────────┘        └─────────────────────┘
```

---

## ⚠️ Important Notes

### Permissions:
- **Owners**: Can VIEW status but CANNOT update
- **Managers/Admins**: Full access to update status

### Date Handling:
- Dates default to TODAY'S DATE
- Can be changed manually if needed
- Format: YYYY-MM-DD (e.g., 2024-01-15)

### Price Input:
- Enter NUMBERS ONLY
- Use decimal point for cents (e.g., 25000.50)
- Currency automatically shown as K when displayed

### Reversibility:
- ⚠️ Actions cannot be undone from UI
- All changes logged in Activity Log
- Database records preserved

---

## 📋 Workflow Examples

### Example 1: Goat Gets Sick
```
1. Goat #G001 appears sick
2. Click ⚕️ on goat card
3. Select 🏥 Health Status
4. Choose 🔴 Sick from dropdown
5. Click "Update Health Status"
6. Stock Overview health counts updated
7. Staff knows to monitor this animal
```

### Example 2: Sell a Goat
```
1. Sold goat #G002 to buyer
2. Click ⚕️ on goat card
3. Select 💰 Mark as Sold
4. Enter price: 25000
5. Date already set to today (2024-01-15)
6. Click "Mark as Sold"
7. Goat disappears from Inventory
8. Stock Overview shows: K 25,000.00 revenue
9. Management can track income
```

### Example 3: Animal Dies
```
1. Goat #G003 dies in pen
2. Click ⚕️ on goat card
3. Select 🪦 Mark as Dead
4. Confirm date of death
5. Click "Mark as Dead"
6. Goat removed from inventory
7. Mortality count incremented
8. Record preserved for analysis
```

---

## 🔍 Finding Sold/Dead Goats

### View in Different Tabs:

**Inventory Tab (📋)**
- Shows only ACTIVE goats
- Sold and dead goats NOT visible here

**Stock Overview Tab (📊)**
- Shows ALL statistics
- Sold count: 5 goats
- Deceased count: 2 goats
- Revenue from sales: K 125,000.00

---

## ✨ Quick Tips

1. **Bulk Operations**: Not yet available - update one goat at a time
2. **Activity Audit**: Check Activity Log for all status changes
3. **Date Validation**: Cannot set dates in the future
4. **Price Accuracy**: Double-check prices before confirming
5. **Status Updates**: Health changes don't remove goats from inventory (only sold/dead do)

---

## 🚀 Status Management Feature Ready!

All systems operational for tracking goat lifecycle events.
Use this feature to maintain accurate records of your herd.
