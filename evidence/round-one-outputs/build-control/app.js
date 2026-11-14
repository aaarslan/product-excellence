const queue = document.querySelector('#queue');
const search = document.querySelector('#search');
const priority = document.querySelector('#priority');
const notice = document.querySelector('#notice');
const sendButton = document.querySelector('#send');
const retryButton = document.querySelector('#retry');
const selectButton = document.querySelector('#select-visible');
const exportButton = document.querySelector('#export');
const reloadButton = document.querySelector('#reload');
let items = [];
let loaded = false;
let busy = false;
let sendingId = null;
const selected = new Set();
const failures = new Map();
const visible = () => items.filter(item => `${item.title} ${item.account}`.toLowerCase().includes(search.value.toLowerCase()) && (priority.value === 'all' || item.priority === priority.value));
function render() {
  const focusId = document.activeElement?.id;
  queue.replaceChildren();
  const rows = visible();
  const hidden = [...selected].filter(id => !rows.some(item => item.id === id)).length;
  document.querySelector('#count').textContent = loaded ? `${rows.length} handoffs · ${selected.size} selected${hidden ? ` (${hidden} hidden by filters)` : ''}` : 'Queue unavailable';
  sendButton.disabled = busy || !selected.size;
  sendButton.textContent = busy ? 'Sending…' : `Send selected (${selected.size})`;
  retryButton.hidden = !failures.size;
  retryButton.disabled = busy;
  retryButton.textContent = `Retry failed (${failures.size})`;
  selectButton.disabled = busy || !rows.some(item => item.status === 'ready');
  document.querySelector('#clear').disabled = busy || !selected.size;
  exportButton.disabled = !loaded;
  if (loaded && !rows.length) {
    const empty = document.createElement('p');
    empty.textContent = items.length ? 'No handoffs match these filters. Change search or priority to see more.' : 'No handoffs in the queue.';
    queue.append(empty);
  }
  for (const item of rows) {
    const article = document.createElement('article');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `select-${item.id}`;
    checkbox.setAttribute('aria-label', `Select ${item.title}`);
    checkbox.checked = selected.has(item.id);
    checkbox.disabled = busy || item.status === 'sent';
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) selected.add(item.id);
      else selected.delete(item.id);
      render();
    });
    const details = document.createElement('div');
    details.className = 'details';
    const heading = document.createElement('h2');
    heading.textContent = item.title;
    const account = document.createElement('p');
    account.textContent = item.account;
    details.append(heading, account);
    if (failures.has(item.id)) {
      const error = document.createElement('p');
      error.className = 'error';
      error.textContent = failures.get(item.id);
      details.append(error);
    }
    const status = document.createElement('span');
    status.className = `badge ${item.status}`;
    status.textContent = `${item.priority} · ${sendingId === item.id ? 'sending' : failures.has(item.id) ? 'failed' : item.status}`;
    article.append(checkbox, details, status);
    queue.append(article);
  }
  if (focusId?.startsWith('select-')) document.getElementById(focusId)?.focus();
}
async function request(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'The request failed. Try again.');
    return data;
  } finally {
    clearTimeout(timeout);
  }
}
async function submit(ids) {
  if (busy) return;
  const batch = items.filter(item => ids.has(item.id) && item.status === 'ready');
  if (!batch.length) return;
  busy = true;
  let succeeded = 0;
  let failed = 0;
  for (const [index, item] of batch.entries()) {
    sendingId = item.id;
    failures.delete(item.id);
    notice.textContent = `Sending ${index + 1} of ${batch.length}: ${item.title}. Keep this page open.`;
    render();
    try {
      const data = await request(`/api/handoffs/${encodeURIComponent(item.id)}/send`, { method: 'POST' });
      if (data.item?.id !== item.id || data.item.status !== 'sent') throw new Error('The service did not confirm this handoff. Retry to confirm its status.');
      item.status = 'sent';
      selected.delete(item.id);
      succeeded++;
    } catch (error) {
      failures.set(item.id, error.name === 'AbortError' || error instanceof TypeError ? 'Could not confirm delivery. Retry safely to confirm or send this handoff.' : error.message);
      selected.add(item.id);
      failed++;
    }
  }
  sendingId = null;
  busy = false;
  notice.textContent = `${succeeded} sent · ${failed} failed.${failed ? ' Failed handoffs remain selected. Retry failed sends only failures, including hidden rows.' : ' All selected handoffs were sent.'}`;
  render();
  if (failed) retryButton.focus();
  else document.querySelector('#notice').focus();
}
async function load() {
  reloadButton.hidden = true;
  notice.textContent = 'Loading handoffs…';
  exportButton.disabled = true;
  try {
    const data = await request('/api/handoffs');
    items = data.items;
    loaded = true;
    notice.textContent = 'Select ready handoffs to send. Selection is kept when filters change.';
  } catch {
    notice.textContent = 'Could not load handoffs. Try loading the queue again.';
    reloadButton.hidden = false;
  }
  render();
}
search.addEventListener('input', render);
priority.addEventListener('change', render);
sendButton.addEventListener('click', () => submit(new Set(selected)));
retryButton.addEventListener('click', () => submit(new Set(failures.keys())));
selectButton.addEventListener('click', () => {
  for (const item of visible()) if (item.status === 'ready') selected.add(item.id);
  render();
});
document.querySelector('#clear').addEventListener('click', () => { selected.clear(); render(); });
reloadButton.addEventListener('click', load);
exportButton.addEventListener('click', () => {
  const csvCell = value => `"${String(value).replaceAll('"', '""')}"`;
  const rows = [['Title', 'Account', 'Priority', 'Status'], ...visible().map(item => [item.title, item.account, item.priority, item.status])];
  const blob = new Blob([rows.map(row => row.map(csvCell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'shift-handoffs.csv';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
load();
