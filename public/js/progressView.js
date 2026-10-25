// Progress page (Part 8.4): puzzle rating, game rating, chapter completion and the mistakes log.
import { progress, chapterStats, streakDays, exportProgress, importProgress, resetProgress, removeMistake, storageStatus } from './progress.js';
import { PARTS, allExercises, findChapterOfExercise } from './content/index.js';
import { MISTAKE_CATEGORIES } from './play.js';
import { esc, fmtDate, lineChart, pct, toast } from './ui.js';

// Rough playing strength of each engine level, used to estimate a game rating.
const LEVEL_ELO = [500, 700, 900, 1200, 1500, 1800, 2200, 2800];

export function gameRatingHistory(games) {
  let r = 1000;
  const out = [];
  [...games].sort((a, b) => a.date - b.date).forEach((g, i) => {
    const opp = LEVEL_ELO[g.level] ?? 1200;
    const expected = 1 / (1 + 10 ** ((opp - r) / 400));
    const score = g.outcome === 'win' ? 1 : g.outcome === 'draw' ? 0.5 : 0;
    r = Math.round(r + (i < 10 ? 60 : 32) * (score - expected));
    out.push({ x: g.date, y: r });
  });
  return out;
}

export function renderProgress(root) {
  let month = new Date().toISOString().slice(0, 7);
  draw();

  function draw() {
    const p = progress();
    const all = allExercises();
    const solved = all.filter(e => p.exercises[e.id]?.solved);
    const attempted = all.filter(e => p.exercises[e.id]?.attempts);
    const firstTry = attempted.filter(e => p.exercises[e.id].firstTry).length;
    const games = p.games;
    const gr = gameRatingHistory(games);
    const wins = games.filter(g => g.outcome === 'win').length, draws = games.filter(g => g.outcome === 'draw').length;
    const months = [...new Set([month, ...p.mistakes.map(m => new Date(m.date).toISOString().slice(0, 7))])].sort().reverse();
    const monthMistakes = p.mistakes.filter(m => new Date(m.date).toISOString().slice(0, 7) === month);
    const byCat = MISTAKE_CATEGORIES.map(c => ({ ...c, n: monthMistakes.filter(m => m.category === c.id).length, all: p.mistakes.filter(m => m.category === c.id).length }));
    const maxCat = Math.max(1, ...byCat.map(c => c.n));
    const topCat = [...byCat].sort((a, b) => b.n - a.n)[0];

    // Accuracy per part.
    const partRows = PARTS.map(part => {
      const exs = part.chapters.flatMap(c => c.exercises || []);
      const att = exs.filter(e => p.exercises[e.id]?.attempts);
      const sol = exs.filter(e => p.exercises[e.id]?.solved).length;
      const ft = att.filter(e => p.exercises[e.id].firstTry).length;
      const done = part.chapters.filter(c => chapterStats(c).completed).length;
      return { part, exs: exs.length, sol, att: att.length, ft, done };
    });

    // Activity for the last 12 weeks.
    const days = {};
    for (const a of p.activity) days[a.d] = (days[a.d] || 0) + 1;
    const cells = [];
    const start = new Date();
    start.setDate(start.getDate() - 83 - ((start.getDay() + 6) % 7) + 6);
    for (let i = 0; i < 84; i++) {
      const d = new Date(start); d.setDate(start.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      const n = days[key] || 0;
      cells.push(`<span class="hm l${n === 0 ? 0 : n < 4 ? 1 : n < 10 ? 2 : 3}" title="${key}: ${n} exercise${n === 1 ? '' : 's'}"></span>`);
    }

    const recent = p.activity.slice(-12).reverse();

    root.innerHTML = `
      <div class="page progress-page">
        <h1>Your progress</h1>
        <p class="muted small">${esc(storageStatus())}.</p>
        <div class="stat-row">
          <div class="stat"><span class="stat-num">${p.rating}</span><span class="stat-label">Puzzle rating</span></div>
          <div class="stat"><span class="stat-num">${solved.length}<small>/${all.length}</small></span><span class="stat-label">Exercises solved</span></div>
          <div class="stat"><span class="stat-num">${attempted.length ? pct(firstTry / attempted.length) : '–'}</span><span class="stat-label">Solved first try</span></div>
          <div class="stat"><span class="stat-num">${gr.length ? gr[gr.length - 1].y : '–'}</span><span class="stat-label">Est. game rating</span></div>
          <div class="stat"><span class="stat-num">${streakDays()}</span><span class="stat-label">Day streak</span></div>
        </div>

        <div class="grid-2">
          <section class="card"><h2>Puzzle rating over time</h2>${lineChart(p.ratingHistory.map((h, i) => ({ x: i, y: h.r })), { yLabel: 'Puzzle rating' })}</section>
          <section class="card"><h2>Game rating over time</h2>
            ${lineChart(gr.map((g, i) => ({ x: i, y: g.y })), { yLabel: 'Game rating' })}
            <p class="muted small">${games.length} games: ${wins} won, ${draws} drawn, ${games.length - wins - draws} lost. Estimated from results against each engine level.</p></section>
        </div>

        <section class="card"><h2>Activity (last 12 weeks)</h2><div class="heatmap">${cells.join('')}</div></section>

        <section class="card"><h2>By part</h2>
          <table class="table"><thead><tr><th>Part</th><th>Chapters done</th><th>Exercises solved</th><th>First-try accuracy</th></tr></thead>
          <tbody>${partRows.map(r => `<tr><td><a href="#/part/${r.part.id}">${r.part.id}. ${esc(r.part.title)}</a></td>
            <td>${r.done} / ${r.part.chapters.length}</td>
            <td><div class="bar inline"><span style="width:${r.exs ? pct(r.sol / r.exs) : 0}"></span></div> ${r.sol} / ${r.exs}</td>
            <td>${r.att ? pct(r.ft / r.att) : '–'}</td></tr>`).join('')}</tbody></table>
        </section>

        <section class="card mistakes-review">
          <h2>Monthly mistakes review</h2>
          <p class="muted">Mistakes you logged while reviewing games. Once a month, look for the category that keeps coming up and study the matching chapter.</p>
          <label class="field inline">Month <select class="month">${months.map(m => `<option ${m === month ? 'selected' : ''} value="${m}">${new Date(m + '-01').toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</option>`).join('')}</select></label>
          <div class="cat-bars">${byCat.map(c => `<div class="cat-bar"><span class="cat-name">${esc(c.label)}</span><span class="cat-track"><span style="width:${(c.n / maxCat) * 100}%"></span></span><b>${c.n}</b><small class="muted">(${c.all} all time)</small></div>`).join('')}</div>
          ${topCat?.n ? `<p class="advice">Most common this month: <b>${esc(topCat.label)}</b>. ${advice(topCat.id)}</p>` : ''}
          ${monthMistakes.length ? `<ul class="mistakes">${monthMistakes.map(m => `<li>${fmtDate(m.date)} · <a href="#/games/${m.gameId}">${Math.floor(m.ply / 2) + 1}${m.ply % 2 ? '…' : '.'} ${esc(m.san)}</a> <span class="tag">${esc(MISTAKE_CATEGORIES.find(c => c.id === m.category)?.label)}</span> ${esc(m.note || '')} <button class="link" data-del="${m.id}">×</button></li>`).join('')}</ul>` : '<p class="muted">No mistakes logged this month.</p>'}
        </section>

        <section class="card"><h2>Recent exercises</h2>
          ${recent.length ? `<ul class="recent">${recent.map(a => { const f = findChapterOfExercise(a.ex); return `<li>${a.ok ? '✔' : '✘'} ${f ? `<a href="#/lesson/${f.chapter.id}">${f.chapter.id} ${esc(f.chapter.title)}</a>` : esc(a.ex)} <span class="muted small">${new Date(a.t).toLocaleString()}</span></li>`; }).join('')}</ul>` : '<p class="muted">Nothing yet.</p>'}
        </section>

        <section class="card"><h2>Backup</h2>
          <p class="muted">Progress is saved automatically. You can also download a copy or move it to another computer.</p>
          <div class="row">
            <button class="btn ghost" data-act="export">Download progress</button>
            <label class="btn ghost">Import progress<input type="file" accept="application/json" hidden></label>
            <button class="btn ghost danger" data-act="reset">Reset everything</button>
          </div>
        </section>
      </div>`;

    root.querySelector('.month').onchange = e => { month = e.target.value; draw(); };
    root.querySelector('[data-act=export]').onclick = () => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([exportProgress()], { type: 'application/json' }));
      a.download = `chessy-progress-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
    };
    root.querySelector('input[type=file]').onchange = async e => {
      try { importProgress(await e.target.files[0].text()); toast('Progress imported'); draw(); }
      catch (err) { toast(err.message, 'bad'); }
    };
    root.querySelector('[data-act=reset]').onclick = () => {
      if (confirm('Delete all progress, games and mistakes? This cannot be undone.')) { resetProgress(); draw(); }
    };
    root.querySelectorAll('[data-del]').forEach(b => (b.onclick = () => { removeMistake(b.dataset.del); draw(); }));
  }
  return null;
}

function advice(cat) {
  return {
    tactic: 'Revisit <a href="#/part/3">Part 3</a> and drill <a href="#/practice/tactics">mixed tactics</a>.',
    blunder: 'Use the blunder check in <a href="#/lesson/5.1">5.1 A Move-Selection Routine</a> before every move, and revisit <a href="#/lesson/3.1">3.1 Tactical Building Blocks</a>.',
    plan: 'Study <a href="#/part/6">Part 6: Strategy and Positional Play</a>, especially <a href="#/lesson/6.4">6.4 Making a Plan</a>.',
    opening: 'Go back over <a href="#/part/2">Part 2: Opening Principles</a>.',
    endgame: 'Work through the <a href="#/practice/endgames">endgame drills</a>.',
    time: 'Play slower games (15+10 or longer) and follow the same thinking routine every move.',
  }[cat];
}
