# 📊 Reports Page - Quick Start Guide

## How to Access the Reports Page

1. **Navigate** to `http://localhost:3000` (or your deployed URL)
2. **Click** the "Reports" link in the main navigation
3. **You'll see** the new Reports Dashboard

## Understanding the Layout

### Top Section - Header
```
[📊 Farm Reports]  [🔄 Refresh Data]
```
- Shows the page title
- Refresh button to reload all data

### Category Navigation
```
[🐐 Goats ✓]  [🐔 Chicken 🔜]  [🌾 Crops 🔜]
```
- Click **Goats** to view goat farm reports (currently active)
- Chicken & Crops are placeholders for future use

### Main Layout
```
┌─────────────────────────────────────────┐
│  Left Sidebar     │    Main Content     │
│  Report Menu      │    Charts & Data    │
│  (sticky)         │                     │
└─────────────────────────────────────────┘
```

## Using Each Report Type

### 1️⃣ **Overall Performance** (📈 Default Report)

**What You See:**
- 6 interactive charts showing farm statistics
- Herd composition (Gender breakdown)
- Health status distribution
- Monthly expense trends
- Vaccination activities
- Expense categorization
- Breed distribution

**How to Use:**
1. Click **📈 Overall Performance** in the sidebar (default selected)
2. Scroll through the charts
3. Hover over chart data for details
4. Charts update automatically when you refresh data

**Key Metrics:**
- Does, Bucks, Kids count
- Healthy vs Sick animals
- 6-month expense trend
- Vaccination history

---

### 2️⃣ **Herd Inventory** (📋 Complete Roster)

**What You See:**
- Complete table of all goats
- Columns: ID, Name, Tag #, Gender, DOB, Breed, Health Status, Weight
- Export button to download data

**How to Use:**
1. Click **📋 Herd Inventory** in sidebar
2. Scroll through the full goat roster
3. Click **📥 Export to Excel** to download as CSV file
4. Opens in Excel/Google Sheets/Numbers

**Export Details:**
- Filename: `Shafa-Farm-Herd-Inventory-[DATE].csv`
- Format: Comma-separated values
- Can be opened in any spreadsheet application

**Example Export:**
```
ID,Name,Tag Number,Gender,Date of Birth,Breed,Health Status,Weight
1,Luna,A001,female,2022-03-15,Boer,Healthy,45
2,Thor,A002,male,2021-06-20,Alpine,Healthy,52
```

---

### 3️⃣ **Breeding Reports** (👶 Coming Soon)

**What You See:**
- Placeholder with planned features
- List of upcoming functionality

**Planned Features:**
- ✓ Breeding calendar and scheduled dates
- ✓ Active breeding pairs tracking
- ✓ Kidding/Birth outcomes and dates
- ✓ Success rates and trends
- ✓ Pregnancy status tracking

**Status:** Under Development

---

### 4️⃣ **Reproductive Efficiency** (♻️ Advanced Analytics)

**What You See:**
- Placeholder for advanced breeding metrics
- Preview of future capabilities

**Planned Features:**
- ✓ Breeding calendar with key dates
- ✓ Pedigree charts showing family relationships
- ✓ Kidding rates and success percentages
- ✓ Inter-breeding interval analysis
- ✓ Lactation cycle tracking
- ✓ Fertility rate trends

**Status:** In Development

---

### 5️⃣ **Genetic / Pedigree** (🧬 Lineage Analysis)

**What You See:**
- Placeholder for genetic analysis tools
- Feature overview

**Planned Features:**
- ✓ Pedigree charts and family trees
- ✓ Genetic diversity analysis
- ✓ Inbreeding coefficient calculation
- ✓ Trait inheritance tracking
- ✓ Ancestry and bloodline reports
- ✓ Genetic performance metrics

**Status:** In Development

---

### 6️⃣ **Sold Goats** (💰 Sales Performance)

**What You See:**
- Sales summary cards (Total Sold, Revenue, Avg Price)
- Detailed sales table

