const RESCUEGROUPS_ENDPOINT = 'https://api.rescuegroups.org/http/v2.json';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apikey =
    process.env.RESCUEGROUPS_APIKEY || 'nOnXnixt';

  let body = req.body;
  if (typeof body === 'undefined') {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString('utf-8');
    try {
      body = raw ? JSON.parse(raw) : {};
    } catch {
      res.status(400).json({ error: 'Invalid JSON body' });
      return;
    }
  } else if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      res.status(400).json({ error: 'Invalid JSON body' });
      return;
    }
  }

  const payload = {
    ...body,
    apikey,
  };

  try {
    const upstream = await fetch(RESCUEGROUPS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const text = await upstream.text();
    res.status(upstream.status).type('application/json').send(text);
  } catch (err) {
    res.status(502).json({
      error: 'Error contacting RescueGroups',
      detail: String(err && err.message ? err.message : err),
    });
  }
};