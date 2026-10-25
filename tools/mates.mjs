// Authoring helper: prints the engine score for each FEN given on the command line.
import { startEngine } from './sf.mjs';
const e = startEngine(); await e.init();
for (const fen of process.argv.slice(2)) {
  const [l] = await e.analyse(fen, { depth: 22 });
  console.log(l.mate !== undefined ? `#${l.mate}` : (l.cp / 100).toFixed(2), '\t', fen);
}
e.quit();
