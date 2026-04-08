const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/chat/health',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
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
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
});

req.setTimeout(10000, () => {
  console.log('Request timed out');
  req.destroy();
});

req.end();
