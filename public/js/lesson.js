// Lesson view: explanation steps with board examples, then exercises, then a chapter summary.
import { Board, tryMove } from './board.js';
import { mountExercise } from './exercise.js';
import { progress, markLearnSeen, setLastLesson, completeChapter, chapterStats } from './progress.js';
import { findChapter, nextChapter } from './content/index.js';
import { Chess } from '../vendor/chess.js';
import { esc } from './ui.js';

export function renderLesson(root, chapterId, stepParam) {
  const found = findChapter(chapterId);
  if (!found) {
    root.innerHTML = `<div class="page"><h1>Chapter not found</h1><p><a href="#/">Back to the manual</a></p></div>`;
    return () => {};
  }
  const { chapter, part } = found;
  const learn = chapter.learn || [];
  const exercises = chapter.exercises || [];
  const steps = [
    ...learn.map((l, i) => ({ kind: 'learn', data: l, i })),
    ...exercises.map((e, i) => ({ kind: 'exercise', data: e, i })),
    { kind: 'summary' },
  ];
  const session = { results: {} };

  root.innerHTML = `
    <div class="lesson">
      <div class="lesson-board"><div class="board-holder"></div>
        <div class="board-tools">
          <button class="icon-btn" data-tool="flip" title="Flip board">⇅ Flip</button>
          <span class="move-ctrl" hidden>
            <button class="icon-btn" data-tool="first" title="Start">⏮</button>
            <button class="icon-btn" data-tool="prev" title="Previous move">◀</button>
            <span class="move-counter"></span>
            <button class="icon-btn" data-tool="next" title="Next move">▶</button>
            <button class="icon-btn" data-tool="last" title="End">⏭</button>
          </span>
          <button class="icon-btn" data-tool="explore" title="Move the pieces yourself" hidden>✋ Try moves</button>
          <button class="icon-btn" data-tool="reset" title="Reset position" hidden>↺ Reset</button>
        </div>
      </div>
      <div class="lesson-panel">
        <div class="crumbs"><a href="#/">Manual</a> › <a href="#/part/${part.id}">Part ${part.id}: ${esc(part.title)}</a></div>
        <h1 class="lesson-title"><span class="ch-num">${chapter.id}</span> ${esc(chapter.title)}</h1>
        <nav class="stepper" aria-label="Lesson steps"></nav>
        <div class="step-body"></div>
        <div class="step-nav">
          <button class="btn ghost" data-nav="prev">← Back</button>
          <button class="btn primary" data-nav="next">Next →</button>
        </div>
      </div>
    </div>`;

  const board = new Board(root.querySelector('.board-holder'));
  const body = root.querySelector('.step-body');
  const stepper = root.querySelector('.stepper');
  const tools = root.querySelector('.board-tools');
  const moveCtrl = tools.querySelector('.move-ctrl');
  let current = null;   // mounted exercise
  let demo = null;      // learn step move-stepping state
  let stepIndex = 0;

  function stepState(st) {
    if (st.kind === 'learn') return progress().chapters[chapter.id]?.learnSeen || stepIndex > steps.indexOf(st) ? 'seen' : '';
    if (st.kind === 'exercise') {
      const r = session.results[st.data.id];
      if (r) return r.clean ? 'clean' : r.solved ? 'solved' : 'failed';
      const rec = progress().exercises[st.data.id];
      return rec?.solved ? (rec.lastClean ? 'clean' : 'solved') : rec?.attempts ? 'failed' : '';
    }
    return chapterStats(chapter).completed ? 'clean' : '';
  }

  function drawStepper() {
    stepper.innerHTML = steps.map((st, i) => {
      const label = st.kind === 'learn' ? `Learn: ${st.data.title}` : st.kind === 'exercise' ? `Exercise ${st.i + 1}` : 'Summary';
      const icon = st.kind === 'learn' ? '📖' : st.kind === 'exercise' ? st.i + 1 : '🏁';
      return `<a href="#/lesson/${chapter.id}/${i + 1}" class="step-dot ${st.kind} ${stepState(st)} ${i === stepIndex ? 'current' : ''}" title="${esc(label)}">${icon}</a>`;
    }).join('');
  }

  function go(i) {
    location.hash = `#/lesson/${chapter.id}/${i + 1}`;
  }

  function show(i) {
    stepIndex = Math.max(0, Math.min(steps.length - 1, i));
    current?.destroy();
    current = null;
    demo = null;
    moveCtrl.hidden = true;
    tools.querySelector('[data-tool=explore]').hidden = true;
    tools.querySelector('[data-tool=reset]').hidden = true;
    const st = steps[stepIndex];
    setLastLesson(chapter.id, stepIndex);
    root.querySelector('[data-nav=prev]').disabled = stepIndex === 0;
    const nextBtn = root.querySelector('[data-nav=next]');
    nextBtn.hidden = st.kind === 'summary';
    nextBtn.textContent = stepIndex === learn.length - 1 && exercises.length ? 'Start exercises →' : 'Next →';

    if (st.kind === 'learn') showLearn(st.data);
    else if (st.kind === 'exercise') showExercise(st.data);
    else showSummary();
    if (stepIndex >= learn.length - 1 && learn.length) markLearnSeen(chapter.id);
    drawStepper();
    root.querySelector('.lesson-panel').scrollTop = 0;
  }

  function showLearn(step) {
    body.innerHTML = `
      <div class="learn">
        <h2>${esc(step.title)}</h2>
        <div class="learn-text">${step.text}</div>
        <div class="move-caption" hidden></div>
      </div>`;
    board.load(step.fen || '8/8/8/8/8/8/8/8 w - - 0 1', { orientation: step.orientation || 'white', shapes: step.shapes, squares: step.squares });
    if (step.moves?.length) {
      demo = { step, ply: 0 };
      moveCtrl.hidden = false;
      renderDemo();
    }
    if (board.legal) {
      tools.querySelector('[data-tool=explore]').hidden = false;
    }
  }

  // Shows the demo position after `demo.ply` moves.
  function renderDemo(animate = false) {
    const { step, ply } = demo;
    const chess = new Chess(step.fen);
    let last;
    for (let k = 0; k < ply; k++) last = tryMove(chess, step.moves[k].san);
    const m = ply ? step.moves[ply - 1] : null;
    board.load(chess.fen(), {
      shapes: m ? m.shapes || [] : step.shapes || [],
      squares: m ? m.squares || {} : step.squares || {},
      lastMove: last ? [last.from, last.to] : undefined,
      animate,
    });
    moveCtrl.querySelector('.move-counter').textContent = `${ply} / ${step.moves.length}`;
    const cap = body.querySelector('.move-caption');
    if (m) {
      const moveNo = movePrefix(step.fen, ply - 1);
      cap.innerHTML = `<b>${moveNo}${esc(m.san)}</b> ${m.text || ''}`;
      cap.hidden = false;
    } else {
      cap.innerHTML = `<span class="muted">Press ▶ to step through the moves.</span>`;
      cap.hidden = false;
    }
  }

  function movePrefix(fen, plyIndex) {
    const [, turn, , , , full] = fen.split(' ');
    const startBlack = turn === 'b';
    const absPly = plyIndex + (startBlack ? 1 : 0);
    const num = Number(full || 1) + Math.floor(absPly / 2);
    return absPly % 2 === 0 ? `${num}. ` : `${num}… `;
  }

  function showExercise(ex) {
    body.innerHTML = `<div class="exercise"></div>`;
    current = mountExercise(ex, {
      board,
      panel: body.querySelector('.exercise'),
      onResult: r => {
        session.results[ex.id] = r;
        drawStepper();
        maybeComplete();
      },
      onNext: () => go(stepIndex + 1),
    });
  }

  function maybeComplete() {
    const st = chapterStats(chapter);
    if (st.total && st.solved === st.total) {
      const tried = exercises.filter(e => session.results[e.id]);
      const cleanCount = exercises.filter(e => session.results[e.id]?.clean ?? progress().exercises[e.id]?.firstTry).length;
      if (tried.length) completeChapter(chapter.id, cleanCount / exercises.length);
    }
  }

  function showSummary() {
    if (!exercises.length) markLearnSeen(chapter.id);
    const st = chapterStats(chapter);
    const missing = exercises.filter(e => !progress().exercises[e.id]?.solved);
    const nxt = nextChapter(chapter.id);
    board.load(chapter.summaryFen || '8/8/8/8/8/8/8/8 w - - 0 1', { orientation: 'white' });
    body.innerHTML = `
      <div class="summary">
        <h2>${st.completed || (!st.total) ? '🏁 Chapter complete' : 'Chapter summary'}</h2>
        ${st.total ? `<p class="big-stat">${st.solved} / ${st.total} exercises solved</p>` : ''}
        ${chapter.keyPoints ? `<h3>Key points</h3><ul class="key-points">${chapter.keyPoints.map(k => `<li>${k}</li>`).join('')}</ul>` : ''}
        ${missing.length ? `<p>Still to solve: ${missing.map(e => `<a href="#/lesson/${chapter.id}/${learn.length + exercises.indexOf(e) + 1}">Exercise ${exercises.indexOf(e) + 1}</a>`).join(', ')}</p>` : ''}
        <div class="summary-actions">
          ${nxt ? `<a class="btn primary" href="#/lesson/${nxt.id}">Next: ${nxt.id} ${esc(nxt.title)} →</a>` : `<a class="btn primary" href="#/">Back to the manual</a>`}
          <a class="btn ghost" href="#/play">Play a game to practise</a>
        </div>
      </div>`;
  }

  // Board tool buttons.
  tools.addEventListener('click', e => {
    const t = e.target.closest('[data-tool]')?.dataset.tool;
    if (!t) return;
    if (t === 'flip') board.flip();
    if (demo) {
      if (t === 'first') demo.ply = 0;
      if (t === 'prev') demo.ply = Math.max(0, demo.ply - 1);
      if (t === 'next') demo.ply = Math.min(demo.step.moves.length, demo.ply + 1);
      if (t === 'last') demo.ply = demo.step.moves.length;
      // Animate single steps; jump straight to the first/last position.
      if (['first', 'prev', 'next', 'last'].includes(t)) renderDemo(t === 'next' || t === 'prev');
    }
    if (t === 'explore') {
      board.enable('both');
      board.onMove = () => board.enable('both');
      tools.querySelector('[data-tool=explore]').hidden = true;
      tools.querySelector('[data-tool=reset]').hidden = false;
    }
    if (t === 'reset') show(stepIndex);
  });

  root.querySelector('.step-nav').addEventListener('click', e => {
    const n = e.target.closest('[data-nav]')?.dataset.nav;
    if (n === 'prev') go(stepIndex - 1);
    if (n === 'next') go(stepIndex + 1);
  });

  const onKey = e => {
    if (!demo || e.target.closest('input, textarea')) return;
    if (e.key === 'ArrowRight') { demo.ply = Math.min(demo.step.moves.length, demo.ply + 1); renderDemo(true); }
    if (e.key === 'ArrowLeft') { demo.ply = Math.max(0, demo.ply - 1); renderDemo(true); }
  };
  document.addEventListener('keydown', onKey);

  let initial = stepParam ? Number(stepParam) - 1 : 0;
  // Returning to a chapter with no step in the URL resumes where the user left off.
  if (!stepParam && progress().lastLesson?.chapterId === chapter.id) initial = progress().lastLesson.step;
  show(Number.isFinite(initial) ? initial : 0);

  return {
    update(step) { show(Number(step || 1) - 1); },
    chapterId: chapter.id,
    destroy() {
      document.removeEventListener('keydown', onKey);
      current?.destroy();
      board.destroy();
    },
  };
}
