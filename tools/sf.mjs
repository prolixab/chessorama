// Small Stockfish wrapper for Node, used by the content validator.
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const SF = path.join(here, '..', 'node_modules', 'stockfish', 'src', 'stockfish-nnue-16.js');

export function startEngine() {
  const proc = spawn(process.execPath, [SF], { stdio: ['pipe', 'pipe', 'inherit'] });
  let buf = '';
  let waiters = [];
  proc.stdout.on('data', d => {
    buf += d.toString();
    let i;
    while ((i = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, i).trim();
      buf = buf.slice(i + 1);
      waiters = waiters.filter(w => !w(line));
    }
  });
  const send = s => proc.stdin.write(s + '\n');
  const until = (pred, collect) => new Promise(res => {
    const lines = [];
    waiters.push(line => { if (collect) lines.push(line); if (pred(line)) { res(lines); return true; } return false; });
  });
  return {
    async init() { await new Promise(r => setTimeout(r, 2500)); send('uci'); await until(l => l === 'uciok'); send('setoption name MultiPV value 1'); send('isready'); await until(l => l === 'readyok'); },
    // Returns [{move, cp, mate}] for top `multipv` lines at given depth.
    async analyse(fen, { depth = 14, multipv = 1 } = {}) {
      send(`setoption name MultiPV value ${multipv}`);
      send('ucinewgame'); send('isready'); await until(l => l === 'readyok');
      send(`position fen ${fen}`); send(`go depth ${depth}`);
      const lines = await until(l => l.startsWith('bestmove'), true);
      const best = {};
      for (const l of lines) {
        const m = l.match(/ multipv (\d+) .*score (cp|mate) (-?\d+).* pv (\S+)/);
        if (m && l.includes(` depth `)) best[m[1]] = { move: m[4], [m[2]]: +m[3], pv: l.split(' pv ')[1] };
      }
      return Object.values(best);
    },
    quit() { send('quit'); proc.stdin.end(); },
  };
}
