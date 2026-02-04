# Quick Start Guide - Delivery & Reports Features 🚀

## What's New in Shafa Farm ERP

### 1. Pregnancy Delivery Module 🐣

#### Where to Find It
- **Navigation:** Goat Management → 🐣 Delivery Tab

#### How to Use It
1. Open the **Delivery** tab in Goat Management
2. View all pregnant goats in the list (active, not sold/dead)
3. Click **🐣 Record Delivery** on any pregnant goat
4. A modal appears with the mother's information:
   - Tag #
   - Breed (will be inherited by baby if not changed)
   - Color (will be inherited by baby if not changed)
5. Fill in the baby goat details:
   - **Tag Number** (required) - e.g., "BABY-001"
   - **Gender** (required) - Select Male (♂) or Female (♀)
   - **Breed** (optional) - Leave blank to inherit from mother
   - **Color** (optional) - Leave blank to inherit from mother
6. Click **Record Delivery**
7. System will:
   - Create the baby goat
   - Update mother's status from "pregnant" to "healthy"
   - Create family relationship (pedigree)
   - Log the activities automatically

#### What Happens After
- Baby goat appears in inventory
- Mother can be used for breeding again (no longer pregnant)
- Both animals have activity log entries
- You can view the family tree showing parent-child relationships

---

### 2. Professional PDF Reports 📄

#### Where to Find It
- **Navigation:** Reports → 📄 Dead & Sold Goats

#### How to Use It
1. Open the **Reports** section
2. Click **📄 Dead & Sold Goats** button
3. (Optional) Set date range:
   - Click **From** and select start date
   - Click **To** and select end date
4. (Optional) Click dropdown to filter:
   - **All (Dead & Sold)** - Shows both dead and sold goats
   - **Dead Only** - Shows only dead goats
   - **Sold Only** - Shows only sold goats
5. Click **📊 Load Report** button
6. View the report showing:
   - **Summary Cards:**
     - Total Records
     - Dead Count (red)
     - Sold Count (green)
     - Total Sales Value
   - **Details Table:** Shows each goat with:
     - Tag number
     - Breed
     - Gender
     - Date of Birth
     - Status (☠️ DEAD or 💰 SOLD)
     - Date of death/sale
     - Sale price (if sold)
7. Click **📥 Download PDF Report** to get professional PDF

#### PDF Report Features
- ✅ Professional "SHAFA FARM" header
- ✅ Company letterhead styling
- ✅ Summary statistics box
- ✅ Complete data table
- ✅ Date range printed on report
- ✅ Automatic page breaks with headers repeated
- ✅ Professional footer
- ✅ Ready to print or email to stakeholders

---

## System Features

### Automatic Features
- ✅ Baby goats automatically inherit breed and color from mother
- ✅ Baby goats automatically set to the same location as mother
- ✅ Baby goats automatically set to "healthy" health status
- ✅ Activity log automatically updated for both baby and mother
- ✅ Pedigree relationships automatically created
- ✅ Sold/dead goats automatically deactivated (can't be edited)
- ✅ Stock overview automatically excludes sold/dead goats

### Validation & Safety
- ✅ Only pregnant goats can record delivery
- ✅ Tag number and gender are required for baby goats
- ✅ Can't mark goats as both sold and dead
- ✅ Admin can reactivate sold/dead goats if needed
- ✅ Modal prevents accidental submissions

---

## Key Information

### Delivery Requirements
- Mother goat must have health status = "pregnant"
- Baby goat tag number must be unique
- Baby goat must have assigned gender

### Report Filtering
- Date range filtering works with all report types
- Can filter by Dead, Sold, or Both
- Summary statistics update based on filters
- PDF includes filter details in metadata

### Data Consistency
- All changes are immediately reflected in the system
- Activity logs track all events
- Pedigree relationships enable family tree viewing
- Status changes are permanent until admin reactivates

---

## Tips & Best Practices

### For Delivery Recording
1. **Tag Numbering:** Use consistent naming like "BABY-001", "BABY-002"
2. **Timing:** Record delivery immediately after birth
3. **Details:** Inherit breed/color when uncertain about baby's genetics
4. **Verification:** Check inventory to confirm baby appeared

### For Reports
1. **Date Range:** Use for tracking seasonal deaths or sales
2. **Status Filter:** Separate analysis for mortality vs. sales trends
3. **PDF Sharing:** Share reports with stakeholders or accountants
4. **Archives:** Keep monthly/annual PDF copies for records
5. **Export:** Use browser print functionality for additional formats

---

## Troubleshooting

### Delivery Modal Won't Open
- ✅ Ensure goat is selected and is pregnant
- ✅ Check goat hasn't been marked as sold or dead
- ✅ Try refreshing the page

### Baby Goat Not Appearing
- ✅ Click Refresh button to reload inventory
- ✅ Check that tag number is unique
- ✅ Verify no database errors in console

### PDF Won't Download
- ✅ Check date range is valid (start ≤ end)
- ✅ Ensure at least one goat matches filter
- ✅ Check browser allows downloads
- ✅ Verify internet connection is active

### Report Shows No Data
- ✅ Click "Load Report" button first
- ✅ Check date range includes your goats
- ✅ Verify goats are marked as dead or sold
- ✅ Try removing date filters to see all records

---

## API Quick Reference (For Developers)

### Record Delivery
```
POST /api/goats/:id/deliver
Body: { tag_number, gender, breed?, color? }
Response: { message, baby, mother }
```

### Download PDF
```
POST /api/reports/dead-sold-pdf
Body: { startDate?, endDate?, includeType }
Response: PDF file download
```

### Get Summary
```
GET /api/reports/dead-sold-summary?startDate=X&endDate=Y
Response: { total, dead, sold, totalSalesValue, goats }
```

---

## Support

For issues or questions:
1. Check the Activity Log for system events
2. Review the Family Tree for relationships
3. Verify goat status in inventory
4. Check user role (delivery requires user role, PDF requires token)

---

## Success Criteria Met ✅

- ✅ Only pregnant goats can deliver
- ✅ Clicking deliver button opens modal to add baby goat
- ✅ After adding baby, pregnant mother updates to healthy
- ✅ Dead/sold goats list in professional PDF report
- ✅ PDF has professional header "SHAFA FARM"
- ✅ PDF is downloadable
- ✅ Date filtering works
- ✅ Report looks professional and real

---

**Last Updated:** Today
**Status:** ✅ Ready for Production Use
