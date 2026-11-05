// Play a full game against Stockfish, then review it (Part 8.1: notes first, engine second, mistakes log).
import { Board, tryMove, uciToSan } from './board.js';
import { Chess } from '../vendor/chess.js';
import { engine, LEVELS, whiteCp } from './engine.js';
import { progress, save, addGame, updateGame, deleteGame, addMistake, removeMistake } from './progress.js';
import { esc, fmtDate, toast, sleep } from './ui.js';

export const MISTAKE_CATEGORIES = [
  { id: 'tactic', label: 'Tactic missed' },
  { id: 'blunder', label: 'Blunder (hung material)' },
  { id: 'plan', label: 'Wrong plan' },
  { id: 'opening', label: 'Opening principle' },
  { id: 'endgame', label: 'Endgame technique' },
  { id: 'time', label: 'Time / rushed' },
];

const VALUE = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
const PIECE_NAME = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king' };

// Pieces of `color` that are attacked and either undefended or attacked by something cheaper.
export function loosePieces(chess, color) {
  const enemy = color === 'w' ? 'b' : 'w';
  const out = [];
  for (const row of chess.board()) for (const p of row) {
    if (!p || p.color !== color || p.type === 'k') continue;
    const attackers = chess.attackers(p.square, enemy);
    if (!attackers.length) continue;
    const defenders = chess.attackers(p.square, color);
    const cheapest = Math.min(...attackers.map(sq => VALUE[chess.get(sq).type] || 0.5));
    if (!defenders.length || cheapest < VALUE[p.type]) out.push(p);
  }
  return out;
}

function checklist(chess, userColor) {
  if (chess.turn() !== userColor || chess.isGameOver()) return '<p class="muted">Waiting for the opponent…</p>';
  const hist = chess.history({ verbose: true });
  const last = hist[hist.length - 1];
  let threat = 'Game start — no previous move.';
  if (last) {
    const targets = [];
    const c = new Chess(chess.fen());
    for (const row of c.board()) for (const p of row) {
      if (p && p.color === userColor && c.attackers(p.square, last.color).includes(last.to)) targets.push(`${PIECE_NAME[p.type]} on ${p.square}`);
    }
    threat = `<b>${last.san}</b> — the ${PIECE_NAME[last.piece]} on ${last.to} now attacks ${targets.length ? targets.join(', ') : 'none of your pieces'}.`;
  }
  const moves = chess.moves({ verbose: true });
  const checks = moves.filter(m => m.san.includes('+') || m.san.includes('#')).map(m => m.san);
  const captures = moves.filter(m => m.captured).map(m => m.san);
  const loose = loosePieces(chess, userColor).map(p => `${PIECE_NAME[p.type]} ${p.square}`);
  const theirLoose = loosePieces(chess, userColor === 'w' ? 'b' : 'w').map(p => `${PIECE_NAME[p.type]} ${p.square}`);
  return `<ol class="checklist">
    <li><b>Their last move:</b> ${threat}</li>
    <li><b>Checks:</b> ${checks.join(', ') || 'none'} · <b>Captures:</b> ${captures.join(', ') || 'none'}</li>
    <li><b>Loose enemy pieces:</b> ${theirLoose.join(', ') || 'none'}</li>
    <li><b>Pick 2–4 candidates</b> and calculate each one.</li>
    <li><b>Blunder check:</b> your loose pieces right now: ${loose.length ? `<span class="warn">${loose.join(', ')}</span>` : 'none'}.</li>
  </ol>`;
}

function resultText(chess, userColor) {
  if (chess.isCheckmate()) return chess.turn() === userColor ? { result: chess.turn() === 'w' ? '0-1' : '1-0', text: 'Checkmate — you lost.', outcome: 'loss' } : { result: chess.turn() === 'w' ? '0-1' : '1-0', text: 'Checkmate — you won!', outcome: 'win' };
  if (chess.isStalemate()) return { result: '1/2-1/2', text: 'Stalemate — draw.', outcome: 'draw' };
  if (chess.isInsufficientMaterial()) return { result: '1/2-1/2', text: 'Draw — insufficient material.', outcome: 'draw' };
  if (chess.isThreefoldRepetition()) return { result: '1/2-1/2', text: 'Draw by threefold repetition.', outcome: 'draw' };
  if (chess.isDraw()) return { result: '1/2-1/2', text: 'Draw (50-move rule).', outcome: 'draw' };
  return null;
}

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

