const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Goat names library
const maleNames = [
  'Buck', 'Billy', 'Storm', 'Atlas', 'Zeus', 'Thor', 'Rocky', 'Prince', 'Shadow',
  'Titan', 'King', 'Duke', 'Chief', 'Ranger', 'Scout', 'Max', 'Rex', 'Ace',
  'Blaze', 'Ranger', 'Diesel', 'Bear', 'Wolf', 'Hawk', 'Eagle', 'Lion', 'Tiger',
  'Falcon', 'Striker', 'Thunder', 'Knight', 'Baron', 'Duke', 'Lord', 'Jack', 'Jax',
  'Comet', 'Blizzard', 'Phoenix', 'Granite', 'Savage', 'Fury', 'Rebel', 'Rogue',
  'Valor', 'Victor', 'Venom', 'Vanquish', 'Vigor', 'Viking', 'Vulcan'
];

const femaleNames = [
  'Doe', 'Nanny', 'Pearl', 'Grace', 'Luna', 'Star', 'Bella', 'Rose', 'Queen',
  'Princess', 'Diana', 'Venus', 'Aurora', 'Iris', 'Sage', 'Olive', 'Maple',
  'Hazel', 'Fawn', 'Daisy', 'Lily', 'Violet', 'Ruby', 'Sienna', 'Amber',
  'Honey', 'Ginger', 'Cinnamon', 'Nutmeg', 'Vanilla', 'Pepper', 'Willow',
  'Ivy', 'Scarlett', 'Madeline', 'Claire', 'Emma', 'Sophia', 'Isabella',
  'Charlotte', 'Olivia', 'Abigail', 'Elizabeth', 'Margaret', 'Victoria', 'Helen'
];

const breeds = ['Alpine', 'Saanen', 'Nubian', 'Boer', 'Kiko', 'LaMancha', 'Angora', 'Nigerian Dwarf', 'Oberhasli', 'Toggenburg'];
const colors = ['White', 'Black', 'Brown', 'Gray', 'Red', 'Cream', 'Black & White', 'Brown & White', 'Mixed', 'Golden'];
const locations = ['Pen A', 'Pen B', 'Pen C', 'Pen D', 'Pasture 1', 'Pasture 2', 'Barn East', 'Barn West'];
const healthStatus = ['healthy', 'sick', 'pregnant', 'injured'];
const breedingStatus = ['breeding', 'non-breeding', 'retired'];

// Function to get random element from array
function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Function to generate random date of birth (between 1 and 10 years ago)
function getRandomDOB() {
  const now = new Date();
  const yearsAgo = Math.random() * 10; // 0-10 years ago
  const randomDays = Math.floor(Math.random() * 365);
  const dob = new Date(now.getFullYear() - Math.floor(yearsAgo), now.getMonth(), now.getDate() - randomDays);
  return dob.toISOString().split('T')[0]; // YYYY-MM-DD format
}

// Function to generate random weight (35-120 kg)
function getRandomWeight() {
  return (Math.random() * 85 + 35).toFixed(2);
}

// Function to generate a unique tag number using timestamp + index
function generateTagNumber(index) {
  const timestamp = Date.now();
  return `TAG-${timestamp}-${String(index).padStart(4, '0')}`;
}

// Generate 200 goats with family relationships
function generateGoats() {
  const goats = [];
  let tagCounter = 1;

  // Generate base goats (first 50 will be parents/founders)
  for (let i = 0; i < 200; i++) {
    const gender = Math.random() > 0.5 ? 'male' : 'female';
    const names = gender === 'male' ? maleNames : femaleNames;
    
    goats.push({
      name: getRandomElement(names) + ' ' + Math.floor(Math.random() * 1000),
      tag_number: generateTagNumber(tagCounter++),
      date_of_birth: getRandomDOB(),
      gender: gender,
      breed: getRandomElement(breeds),
      color: getRandomElement(colors),
      health_status: getRandomElement(healthStatus),
      location: getRandomElement(locations),
      weight: getRandomWeight(),
      breeding_status: getRandomElement(breedingStatus),
      notes: `Demo goat #${i + 1} for system demonstration`
    });
  }

  return goats;
}

