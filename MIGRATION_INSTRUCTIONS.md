# Database Migration Guide

## What to Do

Your goat management system has been updated to:
- ✅ Remove goat names (use only tag numbers)
- ✅ Remove Goat List tab
- ✅ Simplify Family Tree to Mother + Children

**Now you need to run ONE command to update your database.**

## How to Run the Migration

### Step 1: Open Terminal
Go to the project folder and navigate to backend:
```
cd backend
```

### Step 2: Run the Migration
```
node migrate-remove-names.js
```

### Step 3: What You'll See
```
Connected to SQLite database
Starting migration: Removing name column from goats table...
New goats_new table created
Data copied to new table
Old goats table dropped
✅ Migration complete! Name column removed from goats table
All goats now identified by tag_number only

New table structure:
  - id: INTEGER
  - tag_number: TEXT
  - date_of_birth: DATE
  - gender: TEXT
  - breed: TEXT
  - color: TEXT
  - health_status: TEXT
  - location: TEXT
  - weight: REAL
  - breeding_status: TEXT
  - notes: TEXT
  - created_at: DATETIME
  - updated_at: DATETIME
```

## That's It!

After seeing "✅ Migration complete!", your database is ready.

**All your goat data is preserved!** Only the `name` field is removed.

## Testing

1. **Refresh browser** or restart frontend
2. **Navigate to** `/goats`
3. **Verify:**
   - Goat cards show only `#TAG_NUMBER`
   - Add/Edit form has no "Name" field
   - Search works by tag number
   - Family tree shows simplified view
   - Everything else works normally

## If Something Goes Wrong

The migration creates a backup of your data before making changes. If anything fails:

1. **Check the error message** in the terminal
2. **Your original data is still safe** (migration uses a transaction)
3. **Contact support** with the error message

## Questions?

- **What happened to goat names?** They're permanently removed to simplify the system
- **Will this break anything?** No - tag_number was always unique and is now the only identifier
- **Can I undo this?** The migration creates a backup, but it's not reversible
- **What if a goat has no tag number?** All goats must have a tag_number (it was required anyway)

---

**Run the migration command above to complete the update!**
