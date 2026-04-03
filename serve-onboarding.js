const http = require('http');
const fs = require('fs');
const path = require('path');
const dir = 'C:\\Users\\maria\\OneDrive\\Documents\\Maria Files\\Fundamentals\\The Plan\\Onboarding';
const port = 8181;
const mime = { '.html':'text/html', '.css':'text/css', '.js':'application/javascript' };
http.createServer((req, res) => {
  const file = path.join(dir, req.url === '/' ? 'Onboarding Worksheets - Fillable.html' : req.url);
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'text/plain' });
    res.end(data);
  });
}).listen(port, () => console.log('Serving on http://localhost:' + port));