// Insert goats into database
function insertGoats(goats) {
  let insertedCount = 0;
  const goatIds = {};

  // Insert all goats first
  goats.forEach((goat, index) => {
    db.run(
      `INSERT INTO goats (name, tag_number, date_of_birth, gender, breed, color, health_status, location, weight, breeding_status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        goat.name,
        goat.tag_number,
        goat.date_of_birth,
        goat.gender,
        goat.breed,
        goat.color,
        goat.health_status,
        goat.location,
        goat.weight,
        goat.breeding_status,
        goat.notes
      ],
      function(err) {
        if (err) {
          console.error(`Error inserting goat ${goat.name}:`, err.message);
        } else {
          goatIds[index] = this.lastID;
          insertedCount++;
          if (insertedCount % 20 === 0) {
            console.log(`✓ Inserted ${insertedCount} goats...`);
          }

          // After all goats are inserted, add family relationships
          if (insertedCount === goats.length) {
            console.log(`\n✓ All ${goats.length} goats inserted!`);
            setTimeout(() => addFamilyRelationships(goatIds, goats), 500);
          }
        }
      }
    );
  });
}

// Add family relationships (pedigree)
function addFamilyRelationships(goatIds, goats) {
  console.log('\nAdding family relationships...');
  let relationshipCount = 0;
  const totalGoats = Object.keys(goatIds).length;

  // Create relationships: each goat has a chance to have a sire and dam
  Object.keys(goatIds).forEach((childIndex) => {
    const childId = goatIds[childIndex];
    const child = goats[childIndex];
    const childIdx = parseInt(childIndex);

    // Pick potential sires (males from earlier in the list, at least 1 year older)
    const potentialSires = Object.keys(goatIds)
      .map(idx => parseInt(idx))
      .filter(idx => {
        const potentialSire = goats[idx];
        return potentialSire.gender === 'male' && idx < childIdx && idx < totalGoats - 50;
      });

    // Pick potential dams (females from earlier in the list)
    const potentialDams = Object.keys(goatIds)
      .map(idx => parseInt(idx))
      .filter(idx => {
        const potentialDam = goats[idx];
        return potentialDam.gender === 'female' && idx < childIdx && idx < totalGoats - 50;
      });

    // 60% chance of having a sire relationship
    if (Math.random() < 0.6 && potentialSires.length > 0) {
      const sireIdx = potentialSires[Math.floor(Math.random() * potentialSires.length)];
      const sireId = goatIds[sireIdx];

      db.run(
        `INSERT INTO goat_pedigree (goat_id, parent_goat_id, relationship_type)
         VALUES (?, ?, ?)`,
        [childId, sireId, 'sire'],
        function(err) {
          if (!err) {
            relationshipCount++;
            if (relationshipCount % 30 === 0) {
              console.log(`✓ Added ${relationshipCount} relationships...`);
            }
          }
        }
      );
    }

    // 60% chance of having a dam relationship
    if (Math.random() < 0.6 && potentialDams.length > 0) {
      const damIdx = potentialDams[Math.floor(Math.random() * potentialDams.length)];
      const damId = goatIds[damIdx];

      db.run(
        `INSERT INTO goat_pedigree (goat_id, parent_goat_id, relationship_type)
         VALUES (?, ?, ?)`,
        [childId, damId, 'dam'],
        function(err) {
          if (!err) {
            relationshipCount++;
            if (relationshipCount % 30 === 0) {
              console.log(`✓ Added ${relationshipCount} relationships...`);
            }
          }
        }
      );
    }
  });

  // Close database after a delay to allow all inserts to complete
  setTimeout(() => {
    console.log(`\n✓ Successfully added approximately ${relationshipCount} family relationships!`);
    console.log('\n========================================');
    console.log('✅ DEMO DATA CREATION COMPLETE!');
    console.log('========================================');
    console.log(`✓ 200 goats created`);
    console.log(`✓ ~120 family relationships added`);
    console.log(`✓ Data is ready for demonstration`);
    console.log('========================================\n');
    db.close();
  }, 2000);
}

// Start the seeding process
console.log('Starting demo data generation...\n');
const goats = generateGoats();
insertGoats(goats);
