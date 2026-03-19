/**
 * Simple Email Configuration Test
 * Run after adding email config to .env
 */

require('dotenv').config();

console.log('\n📧 Email Configuration Status:\n');
console.log('━'.repeat(50));

const checks = [
  { name: 'EMAIL_HOST', value: process.env.EMAIL_HOST },
  { name: 'EMAIL_PORT', value: process.env.EMAIL_PORT },
  { name: 'EMAIL_USER', value: process.env.EMAIL_USER },
  { name: 'EMAIL_PASSWORD', value: process.env.EMAIL_PASSWORD ? '✓ Set (hidden)' : null },
  { name: 'APP_NAME', value: process.env.APP_NAME },
  { name: 'CLIENT_URL', value: process.env.CLIENT_URL },
];

let allSet = true;
checks.forEach(({ name, value }) => {
  if (!value || value === null) {
    console.log(`❌ ${name}: NOT SET`);
    allSet = false;
  } else {
    const displayValue = name === 'EMAIL_PASSWORD' ? value : `"${value}"`;
    console.log(`✅ ${name}: ${displayValue}`);
  }
});

console.log('━'.repeat(50));

if (allSet) {
  console.log('\n🎉 SUCCESS! All email configuration is set!');
  console.log('\n📋 Next steps:');
  console.log('   1. Restart your server (Ctrl+C, then npm run dev)');
  console.log('   2. Try forgot password again');
  console.log('   3. Check your email inbox!\n');
} else {
  console.log('\n⚠️  MISSING CONFIG! Add missing values to server/.env');
  console.log('\n📝 Example .env configuration:');
  console.log('   EMAIL_HOST=smtp.gmail.com');
  console.log('   EMAIL_PORT=587');
  console.log('   EMAIL_USER=your-email@gmail.com');
  console.log('   EMAIL_PASSWORD=abcdefghijklmnop');
  console.log('   APP_NAME=Narin Jewelry');
  console.log('   CLIENT_URL=http://localhost:5173\n');
}

