import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
const port = Number(process.env.PORT ?? 4173);
const items = [
  { id: 'h-101', title: 'Confirm replacement delivery', account: 'Aster Supply', priority: 'high', status: 'ready' },
  { id: 'h-102', title: 'Resolve duplicate invoice', account: 'Harbor Works', priority: 'high', status: 'ready' },
  { id: 'h-103', title: 'Share onboarding checklist', account: 'Juniper Studio', priority: 'normal', status: 'ready' },
  { id: 'h-104', title: 'Confirm account closure', account: 'Field & Stone', priority: 'normal', status: 'sent' }
];
const attempts = new Map();
const pending = new Map();
const json = (res, status, value) => { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(value)); };
const send = async (item) => {
  if (item.status === 'sent') return [200, { item }];
  if (pending.has(item.id)) return pending.get(item.id);
  const work = new Promise(resolve => setTimeout(() => {
    const attempt = (attempts.get(item.id) ?? 0) + 1;
    attempts.set(item.id, attempt);
    if (item.id === 'h-102' && attempt === 1) resolve([503, { error: 'Handoff service is temporarily unavailable. Try again.' }]);
    else { item.status = 'sent'; resolve([200, { item }]); }
  }, 600));
  pending.set(item.id, work);
  try { return await work; } finally { pending.delete(item.id); }
};
createServer(async (req, res) => {
  const path = new URL(req.url, 'http://localhost').pathname;
  if (req.method === 'GET' && path === '/api/handoffs') return json(res, 200, { items });
  const match = path.match(/^\/api\/handoffs\/([^/]+)\/send$/);
  if (req.method === 'POST' && match) {
    const item = items.find(item => item.id === match[1]);
    if (!item) return json(res, 404, { error: 'Handoff not found.' });
    const [status, body] = await send(item);
    return json(res, status, body);
  }
  const files = { '/': ['index.html', 'text/html'], '/app.js': ['app.js', 'text/javascript'], '/style.css': ['style.css', 'text/css'] };
  if (req.method !== 'GET' || !files[path]) return json(res, 404, { error: 'Not found.' });
  try {
    const [name, type] = files[path];
    res.writeHead(200, { 'Content-Type': type });
    res.end(await readFile(new URL(name, import.meta.url)));
  } catch { json(res, 500, { error: 'Unable to load application.' }); }
}).listen(port, '127.0.0.1', () => process.stdout.write(`Handoff queue: http://127.0.0.1:${port}\n`));
