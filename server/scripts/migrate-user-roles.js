/**
 * Migration Script: Update "user" role to "client"
 * 
 * This script updates all users with role "user" to "client" for consistency.
 * The system now uses "client" as the standard role for regular users.
 * 
 * Usage: node scripts/migrate-user-roles.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../model/user.model');

async function migrateUserRoles() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all users with role "user"
    const usersToUpdate = await User.find({ role: 'user' });
    console.log(`Found ${usersToUpdate.length} users with role "user"`);

    if (usersToUpdate.length === 0) {
      console.log('No users to migrate. All done! ✅');
      process.exit(0);
    }

    // Update all users
    const result = await User.updateMany(
      { role: 'user' },
      { $set: { role: 'client', updatedAt: new Date() } }
    );

    console.log(`\n✅ Migration completed!`);
    console.log(`   Updated ${result.modifiedCount} users`);
    console.log(`   Changed role from "user" to "client"\n`);

    // Verify the migration
    const remainingUsers = await User.countDocuments({ role: 'user' });
    if (remainingUsers === 0) {
      console.log('✅ Verification: No users with role "user" remaining');
    } else {
      console.log(`⚠️  Warning: Still ${remainingUsers} users with role "user"`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
console.log('Starting user role migration...\n');
migrateUserRoles();

