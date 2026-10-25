// Helpers for writing lesson content.
import { Chess } from '../../vendor/chess.js';

export const START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
export const EMPTY = '8/8/8/8/8/8/8/8 w - - 0 1';

// Splits "1.e4 e5 2.Nf3" into ['e4', 'e5', 'Nf3'].
export function sans(str) {
  return str.replace(/\d+\.(\.\.)?/g, ' ').split(/\s+/).filter(Boolean);
}

// FEN after playing `moves` from `fen`.
export function after(moves, fen = START) {
  const c = new Chess(fen);
  for (const m of sans(moves)) {
    try { c.move(m); } catch { throw new Error(`Illegal move ${m} in "${moves}"`); }
  }
  return c.fen();
}

// Demo moves with captions: mv('e4 e5', ['Takes the centre.', 'Black does the same.'])
export function mv(moves, captions = [], shapes = []) {
  return sans(moves).map((san, i) => ({ san, text: captions[i] || '', shapes: shapes[i] || [] }));
}

const FILES = 'abcdefgh';
export const fileSquares = f => [1, 2, 3, 4, 5, 6, 7, 8].map(r => f + r);
export const rankSquares = r => [...FILES].map(f => f + r);
export function diagonal(from, df, dr) {
  const out = [];
  let f = FILES.indexOf(from[0]), r = +from[1];
  while (f >= 0 && f < 8 && r >= 1 && r <= 8) { out.push(FILES[f] + r); f += df; r += dr; }
  return out;
}
export const mark = (squares, cls) => Object.fromEntries(squares.map(s => [s, cls]));

const VALUE = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

// Squares of `color` pieces (not the king) that are attacked and undefended, or attacked by something cheaper.
export function loosePieces(fen, color) {
  const c = new Chess(fen);
  const enemy = color === 'w' ? 'b' : 'w';
  const out = [];
  for (const row of c.board()) for (const p of row) {
    if (!p || p.color !== color || p.type === 'k') continue;
    const att = c.attackers(p.square, enemy);
    if (!att.length) continue;
    const def = c.attackers(p.square, color);
    const cheapest = Math.min(...att.map(s => VALUE[c.get(s).type] || 0.5));
    if (!def.length || cheapest < VALUE[p.type]) out.push(p.square);
  }
  return out;
}

// Squares of `color` pieces (not the king) with no defender at all.
export function undefendedPieces(fen, color) {
  const c = new Chess(fen);
  const out = [];
  for (const row of c.board()) for (const p of row) {
    if (p && p.color === color && p.type !== 'k' && !c.attackers(p.square, color).length) out.push(p.square);
  }
  return out;
}

// Destination squares of every checking move for the side to move.
export function checkSquares(fen) {
  const c = new Chess(fen);
  return [...new Set(c.moves({ verbose: true }).filter(m => /[+#]/.test(m.san)).map(m => m.to))];
}

// Reads pawn squares straight from the FEN so diagrams without kings work too.
function pawnFiles(fen, color) {
  const want = color === 'w' ? 'P' : 'p';
  const out = [];
  fen.split(' ')[0].split('/').forEach((row, i) => {
    let file = 0;
    for (const ch of row) {
      if (ch >= "1" && ch <= "8") file += +ch;
      else { if (ch === want) out.push(FILES[file] + (8 - i)); file++; }
    }
  });
  return out;
}

// Pawns with no friendly pawn on an adjacent file.
export function isolatedPawns(fen, color) {
  const ps = pawnFiles(fen, color);
  const files = new Set(ps.map(s => s.charCodeAt(0)));
  return ps.filter(s => !files.has(s.charCodeAt(0) - 1) && !files.has(s.charCodeAt(0) + 1));
}

// Pawns with no enemy pawn ahead of them on the same or adjacent files.
export function passedPawns(fen, color) {
  const mine = pawnFiles(fen, color);
  const theirs = pawnFiles(fen, color === 'w' ? 'b' : 'w');
  return mine.filter(s => {
    const f = s.charCodeAt(0), r = +s[1];
    return !theirs.some(t => Math.abs(t.charCodeAt(0) - f) <= 1 && (color === 'w' ? +t[1] > r : +t[1] < r));
  });
}
