const axios = require('axios');

const API_URL = 'http://localhost:3001';

const testUsers = [
  { email: 'farmer@test.com', password: 'Farmer123', expectedRole: 'FARMER', expectedDashboard: '/farmer/dashboard' },
  { email: 'buyer@test.com', password: 'Buyer123', expectedRole: 'BUYER', expectedDashboard: '/buyer/dashboard' },
  { email: 'fpo@test.com', password: 'Farmer123', expectedRole: 'FPO', expectedDashboard: '/fpo/dashboard' }
];

async function testLogin(user) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing login for: ${user.email}`);
  console.log(`Expected role: ${user.expectedRole}`);
  console.log(`Expected dashboard: ${user.expectedDashboard}`);
  console.log('='.repeat(60));

  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email: user.email,
      password: user.password
    });

    console.log('✅ Login successful!');
    console.log('Response status:', response.status);
    console.log('Response data structure:', Object.keys(response.data));
    
    const data = response.data.data || response.data;
    console.log('\nUser data:');
    console.log('  - ID:', data.user.id);
    console.log('  - Name:', data.user.name);
    console.log('  - Email:', data.user.email);
    console.log('  - Role:', data.user.role);
    console.log('  - Has token:', !!data.tokens?.accessToken || !!data.token);

    // Verify role matches expected
    if (data.user.role === user.expectedRole) {
      console.log(`\n✅ PASS: Role matches expected (${user.expectedRole})`);
      console.log(`✅ Should redirect to: ${user.expectedDashboard}`);
    } else {
      console.log(`\n❌ FAIL: Role mismatch!`);
      console.log(`   Expected: ${user.expectedRole}`);
      console.log(`   Got: ${data.user.role}`);
    }

    return true;
  } catch (error) {
    console.log('❌ Login failed!');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
    return false;
  }
}

async function runTests() {
  console.log('\n🚀 Starting Authentication Flow Tests');
  console.log(`API URL: ${API_URL}`);
  console.log(`Testing ${testUsers.length} users\n`);

  let passed = 0;
  let failed = 0;

  for (const user of testUsers) {
    const result = await testLogin(user);
    if (result) {
      passed++;
    } else {
      failed++;
    }
    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total tests: ${testUsers.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log('='.repeat(60));

  if (failed === 0) {
    console.log('\n🎉 All authentication tests passed!');
    console.log('\n✅ Role-based routing should work correctly:');
    console.log('   - FARMER → /farmer/dashboard');
    console.log('   - BUYER → /buyer/dashboard');
    console.log('   - FPO → /fpo/dashboard');
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.');
  }
}

// Run the tests
runTests().catch(console.error);
