// Copies browser builds of third-party libraries from node_modules into public/vendor.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const nm = p => path.join(root, 'node_modules', p);
const out = p => path.join(root, 'public', 'vendor', p);

const copies = [
  ['chess.js/dist/esm/chess.js', 'chess.js'],
  ['chessground/dist/chessground.min.js', 'chessground.min.js'],
  ['chessground/assets/chessground.base.css', 'chessground.base.css'],
  ['chessground/assets/chessground.brown.css', 'chessground.brown.css'],
  ['chessground/assets/chessground.cburnett.css', 'chessground.cburnett.css'],
  ['stockfish/src/stockfish-nnue-16-single.js', 'stockfish/stockfish-nnue-16-single.js'],
  ['stockfish/src/stockfish-nnue-16-single.wasm', 'stockfish/stockfish-nnue-16-single.wasm'],
  ['stockfish/src/nn-5af11540bbfe.nnue', 'stockfish/nn-5af11540bbfe.nnue'],
];

for (const [from, to] of copies) {
  fs.mkdirSync(path.dirname(out(to)), { recursive: true });
  fs.copyFileSync(nm(from), out(to));
  console.log('vendored', to);
}
