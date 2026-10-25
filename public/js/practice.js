// Practice mode: mixed drills drawn from the chapters, plus a review queue of missed exercises.
import { Board } from './board.js';
import { mountExercise } from './exercise.js';
import { progress } from './progress.js';
import { PARTS, allExercises, findChapterOfExercise } from './content/index.js';
import { esc } from './ui.js';

const shuffle = a => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const fromParts = (ids, pred = () => true) => PARTS.filter(p => ids.includes(p.id)).flatMap(p => p.chapters.flatMap(c => c.exercises || [])).filter(pred);

const MODES = {
  review: {
    title: 'Review queue',
    desc: 'Exercises you missed or needed hints for. Solve them cleanly to clear them.',
    pool: () => allExercises().filter(e => progress().exercises[e.id]?.review),
  },
  tactics: {
    title: 'Mixed tactics',
    desc: 'Random puzzles from Part 3 — you won\'t be told which motif it is.',
    pool: () => fromParts([3], e => e.type === 'move'),
  },
  patterns: {
    title: 'Pattern recognition',
    desc: 'Part 4 drill: name the checkmate pattern before you calculate, then deliver the mate.',
    pool: () => fromParts([4], e => e.type === 'move' && e.mate),
    patterns: true,
  },
  mates: {
    title: 'Basic mates drill',
    desc: 'King + Queen, King + Rook and the ladder mate from random positions, against best defence.',
    pool: () => fromParts([1], e => e.type === 'play'),
  },
  endgames: {
    title: 'Endgame drills',
    desc: 'Opposition, Lucena, Philidor and more — play them out against Stockfish.',
    pool: () => fromParts([7]),
  },
  visual: {
    title: 'Visualisation',
    desc: 'Square colours and blindfold exercises from Part 5.2.',
    pool: () => fromParts([5], e => e.blind || e.visual),
  },
  all: {
    title: 'Everything',
    desc: 'A random mix of every exercise in the manual.',
    pool: () => allExercises(),
  },
};

export function renderPractice(root, mode) {
  if (!mode || !MODES[mode]) {
    root.innerHTML = `
      <div class="page">
        <h1>Practice</h1>
        <p class="lede">Mixed drills from the manual. Every attempt updates your puzzle rating and progress.</p>
        <div class="chapter-grid">
          ${Object.entries(MODES).map(([id, m]) => {
            const n = m.pool().length;
            return `<a class="chapter-card ${n ? '' : 'disabled'}" href="${n ? `#/practice/${id}` : '#/practice'}"><h3>${esc(m.title)}</h3><p>${esc(m.desc)}</p><small>${n} exercise${n === 1 ? '' : 's'}</small></a>`;
          }).join('')}
        </div>
      </div>`;
    return null;
  }

  const m = MODES[mode];
  let queue = shuffle(m.pool());
  let n = 0, cleanCount = 0, current = null;
  root.innerHTML = `
    <div class="lesson">
      <div class="lesson-board"><div class="board-holder"></div>
        <div class="board-tools"><button class="icon-btn" data-tool="flip">⇅ Flip</button></div></div>
      <div class="lesson-panel">
        <div class="crumbs"><a href="#/practice">Practice</a> › ${esc(m.title)}</div>
        <h1 class="lesson-title">${esc(m.title)}</h1>
        <div class="practice-score"></div>
        <div class="step-body"></div>
      </div>
    </div>`;
  const board = new Board(root.querySelector('.board-holder'));
  const body = root.querySelector('.step-body');
  root.querySelector('[data-tool=flip]').onclick = () => board.flip();

  function score() {
    root.querySelector('.practice-score').innerHTML = `<span>Done: <b>${n}</b></span> <span>Clean: <b>${cleanCount}</b></span> <span>Rating: <b>${progress().rating}</b></span>`;
  }

  function next() {
    current?.destroy();
    if (!queue.length) {
      if (mode === 'review') {
        body.innerHTML = `<h2>Review queue cleared 🎉</h2><p><a class="btn primary" href="#/practice">Back to practice</a></p>`;
        board.load('8/8/8/8/8/8/8/8 w - - 0 1');
        return;
      }
      queue = shuffle(m.pool());
    }
    const ex = queue.shift();
    const found = findChapterOfExercise(ex.id);
    if (m.patterns) return askPattern(ex, found);
    mountIt(ex, found);
  }

  function mountIt(ex, found) {
    body.innerHTML = `<div class="from-chapter muted small">From <a href="#/lesson/${found.chapter.id}">${found.chapter.id} ${esc(found.chapter.title)}</a></div><div class="exercise"></div>`;
    if (mode === 'tactics') body.querySelector('.from-chapter').innerHTML = '<span class="muted small">Motif hidden — find the best move.</span>';
    // Mixed tactics hides the motif: no title, no hint, and a neutral prompt.
    const shown = mode === 'tactics' ? { ...ex, title: undefined, hint: undefined, prompt: ex.mate ? 'Find the mate.' : 'Find the best move.' } : ex;
    current = mountExercise(shown, {
      board,
      panel: body.querySelector('.exercise'),
      onResult: r => { n++; if (r.clean) cleanCount++; score(); if (mode === 'review' && r.clean) queue = queue.filter(e => e.id !== ex.id); },
      onNext: next,
    });
  }

  // Part 4 drill: identify the pattern first.
  function askPattern(ex, found) {
    const names = PARTS.find(p => p.id === 4).chapters.filter(c => c.exercises?.length).map(c => c.title);
    const options = shuffle([found.chapter.title, ...shuffle(names.filter(nm => nm !== found.chapter.title)).slice(0, 3)]);
    board.load(ex.fen, { orientation: ex.fen.split(' ')[1] === 'b' ? 'black' : 'white' });
    body.innerHTML = `<div class="exercise"><div class="ex-head"><span class="ex-kind">Step 1 · Name the pattern</span></div>
      <p class="ex-prompt">${ex.fen.split(' ')[1] === 'b' ? 'Black' : 'White'} to move and mate. Before calculating: which checkmate pattern is on the board?</p>
      <div class="ex-choices">${options.map(o => `<button class="choice">${esc(o)}</button>`).join('')}</div>
      <div class="ex-feedback"></div></div>`;
    let wrong = false;
    body.querySelector('.ex-choices').addEventListener('click', e => {
      const b = e.target.closest('.choice');
      if (!b || b.disabled) return;
      if (b.textContent === found.chapter.title) {
        b.classList.add('right');
        body.querySelector('.ex-feedback').innerHTML = `<span class="good">✔ ${esc(found.chapter.title)}. Now deliver the mate!</span>`;
        setTimeout(() => mountIt({ ...ex, prompt: `${wrong ? '' : '✔ Pattern spotted. '}Deliver the ${esc(found.chapter.title)}.` }, found), 900);
      } else {
        wrong = true;
        b.classList.add('wrong');
        b.disabled = true;
      }
    });
  }

  score();
  next();
  return { destroy() { current?.destroy(); board.destroy(); } };
}
