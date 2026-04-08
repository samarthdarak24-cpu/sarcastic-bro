const http = require('http');

const testCases = [
  {
    endpoint: '/api/chat',
    name: 'Main Chat Endpoint',
    data: {
      message: "What is the best time to plant rice?",
      userRole: "farmer"
    }
  },
  {
    endpoint: '/api/n8n/chat',
    name: 'N8N Chat Endpoint (chatInput)',
    data: {
      chatInput: "How do I find bulk buyers for my vegetables?",
      userRole: "farmer"
    }
  },
  {
    endpoint: '/api/n8n/chat',
    name: 'N8N Chat Endpoint (message)',
    data: {
      message: "What is blockchain technology?",
      userRole: "general"
    }
  }
];

let currentTest = 0;

function runTest() {
  if (currentTest >= testCases.length) {
    console.log('\n✅ All LLM-Only tests completed!');
    process.exit(0);
  }

  const test = testCases[currentTest];
  const data = JSON.stringify(test.data);

  console.log(`\n${'='.repeat(80)}`);
  console.log(`Test ${currentTest + 1}/${testCases.length}: ${test.name}`);
  console.log(`${'='.repeat(80)}`);
  console.log(`Endpoint: ${test.endpoint}`);
  console.log(`Question: ${test.data.message || test.data.chatInput}`);
  console.log(`Role: ${test.data.userRole}`);
  console.log(`⏳ Waiting for LLM response...\n`);

  const options = {
    hostname: 'localhost',
    port: 3001,
    path: test.endpoint,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const startTime = Date.now();

  const req = http.request(options, (res) => {
    let responseData = '';
    
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      const elapsed = Date.now() - startTime;
      
      try {
        const parsed = JSON.parse(responseData);
        console.log(`✅ LLM Response (${elapsed}ms):`);
        console.log(`${parsed.response.substring(0, 300)}...`);
        console.log(`\n📊 Session: ${parsed.sessionId}`);
        console.log(`🤖 Model: ${parsed.model}`);
        if (parsed.provider) console.log(`🔌 Provider: ${parsed.provider}`);
      } catch (e) {
        console.log('Response:', responseData);
      }

      currentTest++;
      setTimeout(runTest, 1000);
    });
  });

  req.on('error', (error) => {
    console.error('❌ Error:', error.message);
    currentTest++;
    setTimeout(runTest, 1000);
  });

  req.setTimeout(120000, () => {
    console.log('❌ Request timed out');
    req.destroy();
    currentTest++;
    setTimeout(runTest, 1000);
  });

  req.write(data);
  req.end();
}

console.log('🚀 AgriVoice AI - LLM-Only System Test');
console.log(`📊 Total Tests: ${testCases.length}`);
console.log('✅ All questions will be answered by LLM only\n');
runTest();
