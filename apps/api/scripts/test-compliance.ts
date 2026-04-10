// Test script for Government Compliance APIs
// Run with: npx ts-node scripts/test-compliance.ts

const API_URL = 'http://localhost:3001/api';
const TOKEN = 'YOUR_JWT_TOKEN_HERE'; // Replace with actual token

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${TOKEN}`
};

async function testLiveliness() {
  console.log('\n🔍 Testing Liveliness API...');
  
  const response = await fetch(`${API_URL}/compliance/liveliness`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      sessionId: 'session_' + Date.now(),
      photoData: 'base64_encoded_image_data_here'
    })
  });
  
  const data = await response.json();
  console.log('✅ Liveliness Result:', JSON.stringify(data, null, 2));
  return data;
}

async function testAadhaar() {
  console.log('\n🆔 Testing Aadhaar Bridge API...');
  
  const response = await fetch(`${API_URL}/compliance/aadhaar/verify`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      aadhaarNumber: '123456789012' // Mock 12-digit number
    })
  });
  
  const data = await response.json();
  console.log('✅ Aadhaar Result:', JSON.stringify(data, null, 2));
  return data;
}

async function testGeoAudit() {
  console.log('\n📍 Testing Geo-Audit API...');
  
  const response = await fetch(`${API_URL}/compliance/geo-audit`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      latitude: 19.1383,  // Nanded coordinates
      longitude: 77.3210
    })
  });
  
  const data = await response.json();
  console.log('✅ Geo-Audit Result:', JSON.stringify(data, null, 2));
  return data;
}

async function testFamilyLinks() {
  console.log('\n👨‍👩‍👧‍👦 Testing Family Links API...');
  
  const response = await fetch(`${API_URL}/compliance/family-links`, {
    method: 'GET',
    headers
  });
  
  const data = await response.json();
  console.log('✅ Family Links Result:', JSON.stringify(data, null, 2));
  return data;
}

async function testSubsidies() {
  console.log('\n💰 Testing Subsidy Check API...');
  
  const response = await fetch(`${API_URL}/compliance/subsidies`, {
    method: 'GET',
    headers
  });
  
  const data = await response.json();
  console.log('✅ Subsidies Result:', JSON.stringify(data, null, 2));
  return data;
}

async function testBlacklist() {
  console.log('\n🚫 Testing Blacklist Check API...');
  
  const response = await fetch(`${API_URL}/compliance/blacklist-check`, {
    method: 'GET',
    headers
  });
  
  const data = await response.json();
  console.log('✅ Blacklist Result:', JSON.stringify(data, null, 2));
  return data;
}

async function testReKYCTimer() {
  console.log('\n⏰ Testing Re-KYC Timer API...');
  
  const response = await fetch(`${API_URL}/compliance/rekyc-timer`, {
    method: 'GET',
    headers
  });
  
  const data = await response.json();
  console.log('✅ Re-KYC Timer Result:', JSON.stringify(data, null, 2));
  return data;
}

async function testComplianceLogs() {
  console.log('\n📋 Testing Compliance Logs API...');
  
  const response = await fetch(`${API_URL}/compliance/logs?limit=10`, {
    method: 'GET',
    headers
  });
  
  const data = await response.json();
  console.log('✅ Compliance Logs Result:', JSON.stringify(data, null, 2));
  return data;
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Government Compliance API Tests...\n');
  console.log('=' .repeat(60));
  
  try {
    await testLiveliness();
    await testAadhaar();
    await testGeoAudit();
    await testFamilyLinks();
    await testSubsidies();
    await testBlacklist();
    await testReKYCTimer();
    await testComplianceLogs();
    
    console.log('\n' + '=' .repeat(60));
    console.log('✅ All tests completed successfully!');
  } catch (error) {
    console.error('\n❌ Test failed:', error);
  }
}

// Export for use in other files
export {
  testLiveliness,
  testAadhaar,
  testGeoAudit,
  testFamilyLinks,
  testSubsidies,
  testBlacklist,
  testReKYCTimer,
  testComplianceLogs,
  runAllTests
};

// Run if executed directly
if (require.main === module) {
  runAllTests();
}
