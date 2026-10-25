import { after, isolatedPawns, passedPawns } from './helpers.js';

const IQP_W = 'r1bq1rk1/pp2bppp/2n1pn2/8/3P4/2NB1N2/PP3PPP/R1BQ1RK1 w - - 0 1';
const IQP_B = 'r1bq1rk1/pp2bppp/2n2n2/3p4/8/2N1BN2/PP2BPPP/R2Q1RK1 w - - 0 1';
const DOUBLED = '4k3/pp3ppp/8/8/8/2P5/P1P2PPP/4K3 w - - 0 1';
const PASSED = '8/5pk1/6p1/1P6/8/6P1/5PK1/8 w - - 0 1';
const BACKWARD = '4k3/5ppp/p2p4/1p2p3/4P3/2N5/PPP2PPP/4K3 w - - 0 1';
const MAJORITY = '4k3/pp3ppp/8/8/8/8/PPP2PP1/4K3 w - - 0 1';
const OUTPOST = 'r4rk1/pp2bppp/3p1n2/4p3/4P3/2N2N2/PPP2PPP/R4RK1 w - - 0 1';
const BISHOPS = '4k3/pp2bppp/3p4/2p1p3/2P1P3/2N1B3/PP3PPP/4K3 w - - 0 1';
const OPEN_FILES = 'r4rk1/ppp2ppp/2n1bn2/8/8/2N1BN2/PPP2PPP/R4RK1 w - - 0 1';
const SEVENTH = '6k1/pp3pp1/7p/8/8/8/PP3PPP/2R3K1 w - - 0 1';
const CASTLED = 'r1bq1rk1/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 w - - 0 1';
const YUGOSLAV = after('e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be3 Bg7 f3 O-O Qd2 Nc6 O-O-O');
const WORST = '2r2rk1/pp2bppp/3p4/2pNp3/2P1P3/8/PP3PPP/2R2RK1 b - - 0 1';

