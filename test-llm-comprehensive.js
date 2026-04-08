const http = require('http');

const questions = [
  {
    message: "How do I detect pest infestation in my rice crop?",
    userRole: "farmer",
    title: "🌾 FARMER QUESTION - Pest Detection"
  },
  {
    message: "What are the best practices for finding reliable vegetable suppliers?",
    userRole: "buyer",
    title: "🏪 BUYER QUESTION - Supplier Finding"
  },
  {
    message: "Explain machine learning in simple terms",
    userRole: "general",
    title: "🤖 GENERAL QUESTION - Machine Learning"
  },
  {
    message: "What is sustainable agriculture and why is it important?",
    userRole: "farmer",
    title: "🌱 FARMER QUESTION - Sustainability"
  },
  {
    message: "How do I negotiate bulk purchase prices?",
    userRole: "buyer",
    title: "💰 BUYER QUESTION - Negotiation"
  }
];

let currentIndex = 0;

function askQuestion() {
  if (currentIndex >= questions.length) {
    console.log('\n✅ All tests completed!');
    process.exit(0);
  }

  const q = questions[currentIndex];
  const data = JSON.stringify({
    message: q.message,
    userRole: q.userRole
  });

  console.log(`\n${'='.repeat(80)}`);
  console.log(`${q.title}`);
  console.log(`${'='.repeat(80)}`);
  console.log(`📝 Question: ${q.message}`);
  console.log(`👤 Role: ${q.userRole}`);
  console.log(`⏳ Waiting for response...`);

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

  const startTime = Date.now();

  const req = http.request(options, (res) => {
    let responseData = '';
    
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      const elapsed = Date.now() - startTime;
      console.log(`\n✅ Response received in ${elapsed}ms`);
      
      try {
        const parsed = JSON.parse(responseData);
        console.log(`\n📖 Answer:\n${parsed.response.substring(0, 500)}${parsed.response.length > 500 ? '...' : ''}`);
        console.log(`\n📊 Session: ${parsed.sessionId}`);
        console.log(`🤖 Model: ${parsed.model}`);
      } catch (e) {
        console.log('Raw response:', responseData);
      }

      currentIndex++;
      setTimeout(askQuestion, 1000);
    });
  });

  req.on('error', (error) => {
    console.error('❌ Error:', error.message);
    currentIndex++;
    setTimeout(askQuestion, 1000);
  });

  req.setTimeout(120000, () => {
    console.log('❌ Request timed out');
    req.destroy();
    currentIndex++;
    setTimeout(askQuestion, 1000);
  });

  req.write(data);
  req.end();
}

console.log('🚀 Starting LLM Comprehensive Test Suite');
console.log(`📊 Total Questions: ${questions.length}`);
askQuestion();
