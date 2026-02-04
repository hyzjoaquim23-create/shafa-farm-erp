const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
});

db.run('PRAGMA foreign_keys = ON');

// Helper to run queries with promises
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const seedData = async () => {
  try {
    console.log('Starting comprehensive seed...');

    // Clear existing data (keeping users and sessions)
    await dbRun('DELETE FROM activity_log');
    await dbRun('DELETE FROM vaccination_records');
    await dbRun('DELETE FROM goat_pedigree');
    await dbRun('DELETE FROM expenses');
    await dbRun('DELETE FROM vaccines');
    await dbRun('DELETE FROM goats');

    // ==================== SEED GOATS ====================
    console.log('Seeding goats...');
    
    const goatData = [
      // Breeding does (females)
      { name: 'Luna', tag: 'DOE-001', dob: '2020-03-15', gender: 'female', breed: 'Alpine', color: 'Brown', health: 'healthy', location: 'Pen A', weight: 75, breeding_status: 'breeding' },
      { name: 'Stella', tag: 'DOE-002', dob: '2021-05-22', gender: 'female', breed: 'Saanen', color: 'White', health: 'healthy', location: 'Pen A', weight: 68, breeding_status: 'breeding' },
      { name: 'Bella', tag: 'DOE-003', dob: '2019-11-08', gender: 'female', breed: 'Nubian', color: 'Black', health: 'healthy', location: 'Pen B', weight: 82, breeding_status: 'breeding' },
      { name: 'Daisy', tag: 'DOE-004', dob: '2022-02-14', gender: 'female', breed: 'Alpine', color: 'White/Brown', health: 'pregnant', location: 'Pen C', weight: 71, breeding_status: 'breeding' },
      
      // Breeding bucks (males)
      { name: 'Thor', tag: 'BUCK-001', dob: '2019-06-10', gender: 'male', breed: 'Alpine', color: 'Brown', health: 'healthy', location: 'Pen D', weight: 95, breeding_status: 'breeding' },
      { name: 'Simba', tag: 'BUCK-002', dob: '2020-08-25', gender: 'male', breed: 'Nubian', color: 'Black', health: 'healthy', location: 'Pen D', weight: 105, breeding_status: 'breeding' },
      
      // Kids (young goats)
      { name: 'Sunny', tag: 'KID-001', dob: '2024-03-10', gender: 'female', breed: 'Alpine', color: 'Brown', health: 'healthy', location: 'Pen E', weight: 22, breeding_status: 'non-breeding' },
      { name: 'Rocky', tag: 'KID-002', dob: '2024-03-10', gender: 'male', breed: 'Alpine', color: 'Brown', health: 'healthy', location: 'Pen E', weight: 25, breeding_status: 'non-breeding' },
      { name: 'Milo', tag: 'KID-003', dob: '2024-04-05', gender: 'male', breed: 'Saanen', color: 'White', health: 'healthy', location: 'Pen E', weight: 20, breeding_status: 'non-breeding' },
      { name: 'Lily', tag: 'KID-004', dob: '2024-04-05', gender: 'female', breed: 'Saanen', color: 'White', health: 'healthy', location: 'Pen E', weight: 19, breeding_status: 'non-breeding' },
      { name: 'Shadow', tag: 'KID-005', dob: '2024-05-20', gender: 'male', breed: 'Nubian', color: 'Black', health: 'sick', location: 'Pen F', weight: 18, breeding_status: 'non-breeding' },
      
      // Retired/Non-breeding
      { name: 'Molly', tag: 'DOE-005', dob: '2018-01-12', gender: 'female', breed: 'Alpine', color: 'Brown', health: 'healthy', location: 'Pen G', weight: 73, breeding_status: 'retired' },
    ];

    const goatIds = {};
    for (const goat of goatData) {
      const id = await dbRun(
        `INSERT INTO goats (name, tag_number, date_of_birth, gender, breed, color, health_status, location, weight, breeding_status, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [goat.name, goat.tag, goat.dob, goat.gender, goat.breed, goat.color, goat.health, goat.location, goat.weight, goat.breeding_status, `${goat.breed} goat at Shafa Farm`]
      );
      goatIds[goat.tag] = id;
      console.log(`  - ${goat.name} (${goat.tag}): ID ${id}`);
    }

    // ==================== SEED GOAT PEDIGREE (FAMILY TREE) ====================
    console.log('Seeding pedigree (family tree)...');
    
    const pedigreeData = [
      // Sunny and Rocky are children of Luna and Thor
      { child: 'KID-001', sire: 'BUCK-001', dam: 'DOE-001' },
      { child: 'KID-002', sire: 'BUCK-001', dam: 'DOE-001' },
      // Milo and Lily are children of Stella and Thor
      { child: 'KID-003', sire: 'BUCK-001', dam: 'DOE-002' },
      { child: 'KID-004', sire: 'BUCK-001', dam: 'DOE-002' },
      // Shadow is child of Bella and Simba
      { child: 'KID-005', sire: 'BUCK-002', dam: 'DOE-003' },
      // Bella is daughter of Molly (and some other sire)
      { child: 'DOE-003', dam: 'DOE-005', sire: 'BUCK-001' },
    ];

    for (const ped of pedigreeData) {
      const childId = goatIds[ped.child];
      const sireId = ped.sire ? goatIds[ped.sire] : null;
      const damId = ped.dam ? goatIds[ped.dam] : null;

      if (sireId) {
        await dbRun(
          'INSERT INTO goat_pedigree (goat_id, parent_goat_id, relationship_type) VALUES (?, ?, ?)',
          [childId, sireId, 'sire']
        );
        console.log(`  - ${ped.child} <- sire ${ped.sire}`);
      }
      if (damId) {
        await dbRun(
          'INSERT INTO goat_pedigree (goat_id, parent_goat_id, relationship_type) VALUES (?, ?, ?)',
          [childId, damId, 'dam']
        );
        console.log(`  - ${ped.child} <- dam ${ped.dam}`);
      }
    }

    // ==================== SEED VACCINES ====================
    console.log('Seeding vaccines...');
    
    const vaccineData = [
      { name: 'CDT Vaccine', description: 'Clostridium perfringens types C & D and tetanus', disease: 'Enterotoxemia & Tetanus', dosage: '2 mL subcutaneous', manufacturer: 'Fort Dodge' },
      { name: 'Rabies Vaccine', description: 'Inactivated rabies vaccine for goats', disease: 'Rabies', dosage: '1 mL intramuscular', manufacturer: 'Merial' },
      { name: 'Pneumonia Vaccine', description: 'Protection against respiratory diseases', disease: 'Pneumonia', dosage: '1.5 mL subcutaneous', manufacturer: 'Boehringer Ingelheim' },
      { name: 'Footrot Vaccine', description: 'Vaccine for footrot prevention', disease: 'Footrot', dosage: '1 mL intramuscular', manufacturer: 'Zoetis' },
      { name: 'Brucellosis Vaccine', description: 'RB51 brucellosis vaccine', disease: 'Brucellosis', dosage: '2 mL subcutaneous', manufacturer: 'USDA' },
    ];

    const vaccineIds = {};
    for (const vac of vaccineData) {
      const id = await dbRun(
        `INSERT INTO vaccines (name, description, manufacturer, disease_protection, dosage)
         VALUES (?, ?, ?, ?, ?)`,
        [vac.name, vac.description, vac.manufacturer, vac.disease, vac.dosage]
      );
      vaccineIds[vac.name] = id;
      console.log(`  - ${vac.name}: ID ${id}`);
    }

    // ==================== SEED VACCINATION RECORDS ====================
    console.log('Seeding vaccination records...');
    
    const adminUser = await dbGet('SELECT id FROM users WHERE role = "admin" LIMIT 1');
    const userId = adminUser.id;

    const vaccinationData = [
      // Luna vaccinations
      { goat: 'DOE-001', vaccine: 'CDT Vaccine', date: '2024-01-15', next_due: '2025-01-15', vet: 'Dr. Smith', batch: 'CDT-2024-001', route: 'injection' },
      { goat: 'DOE-001', vaccine: 'Rabies Vaccine', date: '2024-02-10', next_due: '2027-02-10', vet: 'Dr. Smith', batch: 'RAB-2024-045', route: 'injection' },
      
      // Stella vaccinations
      { goat: 'DOE-002', vaccine: 'CDT Vaccine', date: '2024-01-20', next_due: '2025-01-20', vet: 'Dr. Jones', batch: 'CDT-2024-002', route: 'injection' },
      { goat: 'DOE-002', vaccine: 'Pneumonia Vaccine', date: '2024-03-05', next_due: '2024-09-05', vet: 'Dr. Smith', batch: 'PNEU-2024-12', route: 'injection' },
      
      // Bella vaccinations
      { goat: 'DOE-003', vaccine: 'CDT Vaccine', date: '2023-12-10', next_due: '2024-12-10', vet: 'Dr. Jones', batch: 'CDT-2023-099', route: 'injection' },
      { goat: 'DOE-003', vaccine: 'Footrot Vaccine', date: '2024-04-01', next_due: '2024-10-01', vet: 'Dr. Smith', batch: 'FOOT-2024-08', route: 'injection' },
      
      // Kids vaccinations
      { goat: 'KID-001', vaccine: 'CDT Vaccine', date: '2024-04-20', next_due: '2024-06-20', vet: 'Dr. Smith', batch: 'CDT-2024-005', route: 'injection' },
      { goat: 'KID-002', vaccine: 'CDT Vaccine', date: '2024-04-20', next_due: '2024-06-20', vet: 'Dr. Smith', batch: 'CDT-2024-005', route: 'injection' },
      { goat: 'KID-003', vaccine: 'CDT Vaccine', date: '2024-05-10', next_due: '2024-07-10', vet: 'Dr. Jones', batch: 'CDT-2024-006', route: 'injection' },
      { goat: 'KID-004', vaccine: 'CDT Vaccine', date: '2024-05-10', next_due: '2024-07-10', vet: 'Dr. Jones', batch: 'CDT-2024-006', route: 'injection' },
      { goat: 'KID-005', vaccine: 'Pneumonia Vaccine', date: '2024-06-15', next_due: '2024-12-15', vet: 'Dr. Smith', batch: 'PNEU-2024-20', route: 'injection' },
      
      // Thor vaccinations
      { goat: 'BUCK-001', vaccine: 'CDT Vaccine', date: '2023-11-01', next_due: '2024-11-01', vet: 'Dr. Jones', batch: 'CDT-2023-095', route: 'injection' },
      { goat: 'BUCK-001', vaccine: 'Brucellosis Vaccine', date: '2024-01-22', next_due: null, vet: 'Dr. Smith', batch: 'BRUC-2024-01', route: 'injection' },
    ];

    for (const vacc of vaccinationData) {
      const goatId = goatIds[vacc.goat];
      const vaccineId = vaccineIds[vacc.vaccine];
      
      await dbRun(
        `INSERT INTO vaccination_records (goat_id, vaccine_id, vaccination_date, next_due_date, veterinarian_name, batch_number, route, user_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [goatId, vaccineId, vacc.date, vacc.next_due, vacc.vet, vacc.batch, vacc.route, userId]
      );
      console.log(`  - ${vacc.goat} <- ${vacc.vaccine} on ${vacc.date}`);
    }

    // ==================== SEED EXPENSES ====================
    console.log('Seeding expenses...');
    
    const expenseData = [
      { title: 'Feed - Hay', amount: 450, date: '2024-01-05', category: 'Feed', notes: 'Monthly hay supply for herd' },
      { title: 'Feed - Grain', amount: 320, date: '2024-01-10', category: 'Feed', notes: 'High-quality grain mix' },
      { title: 'Veterinary Visit', amount: 280, date: '2024-01-15', category: 'Healthcare', notes: 'Routine check-up for breeding does' },
      { title: 'Vaccines', amount: 185, date: '2024-01-15', category: 'Healthcare', notes: 'CDT and Rabies vaccines' },
      { title: 'Feed - Hay', amount: 450, date: '2024-02-05', category: 'Feed', notes: 'Monthly hay supply' },
      { title: 'Pasture Maintenance', amount: 120, date: '2024-02-08', category: 'Facility', notes: 'Fence repair and pasture cleanup' },
      { title: 'Feed - Grain', amount: 320, date: '2024-02-10', category: 'Feed', notes: 'Grain for lactating does' },
      { title: 'Vitamins & Supplements', amount: 95, date: '2024-02-20', category: 'Healthcare', notes: 'Mineral supplements for herd' },
      { title: 'Bedding Material', amount: 180, date: '2024-02-25', category: 'Facility', notes: 'Straw for barn bedding' },
      { title: 'Feed - Hay', amount: 450, date: '2024-03-05', category: 'Feed', notes: 'Monthly hay supply' },
      { title: 'Vaccines', amount: 165, date: '2024-03-05', category: 'Healthcare', notes: 'Pneumonia vaccine' },
      { title: 'Equipment', amount: 250, date: '2024-03-15', category: 'Equipment', notes: 'Milking supplies' },
      { title: 'Feed - Grain', amount: 320, date: '2024-03-10', category: 'Feed', notes: 'Spring grain supply' },
      { title: 'Veterinary Visit', amount: 320, date: '2024-03-20', category: 'Healthcare', notes: 'Pregnancy check for does' },
      { title: 'Feed - Hay', amount: 450, date: '2024-04-05', category: 'Feed', notes: 'Spring hay' },
      { title: 'Feed - Grain', amount: 320, date: '2024-04-10', category: 'Feed', notes: 'Regular grain' },
      { title: 'Vaccines', amount: 240, date: '2024-04-20', category: 'Healthcare', notes: 'Kids first vaccinations' },
      { title: 'Pasture Maintenance', amount: 150, date: '2024-04-15', category: 'Facility', notes: 'Pasture seeding' },
      { title: 'Feed - Hay', amount: 500, date: '2024-05-05', category: 'Feed', notes: 'Late spring hay' },
      { title: 'Feed - Grain', amount: 380, date: '2024-05-10', category: 'Feed', notes: 'Increased grain for lactation' },
      { title: 'Veterinary Visit', amount: 200, date: '2024-05-20', category: 'Healthcare', notes: 'Post-kidding check-up' },
      { title: 'Minerals & Salts', amount: 85, date: '2024-05-25', category: 'Healthcare', notes: 'Mineral blocks' },
    ];

    for (const exp of expenseData) {
      await dbRun(
        `INSERT INTO expenses (title, amount, date, category, notes, user_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [exp.title, exp.amount, exp.date, exp.category, exp.notes, userId]
      );
      console.log(`  - ${exp.title}: $${exp.amount} on ${exp.date}`);
    }

    console.log('\n✅ Seeding complete!');
    db.close();
  } catch (err) {
    console.error('Seed error:', err);
    db.close();
    process.exit(1);
  }
};

seedData();
