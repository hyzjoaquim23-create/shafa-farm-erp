const http = require('http');

// Test health status update
const testHealth = () => {
  const data = JSON.stringify({
    health_status: 'sick'
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/goats/1/health-status',
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBmYXJtLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTYwMDAwMDAwMH0.fakesignature'
    }
  };

  const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => {
      body += chunk;
    });
    res.on('end', () => {
      console.log('Health status test response:', res.statusCode);
      console.log('Body:', body);
    });
  });

  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
  });

  req.write(data);
  req.end();
};

testHealth();
