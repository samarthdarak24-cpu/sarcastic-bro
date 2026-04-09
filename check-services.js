#!/usr/bin/env node

/**
 * Service Health Check Script
 * Checks if all required services are running
 */

const http = require('http');

const services = [
  { name: 'API Server', url: 'http://localhost:3001', path: '/health' },
  { name: 'Web App', url: 'http://localhost:3000', path: '/' },
  { name: 'AI Service', url: 'http://localhost:8001', path: '/health' }
];

function checkService(service) {
  return new Promise((resolve) => {
    const url = new URL(service.path, service.url);
    
    const req = http.get(url, { timeout: 3000 }, (res) => {
      resolve({
        name: service.name,
        status: res.statusCode >= 200 && res.statusCode < 400 ? 'RUNNING' : 'ERROR',
        statusCode: res.statusCode
      });
    });

    req.on('error', () => {
      resolve({
        name: service.name,
        status: 'NOT RUNNING',
        statusCode: null
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        name: service.name,
        status: 'TIMEOUT',
        statusCode: null
      });
    });
  });
}

async function checkAllServices() {
  console.log('🔍 Checking service status...\n');
  
  const results = await Promise.all(services.map(checkService));
  
  console.log('Service Status:');
  console.log('═══════════════════════════════════════');
  
  let allRunning = true;
  results.forEach(result => {
    const icon = result.status === 'RUNNING' ? '✅' : '❌';
    console.log(`${icon} ${result.name.padEnd(20)} ${result.status}`);
    if (result.status !== 'RUNNING') {
      allRunning = false;
    }
  });
  
  console.log('═══════════════════════════════════════\n');
  
  if (!allRunning) {
    console.log('⚠️  Some services are not running!\n');
    console.log('To start all services, run:');
    console.log('  npm run dev\n');
    console.log('Or start services individually:');
    console.log('  npm run dev:api   (Backend API)');
    console.log('  npm run dev:web   (Frontend)');
    console.log('  npm run dev:ai    (AI Service)\n');
  } else {
    console.log('✅ All services are running!\n');
  }
}

checkAllServices();
