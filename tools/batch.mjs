// Authoring helper: analyses many FENs (one per line in a file: "label | fen") and prints top lines in SAN.
import fs from 'node:fs';
import { Chess } from '../public/vendor/chess.js';
import { startEngine } from './sf.mjs';
const [file, depth = 18] = process.argv.slice(2);
const e = startEngine(); await e.init();
for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
  if (!line.trim() || line.startsWith('#')) continue;
  const [label, fen] = line.split('|').map(s => s.trim());
  let c;
  try { c = new Chess(fen); } catch (err) { console.log(`${label}: ILLEGAL ${err.message}`); continue; }
  const lines = await e.analyse(fen, { depth: +depth, multipv: 3 });
  console.log(`${label}  (${c.turn() === 'w' ? 'White' : 'Black'} to move)`);
  for (const l of lines) {
    const t = new Chess(fen);
    const out = [];
    for (const u of l.pv.split(' ').slice(0, 7)) { try { out.push(t.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }).san); } catch { break; } }
    console.log(`   ${l.mate !== undefined ? '#' + l.mate : (l.cp / 100).toFixed(2)}  ${out.join(' ')}`);
  }
}
e.quit();
