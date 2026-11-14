const queue = document.querySelector('#queue');
const search = document.querySelector('#search');
const priority = document.querySelector('#priority');
const notice = document.querySelector('#notice');
const sendButton = document.querySelector('#send');
const selectAll = document.querySelector('#select-all');
const exportButton = document.querySelector('#export');
const reloadButton = document.querySelector('#reload');
let items = [];
let busy = false;
let loaded = false;
const selected = new Set();
const outcomes = new Map();
const visible = () => items.filter(item => `${item.title} ${item.account}`.toLowerCase().includes(search.value.toLowerCase()) && (priority.value === 'all' || item.priority === priority.value));
function render() {
  const focusedId = document.activeElement?.id;
  queue.replaceChildren();
  const rows = visible();
  const ready = rows.filter(item => item.status === 'ready');
  document.querySelector('#count').textContent = `${rows.length} handoffs · ${selected.size} selected`;
  sendButton.disabled = busy || !selected.size;
  sendButton.textContent = busy ? 'Sending…' : selected.size && [...selected].every(id => outcomes.get(id)?.state === 'failed') ? `Retry selected (${selected.size})` : `Send selected (${selected.size})`;
  selectAll.disabled = busy || !ready.length;
  selectAll.checked = ready.length > 0 && ready.every(item => selected.has(item.id));
  selectAll.indeterminate = selected.size > 0 && !selectAll.checked;
  search.disabled = priority.disabled = busy;
  exportButton.disabled = !loaded;
  if (!rows.length) {
    const empty = document.createElement('p');
    empty.textContent = items.length ? 'No handoffs match these filters. Change or clear the filters to see more.' : 'No handoffs in the queue.';
    queue.append(empty);
  }
  for (const item of rows) {
    const article = document.createElement('article');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `select-${item.id}`;
    checkbox.setAttribute('aria-label', `Select ${item.title}`);
    checkbox.checked = selected.has(item.id);
    checkbox.disabled = busy || item.status !== 'ready';
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
    const outcome = outcomes.get(item.id);
    if (outcome) {
      const message = document.createElement('p');
      message.className = outcome.state;
      message.textContent = outcome.message;
      details.append(message);
    }
    const status = document.createElement('span');
    status.className = `badge ${item.status}`;
    status.textContent = `${item.priority} · ${item.status}`;
    article.append(checkbox, details, status);
    queue.append(article);
  }
  if (focusedId) document.getElementById(focusedId)?.focus();
}
function filterChanged() {
  if (selected.size) notice.textContent = 'Selection cleared when filters changed. Select the handoffs you want to send.';
  selected.clear();
  render();
}
search.addEventListener('input', filterChanged);
priority.addEventListener('change', filterChanged);
selectAll.addEventListener('change', () => {
  for (const item of visible().filter(item => item.status === 'ready')) {
    if (selectAll.checked) selected.add(item.id);
    else selected.delete(item.id);
  }
  render();
});
async function request(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Request failed. Try again.');
    return data;
  } finally {
    clearTimeout(timer);
  }
}
sendButton.addEventListener('click', async () => {
  if (busy || !selected.size) return;
  busy = true;
  const batch = [...selected];
  let succeeded = 0;
  let failed = 0;
  for (const id of batch) outcomes.set(id, { state: 'pending', message: 'Waiting to send…' });
  render();
  for (const [index, id] of batch.entries()) {
    outcomes.set(id, { state: 'pending', message: 'Sending…' });
    notice.textContent = `Sending ${index + 1} of ${batch.length}. Keep this page open.`;
    render();
    try {
      const data = await request(`/api/handoffs/${encodeURIComponent(id)}/send`, { method: 'POST' });
      if (data.item?.id !== id || data.item.status !== 'sent') throw new Error('Could not confirm delivery. Retry to check safely.');
      items = items.map(item => item.id === id ? data.item : item);
      outcomes.set(id, { state: 'success', message: 'Sent to the next shift.' });
      selected.delete(id);
      succeeded++;
    } catch (error) {
      outcomes.set(id, { state: 'failed', message: error.name === 'AbortError' || error instanceof TypeError ? 'Delivery not confirmed. Retry safely to check or send.' : error.message });
      failed++;
    }
    render();
  }
  busy = false;
  notice.textContent = `${succeeded} sent · ${failed} failed.${failed ? ' Failed handoffs remain selected. Retry selected to send only those handoffs.' : ' All selected handoffs are now with the next shift.'}`;
  render();
  if (failed) sendButton.focus();
});
document.querySelector('#export').addEventListener('click', () => {
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
async function load() {
  reloadButton.hidden = true;
  exportButton.disabled = true;
  notice.textContent = 'Loading handoffs…';
  try {
    const data = await request('/api/handoffs');
    if (!Array.isArray(data.items)) throw new Error('Invalid queue response. Try loading again.');
    items = data.items;
    loaded = true;
    notice.textContent = 'Select ready handoffs, then send them to the next shift.';
    render();
  } catch (error) {
    notice.textContent = 'Could not load handoffs. Check your connection and try again.';
    document.querySelector('#count').textContent = 'Queue unavailable';
    reloadButton.hidden = false;
  }
}
reloadButton.addEventListener('click', load);
load();
