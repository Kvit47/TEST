/**
 * Email Configuration Checker
 * 
 * This script checks if your email configuration is set up correctly
 * Run: node scripts/check-email-config.js
 */

require('dotenv').config();

console.log('\n🔍 Checking Email Configuration...\n');

const config = {
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  APP_NAME: process.env.APP_NAME,
  CLIENT_URL: process.env.CLIENT_URL,
};

let allGood = true;

// Check each configuration
Object.entries(config).forEach(([key, value]) => {
  const status = value ? '✅' : '❌';
  const displayValue = key === 'EMAIL_PASSWORD' && value 
    ? '********' + value.slice(-4) 
    : value || 'NOT SET';
  
  console.log(`${status} ${key}: ${displayValue}`);
  
  if (!value) {
    allGood = false;
  }
});

console.log('\n' + '='.repeat(50) + '\n');

if (allGood) {
  console.log('✅ All email configuration is set!\n');
  console.log('Your forgot password feature should work now.\n');
} else {
  console.log('❌ Some email configuration is missing!\n');
  console.log('📝 To fix this:\n');
  console.log('1. Open server/.env file');
  console.log('2. Add the missing variables:\n');
  console.log('   EMAIL_HOST=smtp.gmail.com');
  console.log('   EMAIL_PORT=587');
  console.log('   EMAIL_USER=your-email@gmail.com');
  console.log('   EMAIL_PASSWORD=your-app-password\n');
  console.log('3. For Gmail App Password:');
  console.log('   → Go to: https://myaccount.google.com/apppasswords');
  console.log('   → Enable 2-Factor Auth first if needed');
  console.log('   → Generate new App Password');
  console.log('   → Copy it (remove spaces) to EMAIL_PASSWORD\n');
  console.log('4. Restart your server\n');
  console.log('📚 See FORGOT_PASSWORD_SETUP.md for detailed instructions\n');
}

