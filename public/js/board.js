// Interactive board: Chessground for display and input, chess.js for the rules.
import { Chessground } from '../vendor/chessground.min.js';
import { Chess } from '../vendor/chess.js';

const ROLE = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king' };
const COLOR = { w: 'white', b: 'black' };

export const EMPTY_FEN = '8/8/8/8/8/8/8/8 w - - 0 1';

// Turns 'e2e4' / 'e7e8q' into a chess.js move object.
export function parseUci(uci) {
  return { from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] };
}

// Plays a move given as SAN or UCI on a chess.js instance; returns the move or null if illegal.
export function tryMove(chess, move) {
  try {
    if (typeof move === 'string' && /^[a-h][1-8][a-h][1-8][qrbn]?$/.test(move)) return chess.move(parseUci(move));
    return chess.move(move);
  } catch {
    return null;
  }
}

export function sanToUci(fen, san) {
  const c = new Chess(fen);
  const m = tryMove(c, san);
  return m ? m.from + m.to + (m.promotion || '') : null;
}

export function uciToSan(fen, uci) {
  const c = new Chess(fen);
  const m = tryMove(c, uci);
  return m ? m.san : null;
}

// Arrow/circle shapes from compact strings: 'e2e4' (green arrow), 'e2e4:red', 'e4' (circle), 'e4:blue'.
export function toShapes(list = []) {
  return list.map(s => {
    const [sq, brush = 'green'] = s.split(':');
    return sq.length === 4 ? { orig: sq.slice(0, 2), dest: sq.slice(2, 4), brush } : { orig: sq, brush };
  });
}

export class Board {
  constructor(el, { onMove, onSquare } = {}) {
    this.el = el;
    this.onMove = onMove;    // (move) => void, called after a legal user move
    this.onSquare = onSquare; // (square) => void, called when a square is clicked in square-pick mode
    this.chess = new Chess();
    this.userColor = null;
    this.squarePick = false;
    this.wrap = document.createElement('div');
    this.wrap.className = 'board-wrap';
    el.appendChild(this.wrap);
    const cgEl = document.createElement('div');
    cgEl.className = 'cg-host';
    this.wrap.appendChild(cgEl);
    this.animate = !new URLSearchParams(location.search).has('debug');
    this.cg = Chessground(cgEl, {
      fen: '8/8/8/8/8/8/8/8',
      coordinates: true,
      animation: { enabled: this.animate, duration: 220 },
      movable: { free: false, color: undefined, showDests: true, events: { after: (o, d) => this.#afterUserMove(o, d) } },
      premovable: { enabled: false },
      drawable: { enabled: true, eraseOnClick: true },
      highlight: { lastMove: true, check: true },
      events: { select: key => { if (this.squarePick) this.onSquare?.(key); } },
    });
    // With ?debug in the URL, expose the board so moves can be scripted from the console.
    if (!this.animate) window.chessyBoard = this;
  }

  // Plays a move as if the user had dragged it (debug/testing only).
  debugUserMove(from, to) {
    this.cg.move(from, to);
    return this.#afterUserMove(from, to);
  }

  // Shows a position. `fen` may lack kings (display only); interactive play then stays disabled.
  // Jumps are instant unless `animate` is set (e.g. stepping one move forward in a demo).
  load(fen, { orientation, shapes = [], squares = {}, lastMove, animate = false } = {}) {
    this.cancelPromotion();
    this.squarePick = false;
    this.userColor = null;
    try {
      this.chess = new Chess(fen);
      this.legal = true;
    } catch {
      this.chess = null;
      this.legal = false;
    }
    this.cg.set({ animation: { enabled: animate && this.animate } });
    this.cg.set({
      fen,
      orientation: orientation || this.cg.state.orientation,
      turnColor: COLOR[fen.split(' ')[1] || 'w'],
      lastMove,
      check: this.legal && this.chess.inCheck(),
      movable: { color: undefined, dests: new Map() },
      selected: undefined,
    });
    this.cg.set({ animation: { enabled: this.animate } });
    this.setShapes(shapes);
    this.setSquares(squares);
  }

  fen() { return this.chess ? this.chess.fen() : this.cg.getFen(); }
  turn() { return this.chess?.turn(); }

  // Lets the user move pieces of `color` ('w' | 'b' | 'both').
  enable(color) {
    if (!this.legal) return;
    this.userColor = color;
    this.squarePick = false;
    this.#syncMovable();
  }

  disable() {
    this.userColor = null;
    this.cg.set({ movable: { color: undefined, dests: new Map() } });
  }

  // Square-picking mode: clicks report squares instead of moving pieces.
  enableSquarePick() {
    this.disable();
    this.squarePick = true;
  }

  #syncMovable() {
    const dests = new Map();
    const turn = this.chess.turn();
    if (this.userColor === 'both' || this.userColor === turn) {
      for (const m of this.chess.moves({ verbose: true })) {
        if (!dests.has(m.from)) dests.set(m.from, []);
        dests.get(m.from).push(m.to);
      }
    }
    this.cg.set({
      turnColor: COLOR[turn],
      check: this.chess.inCheck(),
      movable: { color: dests.size ? COLOR[turn] : undefined, dests },
    });
  }

  async #afterUserMove(from, to) {
    const piece = this.chess.get(from);
    let promotion;
    if (piece?.type === 'p' && (to[1] === '8' || to[1] === '1')) {
      promotion = await this.#askPromotion(to, piece.color);
      if (!promotion) {
        // Cancelled: put the pawn back.
        this.cg.set({ fen: this.chess.fen(), lastMove: this.#lastMove() });
        this.#syncMovable();
        return;
      }
    }
    const move = tryMove(this.chess, { from, to, promotion });
    if (!move) {
      this.cg.set({ fen: this.chess.fen() });
      this.#syncMovable();
      return;
    }
    // Chessground does not know about en passant captures, castling rook moves or promotions; resync.
    this.cg.set({ fen: this.chess.fen(), lastMove: [from, to] });
    this.disable();
    this.onMove?.(move);
  }

  #lastMove() {
    const h = this.chess.history({ verbose: true });
    const m = h[h.length - 1];
    return m ? [m.from, m.to] : undefined;
  }

  #askPromotion(square, color) {
    return new Promise(resolve => {
      this.cancelPromotion();
      const picker = document.createElement('div');
      picker.className = 'promo-picker cg-wrap';
      const file = square.charCodeAt(0) - 97;
      const flipped = this.cg.state.orientation === 'black';
      picker.style.left = `${(flipped ? 7 - file : file) * 12.5}%`;
      const fromTop = (color === 'w') !== flipped;
      picker.style[fromTop ? 'top' : 'bottom'] = '0';
      for (const role of ['q', 'n', 'r', 'b']) {
        const btn = document.createElement('button');
        btn.title = `Promote to ${ROLE[role]}`;
        btn.innerHTML = `<piece class="${ROLE[role]} ${COLOR[color]}"></piece>`;
        btn.onclick = () => { this.#closePicker(); resolve(role); };
        picker.appendChild(btn);
      }
      const cancel = document.createElement('button');
      cancel.className = 'promo-cancel';
      cancel.textContent = '×';
      cancel.title = 'Cancel';
      cancel.onclick = () => { this.cancelPromotion(); resolve(null); };
      picker.appendChild(cancel);
      this.wrap.appendChild(picker);
      this.promo = { picker, resolve };
    });
  }

  #closePicker() {
    const promo = this.promo;
    this.promo = null;
    promo?.picker.remove();
    return promo;
  }

