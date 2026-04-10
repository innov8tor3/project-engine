const form = document.getElementById('auditForm');
const statusEl = document.getElementById('status');
const summaryEl = document.getElementById('summary');
const resultsEl = document.getElementById('results');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  statusEl.textContent = 'Running audit...';
  summaryEl.textContent = '';
  resultsEl.textContent = '';

  const payload = {
    owner: document.getElementById('owner').value.trim(),
    repo: document.getElementById('repo').value.trim(),
    branch: document.getElementById('branch').value.trim(),
    path: document.getElementById('path').value.trim()
  };

  try {
    const response = await fetch('https://YOUR-BACKEND-URL/audit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Audit failed');
    }

    statusEl.textContent = 'Audit complete.';
    summaryEl.textContent =
      `Red: ${data.counts.red}
Green: ${data.counts.green}
Grey: ${data.counts.grey}`;

    const sorted = [
      ...data.files.filter(f => f.status === 'red'),
      ...data.files.filter(f => f.status === 'green'),
      ...data.files.filter(f => f.status === 'grey')
    ];

    resultsEl.innerHTML = sorted.map(file => `
      <div class="file-group">
        <div class="${file.status}">
          ${file.status.toUpperCase()} — ${file.path}
        </div>
        <div>${file.reason}</div>
        ${file.matches && file.matches.length ? `<div>${file.matches.map(m => `${m.issue_type} line ${m.line_number}: ${m.matched_text}`).join('<br>')}</div>` : ''}
      </div>
    `).join('');
  } catch (error) {
    statusEl.textContent = `Error: ${error.message}`;
  }
});
