const fs = require('fs');
const path = require('path');

try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex === -1) continue;
      const key = trimmed.slice(0, eqIndex).trim();
      const value = trimmed.slice(eqIndex + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  }
} catch {
  // Ignore .env loading errors
}

const http = require('http');
const https = require('https');

const PORT = process.env.PROXY_PORT || 3001;
const RESCUEGROUPS_HOST = 'api.rescuegroups.org';
const RESCUEGROUPS_PATH = '/http/v2.json';
const APIKEY = process.env.RESCUEGROUPS_APIKEY || 'nOnXnixt';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS);
    res.end();
    return;
  }

  if (req.url !== '/api/rescuegroups' || req.method !== 'POST') {
    res.writeHead(404, CORS_HEADERS);
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  const chunks = [];
  req.on('data', (c) => chunks.push(c));
  req.on('end', () => {
    const raw = Buffer.concat(chunks).toString('utf-8');
    let body;
    try {
      body = raw ? JSON.parse(raw) : {};
    } catch {
      res.writeHead(400, { 'Content-Type': 'application/json', ...CORS_HEADERS });
      res.end(JSON.stringify({ error: 'Invalid JSON body' }));
      return;
    }

    const upstreamBody = JSON.stringify({ ...body, apikey: APIKEY });

    const upstreamReq = https.request(
      {
        host: RESCUEGROUPS_HOST,
        path: RESCUEGROUPS_PATH,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(upstreamBody),
        },
      },
      (upstreamRes) => {
        const upChunks = [];
        upstreamRes.on('data', (c) => upChunks.push(c));
        upstreamRes.on('end', () => {
          const text = Buffer.concat(upChunks).toString('utf-8');
          res.writeHead(upstreamRes.statusCode || 502, {
            'Content-Type': 'application/json',
            ...CORS_HEADERS,
          });
          res.end(text);
        });
      },
    );

    upstreamReq.on('error', (err) => {
      res.writeHead(502, { 'Content-Type': 'application/json', ...CORS_HEADERS });
      res.end(
        JSON.stringify({
          error: 'Error contacting RescueGroups',
          detail: String(err && err.message ? err.message : err),
        }),
      );
    });

    upstreamReq.write(upstreamBody);
    upstreamReq.end();
  });
});

server.listen(PORT, () => {
  console.log(`RescueGroups proxy listening on http://localhost:${PORT}`);
});