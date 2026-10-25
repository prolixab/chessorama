// Stockfish running in a Web Worker. Requests are queued so only one search runs at a time.

const WORKER_URL = 'vendor/stockfish/stockfish-18-lite-single.js';

// Strength presets for the opponent in Play mode. Low levels also add randomness so beginners can win.
export const LEVELS = [
  { name: 'Level 1 — Beginner', skill: 0, depth: 1, randomness: 0.5 },
  { name: 'Level 2 — Novice', skill: 1, depth: 2, randomness: 0.3 },
  { name: 'Level 3 — Casual', skill: 3, depth: 4, randomness: 0.15 },
  { name: 'Level 4 — Club', skill: 6, depth: 6, randomness: 0 },
  { name: 'Level 5 — Strong club', skill: 10, depth: 9, randomness: 0 },
  { name: 'Level 6 — Expert', skill: 14, movetime: 600 },
  { name: 'Level 7 — Master', skill: 18, movetime: 1000 },
  { name: 'Level 8 — Full strength', skill: 20, movetime: 1500 },
];

class Engine {
  constructor() {
    this.queue = Promise.resolve();
    this.listeners = new Set();
    this.ready = this.#boot();
  }

  #boot() {
    return new Promise((resolve, reject) => {
      try {
        this.worker = new Worker(WORKER_URL);
      } catch (e) {
        reject(e);
        return;
      }
      this.worker.onmessage = e => {
        const line = typeof e.data === 'string' ? e.data : String(e.data);
        for (const l of [...this.listeners]) l(line);
      };
      this.worker.onerror = e => reject(e);
      this.#until(l => l === 'uciok').then(() => {
        this.#send('isready');
        return this.#until(l => l === 'readyok');
      }).then(resolve);
      this.#send('uci');
    });
  }

  #send(cmd) { this.worker.postMessage(cmd); }

  #until(pred, collect = false) {
    return new Promise(resolve => {
      const lines = [];
      const fn = line => {
        if (collect) lines.push(line);
        if (pred(line)) { this.listeners.delete(fn); resolve(lines); }
      };
      this.listeners.add(fn);
    });
  }

  #run(task) {
    const p = this.queue.then(() => this.ready).then(task);
    this.queue = p.catch(() => {});
    return p;
  }

  // Analyse a position. Scores are from the side to move's point of view.
  // Returns [{ uci, cp, mate, pv: [uci...] }] sorted best first.
  analyse(fen, { depth = 12, movetime, multipv = 1, skill = 20 } = {}) {
    return this.#run(async () => {
      this.#send(`setoption name Skill Level value ${skill}`);
      this.#send(`setoption name MultiPV value ${multipv}`);
      this.#send('isready');
      await this.#until(l => l === 'readyok');
      this.#send(`position fen ${fen}`);
      this.#send(movetime ? `go movetime ${movetime}` : `go depth ${depth}`);
      const lines = await this.#until(l => l.startsWith('bestmove'), true);
      const byPv = new Map();
      for (const l of lines) {
        const m = l.match(/ multipv (\d+) .*?score (cp|mate) (-?\d+).*? pv (.+)$/);
        if (!m) continue;
        const pv = m[4].trim().split(' ');
        byPv.set(+m[1], { uci: pv[0], [m[2]]: +m[3], pv });
      }
      const best = lines[lines.length - 1].split(' ')[1];
      const result = [...byPv.entries()].sort((a, b) => a[0] - b[0]).map(e => e[1]);
      if (!result.length && best && best !== '(none)') result.push({ uci: best, cp: 0, pv: [best] });
      // With a reduced skill level Stockfish may play a weaker move than its first PV line.
      result.bestmove = best === '(none)' ? null : best;
      return result;
    });
  }

  // Pick a move for the opponent at a given strength level.
  async move(fen, level = LEVELS[7]) {
    const multipv = level.randomness ? 5 : 1;
    const lines = await this.analyse(fen, { depth: level.depth, movetime: level.movetime, multipv, skill: level.skill });
    if (level.randomness && lines.length > 1 && Math.random() < level.randomness) {
      return lines[1 + Math.floor(Math.random() * (lines.length - 1))].uci;
    }
    return lines.bestmove || lines[0]?.uci || null;
  }
}

let instance;
export function engine() {
  instance ??= new Engine();
  return instance;
}

// Converts an engine score to centipawns from White's point of view.
export function whiteCp(line, turn) {
  if (!line) return 0;
  const sign = turn === 'w' ? 1 : -1;
  if (line.mate !== undefined) return sign * (line.mate > 0 ? 10000 - line.mate * 10 : -10000 - line.mate * 10);
  return sign * line.cp;
}
