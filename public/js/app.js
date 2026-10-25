// App shell and hash router.
import { loadProgress, progress, chapterStats, streakDays, setLevel } from './progress.js';
import { PARTS, LEVELS_PLAN, findChapter, allExercises } from './content/index.js';
import { renderLesson } from './lesson.js';
import { renderPlay, renderReview, renderGames } from './play.js';
import { renderProgress } from './progressView.js';
import { renderPractice } from './practice.js';
import { renderReference } from './reference.js';
import { esc, ring, pct } from './ui.js';

const main = document.getElementById('main');
let view = null;

function partStats(part) {
  const exs = part.chapters.flatMap(c => c.exercises || []);
  const solved = exs.filter(e => progress().exercises[e.id]?.solved).length;
  const done = part.chapters.filter(c => chapterStats(c).completed).length;
  return { solved, total: exs.length, done, chapters: part.chapters.length, pct: exs.length ? solved / exs.length : done / part.chapters.length };
}

function recommendedParts() {
  const lvl = LEVELS_PLAN.find(l => l.id === progress().level);
  return new Set(lvl?.parts || []);
}

function renderHome() {
  const p = progress();
  const all = allExercises();
  const solved = all.filter(e => p.exercises[e.id]?.solved).length;
  const last = p.lastLesson && findChapter(p.lastLesson.chapterId);
  const rec = recommendedParts();
  const review = all.filter(e => p.exercises[e.id]?.review).length;
  main.innerHTML = `
    <div class="page home">
      <section class="hero">
        <div>
          <h1>Chess Training Manual</h1>
          <p class="lede">Moves and tactics, from fundamentals to advanced play. Each chapter explains an idea on the board, then you prove you've got it.</p>
          <div class="hero-actions">
            ${last ? `<a class="btn primary" href="#/lesson/${last.chapter.id}/${p.lastLesson.step + 1}">Continue: ${last.chapter.id} ${esc(last.chapter.title)} →</a>` : `<a class="btn primary" href="#/lesson/1.1">Start with 1.1 The Board and Notation →</a>`}
            ${review ? `<a class="btn ghost" href="#/practice/review">Review ${review} missed exercise${review > 1 ? 's' : ''}</a>` : ''}
            <a class="btn ghost" href="#/play">Play a game</a>
          </div>
        </div>
        <div class="hero-stats">
          <div class="stat"><span class="stat-num">${p.rating}</span><span class="stat-label">Puzzle rating</span></div>
          <div class="stat"><span class="stat-num">${solved}<small>/${all.length}</small></span><span class="stat-label">Exercises solved</span></div>
          <div class="stat"><span class="stat-num">${streakDays()}</span><span class="stat-label">Day streak</span></div>
          <div class="stat"><span class="stat-num">${p.games.length}</span><span class="stat-label">Games played</span></div>
        </div>
      </section>

      <section class="level-pick">
        <h2>Your level</h2>
        <p class="muted">Pick your level and the parts to focus on are marked <span class="tag rec">Focus</span>. You can still study anything.</p>
        <div class="levels">
          ${LEVELS_PLAN.map(l => `<button class="level ${p.level === l.id ? 'active' : ''}" data-level="${l.id}"><b>${l.name}</b><span>${l.range}</span><small>${l.focus}</small></button>`).join('')}
        </div>
      </section>

      <section class="weekly">
        <h2>Weekly rhythm</h2>
        <ul class="rhythm">
          <li><b>3×</b> study / puzzle sessions — work through a chapter here</li>
          <li><b>2–3×</b> slower games (15+10 or longer) — <a href="#/play">play</a></li>
          <li><b>1×</b> game review — <a href="#/games">review your games</a> against the chapter you're studying</li>
        </ul>
      </section>

      <section class="parts">
        ${PARTS.map(part => {
          const st = partStats(part);
          return `<article class="part-card ${rec.has(part.id) ? 'recommended' : ''}">
            <header>
              ${ring(st.pct, 52)}
              <div>
                <h2><a href="#/part/${part.id}">Part ${part.id}: ${esc(part.title)}</a> ${rec.has(part.id) ? '<span class="tag rec">Focus</span>' : ''}</h2>
                <p class="muted">${esc(part.blurb)}</p>
              </div>
            </header>
            <ol class="chapter-list">
              ${part.chapters.map(c => {
                const cs = chapterStats(c);
                return `<li class="${cs.completed ? 'done' : cs.started ? 'started' : ''}">
                  <a href="#/lesson/${c.id}"><span class="ch-num">${c.id}</span> ${esc(c.title)}</a>
                  <span class="ch-prog">${cs.total ? `${cs.solved}/${cs.total}` : cs.completed ? '✓' : ''}</span>
                </li>`;
              }).join('')}
            </ol>
          </article>`;
        }).join('')}
      </section>
    </div>`;
  main.querySelector('.levels').addEventListener('click', e => {
    const b = e.target.closest('[data-level]');
    if (!b) return;
    setLevel(b.dataset.level);
    renderHome();
  });
}

function renderPart(id) {
  const part = PARTS.find(p => String(p.id) === String(id));
  if (!part) return renderHome();
  const st = partStats(part);
  main.innerHTML = `
    <div class="page">
      <div class="crumbs"><a href="#/">Manual</a> › Part ${part.id}</div>
      <header class="part-head">${ring(st.pct, 64)}<div><h1>Part ${part.id}: ${esc(part.title)}</h1><p class="lede">${esc(part.blurb)}</p></div></header>
      ${part.intro ? `<div class="part-intro">${part.intro}</div>` : ''}
      <div class="chapter-grid">
        ${part.chapters.map(c => {
          const cs = chapterStats(c);
          return `<a class="chapter-card ${cs.completed ? 'done' : ''}" href="#/lesson/${c.id}">
            <span class="ch-num">${c.id}</span>
            <h3>${esc(c.title)}</h3>
            <p>${esc(c.blurb || '')}</p>
            <div class="bar"><span style="width:${pct(cs.pct)}"></span></div>
            <small>${cs.total ? `${cs.solved} of ${cs.total} exercises` : cs.completed ? 'Read ✓' : 'Reading'}${cs.completed ? ' · complete' : ''}</small>
          </a>`;
        }).join('')}
      </div>
    </div>`;
}

function route() {
  const parts = location.hash.replace(/^#\/?/, '').split('/');
  const [page, a, b] = parts;
  // Re-use the lesson view when only the step changes, so the board doesn't flash.
  if (page === 'lesson' && view?.chapterId === a) {
    view.update(b);
    highlightNav('lesson');
    return;
  }
  view?.destroy?.();
  view = null;
  main.innerHTML = '';
  window.scrollTo(0, 0);
  highlightNav(page || 'home');
  if (page === 'lesson') view = renderLesson(main, a, b);
  else if (page === 'part') renderPart(a);
  else if (page === 'play') view = renderPlay(main);
  else if (page === 'games' && a) view = renderReview(main, a);
  else if (page === 'games') renderGames(main);
  else if (page === 'progress') view = renderProgress(main);
  else if (page === 'practice') view = renderPractice(main, a);
  else if (page === 'reference') view = renderReference(main, a);
  else renderHome();
}

function highlightNav(page) {
  document.querySelectorAll('.topnav a').forEach(a => a.classList.toggle('active', a.dataset.page === page || (page === 'part' && a.dataset.page === 'home') || (page === 'lesson' && a.dataset.page === 'home')));
}

await loadProgress();
window.addEventListener('hashchange', route);
route();
