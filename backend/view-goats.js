const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.db');

console.log('=== GOAT DATABASE ===\n');

db.all('SELECT COUNT(*) as count FROM goats', (err, rows) => {
  if (err) {
    console.log('Error:', err.message);
    db.close();
    return;
  }
  
  console.log('Total Goats:', rows[0].count);
  
  if (rows[0].count === 0) {
    console.log('\n⚠️  No goats in database yet.\n');
    db.close();
    return;
  }
  
  console.log('\n--- GOAT DETAILS ---\n');
  
  db.all('SELECT id, name, tag_number, gender, breed, date_of_birth, health_status, breeding_status, location, weight, color, notes, created_at FROM goats ORDER BY id', (err, goats) => {
    if (err) {
      console.log('Error:', err.message);
      db.close();
      return;
    }
    
    goats.forEach((goat, index) => {
      console.log(`Goat #${index + 1}`);
      console.log('─'.repeat(50));
      console.log('ID:', goat.id);
      console.log('Name:', goat.name);
      console.log('Tag Number:', goat.tag_number);
      console.log('Gender:', goat.gender);
      console.log('Breed:', goat.breed || 'N/A');
      console.log('Date of Birth:', goat.date_of_birth);
      console.log('Health Status:', goat.health_status);
      console.log('Breeding Status:', goat.breeding_status);
      console.log('Location:', goat.location || 'N/A');
      console.log('Weight:', goat.weight ? goat.weight + ' kg' : 'N/A');
      console.log('Color:', goat.color || 'N/A');
      console.log('Notes:', goat.notes || 'N/A');
      console.log('Created:', goat.created_at);
      console.log('');
    });
    
    // Show pedigree info
    db.all('SELECT COUNT(*) as count FROM goat_pedigree', (err, rows) => {
      if (err || !rows[0].count) {
        console.log('\n📊 Pedigree Records: None yet');
      } else {
        console.log('\n📊 Pedigree Records:', rows[0].count);
      }
      db.close();
    });
  });
});