  cancelPromotion() {
    this.#closePicker()?.resolve(null);
  }

  // Plays a move programmatically (opponent replies, demonstrations). Returns the chess.js move or null.
  play(move) {
    if (!this.chess) return null;
    const m = tryMove(this.chess, move);
    if (!m) return null;
    // Setting the FEN animates the change and handles castling, en passant and promotion.
    this.cg.set({ fen: this.chess.fen(), lastMove: [m.from, m.to], check: this.chess.inCheck(), turnColor: COLOR[this.chess.turn()] });
    if (this.userColor) this.#syncMovable();
    return m;
  }

  undo() {
    if (!this.chess) return null;
    const m = this.chess.undo();
    this.cg.set({ fen: this.chess.fen(), lastMove: this.#lastMove(), check: this.chess.inCheck(), turnColor: COLOR[this.chess.turn()] });
    if (this.userColor) this.#syncMovable();
    return m;
  }

  setShapes(list) {
    this.cg.setAutoShapes(toShapes(list));
  }

  // squares: { e4: 'good' | 'bad' | 'mark' | 'hint' } -> CSS classes on the squares.
  setSquares(map = {}) {
    this.cg.set({ highlight: { custom: new Map(Object.entries(map).map(([k, v]) => [k, `hl-${v}`])) } });
  }

  // Visualisation modes: true hides the pieces, 'colors' hides the square colours.
  setBlind(mode) {
    this.wrap.classList.toggle('blind', mode === true);
    this.wrap.classList.toggle('blind-colors', mode === 'colors');
  }

  orientation() { return this.cg.state.orientation; }

  flip() { this.cg.toggleOrientation(); }

  redraw() { this.cg.redrawAll(); }

  destroy() {
    this.cancelPromotion();
    this.cg.destroy();
    this.el.innerHTML = '';
  }
}
