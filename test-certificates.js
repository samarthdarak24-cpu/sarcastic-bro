// Test quality certificates endpoint
const axios = require('axios');

async function testCertificates() {
  try {
    // First login
    console.log('1. Logging in...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'fpo@test.com',
      password: 'Test@1234'
    });
    
    const token = loginResponse.data.tokens?.accessToken || loginResponse.data.token;
    console.log('✅ Login successful, got token');
    
    // Then fetch certificates
    console.log('\n2. Fetching certificates...');
    const certResponse = await axios.get('http://localhost:3001/api/quality-certificate/my/certificates', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Certificates fetched successfully!');
    console.log('Number of certificates:', certResponse.data.length);
    console.log('\nCertificates:');
    certResponse.data.forEach((cert, i) => {
      console.log(`\n${i + 1}. ${cert.certificateType} - ${cert.certificateNumber || 'No number'}`);
      console.log(`   Issuer: ${cert.issuerName || 'N/A'}`);
      console.log(`   Verified: ${cert.verifiedByFPO ? 'Yes' : 'No'}`);
      console.log(`   AI Score: ${cert.aiScore || 'N/A'}`);
    });
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

testCertificates();
