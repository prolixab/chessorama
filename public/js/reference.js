// Appendix: glossary, motif quick-reference, game-review template and answer key.
import { PARTS } from './content/index.js';
import { GLOSSARY } from './content/glossary.js';
import { describeSolution } from './exercise.js';
import { esc } from './ui.js';

const TABS = [
  { id: 'glossary', label: 'A. Glossary' },
  { id: 'motifs', label: 'B. Tactical motifs' },
  { id: 'template', label: 'C. Game-review template' },
  { id: 'answers', label: 'D. Answer key' },
];

export function renderReference(root, tab = 'glossary') {
  if (!TABS.some(t => t.id === tab)) tab = 'glossary';
  root.innerHTML = `
    <div class="page reference">
      <h1>Appendix</h1>
      <nav class="tabs">${TABS.map(t => `<a href="#/reference/${t.id}" class="${t.id === tab ? 'active' : ''}">${t.label}</a>`).join('')}</nav>
      <div class="tab-body">${{ glossary, motifs, template, answers }[tab]()}</div>
    </div>`;
  if (tab === 'glossary') {
    const input = root.querySelector('.filter');
    input.oninput = () => {
      const q = input.value.toLowerCase();
      root.querySelectorAll('.glossary dt').forEach(dt => {
        const show = (dt.textContent + dt.nextElementSibling.textContent).toLowerCase().includes(q);
        dt.hidden = dt.nextElementSibling.hidden = !show;
      });
    };
  }
  if (tab === 'template') root.querySelector('[data-act=print]').onclick = () => window.print();
  return null;
}

function glossary() {
  const items = [...GLOSSARY].sort((a, b) => a[0].localeCompare(b[0]));
  return `<input class="filter" placeholder="Search terms…" aria-label="Search glossary">
    <dl class="glossary">${items.map(([t, d]) => `<dt>${esc(t)}</dt><dd>${d}</dd>`).join('')}</dl>`;
}

function motifs() {
  const rows = PARTS.filter(p => p.id === 3 || p.id === 4).flatMap(p => p.chapters.filter(c => c.motif));
  return `<p class="muted">One line per motif — what to look for on the board.</p>
    <table class="table motifs"><thead><tr><th>Motif</th><th>Look for</th><th></th></tr></thead>
    <tbody>${rows.map(c => `<tr><td><b>${esc(c.title)}</b></td><td>${c.motif}</td><td><a href="#/lesson/${c.id}">Study</a></td></tr>`).join('')}</tbody></table>`;
}

function template() {
  const lines = n => Array.from({ length: n }, () => '<div class="line"></div>').join('');
  return `<div class="no-print row"><button class="btn primary" data-act="print">Print template</button><span class="muted">Or use the built-in review on any <a href="#/games">saved game</a>.</span></div>
    <div class="review-template">
      <h2>Game review</h2>
      <div class="tpl-grid">
        <div>Date: <span class="blank"></span></div><div>Opponent / rating: <span class="blank"></span></div>
        <div>My colour: ☐ White ☐ Black</div><div>Time control: <span class="blank"></span></div>
        <div>Opening: <span class="blank"></span></div><div>Result: ☐ Win ☐ Draw ☐ Loss</div>
      </div>
      <h3>1. Without an engine</h3>
      <p>Where did I leave the opening? Did I follow the principles (centre, development, castling)?</p>${lines(2)}
      <p>Critical moments — what was I thinking?</p>${lines(4)}
      <p>Where do I think the game was decided?</p>${lines(2)}
      <h3>2. With the engine</h3>
      <p>The turning point (move number and what I missed):</p>${lines(2)}
      <table class="tpl-table"><thead><tr><th>Move</th><th>I played</th><th>Better was</th><th>Category</th></tr></thead>
        <tbody>${Array.from({ length: 5 }, () => '<tr><td></td><td></td><td></td><td>☐ Tactic ☐ Blunder ☐ Plan ☐ Time</td></tr>').join('')}</tbody></table>
      <h3>3. Lessons</h3>
      <p>One thing to do differently next game:</p>${lines(2)}
      <p>Chapter to revisit:</p>${lines(1)}
    </div>`;
}

function answers() {
  return `<p class="muted">Solutions to every exercise. Click to reveal — try the exercise first!</p>
    ${PARTS.map(p => `<h2>Part ${p.id}: ${esc(p.title)}</h2>${p.chapters.filter(c => c.exercises?.length).map(c => `
      <h3><a href="#/lesson/${c.id}">${c.id} ${esc(c.title)}</a></h3>
      <ol class="answers">${c.exercises.map(e => `<li><details><summary>${esc(e.title || stripTags(e.prompt || '').slice(0, 80) || 'Exercise')}</summary>
        <p><b>${esc(describeSolution(e))}</b></p>${e.explain ? `<p>${e.explain}</p>` : ''}</details></li>`).join('')}</ol>`).join('')}`).join('')}`;
}

function stripTags(s) { return s.replace(/<[^>]+>/g, ''); }
