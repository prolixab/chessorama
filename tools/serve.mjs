// Static file server for the app, plus a tiny JSON API that stores progress in data/progress.json.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');
const progressFile = path.join(root, 'data', 'progress.json');
const port = Number(process.env.PORT) || 4321;

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.wasm': 'application/wasm',
  '.nnue': 'application/octet-stream',
};

function sendProgress(req, res) {
  if (req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': types['.json'], 'Cache-Control': 'no-store' });
    res.end(fs.existsSync(progressFile) ? fs.readFileSync(progressFile) : 'null');
    return;
  }
  if (req.method === 'PUT') {
    let body = '';
    req.on('data', d => { body += d; if (body.length > 20e6) req.destroy(); });
    req.on('end', () => {
      try {
        JSON.parse(body);
        fs.mkdirSync(path.dirname(progressFile), { recursive: true });
        // Write to a temp file first so a crash mid-write never corrupts saved progress.
        fs.writeFileSync(progressFile + '.tmp', body);
        fs.renameSync(progressFile + '.tmp', progressFile);
        res.writeHead(204).end();
      } catch {
        res.writeHead(400).end('Invalid JSON');
      }
    });
    return;
  }
  res.writeHead(405).end();
}

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/api/progress') return sendProgress(req, res);

  const rel = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
  const file = path.normalize(path.join(publicDir, rel));
  if (!file.startsWith(publicDir)) return res.writeHead(403).end();
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) return res.writeHead(404).end('Not found');
    res.writeHead(200, {
      'Content-Type': types[path.extname(file)] || 'application/octet-stream',
      'Content-Length': st.size,
      'Cache-Control': file.includes(`${path.sep}vendor${path.sep}`) ? 'max-age=86400' : 'no-cache',
    });
    fs.createReadStream(file).pipe(res);
  });
}).listen(port, () => console.log(`chessorama running at http://localhost:${port}`));
