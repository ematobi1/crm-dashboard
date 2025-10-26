const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

mongoose.connect(process.env.MONGODB_URI || 'mongodb://admin:leadstream123@localhost:27017/leadstream?authSource=admin');

const leadSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  company: String,
  source: String,
  status: String,
  priority: String,
  score: Number,
  assignedTo: mongoose.Schema.Types.ObjectId,
  createdBy: mongoose.Schema.Types.ObjectId,
  expectedValue: Number,
  lastContactedAt: Date
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  name: String,
  email: String
}, { timestamps: true });

const Lead = mongoose.model('Lead', leadSchema);
const User = mongoose.model('User', userSchema);

// Sample data pools
const firstNames = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
  'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
  'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
  'Kenneth', 'Dorothy', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa',
  'Edward', 'Deborah', 'Ronald', 'Stephanie', 'Timothy', 'Rebecca', 'Jason', 'Sharon',
  'Jeffrey', 'Laura', 'Ryan', 'Cynthia', 'Jacob', 'Kathleen', 'Gary', 'Amy',
  'Nicholas', 'Shirley', 'Eric', 'Angela', 'Jonathan', 'Helen', 'Stephen', 'Anna',
  'Larry', 'Brenda', 'Justin', 'Pamela', 'Scott', 'Nicole', 'Brandon', 'Emma',
  'Benjamin', 'Samantha', 'Samuel', 'Katherine', 'Raymond', 'Christine', 'Gregory', 'Debra',
  'Alexander', 'Rachel', 'Patrick', 'Catherine', 'Frank', 'Carolyn', 'Jack', 'Janet',
  'Dennis', 'Ruth', 'Jerry', 'Maria', 'Tyler', 'Heather', 'Aaron', 'Diane',
  'Jose', 'Virginia', 'Adam', 'Julie', 'Henry', 'Joyce', 'Nathan', 'Victoria',
  'Douglas', 'Olivia', 'Zachary', 'Kelly', 'Peter', 'Christina', 'Kyle', 'Lauren',
  'Walter', 'Joan', 'Ethan', 'Evelyn', 'Jeremy', 'Judith', 'Harold', 'Megan'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
  'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
  'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young',
  'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
  'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker',
  'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy',
  'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey',
  'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson',
  'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza',
  'Ruiz', 'Hughes', 'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers',
  'Long', 'Ross', 'Foster', 'Jimenez', 'Powell', 'Jenkins', 'Perry', 'Russell'
];

const companies = [
  'Tech Solutions Inc', 'Global Enterprises', 'Innovation Labs', 'Digital Dynamics',
  'Smart Systems', 'Future Corp', 'Apex Industries', 'Prime Technologies',
  'Elite Services', 'Quantum Innovations', 'Nexus Group', 'Vertex Solutions',
  'Summit Systems', 'Pinnacle Partners', 'Fusion Tech', 'Horizon Ventures',
  'Catalyst Corp', 'Zenith Solutions', 'Momentum Group', 'Synergy Systems',
  'Atlas Technologies', 'Titan Industries', 'Phoenix Enterprises', 'Vanguard Tech',
  'Omega Solutions', 'Delta Systems', 'Eclipse Corp', 'Nova Innovations',
  'Stellar Group', 'Pulse Technologies', 'Spectrum Solutions', 'Velocity Systems',
  'Anchor Industries', 'Bridge Partners', 'Crown Enterprises', 'Dynasty Tech',
  'Empire Solutions', 'Forge Systems', 'Genesis Corp', 'Harbor Group',
  'Icon Technologies', 'Legacy Enterprises', 'Matrix Solutions', 'Noble Systems',
  'Oracle Industries', 'Pioneer Tech', 'Quest Solutions', 'Radius Group',
  'Signal Systems', 'Trident Corp', 'Unity Enterprises', 'Victory Tech'
];

