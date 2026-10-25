import { after, checkSquares, undefendedPieces, EMPTY } from './helpers.js';

const CHECKS_FEN = 'r1bq1rk1/ppp2ppp/2n5/7Q/2B1N3/8/PPPP1PPP/R1B2RK1 w - - 0 1';
const BLUNDER_FEN = 'r2q1rk1/ppp2ppp/2n1bn2/4p3/2B1P1b1/2NP1N2/PPP2PPP/R2QK2R w KQ - 0 1';

export default {
  id: 5,
  title: 'Calculation and Thinking Process',
  blurb: 'A move-selection routine, visualisation training and defensive technique.',
  chapters: [
    {
      id: '5.1',
      title: 'A Move-Selection Routine',
      blurb: 'Five questions to ask on every move.',
      learn: [
        {
          title: 'The routine',
          text: `<p>Most blunders happen because a player skips a step. Use the same routine on every serious move:</p>
            <ol>
              <li><b>What did my opponent's last move threaten?</b> Look at what the moved piece now attacks, and what it uncovered.</li>
              <li><b>What are all my checks, captures and threats?</b></li>
              <li><b>Choose 2–4 candidate moves.</b></li>
              <li><b>Calculate each candidate</b> a few moves deep and compare the final positions.</li>
              <li><b>Blunder check:</b> before you touch a piece — is anything left hanging? Does the move allow a check, fork or capture?</li>
            </ol>
            <div class="tip">In <a href="#/play">Play</a> mode you can turn on a live checklist that shows the opponent's threat, your checks and captures, and your loose pieces.</div>`,
          fen: after('e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5'),
          shapes: ['g5f7:red', 'c4f7:red'],
        },
        {
          title: 'Step 1: the opponent\'s threat',
          text: `<p>White has just played <code>Ng5</code>. Ask: what does the knight attack now? It joins the bishop against f7, and <code>Nxf7</code> would fork the queen and rook.</p>
            <p>Black's best answer is <code>…d5!</code>, blocking the bishop's line to f7 and counter-attacking.</p>`,
          fen: after('e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5'),
          shapes: ['g5f7:red', 'f7d8:red', 'f7h8:red'],
        },
        {
          title: 'Step 5: the blunder check',
          text: `<p>Before you move, look at the position <i>after</i> your move as if you were your opponent. The two most common blunders:</p>
            <ul>
              <li>Leaving a piece undefended where it can be attacked with tempo.</li>
              <li>Moving a piece that was defending something else.</li>
            </ul>
            <p>Here White's pieces marked in red are undefended. Keep track of them.</p>`,
          fen: BLUNDER_FEN,
          shapes: undefendedPieces(BLUNDER_FEN, 'w').map(s => `${s}:red`),
        },
      ],
      exercises: [
        { id: '5.1-1', type: 'choice', rating: 800, prompt: 'Black to move. What is White threatening?', fen: after('e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5'), options: ['Nxf7, forking the queen and rook', 'Qh5 and Qxf7#', 'Nothing in particular', 'Bxf7+ winning the queen'], answer: 0 },
        { id: '5.1-2', type: 'move', rating: 1000, prompt: 'Black to move. Stop the threat — actively.', fen: after('e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5'), solution: ['d5'], explain: '…d5 blocks the bishop\'s attack on f7. 4…Bc5?! allows Nxf7, and 4…Qe7 is passive.' },
        { id: '5.1-3', type: 'squares', rating: 900, prompt: 'Step 2: list your checks. Click the destination square of <b>every checking move</b> White has.', fen: CHECKS_FEN, answer: checkSquares(CHECKS_FEN), hint: 'Look at every white piece: which can reach a square that attacks g8?' },
        { id: '5.1-4', type: 'choice', rating: 1000, prompt: 'Blunder check: White is considering <code>5.Nxe5</code>, grabbing a pawn. Is it safe?', fen: after('e4 e5 Nf3 Nc6 Bb5 a6 Bxc6 dxc6'), options: ['Yes — e5 is undefended', 'No — …Qd4 attacks the knight and e4, winning the pawn back'], answer: 1, explain: 'After 5.Nxe5? Qd4! 6.Nf3 Qxe4+ Black regains the pawn with a good position.' },
        { id: '5.1-5', type: 'squares', rating: 900, prompt: 'Blunder check: click every <b>undefended</b> white piece and pawn.', fen: BLUNDER_FEN, answer: undefendedPieces(BLUNDER_FEN, 'w') },
      ],
      keyPoints: ['Threat → checks, captures, threats → candidates → calculate → blunder check.', 'Use it every move until it becomes automatic.'],
    },

    {
      id: '5.2',
      title: 'Visualisation Training',
      blurb: 'Calculate without moving pieces; blindfold exercises.',
      learn: [
        {
          title: 'Why visualise?',
          text: `<p>In a game you can't move the pieces to test a line. You need to <b>see the position in your head</b> several moves ahead.</p>
            <ul>
              <li>Know every square's colour and name instantly.</li>
              <li>Follow a sequence of moves without losing track of where pieces are.</li>
              <li>Count piece routes: how many moves does a knight need to reach a square?</li>
            </ul>
            <p>A few minutes a day of the exercises in this chapter builds the skill quickly.</p>`,
          fen: EMPTY,
        },
        {
          title: 'Square colours',
          text: `<p>A trick: a square is <b>dark</b> when its file number (a=1 … h=8) plus its rank number is <b>even</b>, and <b>light</b> when odd.</p>
            <p>a1: 1+1 = 2, even → dark. h1: 8+1 = 9, odd → light. e4: 5+4 = 9 → light.</p>
            <p>Also: the long diagonals a1–h8 are dark, h1–a8 light; d4 and e5 are dark, d5 and e4 light.</p>`,
          fen: EMPTY,
          shapes: ['a1h8', 'h1a8:blue'],
        },
      ],
      exercises: [
        { id: '5.2-1', type: 'choice', blind: 'colors', rating: 700, prompt: 'Without looking: what colour is <b>f5</b>?', fen: EMPTY, options: ['Light', 'Dark'], answer: 0, explain: 'f = 6, 6 + 5 = 11, odd → light.' },
        { id: '5.2-2', type: 'choice', blind: 'colors', rating: 700, prompt: 'What colour is <b>d6</b>?', fen: EMPTY, options: ['Light', 'Dark'], answer: 1, explain: 'd = 4, 4 + 6 = 10, even → dark.' },
        { id: '5.2-3', type: 'choice', blind: 'colors', rating: 750, prompt: 'Are <b>b3</b> and <b>g8</b> the same colour?', fen: EMPTY, options: ['Yes', 'No'], answer: 0, explain: 'b3: 2 + 3 = 5 (light). g8: 7 + 8 = 15 (light).' },
        { id: '5.2-4', type: 'squares', blind: true, rating: 900, prompt: 'Blindfold: from the starting position, play in your head <code>1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.Ng5 d5 5.exd5 Na5</code>. Which square is <b>White\'s light-squared bishop</b> on?', fen: EMPTY, answer: ['c4'] },
        { id: '5.2-5', type: 'squares', blind: true, rating: 1000, prompt: 'Blindfold: a white knight stands on <b>g1</b>. Click every <b>centre square</b> (d4, e4, d5, e5) it can reach in <b>exactly two moves</b>.', fen: EMPTY, answer: ['d4', 'e5'], explain: 'g1–f3–d4, g1–e2–d4 and g1–f3–e5.' },
        { id: '5.2-6', type: 'squares', blind: true, rating: 800, prompt: 'Blindfold: <code>1.e4 e5 2.Qh5 Nc6 3.Bc4 Nf6??</code> White mates in one. On which square?', fen: EMPTY, answer: ['f7'] },
        { id: '5.2-7', type: 'choice', visual: true, rating: 1100, prompt: 'Calculate without moving: White plays <code>1.Rh8+ Kxh8 2.Nxf7+</code>. Which black piece does the knight attack besides the king?', fen: '3q2k1/pp3pp1/8/6N1/8/8/PPP5/1K2R2R w - - 0 1', options: ['The queen on d8', 'The pawn on b7', 'Nothing else'], answer: 0 },
      ],
      keyPoints: ['File number + rank number: even = dark, odd = light.', 'Practise following moves in your head every day.'],
    },

    {
      id: '5.3',
      title: 'Defensive Tactics',
      blurb: 'Spot threats, counter-attack, and save lost positions with perpetual check or stalemate.',
      learn: [
        {
          title: 'Spotting your opponent\'s threats',
          text: `<p>Defence starts with step 1 of the routine: <b>what is my opponent threatening?</b> Imagine it's their move again — what would they play?</p>
            <p>Here Black threatens <code>…Qe1+</code>! If <code>Rxe1 Rxe1#</code> — a back-rank mate. White must make luft (h3 or g3) or cover e1.</p>`,
          fen: '4r1k1/5ppp/8/4q3/8/8/2Q2PPP/2R3K1 w - - 0 1',
          shapes: ['e5e1:red', 'e8e1:red'],
        },
        {
          title: 'Counter-attack vs passive defence',
          text: `<p>When attacked, you don't always have to defend directly. Ask: <b>do I have a bigger threat?</b> A counter-attack that forces your opponent to react can be better than a passive retreat.</p>
            <p>But be honest: a counter-attack only works if it's at least as strong as the opponent's threat. Checks and threats against the king are the strongest.</p>`,
          fen: after('e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5'),
          shapes: ['d5c4:red', 'd5e4:red'],
        },
        {
          title: 'Perpetual check',
          text: `<p>When you're losing, look for a <b>perpetual check</b>: checks the opponent can't escape. If the same position repeats three times, the game is drawn.</p>
            <p>Black is a rook down but the white king can't escape the queen's checks on f2 and f1.</p>`,
          fen: '8/2R2pkp/6p1/Q7/3q4/6PP/7K/8 b - - 0 1',
          moves: [{ san: 'Qf2+', text: 'Check.' }, { san: 'Kh1', text: 'Forced.' }, { san: 'Qf1+', text: 'Check again.' }, { san: 'Kh2', text: 'Forced.' }, { san: 'Qf2+', text: 'And again — a draw by repetition.' }],
        },
        {
          title: 'Stalemate as a saving resource',
          text: `<p>If your king has no legal moves, try to get rid of your remaining pieces. If the opponent must capture them, it's stalemate. Here <code>…Qg1+!</code> forces <code>Kxg1</code> and Black has no legal move.</p>`,
          fen: '7k/5Q2/8/2q5/8/8/8/7K b - - 0 1',
          moves: [{ san: 'Qg1+', text: 'The queen sacrifices itself.' }, { san: 'Kxg1', text: 'Forced — and it\'s stalemate.' }],
        },
      ],
      exercises: [
        { id: '5.3-1', type: 'choice', rating: 900, prompt: 'White to move. What is Black threatening?', fen: '4r1k1/5ppp/8/4q3/8/8/2Q2PPP/2R3K1 w - - 0 1', options: ['…Qe1+ followed by …Rxe1#', '…Qxh2+', '…Re2 attacking the queen', 'Nothing'], answer: 0 },
        { id: '5.3-2', type: 'move', rating: 900, prompt: 'Deal with Black\'s back-rank threat.', fen: '4r1k1/5ppp/8/4q3/8/8/2Q2PPP/2R3K1 w - - 0 1', solution: ['h3'], alts: { 0: ['g3', 'h4', 'Qc8', 'Kf1'] }, anyGood: true, explain: 'h3 or g3 gives the king an escape square ("luft"). Qc8 also works, pinning the e8 rook.' },
        { id: '5.3-3', type: 'move', rating: 1200, prompt: 'Black to move. You\'re a rook down. Save the game!', fen: '8/2R2pkp/6p1/Q7/3q4/6PP/7K/8 b - - 0 1', solution: ['Qf2+', 'Kh1', 'Qf1+', 'Kh2', 'Qf2+'], explain: 'The king can only shuttle between h1 and h2: perpetual check.' },
        { id: '5.3-4', type: 'move', rating: 1300, prompt: 'Black to move. You\'re about to lose. Find the stalemate trick.', fen: '7k/5Q2/8/2q5/8/8/8/7K b - - 0 1', solution: ['Qg1+'], alts: { 0: ['Qe5'] }, anyGood: true, explain: 'After …Qg1+ Kxg1 Black has no legal moves: stalemate.' },
      ],
      keyPoints: ['Always ask what your opponent threatens.', 'Prefer active defence when the counter-threat is real.', 'When lost: look for perpetual check and stalemate tricks.'],
    },
  ],
};
