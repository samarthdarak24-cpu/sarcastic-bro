// Quick test script to verify login works
const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login...');
    const response = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'fpo@test.com',
      password: 'Test@1234'
    });
    
    console.log('✅ Login successful!');
    console.log('Token:', response.data.tokens?.accessToken || response.data.token);
    console.log('User:', response.data.user);
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
  }
}

testLogin();