const sources = ['website', 'referral', 'social', 'email', 'phone', 'event', 'other'];
const statuses = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'];
const priorities = ['low', 'medium', 'high', 'urgent'];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generatePhone() {
  return `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
}

function generateEmail(firstName, lastName) {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'company.com', 'business.io', 'corp.net'];
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${getRandomElement(domains)}`;
}

function generateScore() {
  return Math.floor(Math.random() * 50) + 50; // 50-100
}

function generateValue() {
  return Math.floor(Math.random() * 100000) + 5000; // $5k-$105k
}

function getRandomDate(daysBack) {
  const now = new Date();
  const pastDate = new Date(now.getTime() - (Math.random() * daysBack * 24 * 60 * 60 * 1000));
  return pastDate;
}

async function generate2000Leads() {
  try {
    console.log('Ì¥ç Finding users...');
    const adminUser = await User.findOne({ email: 'admin@leadstream.com' });
    const salesUser = await User.findOne({ email: 'john@leadstream.com' });

    if (!adminUser || !salesUser) {
      console.error('‚ùå Users not found. Run setup-data.js first.');
      process.exit(1);
    }

    console.log('Ìø≠ Generating 2000 leads...');
    console.log('‚è≥ This may take 30-60 seconds...');

    const leads = [];
    const batchSize = 100;

    for (let i = 0; i < 2000; i++) {
      const firstName = getRandomElement(firstNames);
      const lastName = getRandomElement(lastNames);
      const status = getRandomElement(statuses);
      const createdAt = getRandomDate(90); // Within last 90 days

      const lead = {
        name: `${firstName} ${lastName}`,
        email: generateEmail(firstName, lastName),
        phone: generatePhone(),
        company: getRandomElement(companies),
        source: getRandomElement(sources),
        status: status,
        priority: getRandomElement(priorities),
        score: generateScore(),
        expectedValue: generateValue(),
        assignedTo: salesUser._id,
        createdBy: adminUser._id,
        createdAt: createdAt,
        updatedAt: createdAt
      };

      // Add lastContactedAt for non-new leads
      if (status !== 'new') {
        lead.lastContactedAt = getRandomDate(30);
      }

      leads.push(lead);

      // Progress indicator
      if ((i + 1) % 200 === 0) {
        console.log(`   Generated ${i + 1}/2000 leads...`);
      }
    }

    console.log('Ì≤æ Inserting leads into database...');
    
    // Insert in batches to avoid memory issues
    for (let i = 0; i < leads.length; i += batchSize) {
      const batch = leads.slice(i, i + batchSize);
      await Lead.insertMany(batch, { ordered: false }).catch(err => {
        if (err.code === 11000) {
          console.log(`   Skipped ${err.writeErrors?.length || 0} duplicates in batch ${i / batchSize + 1}`);
        }
      });
    }

    console.log('‚úÖ Lead generation complete!');
    console.log('');
    
    // Statistics
    const totalLeads = await Lead.countDocuments();
    const stats = await Lead.aggregate([
      { $group: { 
        _id: null, 
        totalValue: { $sum: '$expectedValue' },
        avgScore: { $avg: '$score' }
      }}
    ]);
    
    const byStatus = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('Ì≥ä DATABASE STATISTICS:');
    console.log(`   Total Leads: ${totalLeads.toLocaleString()}`);
    console.log(`   Total Pipeline Value: $${stats[0].totalValue.toLocaleString()}`);
    console.log(`   Average Lead Score: ${Math.round(stats[0].avgScore)}/100`);
    console.log('');
    console.log('   Leads by Status:');
    byStatus.forEach(s => {
      console.log(`     ${s._id.padEnd(15)}: ${s.count.toLocaleString()}`);
    });

  } catch (error) {
    console.error('‚ùå Error:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

mongoose.connection.on('connected', () => {
  console.log('‚úÖ Connected to MongoDB');
  generate2000Leads();
});

mongoose.connection.on('error', (err) => {
  console.error('‚ùå MongoDB connection error:', err);
  process.exit(1);
});
