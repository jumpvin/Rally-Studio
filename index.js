const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8' };

http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
  const relative = pathname === '/' ? 'studio4/index.html' : pathname.replace(/^\//, '');
  const target = path.resolve(root, relative);
  if (!target.startsWith(root + path.sep)) return response.writeHead(403).end('Forbidden');
  fs.readFile(target, (error, content) => {
    if (error) return response.writeHead(error.code === 'ENOENT' ? 404 : 500).end(error.code === 'ENOENT' ? 'Not found' : 'Server error');
    response.writeHead(200, { 'Content-Type': types[path.extname(target)] || 'application/octet-stream' });
    response.end(content);
  });
}).listen(port, () => console.log(`Rally Studio 4: http://localhost:${port}`));