function movesTable(sans, startPly = 0, current = -1, marks = {}) {
  let out = '';
  for (let i = 0; i < sans.length; i += 2) {
    const n = i / 2 + 1;
    const cell = j => (sans[j] === undefined ? '<span></span>' : `<button class="mv ${j === current ? 'cur' : ''} ${marks[j]?.cls || ''}" data-ply="${j}">${esc(sans[j])}${marks[j]?.sym || ''}</button>`);
    out += `<div class="mv-row"><span class="mv-no">${n}.</span>${cell(i)}${cell(i + 1)}</div>`;
  }
  return out || '<p class="muted">No moves yet.</p>';
}

export function renderPlay(root) {
  const p = progress();
  let g = p.currentGame; // { color, level, moves: [san], started }
  let board, chess, alive = true, thinking = false;

  function setup() {
    root.innerHTML = `
      <div class="page play-setup">
        <h1>Play a game</h1>
        <p class="lede">Play against Stockfish and practise the chapter you're studying. Your games are saved so you can review them afterwards (Part 8.1).</p>
        <form class="setup-form">
          <fieldset><legend>Play as</legend>
            <label><input type="radio" name="color" value="w" checked> White</label>
            <label><input type="radio" name="color" value="b"> Black</label>
            <label><input type="radio" name="color" value="r"> Random</label>
          </fieldset>
          <label class="field">Opponent strength
            <select name="level">${LEVELS.map((l, i) => `<option value="${i}" ${i === (p.lastLevel ?? 1) ? 'selected' : ''}>${l.name}</option>`).join('')}</select>
          </label>
          <label class="check"><input type="checkbox" name="checklist" ${p.showChecklist !== false ? 'checked' : ''}> Show the move-selection checklist while I play (Part 5.1)</label>
          <button class="btn primary" type="submit">Start game</button>
        </form>
        <p><a href="#/games">See your saved games →</a></p>
      </div>`;
    root.querySelector('form').addEventListener('submit', e => {
      e.preventDefault();
      const f = new FormData(e.target);
      let color = f.get('color');
      if (color === 'r') color = Math.random() < 0.5 ? 'w' : 'b';
      p.lastLevel = +f.get('level');
      p.showChecklist = !!f.get('checklist');
      g = p.currentGame = { color, level: +f.get('level'), moves: [], started: Date.now(), takebacks: 0 };
      save();
      start();
    });
  }

  function start() {
    root.innerHTML = `
      <div class="play">
        <div class="play-board"><div class="board-holder"></div>
          <div class="board-tools">
            <button class="icon-btn" data-act="flip">⇅ Flip</button>
            <button class="icon-btn" data-act="takeback">↶ Take back</button>
            <button class="icon-btn" data-act="draw">½ Offer draw</button>
            <button class="icon-btn danger" data-act="resign">⚑ Resign</button>
          </div>
        </div>
        <aside class="play-side">
          <div class="play-head">
            <h2>You (${g.color === 'w' ? 'White' : 'Black'}) vs ${esc(LEVELS[g.level].name)}</h2>
            <div class="play-status" aria-live="polite"></div>
          </div>
          <div class="moves"></div>
          <details class="checklist-box" ${p.showChecklist !== false ? 'open' : ''}><summary>Move-selection checklist</summary><div class="checklist-body"></div></details>
          <div class="play-over" hidden></div>
        </aside>
      </div>`;
    board = new Board(root.querySelector('.board-holder'), { onMove: onUserMove });
    // Replay into the board's own chess instance so history (repetition, takebacks) is kept.
    board.load(new Chess().fen(), { orientation: g.color === 'w' ? 'white' : 'black' });
    for (const san of g.moves) board.play(san);
    chess = board.chess;
    root.querySelector('.board-tools').addEventListener('click', onTool);
    root.querySelector('.checklist-box').addEventListener('toggle', e => { p.showChecklist = e.target.open; save(); });
    root.querySelector('.moves').addEventListener('click', e => e.preventDefault());
    refresh();
    if (chess.turn() !== g.color) engineMove();
    else board.enable(g.color);
  }

  function refresh() {
    const hist = chess.history();
    root.querySelector('.moves').innerHTML = movesTable(hist, 0, hist.length - 1);
    const mv = root.querySelector('.moves');
    mv.scrollTop = mv.scrollHeight;
    root.querySelector('.checklist-body').innerHTML = checklist(chess, g.color);
    root.querySelector('.play-status').textContent = thinking ? 'Stockfish is thinking…' : chess.turn() === g.color ? (chess.inCheck() ? 'You are in check!' : 'Your move.') : '';
  }

  function persist() {
    g.moves = chess.history();
    save();
  }

  function onUserMove() {
    persist();
    refresh();
    if (checkOver()) return;
    engineMove();
  }

  async function engineMove() {
    thinking = true;
    refresh();
    let uci;
    try {
      uci = await engine().move(chess.fen(), LEVELS[g.level]);
    } catch {
      toast('Could not start the chess engine.', 'bad');
      return;
    }
    if (!alive) return;
    await sleep(200);
    thinking = false;
    if (uci) board.play(uci);
    persist();
    refresh();
    if (checkOver()) return;
    board.enable(g.color);
  }

  function checkOver() {
    const r = resultText(chess, g.color);
    if (r) { finish(r); return true; }
    return false;
  }

  function finish({ result, text, outcome }) {
    board.disable();
    const game = {
      id: crypto.randomUUID(),
      date: Date.now(),
      color: g.color,
      level: g.level,
      result,
      outcome,
      moves: chess.history(),
      takebacks: g.takebacks,
      durationMs: Date.now() - g.started,
      termination: text,
    };
    game.pgn = toPgn(game);
    addGame(game);
    p.currentGame = null;
    save();
    const over = root.querySelector('.play-over');
    over.hidden = false;
    over.innerHTML = `<h3>${esc(text)}</h3>
      <p>The game has been saved. Review it now while it's fresh: write down your thoughts first, then check with the engine.</p>
      <div class="row"><a class="btn primary" href="#/games/${game.id}">Review this game</a><button class="btn ghost" data-act="new">New game</button></div>`;
    over.querySelector('[data-act=new]').onclick = () => { board.destroy(); setup(); };
    root.querySelector('.board-tools').hidden = true;
    root.querySelector('.play-status').textContent = text;
  }

  function onTool(e) {
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (act === 'flip') board.flip();
    if (act === 'takeback' && !thinking) {
      // Undo the engine's reply and the user's move.
      if (chess.history().length && chess.turn() === g.color) { board.undo(); board.undo(); }
      else if (chess.history().length) board.undo();
      g.takebacks = (g.takebacks || 0) + 1;
      persist();
      refresh();
      board.enable(g.color);
    }
    if (act === 'resign' && confirm('Resign this game?')) {
      finish({ result: g.color === 'w' ? '0-1' : '1-0', text: 'You resigned.', outcome: 'loss' });
    }
    if (act === 'draw' && !thinking) offerDraw();
  }

  async function offerDraw() {
    if (chess.history().length < 40) return toast('The engine declines — it\'s too early for a draw.');
    const lines = await engine().analyse(chess.fen(), { depth: 10 });
    const cp = whiteCp(lines[0], chess.turn()) * (g.color === 'w' ? 1 : -1);
    if (Math.abs(cp) <= 40) finish({ result: '1/2-1/2', text: 'Draw agreed.', outcome: 'draw' });
    else toast('The engine declines your draw offer.');
  }

  if (g) start(); else setup();
  return { destroy() { alive = false; board?.destroy(); } };
}

