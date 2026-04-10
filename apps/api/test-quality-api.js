const axios = require('axios');

// Test the quality analysis endpoint
async function testQualityAnalysis() {
  try {
    console.log('Testing quality analysis endpoint...');
    
    // You'll need to replace this with a valid JWT token
    const token = 'YOUR_JWT_TOKEN_HERE';
    
    const response = await axios.post(
      'http://localhost:3001/api/farmer/quality/analyze',
      {
        imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    console.log('Success!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
  }
}

// Test without auth (should fail with 401)
async function testWithoutAuth() {
  try {
    console.log('\nTesting without authentication...');
    
    const response = await axios.post(
      'http://localhost:3001/api/farmer/quality/analyze',
      {
        imageUrl: 'data:image/png;base64,test'
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Response:', response.data);
  } catch (error) {
    console.log('Expected error (no auth):', error.response?.status, error.response?.data);
  }
}

// Run tests
testWithoutAuth();
// testQualityAnalysis(); // Uncomment and add token to test with auth
