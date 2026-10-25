import { START, EMPTY, after, mv, fileSquares, rankSquares, diagonal, mark } from './helpers.js';

const KNIGHT_D4 = '7k/8/8/8/3N4/8/8/K7 w - - 0 1';

export default {
  id: 1,
  title: 'Foundations',
  blurb: 'The board, notation, how the pieces move, special moves, check and mate, and the basic checkmates.',
  chapters: [
    {
      id: '1.1',
      title: 'The Board and Notation',
      blurb: 'Files, ranks, diagonals and algebraic notation.',
      learn: [
        {
          title: 'Files, ranks and diagonals',
          text: `<p>The board has 64 squares in an 8×8 grid. Always set it up with a <b>light square in the bottom-right corner</b> ("light on the right").</p>
            <ul>
              <li><b>Files</b> are the columns, lettered <b>a</b> to <b>h</b> from White's left. The highlighted file is the <b>e-file</b>.</li>
              <li><b>Ranks</b> are the rows, numbered <b>1</b> to <b>8</b> from White's side. The fourth rank is shaded.</li>
              <li><b>Diagonals</b> are lines of same-coloured squares. The long diagonal a1–h8 is marked.</li>
            </ul>`,
          fen: EMPTY,
          squares: { ...mark(rankSquares(4), 'light'), ...mark(fileSquares('e'), 'mark'), ...mark(diagonal('a1', 1, 1), 'hint') },
        },
        {
          title: 'Naming squares',
          text: `<p>Every square is named by its file then its rank: <code>e4</code>, <code>d5</code>, <code>a8</code>. The circled squares are <b>e4</b> (green), <b>d5</b> (blue) and <b>a8</b> (red).</p>
            <p>The four squares <b>d4, e4, d5, e5</b> are the <b>centre</b> — you'll meet them again in Part 2.</p>
            <div class="tip">Tip: White's pieces start on ranks 1–2 and Black's on ranks 7–8. The queen starts on her own colour: the white queen on the light square d1, the black queen on the dark square d8.</div>`,
          fen: START,
          shapes: ['e4', 'd5:blue', 'a8:red'],
        },
        {
          title: 'Algebraic notation',
          text: `<p>Moves are written as <b>piece letter + destination square</b>:</p>
            <table><tr><th>K</th><td>King</td><th>Q</th><td>Queen</td></tr><tr><th>R</th><td>Rook</td><th>B</th><td>Bishop</td></tr><tr><th>N</th><td>Knight</td><th></th><td>Pawns have no letter</td></tr></table>
            <ul>
              <li><code>x</code> means a capture: <code>Bxc6</code>. A pawn capture names the file it came from: <code>dxc6</code>.</li>
              <li><code>+</code> is check, <code>#</code> is checkmate.</li>
              <li><code>O-O</code> is kingside castling, <code>O-O-O</code> queenside.</li>
              <li><code>e8=Q</code> is a pawn promoting to a queen.</li>
              <li>If two identical pieces could reach the same square, add the file or rank they came from: <code>Nbd2</code>, <code>R1e2</code>.</li>
            </ul>
            <p>Step through this opening with ▶ and read the notation for each move.</p>`,
          fen: START,
          moves: mv('1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Bxc6 dxc6 5.O-O', [
            'A pawn move: just the square.',
            'Black answers in the same way.',
            'Knight to f3 — the N stands for kNight (K is taken by the king).',
            'Black develops a knight too.',
            'Bishop to b5: the Ruy Lopez opening.',
            'Pawn to a6, asking the bishop what it wants to do.',
            'Bishop takes on c6 — "x" means capture.',
            'The d-pawn takes back. Pawn captures start with the file letter.',
            'White castles kingside.',
          ]),
        },
        {
          title: 'Recording your games',
          text: `<p>Writing down your moves lets you review your games later — the single best way to improve (see <a href="#/lesson/8.1">8.1</a>).</p>
            <ul>
              <li>Number each move: <code>1. e4 e5 2. Nf3 Nc6</code>. A move number with three dots, like <code>5... Nf6</code>, means it's Black's move.</li>
              <li>Write your move <i>before</i> or straight after you play it, every time.</li>
              <li>Common annotations: <code>!</code> good move, <code>?</code> mistake, <code>??</code> blunder, <code>!?</code> interesting, <code>?!</code> dubious.</li>
            </ul>
            <p>In this app every game you <a href="#/play">play</a> is recorded automatically in <b>PGN</b> (Portable Game Notation), the standard format other chess sites can read.</p>`,
          fen: after('e4 e5 Nf3 Nc6 Bb5 a6'),
        },
      ],
      exercises: [
        { id: '1.1-1', type: 'squares', rating: 300, prompt: 'Click the square <b>e4</b>.', fen: EMPTY, answer: ['e4'] },
        { id: '1.1-2', type: 'squares', rating: 350, prompt: 'Click the square <b>g7</b>.', fen: EMPTY, answer: ['g7'] },
        { id: '1.1-3', type: 'squares', rating: 450, prompt: 'Click all four <b>centre squares</b>.', fen: EMPTY, answer: ['d4', 'e4', 'd5', 'e5'] },
        { id: '1.1-4', type: 'squares', rating: 600, prompt: 'The board is now seen from <b>Black\'s side</b>. Click <b>c3</b>.', fen: EMPTY, orientation: 'black', answer: ['c3'], hint: 'From Black\'s side, the a-file is on the right and rank 1 is at the top.' },
        { id: '1.1-5', type: 'choice', rating: 500, prompt: 'What colour is the square <b>h1</b>?', fen: EMPTY, options: ['Light', 'Dark'], answer: 0, explain: '"Light on the right": h1 (White\'s bottom-right corner) is always a light square.' },
        { id: '1.1-6', type: 'move', rating: 400, strict: true, prompt: 'Play the move <code>Nf3</code>.', fen: START, solution: ['Nf3'] },
        { id: '1.1-7', type: 'move', rating: 550, strict: true, prompt: 'Play <code>Bxc6</code>.', fen: after('e4 e5 Nf3 Nc6 Bb5 a6'), solution: ['Bxc6'] },
        { id: '1.1-8', type: 'choice', rating: 600, prompt: 'What does <code>Nxe5+</code> mean?', fen: EMPTY, options: ['A knight moves to e5', 'A knight captures on e5 and gives check', 'A pawn on the e-file captures a knight', 'A knight captures on e5 and gives checkmate'], answer: 1 },
        { id: '1.1-9', type: 'move', rating: 650, strict: true, prompt: 'Black to move. Castle kingside: <code>O-O</code>. (Drag the king two squares towards the rook.)', fen: after('e4 e5 Nf3 Nc6 Bc4 Bc5 O-O Nf6 d3'), solution: ['O-O'] },
      ],
      keyPoints: ['Light square on the right.', 'Files a–h, ranks 1–8; squares are file + rank.', 'Piece letter + square; x for captures, + check, # mate.'],
    },

    {
      id: '1.2',
      title: 'How the Pieces Move and Their Value',
      blurb: 'Every piece, its value, and what makes a piece good or bad.',
      learn: [
        {
          title: 'The knight',
          text: `<p>The knight moves in an <b>L-shape</b>: two squares in one direction and one to the side. It is the only piece that can <b>jump</b> over others.</p>
            <p>A knight on d4 controls 8 squares. Notice it always lands on the opposite colour.</p>
            <div class="tip">"A knight on the rim is dim": on the edge it controls only 4 squares, in the corner just 2.</div>`,
          fen: KNIGHT_D4,
          shapes: ['d4b5', 'd4c6', 'd4e6', 'd4f5', 'd4f3', 'd4e2', 'd4c2', 'd4b3'],
        },
        {
          title: 'Bishop, rook and queen',
          text: `<ul>
              <li>The <b>bishop</b> moves any distance diagonally and stays on one colour for the whole game.</li>
              <li>The <b>rook</b> moves any distance along a file or rank.</li>
              <li>The <b>queen</b> combines both: any distance in any straight line.</li>
            </ul>
            <p>None of them can jump over other pieces. Here the bishop on c4 has an open path to f7 — Black's weakest square early in the game.</p>`,
          fen: '4k3/5p2/8/8/2B5/8/8/R2QK3 w - - 0 1',
          shapes: ['c4f7', 'a1a8:blue', 'd1h5:red', 'd1d8:red'],
        },
        {
          title: 'The pawn and the king',
          text: `<ul>
              <li><b>Pawns</b> move straight forward one square (two on their first move) but <b>capture diagonally</b> forwards. They never move backwards.</li>
              <li>The <b>king</b> moves one square in any direction. It can never move into check.</li>
            </ul>
            <p>The e4 pawn can capture on d5 or f5 but cannot move to e5 — it's blocked.</p>`,
          fen: '4k3/8/8/3npn2/4P3/8/8/4K3 w - - 0 1',
          shapes: ['e4d5', 'e4f5', 'e1d2:blue', 'e1e2:blue', 'e1f2:blue', 'e1d1:blue', 'e1f1:blue'],
        },
        {
          title: 'Piece values',
          text: `<table><tr><th>Pawn</th><td>1</td></tr><tr><th>Knight</th><td>3</td></tr><tr><th>Bishop</th><td>3</td></tr><tr><th>Rook</th><td>5</td></tr><tr><th>Queen</th><td>9</td></tr><tr><th>King</th><td>priceless</td></tr></table>
            <p>Use these numbers to judge trades: giving a knight (3) for a rook (5) wins "the exchange". Two minor pieces (6) are usually better than a rook and pawn (6) in the middlegame.</p>`,
          fen: START,
        },
        {
          title: 'Relative vs situational value',
          text: `<p>The table is only a guide. A piece's real value depends on the position.</p>
            <p>Here White's pawn on b7 is one step from promoting: it is worth far more than 1 point, and Black's rook is stuck on b8 just to stop it. Meanwhile Black's bishop on h8 is blocked by its own g7 pawn and does almost nothing.</p>`,
          fen: '1r4kb/1P3ppp/8/8/8/8/5PPP/6K1 w - - 0 1',
          shapes: ['b7b8', 'h8:red'],
        },
        {
          title: 'Good and bad pieces',
          text: `<ul>
              <li><b>Active</b> pieces control many squares, especially in the centre or in the enemy camp.</li>
              <li><b>Passive</b> pieces sit behind their own pawns doing little.</li>
              <li><b>Trapped</b> pieces have no safe square and can be won.</li>
            </ul>
            <p>White's knight on e5 is active: centralised, protected, and eyeing f7, d7 and c6. Black's bishop on c8 is passive, hemmed in by its own pawns on e6 and d5. You'll meet a trapped piece in the exercises.</p>`,
          fen: '2b4k/2p3pp/1p2p3/3pN3/3P4/8/5PPP/6K1 w - - 0 1',
          shapes: ['e5:green', 'c8:red'],
        },
      ],
      exercises: [
        { id: '1.2-1', type: 'squares', rating: 500, prompt: 'Click <b>every square</b> the knight on d4 can move to.', fen: KNIGHT_D4, answer: ['b3', 'b5', 'c2', 'c6', 'e2', 'e6', 'f3', 'f5'] },
        { id: '1.2-2', type: 'squares', rating: 450, prompt: 'A knight in the corner: click every square the knight on h1 can move to.', fen: '7k/8/8/8/8/8/8/K6N w - - 0 1', answer: ['f2', 'g3'], explain: 'Only two squares — a knight on the rim is dim!' },
        { id: '1.2-3', type: 'squares', rating: 550, prompt: 'Click every square the bishop on c1 can move to.', fen: 'k7/8/8/8/8/8/3P4/2B4K w - - 0 1', answer: ['b2', 'a3'], explain: 'The bishop is blocked on the other diagonal by its own d2 pawn.' },
        { id: '1.2-4', type: 'squares', rating: 600, prompt: 'Click every square the rook on d4 can move to (including captures).', fen: '7k/3p4/8/8/1n1R2P1/8/8/K7 w - - 0 1', answer: ['d5', 'd6', 'd7', 'd3', 'd2', 'd1', 'c4', 'b4', 'e4', 'f4'], explain: 'It can capture the d7 pawn and the b4 knight but is blocked by its own pawn on g4.' },
        { id: '1.2-5', type: 'move', rating: 600, prompt: 'Win the most material — safely.', fen: '4k3/r5n1/8/8/3Q4/8/8/4K3 w - - 0 1', solution: ['Qxa7'], explain: 'The rook (5) is undefended. Taking the knight on g7 would lose the queen to …Rxg7.' },
        { id: '1.2-6', type: 'choice', rating: 550, prompt: 'Which is usually worth more?', fen: EMPTY, options: ['A rook', 'A bishop and a pawn', 'They are exactly equal'], answer: 0, explain: 'Rook = 5, bishop + pawn = 4.' },
        { id: '1.2-7', type: 'choice', rating: 700, prompt: 'How would you describe White\'s bishop on a7?', fen: '2k5/B1p5/1p6/8/8/8/8/4K3 w - - 0 1', options: ['Active', 'Passive', 'Trapped'], answer: 2, explain: 'b8 is covered by the black king and b6 is defended by c7. Black plays …Kb7 and wins the bishop.' },
      ],
      keyPoints: ['Knight 3, bishop 3, rook 5, queen 9.', 'Value depends on activity: an active piece is worth more.', 'Watch for pieces with no safe squares — they can be trapped.'],
    },

    {
      id: '1.3',
      title: 'Special Moves',
      blurb: 'Castling, en passant, promotion and underpromotion.',
      learn: [
        {
          title: 'Castling',
          text: `<p>Castling moves the king two squares towards a rook, and the rook jumps to the other side of the king. It is the only move where two pieces move at once.</p>
            <p>Step through to see White castle kingside (<code>O-O</code>) and Black castle queenside (<code>O-O-O</code>).</p>`,
          fen: 'r3k2r/pppq1ppp/2npbn2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 1',
          moves: mv('O-O O-O-O', ['White\'s king goes to g1 and the rook to f1.', 'Black\'s king goes to c8 and the rook to d8.']),
        },
        {
          title: 'When you cannot castle',
          text: `<ul>
              <li>The king or that rook has <b>already moved</b> (even if it moved back).</li>
              <li>There are <b>pieces between</b> the king and the rook.</li>
              <li>The king is <b>in check</b>.</li>
              <li>The king would <b>pass through</b> or <b>land on</b> an attacked square.</li>
            </ul>
            <p>Here White cannot castle kingside: the bishop on a6 attacks f1, a square the king must cross. Note that only the <i>king's</i> path matters — the rook may pass through an attacked square.</p>`,
          fen: '4k3/8/b7/8/8/8/8/4K2R w K - 0 1',
          shapes: ['a6f1:red', 'f1:red'],
        },
        {
          title: 'En passant',
          text: `<p>When a pawn moves two squares and lands <b>beside</b> an enemy pawn, that enemy pawn may capture it <b>as if it had moved only one square</b>. This must be done immediately or the right is lost.</p>
            <p>Black plays …d5, passing the d6 square. White captures exd6 en passant.</p>`,
          fen: '4k3/3p4/8/4P3/8/8/8/4K3 b - - 0 1',
          moves: mv('d5 exd6', ['The pawn jumps two squares, landing next to White\'s e5 pawn…', '…and White captures it "in passing", landing on d6.'], [['d7d5'], ['e5d6']]),
        },
        {
          title: 'Promotion and underpromotion',
          text: `<p>A pawn reaching the last rank <b>must</b> be exchanged for a queen, rook, bishop or knight. Almost always you choose a queen.</p>
            <p>But sometimes a queen would be a mistake. Here <code>f8=Q</code>?? stalemates Black (no legal moves, not in check). <code>f8=R</code>! leaves the king one square and mates next move.</p>
            <div class="tip">When you promote in this app, a menu lets you pick the piece.</div>`,
          fen: '8/5P1k/5K2/8/8/8/8/8 w - - 0 1',
          moves: mv('f8=R Kh6 Rh8#', ['Underpromotion to a rook avoids stalemate.', 'The only move.', 'Checkmate.']),
        },
      ],
      exercises: [
        { id: '1.3-1', type: 'move', rating: 500, strict: true, prompt: 'Castle kingside.', fen: after('e4 e5 Nf3 Nc6 Bc4 Bc5'), solution: ['O-O'] },
        { id: '1.3-2', type: 'choice', rating: 700, prompt: 'Can White castle kingside here?', fen: '4k3/8/b7/8/8/8/8/4K2R w K - 0 1', options: ['Yes', 'No — the king is in check', 'No — the king would pass through an attacked square', 'No — the king would land in check'], answer: 2, explain: 'The bishop on a6 controls f1, which the king must cross.' },
        { id: '1.3-3', type: 'choice', rating: 850, prompt: 'Can White castle queenside here?', fen: '1r2k3/8/8/8/8/8/8/R3K3 w Q - 0 1', options: ['Yes', 'No — the rook on b8 attacks b1'], answer: 0, explain: 'Only the squares the <i>king</i> crosses and lands on (d1, c1) must be safe. The rook passing b1 doesn\'t matter.' },
        { id: '1.3-4', type: 'move', rating: 650, strict: true, prompt: 'Black has just played …d7-d5. Capture en passant.', fen: '4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1', solution: ['exd6'] },
        { id: '1.3-5', type: 'move', rating: 700, strict: true, prompt: 'Black to move. White just played e2-e4. Capture en passant.', fen: '4k3/8/8/8/3pP3/8/8/4K3 b - e3 0 1', solution: ['dxe3'] },
        { id: '1.3-6', type: 'move', rating: 900, prompt: 'Promote — but choose the right piece!', fen: '8/5P1k/5K2/8/8/8/8/8 w - - 0 1', solution: ['f8=R', 'Kh6', 'Rh8#'], mate: true, hint: 'A queen on f8 would leave Black with no legal moves.', explain: 'f8=Q is stalemate. f8=R leaves the king the h6 square, then Rh8 mates.' },
        { id: '1.3-7', type: 'move', rating: 1100, prompt: 'Promote with a fork!', fen: '8/2q1P1k1/8/8/8/8/P7/4K3 w - - 0 1', solution: ['e8=N+'], hint: 'Which piece on e8 would attack both g7 and c7?', explain: 'A knight on e8 checks the king and attacks the queen. After the king moves, Nxc7 wins the queen.' },
      ],
      keyPoints: ['Castle only if king and rook haven\'t moved and the king\'s path is safe.', 'En passant: only immediately after the two-square pawn move.', 'Promotion: usually a queen, but check for stalemate and knight forks.'],
    },

    {
      id: '1.4',
      title: 'Check, Checkmate, and Stalemate',
      blurb: 'Three ways out of check, and how not to stalemate a won game.',
      learn: [
        {
          title: 'Three ways out of check',
          text: `<p>When your king is attacked (in <b>check</b>) you must deal with it immediately. There are only three ways:</p>
            <ol>
              <li><b>Move</b> the king to a safe square (blue arrow).</li>
              <li><b>Block</b> the check by putting a piece in between (green arrow) — impossible against a knight.</li>
              <li><b>Capture</b> the checking piece (red arrow).</li>
            </ol>
            <p>Always look at all three, and pick the best. Here capturing wins a whole rook.</p>`,
          fen: '4r1k1/8/3N4/1B6/8/8/8/4K3 w - - 0 1',
          shapes: ['e1d2:blue', 'b5e2', 'd6e8:red'],
        },
        {
          title: 'Checkmate',
          text: `<p>If none of the three ways works, it is <b>checkmate</b> and the game is over. Here the rook checks along the back rank; the black king is boxed in by its own pawns, can't block and can't capture.</p>`,
          fen: 'R5k1/5ppp/8/8/8/8/5PPP/6K1 b - - 0 1',
          shapes: ['a8g8:red'],
        },
        {
          title: 'Stalemate',
          text: `<p><b>Stalemate</b>: the side to move is <i>not</i> in check but has <b>no legal moves</b>. The game is a <b>draw</b> — even if one side has a huge material advantage!</p>
            <p>Black to move: the king on a8 isn't in check, but a7, b7 and b8 are all covered by the queen. Draw.</p>`,
          fen: 'k7/2Q5/8/8/8/8/8/4K3 b - - 0 1',
          squares: { a7: 'bad', b7: 'bad', b8: 'bad' },
        },
        {
          title: 'Recognising stalemate traps',
          text: `<ul>
              <li>When you're winning, ask before every move: <b>"After this, does my opponent have a legal move?"</b></li>
              <li>Danger signs: the enemy king is in a corner or on the edge, and has few or no pawns that can move.</li>
              <li>The losing side may try to give away its last pieces to reach stalemate. Here Black plays …Qg1+!; if White takes with Kxg1, Black has no legal moves — stalemate.</li>
            </ul>`,
          fen: '7k/5Q2/8/2q5/8/8/8/7K b - - 0 1',
          moves: mv('Qg1+ Kxg1', ['A desperado: the queen offers itself.', 'Capturing leaves Black with no legal moves: stalemate.']),
        },
      ],
      exercises: [
        { id: '1.4-1', type: 'move', rating: 600, prompt: 'Get out of check in the best way.', fen: '4k3/5ppp/8/8/1b6/P7/5PPP/4K3 w - - 0 1', solution: ['axb4'], explain: 'Capturing the checking piece wins a bishop. Moving the king or blocking just loses time.' },
        { id: '1.4-2', type: 'move', rating: 650, prompt: 'You\'re in check. Find the best way out.', fen: '4r1k1/8/3N4/1B6/8/8/8/4K3 w - - 0 1', solution: ['Nxe8'], alts: { 0: ['Bxe8'] } },
        { id: '1.4-3', type: 'choice', rating: 550, prompt: 'Black to move. What is the situation?', fen: 'R5k1/5ppp/8/8/8/8/5PPP/6K1 b - - 0 1', options: ['Check — Black can escape', 'Checkmate', 'Stalemate'], answer: 1 },
        { id: '1.4-4', type: 'choice', rating: 650, prompt: 'Black to move. What is the result?', fen: '7k/5Q2/6K1/8/8/8/8/8 b - - 0 1', options: ['White is winning', 'Checkmate', 'Stalemate — draw'], answer: 2, explain: 'The king isn\'t in check but g8, g7 and h7 are all covered. Stalemate.' },
        { id: '1.4-5', type: 'choice', rating: 750, prompt: 'Black to move. Is it checkmate?', fen: '6k1/5Q2/8/8/8/8/8/K7 b - - 0 1', options: ['Yes', 'No — the king can capture the queen'], answer: 1, explain: 'The queen is unprotected, so …Kxf7.' },
        { id: '1.4-6', type: 'move', rating: 700, prompt: 'Mate in one — but beware of stalemate!', fen: 'k7/8/1K6/2Q5/8/8/8/8 w - - 0 1', solution: ['Qc8#'], mate: true, hint: 'Qc7?? would be stalemate. Check along the back rank instead.' },
      ],
      keyPoints: ['Out of check: move, block, or capture.', 'Checkmate ends the game; stalemate is a draw.', 'When winning, always check that the opponent still has a legal move.'],
    },

    {
      id: '1.5',
      title: 'Basic Checkmates',
      blurb: 'King + queen, king + rook and the ladder mate.',
      learn: [
        {
          title: 'King + Queen vs King',
          text: `<p>The plan: use the queen to <b>shrink the box</b> the enemy king lives in, then bring your own king up to help.</p>
            <ul>
              <li>Keep the queen a <b>knight's move</b> away from the enemy king — it squeezes without giving check or stalemate.</li>
              <li>Once the king is on the edge, stop: bring your king closer.</li>
              <li>Then mate on the edge with the queen protected by your king.</li>
            </ul>
            <p>Step through the moves.</p>`,
          fen: '8/8/3k4/8/8/2Q5/8/6K1 w - - 0 1',
          moves: mv('Kf2 Ke6 Ke3 Kf5 Qc6 Ke5 Qd7 Kf6 Kf4 Kg6 Ke5 Kg5 Qg7+ Kh4 Kf4 Kh3 Qg3#', [
            'First bring the king towards the centre.', '', 'The king supports the queen.', '',
            'The queen takes away the 6th rank.', '', 'And now the 7th rank — Black\'s box keeps shrinking.', '',
            'King comes closer.', '', 'And closer still.', '',
            'Driving the king to the edge.', '', 'Cutting off the escape squares.', 'The king is in the corner.', 'Checkmate, with the queen protected by the king.',
          ]),
        },
        {
          title: 'King + Rook vs King',
          text: `<p>The rook alone can't mate — the kings must cooperate. The method:</p>
            <ul>
              <li>Use the rook to <b>cut off</b> the king along a rank or file.</li>
              <li>Bring your king up so the two kings face each other (the <b>opposition</b>).</li>
              <li>When the kings are opposite, check with the rook: the enemy king must retreat a line.</li>
              <li>If the enemy king isn't opposite, make a <b>waiting move</b> with the rook along its line.</li>
            </ul>`,
          fen: '8/8/8/8/8/6k1/8/3RK3 w - - 0 1',
          moves: mv('Rd4 Kf3 Kd2 Kg2 Ke2 Kg3 Rc4 Kg2 Rg4+ Kh3 Kf3 Kh2 Kf2 Kh3 Re4 Kh2 Rh4#', [
            'The rook cuts the king off from the 4th rank... and the d-file.', '', 'Bring the king.', '', '', '',
            'A waiting move along the rank.', '', 'Check! The king is pushed to the h-file.', '', 'Kings face each other soon.', '',
            '', '', 'Another waiting move.', '', 'Checkmate on the edge.',
          ]),
        },
        {
          title: 'Two rooks: the ladder mate',
          text: `<p>Two rooks mate without help from the king. They take turns: one rook <b>guards a rank</b> while the other <b>checks on the next rank</b>, walking the king to the edge like climbing a ladder.</p>
            <p>If the king gets close to your rooks, swing them to the <b>far side</b> of the board and continue.</p>`,
          fen: '8/8/8/4k3/R7/8/8/1R4K1 w - - 0 1',
          moves: mv('Rb5+ Kd6 Ra6+ Kc7 Rh5 Kb7 Rg6 Kc7 Rh7+ Kd8 Rg8#', [
            'The a4 rook guards the 4th rank, so the check on the 5th drives the king up.', '',
            'Next rung: check on the 6th.', 'The king approaches the rooks to attack them.',
            'Move the rook far away, to the other side.', 'Attacking the a6 rook.',
            'That one swings across too.', '',
            'Check on the 7th…', '',
            '…and mate on the 8th.',
          ]),
        },
      ],
      exercises: [
        {
          id: '1.5-1', type: 'play', goal: 'mate', maxMoves: 20, rating: 700, title: 'Queen mate — warm-up',
          prompt: 'Mate with king and queen. Squeeze, then bring your king!',
          fens: ['8/8/8/4k3/8/8/8/3QK3 w - - 0 1', '8/8/3k4/8/8/2Q5/8/6K1 w - - 0 1', '8/1k6/8/8/5Q2/8/8/4K3 w - - 0 1', '8/8/8/8/2k5/8/5Q2/6K1 w - - 0 1'],
          solutionText: 'Shrink the box with the queen a knight\'s move away, bring the king, then mate on the edge.',
        },
        {
          id: '1.5-2', type: 'play', goal: 'mate', maxMoves: 10, rating: 1000, title: 'Queen mate — under 10 moves',
          prompt: 'From a random position: mate in under 10 moves.',
          fens: ['8/4Q3/8/8/8/8/1k6/4K3 w - - 0 1', '4K3/8/8/8/8/5Q2/8/k7 w - - 0 1', '8/8/8/4K3/Q7/6k1/8/8 w - - 0 1', '8/8/5Q2/1K6/8/1k6/8/8 w - - 0 1', '3Q4/8/8/1K6/8/8/8/5k2 w - - 0 1', '3k4/8/7K/8/8/8/8/5Q2 w - - 0 1'],
        },
        {
          id: '1.5-3', type: 'play', goal: 'mate', maxMoves: 30, rating: 900, title: 'Rook mate — warm-up',
          prompt: 'Mate with king and rook. Cut the king off, bring your king, use waiting moves.',
          fens: ['8/8/8/8/8/2k5/8/R3K3 w - - 0 1', '8/8/8/8/8/6k1/8/3RK3 w - - 0 1', '8/8/8/8/1k6/8/8/2R1K3 w - - 0 1'],
        },
        {
          id: '1.5-4', type: 'play', goal: 'mate', maxMoves: 10, rating: 1200, title: 'Rook mate — under 10 moves',
          prompt: 'From a random position: mate in under 10 moves.',
          fens: ['k7/5K2/8/8/8/8/8/1R6 w - - 0 1', '8/8/8/7k/8/4K3/8/2R5 w - - 0 1', '5k2/3K4/8/8/4R3/8/8/8 w - - 0 1', '3k4/8/7R/4K3/8/8/8/8 w - - 0 1', '8/1k6/6R1/8/2K5/8/8/8 w - - 0 1', '8/7k/8/8/7K/8/8/R7 w - - 0 1'],
        },
        {
          id: '1.5-5', type: 'play', goal: 'mate', maxMoves: 10, rating: 800, title: 'Ladder mate',
          prompt: 'Mate with two rooks in under 10 moves. Keep the rooks away from the king!',
          fens: ['8/8/8/3RR3/k7/4K3/8/8 w - - 0 1', '8/6k1/8/5R2/8/8/8/1R4K1 w - - 0 1', '8/1R6/6k1/3R4/2K5/8/8/8 w - - 0 1', '8/8/8/5k2/K7/4R3/8/2R5 w - - 0 1', '8/8/3k4/6R1/1R6/8/8/5K2 w - - 0 1', '8/5R2/8/4R3/7K/1k6/8/8 w - - 0 1'],
        },
      ],
      keyPoints: ['Queen: knight\'s-move squeeze, then bring the king.', 'Rook: cut off, opposition, check; waiting moves when needed.', 'Ladder: rooks alternate checks; move them away when the king attacks.'],
    },
  ],
};
