// Authoring helper: prints Stockfish's top lines in SAN.  node tools/pv.mjs "<fen>" [depth] [multipv]
import { Chess } from '../public/vendor/chess.js';
import { startEngine } from './sf.mjs';
const [fen, depth = 18, multipv = 3] = process.argv.slice(2);
const e = startEngine(); await e.init();
const lines = await e.analyse(fen, { depth: +depth, multipv: +multipv });
for (const l of lines) {
  const c = new Chess(fen);
  const out = [];
  for (const u of l.pv.split(' ')) { try { out.push(c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }).san); } catch { break; } }
  console.log(l.mate !== undefined ? `#${l.mate}` : (l.cp / 100).toFixed(2), out.join(' '));
}
e.quit();