export default {
  id: 6,
  title: 'Strategy and Positional Play',
  blurb: 'Pawn structure, piece activity, king safety and making a plan.',
  chapters: [
    {
      id: '6.1',
      title: 'Pawn Structure',
      blurb: 'Isolated, doubled, backward and passed pawns; chains and majorities.',
      learn: [
        {
          title: 'Isolated pawns',
          text: `<p>An <b>isolated pawn</b> has no friendly pawns on the files next to it, so no pawn can ever defend it. The most famous is the <b>isolated queen's pawn (IQP)</b> on d4.</p>
            <ul>
              <li><b>Strength:</b> it controls e5 and c5, and the open files around it give the pieces activity — good for attacking.</li>
              <li><b>Weakness:</b> it must be defended by pieces, and the square in front of it (d5) is a perfect outpost for the opponent.</li>
            </ul>`,
          fen: IQP_W,
          shapes: ['d4:red', 'd5:blue'],
        },
        {
          title: 'Doubled and backward pawns',
          text: `<p><b>Doubled pawns</b> — two on the same file — can't protect each other and are often weak, though they open a file for your rooks.</p>
            <p>A <b>backward pawn</b> has fallen behind its neighbours: it can't be defended by a pawn and the square in front is controlled by the enemy. Black's d6 pawn here is backward; d5 is a hole for White.</p>`,
          fen: BACKWARD,
          shapes: ['d6:red', 'd5:blue'],
        },
        {
          title: 'Passed pawns',
          text: `<p>A <b>passed pawn</b> has no enemy pawns in front of it on its own or adjacent files. Nothing but pieces can stop it, so it gets stronger as pieces are traded.</p>
            <p>"Passed pawns must be pushed" — but make sure they're supported.</p>`,
          fen: PASSED,
          shapes: ['b5b8'],
        },
        {
          title: 'Pawn chains: attack the base',
          text: `<p>A <b>pawn chain</b> is a diagonal line of pawns defending each other. The front pawn is the head, the back pawn is the <b>base</b>.</p>
            <p>Attack a chain at its <b>base</b>, the one pawn not defended by another pawn. In the French Defence, Black hits d4 with <code>…c5</code>; later <code>…f6</code> hits the head.</p>`,
          fen: after('e4 e6 d4 d5 e5'),
          moves: [{ san: 'c5', text: 'Black strikes at the base of White\'s chain.', shapes: ['c5d4:red'] }],
        },
        {
          title: 'Pawn majorities',
          text: `<p>Count the pawns on each wing. A side with more pawns on one wing has a <b>majority</b> there and can create a passed pawn by advancing it.</p>
            <p>White has 3 vs 2 on the queenside; Black has 3 vs 2 on the kingside. In endgames, a queenside majority is often more dangerous because it's far from the kings.</p>`,
          fen: MAJORITY,
          squares: { a2: 'mark', b2: 'mark', c2: 'mark', f7: 'hint', g7: 'hint', h7: 'hint' },
        },
      ],
      exercises: [
        { id: '6.1-1', type: 'squares', rating: 700, prompt: 'Click White\'s <b>isolated pawn</b>.', fen: IQP_W, answer: isolatedPawns(IQP_W, 'w') },
        { id: '6.1-2', type: 'squares', rating: 650, prompt: 'Click both of White\'s <b>doubled pawns</b>.', fen: DOUBLED, answer: ['c2', 'c3'] },
        { id: '6.1-3', type: 'squares', rating: 750, prompt: 'Click White\'s <b>passed pawn</b>.', fen: PASSED, answer: passedPawns(PASSED, 'w') },
        { id: '6.1-4', type: 'squares', rating: 950, prompt: 'Click Black\'s <b>backward pawn</b>.', fen: BACKWARD, answer: ['d6'] },
        { id: '6.1-5', type: 'choice', rating: 1000, prompt: 'Black to move. Where should Black attack White\'s pawn chain?', fen: after('e4 e6 d4 d5 e5'), options: ['At the base: …c5, hitting d4', 'At the head: …f6, hitting e5', 'On the side: …h5'], answer: 0, explain: '…c5 attacks the base. …f6 is a good second idea, but the base is the main target.' },
        { id: '6.1-6', type: 'choice', rating: 800, prompt: 'Who has a <b>queenside</b> pawn majority?', fen: MAJORITY, options: ['White', 'Black', 'Neither'], answer: 0 },
      ],
      keyPoints: ['Isolated, doubled and backward pawns are targets; the square in front of them is an outpost.', 'Passed pawns grow stronger as pieces come off.', 'Attack a chain at its base. Use majorities to create passed pawns.'],
    },

    {
      id: '6.2',
      title: 'Piece Activity',
      blurb: 'Outposts, good and bad bishops, rooks on open files and the 7th rank.',
      learn: [
        {
          title: 'Outposts for knights',
          text: `<p>An <b>outpost</b> is a square in or near enemy territory that <b>can't be attacked by an enemy pawn</b> and is supported by one of yours. A knight there is a monster.</p>
            <p>d5 can never be attacked by a black pawn (no c-pawn, and the e-pawn has passed it). White's knight belongs there.</p>`,
          fen: OUTPOST,
          shapes: ['c3d5', 'd5:green'],
        },
        {
          title: 'Good and bad bishops',
          text: `<p>A bishop is <b>bad</b> when its own pawns are fixed on its colour, blocking it. It's <b>good</b> when its pawns are on the other colour.</p>
            <p>Black's dark-squared bishop on e7 is bad: c5, d6 and e5 are all dark squares. White's dark-squared bishop is good: White's pawns stand on light squares.</p>`,
          fen: BISHOPS,
          shapes: ['e7:red', 'e3:green'],
        },
        {
          title: 'Rooks on open files and the 7th rank',
          text: `<ul>
              <li>An <b>open file</b> has no pawns on it; a <b>half-open</b> file has only enemy pawns. Rooks belong there.</li>
              <li>A rook on the <b>7th rank</b> (2nd for Black) attacks pawns from the side and traps the king on the back rank.</li>
            </ul>`,
          fen: SEVENTH,
          moves: [{ san: 'Rc7', text: 'The rook invades the 7th, attacking b7 and f7.', shapes: ['c7b7:red', 'c7f7:red'] }],
        },
      ],
      exercises: [
        { id: '6.2-1', type: 'squares', rating: 900, prompt: 'Click the best <b>outpost</b> for White\'s knight.', fen: OUTPOST, answer: ['d5'] },
        { id: '6.2-2', type: 'choice', rating: 850, prompt: 'Which bishop is <b>bad</b>?', fen: BISHOPS, options: ['White\'s bishop on e3', 'Black\'s bishop on e7'], answer: 1 },
        { id: '6.2-3', type: 'move', strict: true, rating: 700, prompt: 'Put a rook on an open file.', fen: OPEN_FILES, solution: ['Rfd1'], alts: { 0: ['Rad1', 'Rfe1', 'Rae1'] } },
        { id: '6.2-4', type: 'move', rating: 900, prompt: 'Activate your rook.', fen: SEVENTH, solution: ['Rc7'] },
      ],
      keyPoints: ['Knights love outposts that enemy pawns can\'t attack.', 'Put pawns on the opposite colour to your bishop.', 'Rooks on open files; rooks on the 7th.'],
    },

    {
      id: '6.3',
      title: 'King Safety',
      blurb: 'Pawn shields, weaknesses, opposite-side castling.',
      learn: [
        {
          title: 'The pawn shield',
          text: `<p>After castling, the pawns in front of the king (f2, g2, h2) are its shield. Every move of those pawns creates <b>weak squares</b> that enemy pieces can use.</p>
            <ul>
              <li><b>h3</b> is the least weakening and gives luft.</li>
              <li><b>g3</b> weakens f3 and h3 — fine if a bishop goes to g2 (fianchetto).</li>
              <li><b>g4</b> or <b>f3/f4</b> early open lines to the king — only do it as part of an attack.</li>
            </ul>`,
          fen: CASTLED,
          squares: { f2: 'mark', g2: 'mark', h2: 'mark' },
        },
        {
          title: 'Opposite-side castling and pawn storms',
          text: `<p>When the kings castle on <b>opposite sides</b>, both players can throw their pawns at the enemy king without weakening their own. It becomes a race: whoever opens lines first usually wins.</p>
            <p>In this Sicilian Dragon, White castled queenside and will push <code>h4–h5</code> and <code>g4</code>; Black attacks on the queenside with …Rc8, …Ne5–c4 and …b5.</p>`,
          fen: YUGOSLAV,
          shapes: ['h2h4', 'h4h5', 'g2g4:blue'],
        },
      ],
      exercises: [
        { id: '6.3-1', type: 'choice', rating: 800, prompt: 'Which pawn move weakens White\'s castled king the most?', fen: CASTLED, options: ['h3', 'g4', 'a3'], answer: 1, explain: 'g4 opens the king\'s diagonal and leaves f4 and h4 weak. h3 just makes luft; a3 is far away.' },
        { id: '6.3-2', type: 'choice', rating: 1000, prompt: 'White has castled queenside and Black kingside. What is White\'s typical plan?', fen: YUGOSLAV, options: ['Push the h- and g-pawns at Black\'s king', 'Keep all pawns still and defend', 'Push the a- and b-pawns'], answer: 0, explain: 'With opposite-side castling, pawn storms against the enemy king are safe and fast.' },
      ],
      keyPoints: ['Each pawn move in front of your king creates weaknesses.', 'Opposite-side castling = pawn storm race.'],
    },

    {
      id: '6.4',
      title: 'Making a Plan',
      blurb: 'Find weaknesses, improve your worst piece, and decide when to trade.',
      learn: [
        {
          title: 'Identify weaknesses',
          text: `<p>When there are no tactics, ask: <b>what are the weaknesses in each camp?</b> Weak pawns (isolated, backward, doubled), weak squares (holes), and an exposed king. Then aim your pieces at them.</p>
            <p>Black's isolated d5 pawn is a clear target: pile up on it with rooks on the d-file and pieces on c3, f4 and b3.</p>`,
          fen: IQP_B,
          shapes: ['d5:red', 'c3d5', 'f3d4:blue'],
        },
        {
          title: 'Improve your worst piece',
          text: `<p>If you don't know what to do, find your <b>worst piece</b> and make it better. Usually that's a bad bishop, a knight on the rim, or a rook that isn't on an open file.</p>
            <p>Black's bishop on e7 is hemmed in by its own pawns, while White's knight on d5 dominates. Black should aim to trade the bad bishop with …Bg5.</p>`,
          fen: WORST,
          shapes: ['e7g5:green', 'd5:red'],
        },
        {
          title: 'When to trade and when to keep pieces',
          text: `<ul>
              <li><b>Trade</b> when you're ahead in material — fewer pieces means the extra material counts for more.</li>
              <li><b>Trade</b> your bad pieces for your opponent's good ones.</li>
              <li><b>Trade</b> attackers when you're under attack.</li>
              <li><b>Keep</b> pieces when you're attacking, when you're behind in material, or when your opponent has the cramped position.</li>
            </ul>`,
          fen: WORST,
        },
      ],
      exercises: [
        { id: '6.4-1', type: 'squares', rating: 800, prompt: 'Click Black\'s <b>weakest pawn</b>.', fen: IQP_B, answer: isolatedPawns(IQP_B, 'b') },
        { id: '6.4-2', type: 'choice', rating: 900, prompt: 'Black to move. Which is Black\'s worst piece?', fen: WORST, options: ['The bishop on e7', 'The rook on c8', 'The rook on f8', 'The king'], answer: 0 },
        { id: '6.4-3', type: 'choice', rating: 1000, prompt: 'What should Black do about it?', fen: WORST, options: ['Try to trade it with …Bg5', 'Keep it on e7 to defend d6', 'Push …f5 to open lines for it'], answer: 0, explain: '…Bg5 offers to swap the bad bishop. The knight on d5 can\'t be removed by a pawn, so trading pieces reduces its impact.' },
        { id: '6.4-4', type: 'choice', rating: 750, prompt: 'You are a piece up with queens on the board. What should you aim for?', options: ['Trade pieces, especially queens', 'Avoid all trades', 'Trade pawns but keep pieces'], answer: 0, explain: 'Each trade makes your extra piece relatively more important and reduces your opponent\'s counterplay.' },
      ],
      keyPoints: ['Find the weaknesses; aim at them.', 'No plan? Improve your worst piece.', 'Trade when ahead or defending; keep pieces when attacking or behind.'],
    },
  ],
};
