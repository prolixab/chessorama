// Small DOM helpers shared by the views.

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Creates an element from an HTML string.
export function html(str) {
  const t = document.createElement('template');
  t.innerHTML = str.trim();
  return t.content.firstElementChild;
}

export function fmtDate(t) {
  return new Date(t).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function pct(x) { return `${Math.round(x * 100)}%`; }

// Progress ring as inline SVG.
export function ring(fraction, size = 44, label = '') {
  const r = size / 2 - 4;
  const c = 2 * Math.PI * r;
  const done = Math.max(0, Math.min(1, fraction));
  return `<svg class="ring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-label="${Math.round(done * 100)}% complete">
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="ring-bg"/>
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="ring-fg" stroke-dasharray="${c * done} ${c}" transform="rotate(-90 ${size / 2} ${size / 2})"/>
    <text x="50%" y="50%" dy=".35em" text-anchor="middle">${label || Math.round(done * 100)}</text>
  </svg>`;
}

// Simple line chart. points: [{x: number, y: number}]
export function lineChart(points, { width = 600, height = 180, yLabel = '', zero = null } = {}) {
  if (points.length < 2) return `<div class="chart-empty">Not enough data yet — keep training and this chart will fill in.</div>`;
  const pad = { l: 44, r: 12, t: 12, b: 24 };
  const xs = points.map(p => p.x), ys = points.map(p => p.y);
  let minY = Math.min(...ys), maxY = Math.max(...ys);
  if (zero !== null) { minY = Math.min(minY, zero); maxY = Math.max(maxY, zero); }
  if (maxY - minY < 20) { minY -= 10; maxY += 10; }
  const minX = Math.min(...xs), maxX = Math.max(...xs) || 1;
  const sx = x => pad.l + ((x - minX) / (maxX - minX || 1)) * (width - pad.l - pad.r);
  const sy = y => pad.t + (1 - (y - minY) / (maxY - minY)) * (height - pad.t - pad.b);
  const d = points.map((p, i) => `${i ? 'L' : 'M'}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join('');
  const ticks = [minY, (minY + maxY) / 2, maxY].map(v => Math.round(v));
  return `<svg class="line-chart" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" role="img" aria-label="${esc(yLabel)} chart">
    ${ticks.map(v => `<line x1="${pad.l}" x2="${width - pad.r}" y1="${sy(v)}" y2="${sy(v)}" class="grid"/><text x="${pad.l - 6}" y="${sy(v)}" dy=".35em" text-anchor="end">${v}</text>`).join('')}
    ${zero !== null ? `<line x1="${pad.l}" x2="${width - pad.r}" y1="${sy(zero)}" y2="${sy(zero)}" class="zero"/>` : ''}
    <path d="${d}" class="line"/>
    ${points.length <= 60 ? points.map(p => `<circle cx="${sx(p.x)}" cy="${sy(p.y)}" r="2.5" class="dot"/>`).join('') : ''}
  </svg>`;
}

export function toast(msg, kind = 'info') {
  const el = html(`<div class="toast ${kind}">${esc(msg)}</div>`);
  document.body.appendChild(el);
  setTimeout(() => el.classList.add('show'), 10);
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 2600);
}

export const sleep = ms => new Promise(r => setTimeout(r, ms));
