// Checks every lesson and exercise: legal positions and moves, and (with Stockfish) that each
// puzzle solution is the best move and that play-out goals are achievable.
//   node tools/validate.mjs            all chapters
//   node tools/validate.mjs 3.2 4      only chapters 3.2 and part 4
//   node tools/validate.mjs --fast     skip engine checks
import { Chess } from '../public/vendor/chess.js';
import { PARTS } from '../public/js/content/index.js';
import { startEngine } from './sf.mjs';

const args = process.argv.slice(2);
const fast = args.includes('--fast');
const filters = args.filter(a => !a.startsWith('--'));
const want = ch => !filters.length || filters.some(f => ch.id === f || String(ch.part) === f || ch.id.startsWith(f + '.'));

let errors = 0, warnings = 0;
const err = (where, msg) => { errors++; console.log(`  ✘ ${where}: ${msg}`); };
const warn = (where, msg) => { warnings++; console.log(`  ⚠ ${where}: ${msg}`); };
const SQ = /^[a-h][1-8]$/;
const clean = s => s.replace(/[+#!?]/g, '');

function legal(fen) {
  try { return new Chess(fen); } catch { return null; }
}

function checkShapes(where, shapes = []) {
  for (const s of shapes) {
    const [sq] = s.split(':');
    if (!(sq.length === 2 && SQ.test(sq)) && !(sq.length === 4 && SQ.test(sq.slice(0, 2)) && SQ.test(sq.slice(2)))) err(where, `bad shape ${s}`);
  }
}

const engine = fast ? null : startEngine();
if (engine) await engine.init();

// Score from the side to move: mate scores become large numbers.
const val = l => (l.mate !== undefined ? (l.mate > 0 ? 100000 - l.mate : -100000 - l.mate) : l.cp);
const fmt = l => (l.mate !== undefined ? `#${l.mate}` : `${(l.cp / 100).toFixed(2)}`);
function sanOf(fen, uci) {
  const c = new Chess(fen);
  try { return c.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] }).san; } catch { return uci; }
}

const ids = new Set();

