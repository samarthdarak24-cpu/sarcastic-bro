const http = require('http');

const data = JSON.stringify({
  message: "What is the best fertilizer for wheat?",
  userRole: "farmer"
});

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/chat',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', responseData);
    try {
      const parsed = JSON.parse(responseData);
      console.log('\n✅ LLM Response:');
      console.log(parsed.response);
    } catch (e) {
      console.log('Raw response:', responseData);
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
});

req.write(data);
req.end();
