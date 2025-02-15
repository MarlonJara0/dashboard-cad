const http = require('http');

const server = http.createServer((req, res) => {
  console.log('Received request:', req.url);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World\n');
});

server.on('error', (error) => {
  console.error('Server error:', error);
});

const port = 3000;
server.listen(port, '0.0.0.0', () => {
  console.log(`Test server running at:`);
  console.log(`- http://localhost:${port}/`);
  console.log(`- http://127.0.0.1:${port}/`);
  console.log(`- http://0.0.0.0:${port}/`);
}); 