for (const part of PARTS) {
  for (const ch of part.chapters) {
    ch.part = part.id;
    if (!want(ch)) continue;
    console.log(`\n${ch.id} ${ch.title}`);
    (ch.learn || []).forEach((st, i) => {
      const where = `learn ${i + 1} "${st.title}"`;
      if (!st.title || !st.text) err(where, 'missing title/text');
      checkShapes(where, st.shapes);
      if (st.moves?.length) {
        const c = legal(st.fen);
        if (!c) return err(where, `illegal FEN for moves: ${st.fen}`);
        for (const m of st.moves) {
          try { c.move(m.san); } catch { err(where, `illegal demo move ${m.san} at ${c.fen()}`); break; }
          checkShapes(where, m.shapes);
        }
      }
    });

    for (const ex of ch.exercises || []) {
      const where = `${ex.id} (${ex.type})`;
      if (ids.has(ex.id)) err(where, 'duplicate id');
      ids.add(ex.id);
      if (!ex.id.startsWith(ch.id + '-')) warn(where, `id should start with ${ch.id}-`);
      checkShapes(where, ex.shapes);

      if (ex.type === 'squares') {
        if (!ex.answer?.length || ex.answer.some(s => !SQ.test(s))) err(where, 'bad answer squares');
        if (!ex.prompt) err(where, 'missing prompt');
        continue;
      }
      if (ex.type === 'choice') {
        if (!(ex.answer >= 0 && ex.answer < ex.options.length)) err(where, 'answer index out of range');
        continue;
      }
      if (ex.type === 'move') {
        const c = legal(ex.fen);
        if (!c) { err(where, `illegal FEN ${ex.fen}`); continue; }
        if (c.isGameOver()) { err(where, 'start position is already over'); continue; }
        const positions = [];
        let ok = true;
        for (let i = 0; i < ex.solution.length; i++) {
          const fen = c.fen();
          let m;
          try { m = c.move(ex.solution[i]); } catch { err(where, `illegal solution move ${ex.solution[i]} at ${fen}`); ok = false; break; }
          if (clean(m.san) !== clean(ex.solution[i])) warn(where, `SAN ${ex.solution[i]} is written as ${m.san}`);
          for (const a of ex.alts?.[i] || []) {
            const t = new Chess(fen);
            try { t.move(a); } catch { err(where, `illegal alt ${a} at ${fen}`); }
          }
          positions.push({ fen, i, san: m.san });
        }
        if (!ok) continue;
        if (ex.mate && !c.isCheckmate()) err(where, 'solution does not end in mate');
        if (!engine || ex.repertoire || ex.strict) continue;
        for (const { fen, i, san } of positions) {
          const userMove = i % 2 === 0;
          const lines = await engine.analyse(fen, { depth: ex.depth || 16, multipv: 3 });
          const best = lines[0];
          const mine = lines.find(l => sanOf(fen, l.move) === san);
          const okSans = [san, ...(ex.alts?.[i] || [])].map(clean);
          if (userMove) {
            const bestSan = sanOf(fen, best.move);
            if (!okSans.includes(clean(bestSan))) {
              // Solution isn't the engine's top move. Fine if it is (nearly) as good.
              const myVal = mine ? val(mine) : null;
              if (myVal === null || (val(best) > 50000 ? myVal < val(best) - 3 : myVal < val(best) - 60)) err(where, `move ${i + 1} ${san}: engine prefers ${bestSan} (${fmt(best)}) over it (${mine ? fmt(mine) : 'not in top 3'})`);
            }
            const others = lines.filter(l => !okSans.includes(clean(sanOf(fen, l.move))));
            const top = mine || best;
            const second = others[0];
            if (second && !(ex.anyGood)) {
              const gap = val(top) - val(second);
              const bothMate = top.mate > 0 && second.mate > 0;
              if (!bothMate && gap < 150 && val(top) > -50000) warn(where, `move ${i + 1} ${san} (${fmt(top)}): alternative ${sanOf(fen, second.move)} (${fmt(second)}) is close`);
              if (bothMate && i === ex.solution.length - 1) { /* any mate is accepted */ }
              else if (bothMate && second.mate <= top.mate) warn(where, `move ${i + 1}: ${sanOf(fen, second.move)} also mates (#${second.mate} vs #${top.mate})`);
            }
          } else {
            const bestSan = sanOf(fen, best.move);
            if (clean(bestSan) !== clean(san) && mine && val(best) - val(mine) > 80) warn(where, `reply ${san} (${fmt(mine)}) is weaker than ${bestSan} (${fmt(best)})`);
            if (!mine && clean(bestSan) !== clean(san)) warn(where, `reply ${san} not in top 3; engine plays ${bestSan}`);
          }
        }
        continue;
      }
      if (ex.type === 'play') {
        const pool = ex.fens || [ex.fen];
        for (const fen of pool) {
          const c = legal(fen);
          if (!c) { err(where, `illegal FEN ${fen}`); continue; }
          if (!engine) continue;
          const [l] = await engine.analyse(fen, { depth: ex.depth || 20 });
          const userToMove = c.turn() === (ex.userColor || fen.split(' ')[1]);
          const score = userToMove ? l : { ...l, cp: -l.cp, mate: l.mate !== undefined ? -l.mate : undefined };
          const label = `${fen} → ${fmt(score)}`;
          if (ex.goal === 'mate') {
            if (!(score.mate > 0)) err(where, `no forced mate: ${label}`);
            else if (ex.maxMoves && score.mate > ex.maxMoves) err(where, `mate needs ${score.mate} > ${ex.maxMoves} moves: ${label}`);
            else if (ex.maxMoves && score.mate > ex.maxMoves - 2) warn(where, `tight: mate in ${score.mate}, limit ${ex.maxMoves}: ${label}`);
          } else if (ex.goal === 'promote' || ex.goal === 'capture') {
            const min = ex.goal === 'capture' ? (ex.keepCp ?? 0) : 300;
            if (!(score.mate > 0) && !(score.cp >= min)) err(where, `goal ${ex.goal} not clearly achievable: ${label}`);
          } else if (ex.goal === 'hold') {
            if (score.mate !== undefined || score.cp < -150) err(where, `position is lost, cannot hold: ${label}`);
          } else err(where, `unknown goal ${ex.goal}`);
        }
        continue;
      }
      err(where, `unknown type ${ex.type}`);
    }
  }
}

engine?.quit();
console.log(`\n${errors} errors, ${warnings} warnings`);
process.exit(errors ? 1 : 0);