export function toPgn(game) {
  const d = new Date(game.date);
  const date = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  const you = 'You', sf = `Stockfish (${LEVELS[game.level].name})`;
  const headers = { Event: 'chessorama training game', Site: 'chessorama', Date: date, White: game.color === 'w' ? you : sf, Black: game.color === 'w' ? sf : you, Result: game.result };
  const c = new Chess();
  for (const m of game.moves) tryMove(c, m);
  for (const [k, v] of Object.entries(headers)) c.setHeader(k, v);
  return c.pgn();
}

export function renderGames(root) {
  const games = progress().games;
  const lvl = i => LEVELS[i]?.name.split('—')[0].trim();
  root.innerHTML = `
    <div class="page">
      <h1>Your games</h1>
      <p class="lede">Every game you play is recorded here. Review each one: note your thoughts first, then check with the engine and log your mistakes.</p>
      <p><a class="btn primary" href="#/play">${progress().currentGame ? 'Resume current game' : 'Play a new game'}</a></p>
      ${games.length ? `<div class="table-scroll"><table class="table">
        <thead><tr><th>Date</th><th>Colour</th><th>Opponent</th><th>Result</th><th>Moves</th><th>Review</th><th></th></tr></thead>
        <tbody>${games.map(g => `<tr>
          <td>${fmtDate(g.date)}</td><td>${g.color === 'w' ? 'White' : 'Black'}</td><td>${esc(lvl(g.level))}</td>
          <td class="outcome ${g.outcome}">${g.outcome === 'win' ? 'Won' : g.outcome === 'loss' ? 'Lost' : 'Draw'} <small>${g.result}</small></td>
          <td>${Math.ceil(g.moves.length / 2)}</td>
          <td>${g.review ? '✓ Engine' : g.notes ? 'Notes' : '<span class="muted">Not yet</span>'}</td>
          <td><a href="#/games/${g.id}">Open</a></td></tr>`).join('')}</tbody></table></div>` : '<p class="muted">No games yet.</p>'}
    </div>`;
}

