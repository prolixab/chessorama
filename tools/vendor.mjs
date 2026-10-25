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
  // The lite single-threaded build: ~7 MB with the network built in, and no cross-origin isolation needed.
  ['stockfish/bin/stockfish-18-lite-single.js', 'stockfish/stockfish-18-lite-single.js'],
  ['stockfish/bin/stockfish-18-lite-single.wasm', 'stockfish/stockfish-18-lite-single.wasm'],
];

for (const [from, to] of copies) {
  fs.mkdirSync(path.dirname(out(to)), { recursive: true });
  fs.copyFileSync(nm(from), out(to));
  console.log('vendored', to);
}
