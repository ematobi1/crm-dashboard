const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './backend/.env' });

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/leadstream');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  isActive: Boolean,
  preferences: Object
}, { timestamps: true });

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
  createdBy: mongoose.Schema.Types.ObjectId
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Lead = mongoose.model('Lead', leadSchema);

async function setupData() {
  try {
    console.log('Ì∑ëÔ∏è  Clearing existing data...');
    await User.deleteMany({});
    await Lead.deleteMany({});

    console.log('Ì±• Creating users...');
    
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@leadstream.com',
      password: await bcrypt.hash('password123', 12),
      role: 'admin',
      isActive: true,
      preferences: {
        notifications: { email: true, push: true, sms: false },
        workingHours: { start: '09:00', end: '17:00', timezone: 'UTC' }
      }
    });

    const salesUser = await User.create({
      name: 'John Sales',
      email: 'john@leadstream.com', 
      password: await bcrypt.hash('password123', 12),
      role: 'sales_rep',
      isActive: true,
      preferences: {
        notifications: { email: true, push: true, sms: true },
        workingHours: { start: '08:00', end: '18:00', timezone: 'America/New_York' }
      }
    });

    console.log('Ì≥ä Creating sample leads...');
    
    const sampleLeads = [
      {
        name: 'Alice Johnson',
        email: 'alice@techcorp.com',
        phone: '+1 (555) 123-4567',
        company: 'TechCorp Inc',
        source: 'website',
        status: 'new',
        priority: 'high',
        score: 85,
        assignedTo: salesUser._id,
        createdBy: adminUser._id
      },
      {
        name: 'Bob Smith',
        email: 'bob@startup.io',
        phone: '+1 (555) 987-6543',
        company: 'Startup.io',
        source: 'referral',
        status: 'contacted',
        priority: 'urgent',
        score: 92,
        assignedTo: salesUser._id,
        createdBy: adminUser._id
      },
      {
        name: 'Carol Davis',
        email: 'carol@enterprise.com',
        phone: '+1 (555) 456-7890',
        company: 'Enterprise Solutions',
        source: 'email',
        status: 'qualified',
        priority: 'medium',
        score: 78,
        assignedTo: salesUser._id,
        createdBy: adminUser._id
      },
      {
        name: 'David Wilson',
        email: 'david@consulting.biz',
        company: 'Wilson Consulting',
        source: 'social',
        status: 'new',
        priority: 'low',
        score: 65,
        assignedTo: salesUser._id,
        createdBy: adminUser._id
      },
      {
        name: 'Emma Brown',
        email: 'emma@digitalagency.co',
        phone: '+1 (555) 111-2222',
        company: 'Digital Agency Co',
        source: 'website',
        status: 'proposal',
        priority: 'high',
        score: 88,
        assignedTo: salesUser._id,
        createdBy: adminUser._id
      }
    ];

    await Lead.insertMany(sampleLeads);

    console.log('‚úÖ Sample data created successfully!');
    console.log('');
    console.log('Ì¥ë Login credentials:');
    console.log('  Admin: admin@leadstream.com / password123');
    console.log('  Sales Rep: john@leadstream.com / password123');
    console.log('');
    console.log('Ì≥ä Created 5 sample leads assigned to John Sales');

  } catch (error) {
    console.error('‚ùå Error setting up data:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

mongoose.connection.on('connected', () => {
  console.log('‚úÖ Connected to MongoDB');
  setupData();
});

mongoose.connection.on('error', (err) => {
  console.error('‚ùå MongoDB connection error:', err);
  process.exit(1);
});
