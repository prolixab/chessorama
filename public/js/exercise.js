// Runs one exercise on a board. Exercise types:
//   move    — find the move(s); `solution` is a SAN list alternating user / opponent moves
//   squares — click the right square(s) on the board
//   choice  — multiple choice about a position
//   play    — play against Stockfish until a goal is reached (mate, promote, hold, capture)
import { Chess } from '../vendor/chess.js';
import { tryMove, uciToSan, sanToUci } from './board.js';
import { engine } from './engine.js';
import { recordAttempt } from './progress.js';
import { esc, sleep } from './ui.js';

const clean = san => san.replace(/[+#!?]/g, '');
const sideName = c => (c === 'w' ? 'White' : 'Black');

const GOAL_TEXT = {
  mate: n => `Checkmate the opponent${n ? ` within ${n} moves` : ''}.`,
  promote: () => 'Promote your pawn safely.',
  hold: n => `Hold the draw${n ? ` for ${n} moves` : ''} — don't let the opponent make progress.`,
  capture: () => 'Win all the enemy pawns without letting one promote.',
};

export function userColorOf(ex) {
  if (ex.userColor) return ex.userColor;
  return (ex.fen || '').split(' ')[1] === 'b' ? 'b' : 'w';
}

export function exerciseOrientation(ex) {
  return ex.orientation || (userColorOf(ex) === 'b' ? 'black' : 'white');
}

// Mounts an exercise. `onResult({ solved, clean, delta })` fires once when the attempt finishes.
export function mountExercise(ex, { board, panel, onResult, onNext }) {
  const s = { errors: 0, hints: 0, done: false, gaveUp: false, idx: 0, userMoves: 0, busy: false, alive: true, found: new Set() };
  const fen = ex.fen || '8/8/8/8/8/8/8/8 w - - 0 1';
  const userColor = userColorOf(ex);

  panel.innerHTML = `
    <div class="ex-head">
      <span class="ex-kind">${ex.type === 'play' ? 'Play it out' : ex.type === 'choice' ? 'Question' : ex.type === 'squares' ? 'Find the square' : 'Your move'}</span>
      ${ex.rating ? `<span class="ex-rating" title="Puzzle difficulty">★ ${ex.rating}</span>` : ''}
    </div>
    ${ex.title ? `<h3>${esc(ex.title)}</h3>` : ''}
    <div class="ex-prompt">${ex.type === 'move' || ex.type === 'play' ? `<span class="to-move ${userColor}">${sideName(userColor)} to move</span> ` : ''}${ex.prompt || ''}${ex.type === 'play' ? ` <em>${GOAL_TEXT[ex.goal](ex.maxMoves)}</em>` : ''}</div>
    <div class="ex-choices"></div>
    <div class="ex-status" aria-live="polite"></div>
    <div class="ex-thinking" hidden>Opponent is thinking…</div>
    <div class="ex-feedback" aria-live="polite"></div>
    <div class="ex-explain" hidden></div>
    <div class="ex-actions">
      <button class="btn ghost" data-act="hint">Hint</button>
      <button class="btn ghost" data-act="solution">${ex.type === 'play' ? 'Watch the engine' : 'Show solution'}</button>
      <button class="btn ghost" data-act="retry" hidden>Try again</button>
      <button class="btn primary" data-act="next" hidden>Next →</button>
    </div>`;
  const $ = sel => panel.querySelector(sel);
  const feedback = (msg, kind = '') => { const f = $('.ex-feedback'); f.className = `ex-feedback ${kind}`; f.innerHTML = msg; };
  const status = msg => { $('.ex-status').innerHTML = msg; };

  panel.querySelector('.ex-actions').addEventListener('click', e => {
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (act === 'hint') hint();
    if (act === 'solution') showSolution();
    if (act === 'retry') restart();
    if (act === 'next') onNext?.();
  });

  function finish(solved) {
    if (s.done) return;
    s.done = true;
    board.disable();
    const isClean = solved && s.errors === 0 && s.hints === 0 && !s.gaveUp;
    const delta = recordAttempt(ex, { solved, clean: isClean });
    $('[data-act=hint]').hidden = true;
    $('[data-act=solution]').hidden = ex.type !== 'play' || solved;
    $('[data-act=retry]').hidden = false;
    $('[data-act=next]').hidden = false;
    if (ex.explain) { const el = $('.ex-explain'); el.innerHTML = ex.explain; el.hidden = false; }
    const rating = delta ? ` <span class="delta ${delta > 0 ? 'up' : 'down'}">${delta > 0 ? '+' : ''}${delta} rating</span>` : '';
    if (solved) {
      feedback((isClean ? '✔ Correct — solved first time!' : '✔ Solved.') + rating, 'good');
    } else if (s.gaveUp) {
      feedback(`Here's the solution. Try it again later — it's in your review queue.${rating}`, 'neutral');
    }
    onResult?.({ solved, clean: isClean, delta });
  }

  function restart() {
    destroy();
    Object.assign(api, mountExercise(ex, { board, panel, onResult, onNext }));
  }

  // ----- move puzzles -----------------------------------------------------
  function startMove() {
    board.load(fen, { orientation: exerciseOrientation(ex), shapes: ex.shapes || [] });
    board.onMove = onUserMove;
    board.enable(userColor);
    status(ex.solution.length > 1 ? `Find the best continuation (${Math.ceil(ex.solution.length / 2)} of your moves).` : '');
  }

  function expectedAt(i) {
    return [ex.solution[i], ...(ex.alts?.[i] || [])].map(clean);
  }

  async function onUserMove(move) {
    if (!s.alive) return;
    const chess = board.chess;
    // Any checkmate is accepted, even if it isn't the move in the solution.
    const ok = expectedAt(s.idx).includes(clean(move.san)) || chess.isCheckmate();
    board.setShapes([]);
    if (ok) {
      board.setSquares({ [move.to]: 'good' });
      s.idx++;
      if (s.idx >= ex.solution.length || chess.isGameOver()) return finish(true);
      feedback('✔ Good move!', 'good');
      s.busy = true;
      await sleep(550);
      if (!s.alive) return;
      board.play(ex.solution[s.idx]);
      board.setSquares({});
      s.idx++;
      s.busy = false;
      if (s.idx >= ex.solution.length) return finish(true);
      feedback('✔ Good. Keep going — what now?', 'good');
      board.enable(userColor);
      return;
    }
    s.busy = true;
    board.setSquares({ [move.to]: 'bad' });
    feedback(ex.repertoire || ex.strict ? '✘ Not quite.' : '✘ Not quite. Checking your move…', 'bad');
    const verdict = ex.repertoire ? 'That\'s not the repertoire move — use Hint if you\'ve forgotten it.' : await judgeAlternative(move.before, move.after);
    if (!s.alive) return;
    if (verdict === 'good') {
      feedback('That move is also strong — but this exercise is about a specific idea. Can you find it?', 'neutral');
    } else {
      s.errors++;
      feedback(`✘ ${move.san} isn't it.${verdict ? ` ${verdict}` : ''} Try again.`, 'bad');
    }
    await sleep(700);
    if (!s.alive) return;
    board.undo();
    board.setSquares({});
    board.enable(userColor);
    s.busy = false;
  }

  // Compares the user's move with the solution move using the engine.
  async function judgeAlternative(fenBefore, fenAfterUser) {
    if (ex.strict) return '';
    try {
      const t = new Chess(fenBefore);
      if (!tryMove(t, ex.solution[s.idx])) return '';
      const [a, b] = await Promise.all([
        engine().analyse(fenAfterUser, { depth: 11 }),
        engine().analyse(t.fen(), { depth: 11 }),
      ]);
      // Scores from the user's point of view (the engine reports for the side to move, i.e. the opponent).
      const score = l => (l?.mate !== undefined ? (l.mate > 0 ? -100000 - l.mate : 100000 - l.mate) : -(l?.cp ?? 0));
      const mine = score(a[0]), sol = score(b[0]);
      if (sol > 50000 ? mine >= sol - 2 : mine >= sol - 40) return 'good';
      if (a[0]?.mate !== undefined && a[0].mate > 0) return 'It allows a forced mate against you.';
      if (mine < sol - 300) return 'It gives away material or the advantage.';
      return '';
    } catch {
      return '';
    }
  }

  // ----- square picking ---------------------------------------------------
  function startSquares() {
    board.load(ex.fen || '8/8/8/8/8/8/8/8 w - - 0 1', { orientation: ex.orientation || 'white', shapes: ex.shapes || [] });
    board.setBlind(ex.blind);
    board.onSquare = onSquare;
    board.enableSquarePick();
    const n = ex.answer.length;
    status(n > 1 ? `Find all ${n} squares. <span class="found">0 / ${n}</span>` : 'Click the square on the board.');
  }

  function paintSquares() {
    const sq = {};
    for (const f of s.found) sq[f] = 'good';
    if (s.wrong) sq[s.wrong] = 'bad';
    board.setSquares(sq);
  }

  function onSquare(key) {
    if (s.done || s.found.has(key)) return;
    if (ex.answer.includes(key)) {
      s.found.add(key);
      s.wrong = null;
      paintSquares();
      const n = ex.answer.length;
      if (n > 1) status(`Find all ${n} squares. <span class="found">${s.found.size} / ${n}</span>`);
      if (s.found.size === n) { board.setBlind(false); finish(true); }
      else feedback('✔ Yes!', 'good');
    } else {
      s.errors++;
      s.wrong = key;
      paintSquares();
      feedback(`✘ Not ${key}.`, 'bad');
    }
  }

  // ----- multiple choice --------------------------------------------------
  function startChoice() {
    board.load(ex.fen || '8/8/8/8/8/8/8/8 w - - 0 1', { orientation: ex.orientation || 'white', shapes: ex.shapes || [], squares: ex.squares || {} });
    board.setBlind(ex.blind);
    const box = $('.ex-choices');
    box.innerHTML = ex.options.map((o, i) => `<button class="choice" data-i="${i}">${o}</button>`).join('');
    box.addEventListener('click', e => {
      const b = e.target.closest('.choice');
      if (!b || s.done || b.disabled) return;
      const i = +b.dataset.i;
      if (i === ex.answer) {
        b.classList.add('right');
        box.querySelectorAll('.choice').forEach(x => (x.disabled = true));
        board.setBlind(false);
        finish(true);
      } else {
        s.errors++;
        b.classList.add('wrong');
        b.disabled = true;
        feedback(ex.wrong?.[i] ? `✘ ${ex.wrong[i]}` : '✘ Not that one — think again.', 'bad');
      }
    });
  }

  // ----- play against the engine ------------------------------------------
  function startPlay() {
    const pool = ex.fens || [ex.fen];
    s.playFen = pool[Math.floor(Math.random() * pool.length)];
    board.load(s.playFen, { orientation: exerciseOrientation(ex) });
    board.onMove = onPlayMove;
    s.userMoves = 0;
    updatePlayStatus();
    if (board.turn() !== userColor) engineReply();
    else board.enable(userColor);
  }

  function updatePlayStatus() {
    if (!ex.maxMoves) return status('');
    const left = ex.maxMoves - s.userMoves;
    status(`<span class="moves-left">${ex.goal === 'hold' ? 'Moves to survive' : 'Moves left'}: <b>${left}</b></span>`);
  }

  async function onPlayMove(move) {
    if (!s.alive) return;
    s.userMoves++;
    updatePlayStatus();
    const chess = board.chess;
    board.setShapes([]);
    if (ex.goal === 'mate' && chess.isCheckmate()) return finish(true);
    if (ex.goal === 'capture' && !hasPawns(chess, userColor === 'w' ? 'b' : 'w')) {
      const ok = await stillWinning(ex.keepCp ?? 0);
      if (!s.alive) return;
      return ok ? finish(true) : playFail('You won the pawns but the position is no longer good for you.');
    }
    if (chess.isStalemate()) return ex.goal === 'hold' ? finish(true) : playFail('Stalemate! The opponent has no legal moves and is not in check — it\'s a draw.');
    if (chess.isDraw()) return ex.goal === 'hold' ? finish(true) : playFail('The game is a draw.');
    if (ex.goal === 'promote' && move.promotion) {
      const ok = await stillWinning();
      if (!s.alive) return;
      return ok ? finish(true) : playFail('You promoted, but the new piece is lost straight away.');
    }
    if (ex.goal === 'hold' && ex.maxMoves && s.userMoves >= ex.maxMoves) return finish(true);
    if (ex.goal !== 'hold' && ex.maxMoves && s.userMoves >= ex.maxMoves) return playFail(`Out of moves — you needed to reach the goal within ${ex.maxMoves} moves.`);
    engineReply();
  }

  function hasPawns(chess, color) {
    return chess.board().flat().some(p => p && p.type === 'p' && p.color === color);
  }

  async function stillWinning(threshold = 300) {
    const lines = await engine().analyse(board.fen(), { depth: 12 });
    const l = lines[0];
    if (!l) return true;
    // Score is from the opponent's point of view.
    if (l.mate !== undefined) return l.mate < 0;
    return -l.cp >= threshold;
  }

  async function engineReply() {
    s.busy = true;
    $('.ex-thinking').hidden = false;
    let lines;
    try {
      lines = await engine().analyse(board.fen(), { depth: ex.depth || 14 });
    } catch {
      s.busy = false;
      feedback('The chess engine could not be started, so this exercise is unavailable.', 'bad');
      return;
    }
    if (!s.alive) return;
    await sleep(250);
    $('.ex-thinking').hidden = true;
    const best = lines.bestmove || lines[0]?.uci;
    if (!best) return;
    // Engine's verdict on the position, from its own side.
    const l = lines[0];
    const played = board.play(best);
    s.busy = false;
    updatePlayStatus();
    const chess = board.chess;
    if (chess.isCheckmate()) return playFail('You were checkmated.');
    if (chess.isDraw() || chess.isStalemate()) return ex.goal === 'hold' ? finish(true) : playFail(chess.isInsufficientMaterial() ? 'Not enough material left to checkmate — it\'s a draw.' : 'The game is a draw.');
    if (ex.goal === 'promote' && !hasPawns(chess, userColor)) return playFail('Your pawn has been captured.');
    if (ex.goal === 'capture' && played?.promotion) return playFail('The pawn has promoted.');
    if (ex.goal === 'hold') {
      if (l && ((l.mate !== undefined && l.mate > 0) || l.cp >= (ex.loseCp ?? 400))) return playFail('The opponent now has a winning position. Look at the explanation and try again.');
    } else if (l && ((l.mate === undefined && l.cp > -(ex.keepCp ?? 300)) || (l.mate !== undefined && l.mate > 0))) {
      return playFail('You have lost your winning advantage.');
    }
    board.enable(userColor);
  }

  function playFail(msg) {
    if (msg) feedback(`✘ ${msg}`, 'bad');
    s.errors++;
    finish(false);
  }

  // Engine plays both sides from the start so the user can watch the technique.
  async function watchEngine() {
    s.gaveUp = true;
    s.alive = false; // stop any pending user-move handling
    const token = (s.watchToken = {});
    board.load(s.playFen || ex.fen, { orientation: exerciseOrientation(ex) });
    board.disable();
    feedback('Watching Stockfish play it out…', 'neutral');
    for (let i = 0; i < (ex.maxMoves || 20) * 2 + 2; i++) {
      if (s.watchToken !== token || !api.alive) return;
      const chess = board.chess;
      if (chess.isGameOver()) break;
      const lines = await engine().analyse(chess.fen(), { depth: 14 });
      if (s.watchToken !== token || !api.alive) return;
      const mv = lines.bestmove || lines[0]?.uci;
      if (!mv) break;
      board.play(mv);
      if (ex.goal === 'promote' && /[qrbn]$/.test(mv) && chess.turn() !== userColor) break;
      await sleep(650);
    }
    if (!s.done) { s.done = true; recordAttempt(ex, { solved: false, clean: false }); }
    $('[data-act=hint]').hidden = true;
    $('[data-act=solution]').hidden = true;
    $('[data-act=retry]').hidden = false;
    $('[data-act=next]').hidden = false;
    if (ex.explain) { const el = $('.ex-explain'); el.innerHTML = ex.explain; el.hidden = false; }
    feedback('That\'s how the engine does it. Now try it yourself!', 'neutral');
    onResult?.({ solved: false, clean: false, delta: 0 });
  }

  // ----- hints and solutions ----------------------------------------------
  function hint() {
    if (s.done) return;
    s.hints++;
    if (ex.type === 'move') {
      const uci = sanToUci(board.fen(), ex.solution[s.idx]);
      if (!uci) return;
      if (s.hints === 1 && !ex.hint) board.setSquares({ [uci.slice(0, 2)]: 'hint' });
      else if (s.hints === 1) feedback(`💡 ${ex.hint}`, 'neutral');
      else if (s.hints === 2) board.setSquares({ [uci.slice(0, 2)]: 'hint' });
      else board.setShapes([`${uci.slice(0, 4)}:blue`]);
      if (s.hints === 1 && !ex.hint) feedback('💡 The highlighted piece is the one to move.', 'neutral');
      if (s.hints >= 2 && ex.hint) feedback(`💡 ${ex.hint}`, 'neutral');
    } else if (ex.type === 'squares') {
      if (ex.hint && s.hints === 1) return feedback(`💡 ${ex.hint}`, 'neutral');
      const next = ex.answer.find(a => !s.found.has(a));
      board.setShapes([`${next}:blue`]);
      feedback('💡 Look at the circled square.', 'neutral');
    } else {
      feedback(`💡 ${ex.hint || 'Read the explanation for this chapter again, then look carefully at the board.'}`, 'neutral');
    }
  }

  async function showSolution() {
    if (ex.type === 'play') return watchEngine();
    s.gaveUp = true;
    if (ex.type === 'move') {
      s.alive = false;
      board.disable();
      // Replay from the current point to the end, with arrows.
      for (let i = s.idx; i < ex.solution.length; i++) {
        const uci = sanToUci(board.fen(), ex.solution[i]);
        if (!uci) break;
        board.setShapes([`${uci.slice(0, 4)}:${i % 2 === 0 ? 'green' : 'red'}`]);
        await sleep(700);
        if (!api.alive) return;
        board.play(ex.solution[i]);
        await sleep(400);
      }
      board.setShapes([]);
      s.alive = true;
      finish(false);
      feedback(`Solution: <b>${ex.solution.join(' ')}</b>. It's in your review queue.`, 'neutral');
    } else if (ex.type === 'squares') {
      ex.answer.forEach(a => s.found.add(a));
      paintSquares();
      board.setBlind(false);
      finish(false);
    } else if (ex.type === 'choice') {
      panel.querySelectorAll('.choice').forEach((b, i) => { b.disabled = true; if (i === ex.answer) b.classList.add('right'); });
      board.setBlind(false);
      finish(false);
    }
  }

  function destroy() {
    s.alive = false;
    api.alive = false;
    s.watchToken = null;
    board.onMove = null;
    board.onSquare = null;
    board.setBlind(false);
    board.setShapes([]);
    board.setSquares({});
  }

  const api = { destroy, alive: true };
  if (ex.type === 'move') startMove();
  else if (ex.type === 'squares') startSquares();
  else if (ex.type === 'choice') startChoice();
  else if (ex.type === 'play') startPlay();
  return api;
}

// Exported for the answer key.
export function describeSolution(ex) {
  if (ex.type === 'move') return ex.solution.join(' ');
  if (ex.type === 'squares') return ex.answer.join(', ');
  if (ex.type === 'choice') return ex.options[ex.answer].replace(/<[^>]+>/g, '');
  if (ex.type === 'play') return ex.solutionText || GOAL_TEXT[ex.goal](ex.maxMoves);
  return '';
}

export { uciToSan };
