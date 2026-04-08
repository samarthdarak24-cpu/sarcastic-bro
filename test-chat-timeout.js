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

console.log('Sending chat request...');
const startTime = Date.now();

const req = http.request(options, (res) => {
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    const elapsed = Date.now() - startTime;
    console.log(`\n✅ Response received in ${elapsed}ms`);
    console.log('Status:', res.statusCode);
    try {
      const parsed = JSON.parse(responseData);
      console.log('\n📝 LLM Response:');
      console.log(parsed.response);
      console.log('\n📊 Session ID:', parsed.sessionId);
      console.log('Model:', parsed.model);
    } catch (e) {
      console.log('Raw response:', responseData);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
});

req.setTimeout(120000, () => {
  console.log('❌ Request timed out after 120 seconds');
  req.destroy();
});

req.write(data);
req.end();

console.log('Request sent, waiting for response...');
