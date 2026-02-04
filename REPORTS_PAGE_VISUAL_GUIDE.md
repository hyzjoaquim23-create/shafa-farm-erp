# 📊 Reports Page - Visual Summary

## Page Structure Overview

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                    📊 Farm Reports  [🔄 Refresh Data]                        ║
║                  (Green gradient header with Shafa Farm branding)             ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  [🐐 Goats ✓ Active]  [🐔 Chicken 🔜 Coming Soon]  [🌾 Crops 🔜 Coming Soon] ║
║                     (Category Navigation Bar)                                 ║
╠════════════════════════════════╦════════════════════════════════════════════╣
║   SIDEBAR (250px)              ║   MAIN CONTENT AREA                        ║
║                                ║                                            ║
║  📋 Goat Reports               ║  ┌──────────────────────────────────────┐  ║
║  ├─ 📈 Overall Performance     ║  │  Summary Cards (4 columns)           │  ║
║  ├─ 📋 Herd Inventory          ║  │  [🐐 Total] [💉 Vacc] [💵 Expenses] │  ║
║  ├─ 👶 Breeding Reports        ║  │  [💰 Sold]                          │  ║
║  ├─ ♻️ Reproductive Efficiency  ║  └──────────────────────────────────────┘  ║
║  ├─ 🧬 Genetic / Pedigree      ║                                            ║
║  └─ 💰 Sold Goats              ║  ┌──────────────────────────────────────┐  ║
║                                ║  │  Report Content (Dynamic)            │  ║
║  (Sticky on scroll)            ║  │                                      │  ║
║                                ║  │  Charts Grid (Responsive Layout):    │  ║
║                                ║  │  ┌─────────────┐ ┌─────────────┐   │  ║
║                                ║  │  │ Herd Comp.  │ │Health Status│   │  ║
║                                ║  │  │   (Pie)     │ │ (Doughnut)  │   │  ║
║                                ║  │  └─────────────┘ └─────────────┘   │  ║
║                                ║  │  ┌─────────────┐ ┌─────────────┐   │  ║
║                                ║  │  │ Monthly Exp │ │Vaccinations │   │  ║
║                                ║  │  │   (Line)    │ │    (Bar)    │   │  ║
║                                ║  │  └─────────────┘ └─────────────┘   │  ║
║                                ║  │  ┌─────────────┐ ┌─────────────┐   │  ║
║                                ║  │  │Exp by Categ │ │Breed Distrib│   │  ║
║                                ║  │  │    (Bar)    │ │   (Pie)     │   │  ║
║                                ║  │  └─────────────┘ └─────────────┘   │  ║
║                                ║  │                                      │  ║
║                                ║  └──────────────────────────────────────┘  ║
║                                ║                                            ║
║                                ║  ┌──────────────────────────────────────┐  ║
║                                ║  │  Data Tables (with Export Options)   │  ║
║                                ║  │  [📥 Export to Excel]                │  ║
║                                ║  │                                      │  ║
║                                ║  │  ID │ Name │ Tag │ Gender │ Breed   │  ║
║                                ║  │  ───┼──────┼─────┼────────┼────────  │  ║
║                                ║  │  1  │ Luna │ A01 │   ♀    │ Boer     │  ║
║                                ║  │  2  │ Thor │ B02 │   ♂    │ Alpine   │  ║
║                                ║  │  ... │  ... │ ... │  ...   │  ...     │  ║
║                                ║  │                                      │  ║
║                                ║  └──────────────────────────────────────┘  ║
╚════════════════════════════════╩════════════════════════════════════════════╝
```

## Features by Report Type

### 📈 Overall Performance
```
Displays 6 interactive charts:
1. 🥧 Herd Composition (Pie) → Does, Bucks, Kids distribution
2. 🍩 Health Status (Doughnut) → Healthy, Sick, Unknown counts
3. 📈 Expenses Trend (Line) → 6-month expense progression
4. 📊 Vaccinations (Bar) → Monthly vaccination activities
5. 💳 Expenses by Category (Bar) → Livestock, Crops, General split
6. 🎨 Breed Distribution (Pie) → Different breed percentages
```

### 📋 Herd Inventory
```
Table with columns:
- ID, Name, Tag #, Gender, DOB, Breed, Health Status, Weight

Features:
✓ Full goat roster display
✓ [📥 Export to Excel] button
✓ Responsive table layout
✓ Status badges (Healthy/Sick/Unknown)
```

### 👶 Breeding Reports
```
Placeholder with planned features:
✓ Breeding calendar
✓ Active breeding pairs
✓ Kidding outcomes
✓ Success rates
✓ Pregnancy tracking
```

### ♻️ Reproductive Efficiency
```
Placeholder with planned metrics:
✓ Breeding calendar with dates
✓ Pedigree charts
✓ Kidding rates
✓ Inter-breeding intervals
✓ Lactation tracking
✓ Fertility trends
```

### 🧬 Genetic / Pedigree
```
Placeholder with planned analysis:
✓ Pedigree trees
✓ Genetic diversity
✓ Inbreeding coefficients
✓ Trait inheritance
✓ Ancestry reports
✓ Genetic metrics
```

### 💰 Sold Goats
```
Sales dashboard showing:
- Total sold goats count
- Total revenue (in K)
- Average sale price (in K)

Data table with:
- ID, Name, Tag #, Gender, Breed, Date Sold, Sale Price
✓ Highlighted sold rows
✓ Currency formatting
```

## Color Scheme
```
Primary Green:    #2ecc71 (Shafa Farm brand color)
Dark Green:       #27ae60 (Hover/Active state)
Background:       #f9f9f9 / #f5f5f5
Text:             #333 (Dark gray)
Light Border:     #e0e0e0
Card Background:  White with subtle shadows
```

## Button States
```
Default:   Light gray with green border on hover
Active:    Green background with white text
Disabled:  Opacity 0.6, cursor not-allowed
Hover:     Slight shadow and color shift
```

## Responsive Breakpoints
```
Desktop (>768px):     2-column grid layout (Sidebar + Content)
Mobile (<768px):      1-column layout, sidebar above content
Tablets (>600px):     Single-column charts
Small screens:        Stacked cards and full-width tables
```

## Data Flow
```
Frontend (React)
    ↓
[GET] /api/goats
[GET] /api/vaccinations
[GET] /api/expenses
[GET] /api/dashboard
    ↓
Backend (Node.js + SQLite)
    ↓
Data Processing & Calculations
    ↓
Chart.js Visualization
    ↓
Display & Export (CSV)
```

## Export Format (Excel)
```
Shafa-Farm-Herd-Inventory-[DD/MM/YYYY].csv

CSV Headers:
ID,Name,Tag Number,Gender,Date of Birth,Breed,Health Status,Weight

Sample Data:
1,"Luna","A001","female","2022-03-15","Boer","Healthy","45"
2,"Thor","A002","male","2021-06-20","Alpine","Healthy","52"
3,"Star","A003","female","2023-01-10","Saanen","Healthy","38"
```

---
**Design Philosophy:** Clean, modern, professional with strong focus on data visualization and usability
**Target Users:** Farm managers, veterinarians, decision-makers
**Status:** ✅ Production Ready
