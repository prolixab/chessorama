# Chessy — interactive chess training manual

A web app that teaches the *Chess Training Manual: Moves and Tactics* outline on a real, playable board.
Each chapter explains its idea with examples on the board, then makes you prove it with exercises.
Your progress is recorded as you go.

## Running it

```bash
npm install
npm start
```

Then open <http://localhost:4321>. `npm install` also copies the browser builds of the libraries into `public/vendor` (about 7 MB, almost all of it the Stockfish engine).

## Hosting it as a website

`public/` is a plain static site, so any static host works. Pushing to `main` runs `.github/workflows/pages.yml`, which installs the dependencies, copies the libraries into `public/vendor`, checks the content for legal moves, and publishes `public/` to GitHub Pages. (GitHub Pages must be enabled for the repository with **Source: GitHub Actions**.)

To host it elsewhere, run `npm ci && npm run vendor` and upload the `public` folder.

## What's in it

- **Manual** — all 8 parts and 42 chapters of the outline. Each chapter has:
  - *Learn* steps: explanation plus a board diagram, often with moves you step through (◀ ▶ or arrow keys) and arrows on the board. "Try moves" lets you push the pieces around yourself.
  - *Exercises* (159 in total):
    - **Your move**: find the move or the whole combination. Stockfish checks wrong moves and tells you if your move was also strong.
    - **Find the square**: click squares (notation, knight moves, key squares, outposts, blindfold exercises).
    - **Question**: multiple choice about a position.
    - **Play it out**: play against Stockfish until you reach a goal (mate in N, promote, win the pawn, or hold the draw). Used for the basic mates and endgames.
  - A summary with key points.
- **Practice**: review queue (everything you missed), mixed tactics with the motif hidden, pattern recognition (name the mate before you solve it), basic-mates drill, endgame drills, visualisation.
- **Play**: full games against Stockfish at 8 strength levels, with an optional live move-selection checklist (Part 5.1). Games are saved as PGN.
- **Games**: review each game — write your own notes first, then run engine analysis (eval graph, ?!/?/?? marks, turning point) and add mistakes to your log by category (Part 8.1).
- **Progress**: puzzle rating and estimated game rating over time, activity, completion and accuracy by part, and the monthly mistakes review (Part 8.4). Download or import a backup.
- **Appendix**: glossary, tactical motif quick reference, printable game-review template, answer key.

## Where progress is stored

Progress is always kept in the browser's localStorage. On a static host that is the only copy: it stays on that device and browser, so use **Progress → Download progress** for a backup or to move to another device.

When you run the bundled server (`npm start`), progress is also saved to `data/progress.json`, and the newer of the two copies wins on load.

## Project layout

```
public/
  index.html, css/app.css
  js/app.js            router and home page
  js/lesson.js         chapter view (learn steps → exercises → summary)
  js/exercise.js       the four exercise types
  js/board.js          Chessground board + chess.js rules
  js/engine.js         Stockfish in a Web Worker
  js/play.js           play mode, saved games, game review
  js/practice.js       practice drills
  js/progressView.js   progress page
  js/reference.js      appendix
  js/progress.js       progress storage and rating
  js/content/          the manual: part1.js … part8.js, glossary.js, helpers.js
tools/
  serve.mjs            static server + progress API
  vendor.mjs           copies libraries into public/vendor
  validate.mjs         checks every position and solution with Stockfish
  pv.mjs, batch.mjs, mates.mjs   authoring helpers (print engine lines for positions)
```

## Adding or changing content

Chapters live in `public/js/content/partN.js`. An exercise looks like this:

```js
{ id: '3.2-1', type: 'move', rating: 800, prompt: 'Find the royal fork.',
  fen: '6k1/5ppp/2q5/3N4/8/8/5PPP/6K1 w - - 0 1', solution: ['Ne7+', 'Kf8', 'Nxc6'] }
```

After editing, run the validator. It checks that every position and move is legal, and uses Stockfish to confirm that each solution is the best move and that each play-out goal can be reached:

```bash
npm run validate          # everything (takes a while)
node tools/validate.mjs 3.2 4   # one chapter, or one part
node tools/validate.mjs --fast  # legality only, no engine
```

Debugging: add `?debug` to the URL to turn off board animation and expose the board as `window.chessyBoard`, so moves can be scripted with `chessyBoard.debugUserMove('e2', 'e4')`.

## Credits

Board: [Chessground](https://github.com/lichess-org/chessground) (GPL-3.0) with the cburnett piece set. Rules: [chess.js](https://github.com/jhlywa/chess.js) (BSD-2). Engine: [Stockfish 18 lite](https://github.com/nmrugg/stockfish.js) (GPL-3.0).
