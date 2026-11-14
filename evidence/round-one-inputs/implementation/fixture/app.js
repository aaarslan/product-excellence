const queue = document.querySelector('#queue');
const search = document.querySelector('#search');
const priority = document.querySelector('#priority');
const notice = document.querySelector('#notice');
let items = [];
const visible = () => items.filter(item => `${item.title} ${item.account}`.toLowerCase().includes(search.value.toLowerCase()) && (priority.value === 'all' || item.priority === priority.value));
function render() {
  queue.replaceChildren();
  const rows = visible();
  document.querySelector('#count').textContent = `${rows.length} handoffs`;
  if (!rows.length) {
    const empty = document.createElement('p');
    empty.textContent = 'No handoffs match these filters.';
    queue.append(empty);
  }
  for (const item of rows) {
    const article = document.createElement('article');
    const details = document.createElement('div');
    const heading = document.createElement('h2');
    heading.textContent = item.title;
    const account = document.createElement('p');
    account.textContent = item.account;
    details.append(heading, account);
    const status = document.createElement('span');
    status.className = `badge ${item.status}`;
    status.textContent = `${item.priority} · ${item.status}`;
    article.append(details, status);
    queue.append(article);
  }
}
search.addEventListener('input', render);
priority.addEventListener('change', render);
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
try {
  const response = await fetch('/api/handoffs');
  if (!response.ok) throw new Error('Could not load handoffs. Refresh to try again.');
  const data = await response.json();
  items = data.items;
  render();
} catch (error) {
  notice.textContent = error.message;
  document.querySelector('#count').textContent = 'Queue unavailable';
}
