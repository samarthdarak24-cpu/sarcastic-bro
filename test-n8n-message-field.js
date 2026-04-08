const http = require('http');

const data = JSON.stringify({
  message: "How do I improve soil health for my crops?",
  userRole: "farmer"
});

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/n8n/chat',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('🚀 Testing N8N Chat with "message" field');
console.log(`📝 Question: How do I improve soil health for my crops?`);
console.log(`👤 Role: farmer`);
console.log(`⏳ Waiting for response...\n`);

const startTime = Date.now();

const req = http.request(options, (res) => {
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    const elapsed = Date.now() - startTime;
    console.log(`✅ Response received in ${elapsed}ms`);
    console.log(`Status: ${res.statusCode}\n`);
    
    try {
      const parsed = JSON.parse(responseData);
      console.log('📖 Answer:');
      console.log(parsed.response.substring(0, 400) + (parsed.response.length > 400 ? '...' : ''));
      console.log(`\n📊 Session: ${parsed.sessionId}`);
      console.log(`🤖 Model: ${parsed.model}`);
      console.log(`🔌 Provider: ${parsed.provider}`);
    } catch (e) {
      console.log('Response:', responseData);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
});

req.setTimeout(120000, () => {
  console.log('❌ Request timed out');
  req.destroy();
});

req.write(data);
req.end();