export function renderReview(root, id) {
  const game = progress().games.find(g => g.id === id);
  if (!game) { root.innerHTML = '<div class="page"><h1>Game not found</h1><a href="#/games">Back to games</a></div>'; return null; }
  const fens = [new Chess().fen()];
  const c = new Chess();
  const verbose = [];
  for (const m of game.moves) { verbose.push(tryMove(c, m)); fens.push(c.fen()); }
  let ply = game.moves.length; // position index (0 = start)
  let shownPly = ply;
  let alive = true;
  let analysing = false;

  root.innerHTML = `
    <div class="play review">
      <div class="play-board"><div class="board-holder"></div>
        <div class="board-tools">
          <button class="icon-btn" data-nav="first">⏮</button><button class="icon-btn" data-nav="prev">◀</button>
          <button class="icon-btn" data-nav="next">▶</button><button class="icon-btn" data-nav="last">⏭</button>
          <button class="icon-btn" data-nav="flip">⇅ Flip</button>
        </div>
        <div class="eval-graph"></div>
      </div>
      <aside class="play-side">
        <div class="crumbs"><a href="#/games">Games</a> › ${fmtDate(game.date)}</div>
        <h2>${game.color === 'w' ? 'White' : 'Black'} vs ${esc(LEVELS[game.level].name)} — ${game.outcome === 'win' ? 'Won' : game.outcome === 'loss' ? 'Lost' : 'Draw'} (${game.result})</h2>
        <div class="moves"></div>
        <div class="pos-info"></div>
        <section class="review-step">
          <h3>1 · Your thoughts first</h3>
          <p class="muted">Before using the engine, write where you think the game was decided and what you were thinking at key moments.</p>
          <textarea class="notes" rows="4" placeholder="e.g. Move 14 I missed that his knight could fork my rook and king…">${esc(game.notes || '')}</textarea>
        </section>
        <section class="review-step">
          <h3>2 · Check with the engine</h3>
          <div class="engine-area"></div>
        </section>
        <section class="review-step">
          <h3>3 · Mistakes log for this game</h3>
          <div class="game-mistakes"></div>
        </section>
        <details><summary>PGN</summary><textarea class="pgn" rows="6" readonly>${esc(game.pgn)}</textarea>
          <button class="btn ghost small" data-act="copy">Copy PGN</button></details>
        <p><button class="btn ghost danger small" data-act="delete">Delete this game</button></p>
      </aside>
    </div>`;
  const board = new Board(root.querySelector('.board-holder'));
  const userColor = game.color;

  function marks() {
    const out = {};
    const r = game.review;
    if (!r) return out;
    for (let i = 0; i < game.moves.length; i++) {
      const cls = classify(i);
      if (cls) out[i] = { cls: cls.cls, sym: cls.sym };
    }
    if (r.turningPoint != null) out[r.turningPoint] = { ...(out[r.turningPoint] || {}), cls: `${out[r.turningPoint]?.cls || ''} turning` };
    return out;
  }

  // Loss in centipawns (from the mover's point of view) for move index i.
  function loss(i) {
    const r = game.review;
    if (!r) return 0;
    const mover = i % 2 === 0 ? 1 : -1;
    const before = clamp(r.evals[i]) * mover, after = clamp(r.evals[i + 1]) * mover;
    return before - after;
  }
  const clamp = v => Math.max(-1500, Math.min(1500, v));

  function classify(i) {
    const l = loss(i);
    const isUser = (i % 2 === 0) === (userColor === 'w');
    if (!isUser) return null;
    if (l >= 250) return { cls: 'blunder', sym: '??', label: 'Blunder' };
    if (l >= 120) return { cls: 'mistake', sym: '?', label: 'Mistake' };
    if (l >= 60) return { cls: 'inaccuracy', sym: '?!', label: 'Inaccuracy' };
    return null;
  }

  function show() {
    const last = ply ? verbose[ply - 1] : null;
    const r = game.review;
    const shapes = [];
    if (r && ply < game.moves.length && r.best[ply]) shapes.push(`${r.best[ply].slice(0, 4)}:blue`);
    board.load(fens[ply], { orientation: board.orientation(), lastMove: last ? [last.from, last.to] : undefined, shapes, animate: Math.abs(ply - shownPly) === 1 });
    shownPly = ply;
    root.querySelector('.moves').innerHTML = movesTable(game.moves, 0, ply - 1, marks());
    const info = root.querySelector('.pos-info');
    if (r && ply > 0) {
      const i = ply - 1;
      const cls = classify(i);
      const ev = r.evals[ply];
      const bestBefore = r.best[i] ? uciToSan(fens[i], r.best[i]) : null;
      const userMove = (i % 2 === 0) === (userColor === 'w');
      const logged = progress().mistakes.find(m => m.gameId === game.id && m.ply === i);
      info.innerHTML = `<div class="pos-card ${cls?.cls || ''}">
        <b>${Math.floor(i / 2) + 1}${i % 2 ? '…' : '.'} ${esc(game.moves[i])}</b> ${cls ? `<span class="tag ${cls.cls}">${cls.label}</span>` : ''}
        ${r.turningPoint === i ? '<span class="tag turning">Turning point</span>' : ''}
        <div>Evaluation: <b>${fmtEval(ev)}</b> ${bestBefore && bestBefore !== game.moves[i] ? `· Engine preferred <b>${esc(bestBefore)}</b>` : ''}</div>
        ${userMove && cls && !logged ? `<div class="log-form">
            <select class="cat">${MISTAKE_CATEGORIES.map(c => `<option value="${c.id}">${c.label}</option>`).join('')}</select>
            <input class="note" placeholder="What went wrong? (optional)">
            <button class="btn small primary" data-act="log">Add to mistakes log</button></div>` : ''}
        ${logged ? `<div class="muted">✓ Logged as “${esc(MISTAKE_CATEGORIES.find(c => c.id === logged.category)?.label)}”</div>` : ''}
      </div>`;
    } else info.innerHTML = '';
    drawGraph();
  }

  function fmtEval(cp) {
    if (cp == null) return '–';
    if (Math.abs(cp) >= 9000) return `${cp > 0 ? '' : '-'}M${Math.max(1, Math.round((10000 - Math.abs(cp)) / 10))}`;
    return `${cp > 0 ? '+' : ''}${(cp / 100).toFixed(2)}`;
  }

  function drawGraph() {
    const r = game.review;
    const el = root.querySelector('.eval-graph');
    if (!r) { el.innerHTML = ''; return; }
    const W = 600, H = 110, n = r.evals.length;
    const y = v => H / 2 - (Math.max(-800, Math.min(800, v)) / 800) * (H / 2 - 4);
    const x = i => (i / Math.max(1, n - 1)) * W;
    const pts = r.evals.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
    el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" class="eval-svg">
      <polygon points="0,${H / 2} ${pts} ${W},${H / 2}" class="eval-area"/>
      <line x1="0" x2="${W}" y1="${H / 2}" y2="${H / 2}" class="zero"/>
      ${r.turningPoint != null ? `<line x1="${x(r.turningPoint + 1)}" x2="${x(r.turningPoint + 1)}" y1="0" y2="${H}" class="tp"/>` : ''}
      <line x1="${x(ply)}" x2="${x(ply)}" y1="0" y2="${H}" class="cursor"/>
    </svg><div class="muted small">Evaluation from White's side. Click the graph to jump to a position.</div>`;
    el.querySelector('svg').onclick = e => {
      const rect = e.currentTarget.getBoundingClientRect();
      ply = Math.round(((e.clientX - rect.left) / rect.width) * (n - 1));
      show();
    };
  }

  function engineArea() {
    const el = root.querySelector('.engine-area');
    const r = game.review;
    if (analysing) return;
    if (!r) {
      el.innerHTML = `<p class="muted">The engine will evaluate every position and flag inaccuracies (?!), mistakes (?) and blunders (??), and find the turning point.</p>
        <button class="btn primary" data-act="analyse">Run engine analysis</button>`;
      return;
    }
    const userIdx = game.moves.map((_, i) => i).filter(i => (i % 2 === 0) === (userColor === 'w'));
    const counts = { inaccuracy: 0, mistake: 0, blunder: 0 };
    userIdx.forEach(i => { const c = classify(i); if (c) counts[c.cls]++; });
    const avgLoss = userIdx.length ? Math.round(userIdx.reduce((s, i) => s + Math.max(0, loss(i)), 0) / userIdx.length) : 0;
    el.innerHTML = `<div class="review-summary">
        <span class="tag inaccuracy">${plural(counts.inaccuracy, 'inaccuracy', 'inaccuracies')}</span>
        <span class="tag mistake">${plural(counts.mistake, 'mistake', 'mistakes')}</span>
        <span class="tag blunder">${plural(counts.blunder, 'blunder', 'blunders')}</span>
        <span class="muted">· average loss ${avgLoss} cp per move</span>
      </div>
      ${r.turningPoint != null ? `<p>Turning point: <a href="#" data-goto="${r.turningPoint + 1}"><b>${Math.floor(r.turningPoint / 2) + 1}${r.turningPoint % 2 ? '…' : '.'} ${esc(game.moves[r.turningPoint])}</b></a> — the move where the game swung most against you.</p>` : '<p>No clear turning point — well played!</p>'}
      <p class="muted small">Blue arrows show the engine's preferred move in each position. Click a flagged move to log it.</p>`;
  }

  async function analyse() {
    analysing = true;
    const el = root.querySelector('.engine-area');
    el.innerHTML = `<div class="progressbar"><span style="width:0%"></span></div><p class="muted small">Analysing…</p>`;
    const evals = [], best = [];
    for (let i = 0; i < fens.length; i++) {
      if (!alive) return;
      const pos = new Chess(fens[i]);
      if (pos.isCheckmate()) { evals.push(pos.turn() === 'w' ? -10000 : 10000); best.push(null); }
      else if (pos.isDraw()) { evals.push(0); best.push(null); }
      else {
        const lines = await engine().analyse(fens[i], { depth: 11 });
        evals.push(whiteCp(lines[0], pos.turn()));
        best.push(lines.bestmove || lines[0]?.uci || null);
      }
      el.querySelector('.progressbar span').style.width = `${Math.round(((i + 1) / fens.length) * 100)}%`;
    }
    const review = { evals, best, depth: 11, at: Date.now() };
    game.review = review;
    review.turningPoint = findTurningPoint();
    updateGame(game.id, { review });
    analysing = false;
    engineArea();
    if (review.turningPoint != null) ply = review.turningPoint + 1;
    show();
  }

  function findTurningPoint() {
    let bestI = null, bestLoss = 99;
    for (let i = 0; i < game.moves.length; i++) {
      if ((i % 2 === 0) !== (userColor === 'w')) continue;
      const l = loss(i);
      if (l > bestLoss) { bestLoss = l; bestI = i; }
    }
    return bestI;
  }

  function mistakesList() {
    const list = progress().mistakes.filter(m => m.gameId === game.id);
    root.querySelector('.game-mistakes').innerHTML = list.length ? `<ul class="mistakes">${list.map(m => `<li>
      <a href="#" data-goto="${m.ply + 1}">${Math.floor(m.ply / 2) + 1}${m.ply % 2 ? '…' : '.'} ${esc(m.san)}</a>
      <span class="tag">${esc(MISTAKE_CATEGORIES.find(c => c.id === m.category)?.label)}</span> ${esc(m.note || '')}
      <button class="link" data-del="${m.id}" title="Remove">×</button></li>`).join('')}</ul>` : '<p class="muted">Nothing logged yet. Select one of your flagged moves to add it.</p>';
  }

  // Listen on this view's own element: `root` is shared by every page and outlives this view.
  root.firstElementChild.addEventListener('click', e => {
    const nav = e.target.closest('[data-nav]')?.dataset.nav;
    if (nav === 'first') ply = 0;
    if (nav === 'prev') ply = Math.max(0, ply - 1);
    if (nav === 'next') ply = Math.min(game.moves.length, ply + 1);
    if (nav === 'last') ply = game.moves.length;
    if (nav === 'flip') { board.flip(); return; }
    if (nav) return show();
    const mv = e.target.closest('.mv');
    if (mv) { ply = +mv.dataset.ply + 1; return show(); }
    const go = e.target.closest('[data-goto]');
    if (go) { e.preventDefault(); ply = +go.dataset.goto; return show(); }
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (act === 'analyse') analyse();
    if (act === 'log') {
      const form = e.target.closest('.log-form');
      addMistake({ gameId: game.id, ply: ply - 1, san: game.moves[ply - 1], fen: fens[ply - 1], best: game.review.best[ply - 1], category: form.querySelector('.cat').value, note: form.querySelector('.note').value.trim() });
      toast('Added to your mistakes log');
      mistakesList();
      show();
    }
    if (act === 'copy') navigator.clipboard?.writeText(game.pgn).then(() => toast('PGN copied'));
    if (act === 'delete' && confirm('Delete this game and its logged mistakes?')) { deleteGame(game.id); location.hash = '#/games'; }
    const del = e.target.closest('[data-del]');
    if (del) { removeMistake(del.dataset.del); mistakesList(); show(); }
  });
  root.querySelector('.notes').addEventListener('input', e => { game.notes = e.target.value; updateGame(game.id, { notes: game.notes }); });
  const onKey = e => {
    if (e.target.closest('input, textarea, select')) return;
    if (e.key === 'ArrowLeft') { ply = Math.max(0, ply - 1); show(); }
    if (e.key === 'ArrowRight') { ply = Math.min(game.moves.length, ply + 1); show(); }
  };
  document.addEventListener('keydown', onKey);

  board.load(fens[ply], { orientation: userColor === 'w' ? 'white' : 'black' });
  engineArea();
  mistakesList();
  show();
  return { destroy() { alive = false; document.removeEventListener('keydown', onKey); board.destroy(); } };
}