**Summary Cards:**
```
[💰 Total Sold]  [📅 Total Revenue]  [📊 Average Price]
    Count           Total in K            Price in K
```

**Sales Table Columns:**
- ID, Name, Tag #, Gender, Breed, Date Sold, Sale Price

**How to Use:**
1. Click **💰 Sold Goats** in sidebar
2. View summary statistics at the top
3. Scroll to see detailed sales records
4. All prices displayed in Kwacha (K)

**Example Data:**
```
ID    Name     Tag    Gender   Date Sold    Price (K)
1     Luna     A001   ♀ Female 2024-01-15   250,000
2     Thor     A002   ♂ Male   2024-02-10   350,000
```

---

## Summary Dashboard Cards

**Always Visible at Top:**
```
┌─────────────┐ ┌──────────────┐ ┌───────────────┐ ┌──────────────┐
│ 🐐 Total    │ │ 💉 Vaccin.   │ │ 💵 Total      │ │ 💰 Sold      │
│ Goats       │ │ Count        │ │ Expenses      │ │ Goats        │
│             │ │              │ │               │ │              │
│    40       │ │      120     │ │  K 1,250,000  │ │     2        │
└─────────────┘ └──────────────┘ └───────────────┘ └──────────────┘
```

These update when you click **🔄 Refresh Data**

## Tips & Tricks

### 📌 **Sticky Sidebar**
- The sidebar stays in place as you scroll
- Easy access to all report types
- Click any report button to jump to it

### 🔄 **Refresh Data**
- Click the green **🔄 Refresh Data** button anytime
- Updates all charts and tables with latest data
- Use if you've just added new data in Goat Management

### 📥 **Export to Excel**
- Available on **Herd Inventory** report
- Downloads as CSV file automatically
- Can be edited and used in Excel/Google Sheets
- Branded with "Shafa Farm" in filename

### 🎨 **Color Meanings**
- **Green** (#2ecc71) = Active/Healthy/Approved
- **Red** (#e74c3c) = Attention needed/Sick
- **Blue** (#3498db) = Informational
- **Orange** (#f39c12) = Young animals/Trends

### 📊 **Chart Interaction**
- **Hover** over chart elements for detailed values
- **Click** legend items to show/hide data series
- Charts are responsive and resize with window

## Common Questions

### Q: Why is some data showing zero?
**A:** You need to add goats, vaccinations, or expenses first. Use the Goat Management page to add data.

### Q: Can I edit data from the reports?
**A:** No, reports are read-only. Go to Goat Management to edit goat data.

### Q: How often does the data update?
**A:** Data updates when you click **🔄 Refresh Data** or reload the page.

### Q: When will Breeding/Genetic reports be ready?
**A:** These are in development. Check back soon for updates!

### Q: How do I print a report?
**A:** Right-click → Print or Cmd+P, or use your browser's print function.

### Q: Can I export to PDF?
**A:** Currently exports to CSV/Excel. PDF export coming in next update.

### Q: Are mobile devices supported?
**A:** Yes! Reports are fully responsive on phones and tablets.

---

## Quick Access Buttons

| Button | Action |
|--------|--------|
| 🐐 Goats | Switch to goat reports |
| 📈 Overall Performance | View all charts |
| 📋 Herd Inventory | See all goats + export |
| 👶 Breeding Reports | Breeding calendar (coming) |
| ♻️ Reproductive Efficiency | Breeding metrics (coming) |
| 🧬 Genetic / Pedigree | Lineage analysis (coming) |
| 💰 Sold Goats | Sales performance |
| 🔄 Refresh Data | Update all data |
| 📥 Export to Excel | Download inventory |

---

## Need Help?

**Report not loading?**
→ Check your internet connection and click **🔄 Refresh Data**

**Data looks wrong?**
→ Go to Goat Management and verify your data entries

**Charts not showing?**
→ Make sure you have goats and data in the system

**Export not working?**
→ Check browser security settings allow downloads

---

**Last Updated:** February 4, 2026
**Version:** 1.0 (Initial Release)
**Status:** ✅ Ready to Use
