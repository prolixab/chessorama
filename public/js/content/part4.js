import { after, mv } from './helpers.js';

const OPERA = 'e4 e5 Nf3 d6 d4 Bg4 dxe5 Bxf3 Qxf3 dxe5 Bc4 Nf6 Qb3 Qe7 Nc3 c6 Bg5 b5 Nxb5 cxb5 Bxb5+ Nbd7 O-O-O Rd8 Rxd7 Rxd7 Rd1 Qe6 Bxd7+ Nxd7';

export default {
  id: 4,
  title: 'Checkmate Patterns',
  blurb: 'The classic mating nets. Learn to recognise the pattern first — then calculate.',
  intro: '<p>Strong players don\'t calculate every mate from scratch: they <b>recognise the pattern</b>, then check the details. When you\'ve worked through these, try <a href="#/practice/patterns">Practice → Pattern recognition</a>: name the pattern before you solve.</p>',
  chapters: [
    {
      id: '4.1',
      title: 'Back-rank mate',
      blurb: 'A rook or queen mates a king trapped behind its own pawns.',
      motif: 'King on the back rank, boxed in by its own pawns, with no defender covering the rank.',
      learn: [
        {
          title: 'The pattern',
          text: `<p>A king behind an unmoved row of pawns has no escape square. A rook or queen landing on the back rank is mate unless something can capture or block.</p>
            <p><b>Prevention:</b> make "luft" (air) with a move like h3 or g3 when you have time, and keep a piece guarding your back rank.</p>`,
          fen: '6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1',
          moves: mv('Rd8#', ['The black king is boxed in by its own pawns.'], [['f7:red', 'g7:red', 'h7:red']]),
        },
      ],
      exercises: [
        { id: '4.1-1', type: 'move', rating: 500, prompt: 'Mate in one.', fen: '6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1', solution: ['Rd8#'], mate: true },
        { id: '4.1-2', type: 'move', rating: 1100, prompt: 'Mate in two. The back rank is only defended once.', fen: '2r3k1/2q2ppp/8/8/8/8/4RPPP/4R1K1 w - - 0 1', solution: ['Re8+', 'Rxe8', 'Rxe8#'], mate: true },
        { id: '4.1-3', type: 'move', rating: 550, prompt: 'Black to move. Mate in one.', fen: '3r2k1/5ppp/8/8/8/8/5PPP/6K1 b - - 0 1', solution: ['Rd1#'], mate: true },
      ],
    },
    {
      id: '4.2',
      title: 'Smothered mate',
      blurb: 'A knight mates a king hemmed in by its own pieces.',
      motif: 'Enemy king in the corner surrounded by its own pieces; your knight can reach f7/h6 (or the equivalent).',
      learn: [
        {
          title: 'The pattern',
          text: `<p>When the king is completely surrounded by its own pieces, a single knight check is mate. The classic version uses a queen sacrifice to force a rook onto the last escape square — <b>Philidor's Legacy</b>.</p>`,
          fen: '4r2k/6pp/8/q5N1/2Q5/8/5PPP/6K1 w - - 0 1',
          moves: mv('Nf7+ Kg8 Nh6+ Kh8 Qg8+ Rxg8 Nf7#', ['Check.', '', 'Double check!', 'Back to the corner (…Kf8 allows Qf7#).', 'The queen sacrifice.', 'Forced — the rook blocks the king\'s last square.', 'Smothered mate.']),
        },
        {
          title: 'In the opening',
          text: `<p>It happens in openings too. In the Caro-Kann, 5…Ngf6?? walks into a one-move smothered mate because the e8 king is surrounded by its own pieces.</p>`,
          fen: after('e4 c6 d4 d5 Nc3 dxe4 Nxe4 Nd7 Qe2 Ngf6'),
          moves: mv('Nd6#', ['The e-pawn is pinned by the queen, so nothing can take the knight.']),
        },
      ],
      exercises: [
        { id: '4.2-1', type: 'move', rating: 900, prompt: 'Black has just blundered. Mate in one.', fen: after('e4 c6 d4 d5 Nc3 dxe4 Nxe4 Nd7 Qe2 Ngf6'), solution: ['Nd6#'], mate: true },
        { id: '4.2-2', type: 'move', rating: 1500, prompt: 'Philidor\'s Legacy: mate in four.', fen: '4r2k/6pp/8/q5N1/2Q5/8/5PPP/6K1 w - - 0 1', solution: ['Nf7+', 'Kg8', 'Nh6+', 'Kh8', 'Qg8+', 'Rxg8', 'Nf7#'], mate: true },
      ],
    },
    {
      id: '4.3',
      title: 'Anastasia\'s mate',
      blurb: 'Knight and rook (or queen) trap the king on the edge.',
      motif: 'Knight on e7 (or e2) covering g8/g6; king on h7/h8 with its own pawn on g7; open h-file.',
      learn: [
        {
          title: 'The pattern',
          text: `<p>A knight on e7 takes away g8 and g6. The king's own pawn on g7 blocks the rest. A rook or queen on the h-file mates.</p>
            <p>Often a queen sacrifice on h7 drags the king onto the h-file first.</p>`,
          fen: '5r1k/4N1pp/8/8/7Q/3R4/5PPP/6K1 w - - 0 1',
          moves: mv('Qxh7+ Kxh7 Rh3#', ['Queen sacrifice!', 'Forced.', 'Anastasia\'s mate.'], [[], [], ['e7g8:blue', 'e7g6:blue']]),
        },
      ],
      exercises: [
        { id: '4.3-1', type: 'move', rating: 800, prompt: 'Mate in one.', fen: '8/4N1pk/8/8/8/3R4/5PPP/6K1 w - - 0 1', solution: ['Rh3#'], mate: true },
        { id: '4.3-2', type: 'move', rating: 1300, prompt: 'Mate in two.', fen: '5r1k/4N1pp/8/8/7Q/3R4/5PPP/6K1 w - - 0 1', solution: ['Qxh7+', 'Kxh7', 'Rh3#'], mate: true },
      ],
    },
    {
      id: '4.4',
      title: 'Arabian mate',
      blurb: 'Rook and knight in the corner.',
      motif: 'Enemy king in the corner; your knight covers the rook\'s landing square next to it.',
      learn: [
        {
          title: 'The pattern',
          text: `<p>One of the oldest known mates. The knight on f6 protects the rook on h7 and covers g8; the rook covers g7 and h8.</p>`,
          fen: '7k/4R3/5N2/8/8/8/5PPP/6K1 w - - 0 1',
          moves: mv('Rh7#', ['The knight guards the rook.'], [['f6h7:blue', 'f6g8:blue']]),
        },
      ],
      exercises: [
        { id: '4.4-1', type: 'move', rating: 700, prompt: 'Mate in one.', fen: '7k/4R3/5N2/8/8/8/5PPP/6K1 w - - 0 1', solution: ['Rh7#'], mate: true },
        { id: '4.4-2', type: 'move', rating: 800, prompt: 'Black to move. Mate in one.', fen: '6k1/8/8/8/8/2n5/4r3/K7 b - - 0 1', solution: ['Ra2#'], mate: true },
      ],
    },
    {
      id: '4.5',
      title: 'Boden\'s mate',
      blurb: 'Two bishops on criss-crossing diagonals.',
      motif: 'King castled queenside, its own pieces on d7/d8; your bishops can cover a6–c8 and b8.',
      learn: [
        {
          title: 'The pattern',
          text: `<p>Two bishops on crossing diagonals mate a king boxed in by its own pieces — typically after queenside castling. A queen sacrifice often opens the diagonal.</p>`,
          fen: '2kr4/pp1n1ppp/2n5/8/5B2/5Q2/PPP1BPPP/6K1 w - - 0 1',
          moves: mv('Qxc6+ bxc6 Ba6#', ['Queen sacrifice to open the b7 square.', 'Forced.', 'Boden\'s mate: the bishops on a6 and f4 cover everything.'], [[], [], ['a6c8:red', 'f4b8:red']]),
        },
      ],
      exercises: [
        { id: '4.5-1', type: 'move', rating: 1300, prompt: 'Mate in two.', fen: '2kr4/pp1n1ppp/2n5/8/5B2/5Q2/PPP1BPPP/6K1 w - - 0 1', solution: ['Qxc6+', 'bxc6', 'Ba6#'], mate: true },
      ],
    },
    {
      id: '4.6',
      title: 'Greek gift sacrifice',
      blurb: 'Bxh7+ followed by Ng5+ and Qh5.',
      motif: 'Bishop on d3 aimed at h7, knight able to reach g5, queen able to reach h5; no black knight on f6.',
      learn: [
        {
          title: 'The pattern',
          text: `<p>The <b>Greek gift</b>: <code>Bxh7+</code>, sacrificing the bishop to rip open the king. After <code>Kxh7 Ng5+</code> the queen joins on h5 (or d3/h4) with a crushing attack.</p>
            <p>Checklist before you sacrifice:</p>
            <ul>
              <li>Bishop on d3 hitting h7; knight on f3 that can reach g5; queen able to reach the h-file.</li>
              <li>No black knight on f6 (a pawn on e5 helps keep it away).</li>
              <li>Black can't easily cover g5 or h5.</li>
            </ul>`,
          fen: 'r1bq1rk1/pp1n1ppp/2n1p3/2ppP3/1b1P4/2NB1N2/PPP2PPP/R1BQ1RK1 w - - 0 1',
          moves: mv('Bxh7+ Kxh7 Ng5+ Kg8 Qh5', ['The Greek gift.', '', 'The knight joins with check.', '', 'Threatening Qh7#. Black\'s defence is very difficult.'], [[], [], [], [], ['h5h7:red']]),
        },
      ],
      exercises: [
        { id: '4.6-1', type: 'move', rating: 1400, prompt: 'All the conditions are in place. Strike!', fen: 'r1bq1rk1/pp1n1ppp/2n1p3/2ppP3/1b1P4/2NB1N2/PPP2PPP/R1BQ1RK1 w - - 0 1', solution: ['Bxh7+'] },
      ],
    },
    {
      id: '4.7',
      title: 'Damiano\'s mate',
      blurb: 'Queen on h7 supported by a pawn on g6.',
      motif: 'Your pawn on g6 (or g3 for Black) next to the enemy king; queen able to reach h7.',
      learn: [
        {
          title: 'The pattern',
          text: `<p>A pawn on g6 supports the queen on h7. The king's own rook and pawn take away f8 and f7.</p>`,
          fen: '5rk1/5p2/6P1/8/8/7Q/5PP1/6K1 w - - 0 1',
          moves: mv('Qh7#', ['Protected by the g6 pawn.'], [['g6h7:blue']]),
        },
      ],
      exercises: [
        { id: '4.7-1', type: 'move', rating: 700, prompt: 'Mate in one.', fen: '5rk1/5p2/6P1/8/8/7Q/5PP1/6K1 w - - 0 1', solution: ['Qh7#'], mate: true },
        { id: '4.7-2', type: 'move', rating: 800, prompt: 'Black to move. Mate in one.', fen: '6k1/5pp1/8/8/7q/6p1/5P2/5RK1 b - - 0 1', solution: ['Qh2#'], mate: true },
      ],
    },
    {
      id: '4.8',
      title: 'Queen and bishop battery',
      blurb: 'Queen in front, bishop behind, aimed at h7.',
      motif: 'Queen and bishop lined up on the b1–h7 diagonal; h7 defended only by the king.',
      learn: [
        {
          title: 'The pattern',
          text: `<p>A <b>battery</b> is two pieces lined up on the same line. With the queen in front and bishop behind on the b1–h7 diagonal, <code>Qh7#</code> is a constant threat once the f6 knight is gone.</p>`,
          fen: '5rk1/5pp1/8/8/8/3Q4/2B2PPP/6K1 w - - 0 1',
          moves: mv('Qh7#', ['The bishop on c2 protects the queen.'], [['c2h7:blue']]),
        },
      ],
      exercises: [
        { id: '4.8-1', type: 'move', rating: 600, prompt: 'Mate in one.', fen: '5rk1/5pp1/8/8/8/3Q4/2B2PPP/6K1 w - - 0 1', solution: ['Qh7#'], mate: true },
        { id: '4.8-2', type: 'move', rating: 1100, prompt: 'The knight on f6 stops the mate. Remove it.', fen: 'r2q1rk1/ppp2pp1/5n2/6BQ/8/3B4/PPP2PPP/R5K1 w - - 0 1', solution: ['Bxf6'], explain: 'Now Qh7# is threatened and Black can\'t stop it without big losses.' },
      ],
    },
    {
      id: '4.9',
      title: 'Opera mate',
      blurb: 'Rook mates on the back rank, protected by a bishop.',
      motif: 'King on e8 blocked by its own pieces on e7/f7; rook can reach d8 protected by a bishop on g5.',
      learn: [
        {
          title: 'Morphy\'s Opera Game',
          text: `<p>Played by Paul Morphy in 1858 at the Paris opera, during a performance. It's the perfect example of rapid development and open lines against an undeveloped king.</p>
            <p>Step through the whole game. At the end, a rook on d8 protected by the bishop on g5 delivers mate.</p>`,
          fen: after(''),
          moves: mv(`${OPERA} Qb8+ Nxb8 Rd8#`, [
            '', '', '', 'The Philidor Defence.', '', 'Pins the knight — but Black will give up the bishop pair.', '', '', 'Recaptures and develops the queen.', '', 'Develops with a threat to f7.', 'Defends.', 'Double attack on f7 and b7.', 'Defends f7 but blocks the f8 bishop.', 'Another developing move.', '', 'Pins the knight to the queen.', 'Black attacks the queen…', 'White sacrifices instead.', '', 'Check, and the d7 pin begins.', '', 'Castling brings the rook into the attack.', '', 'Removing a defender.', '', 'Bringing the second rook.', 'Black tries to unpin.', '', 'Recapture.', 'The famous queen sacrifice!', 'Forced.', 'The Opera mate.',
          ]),
        },
      ],
      exercises: [
        { id: '4.9-1', type: 'move', rating: 1300, prompt: 'Finish Morphy\'s Opera Game: mate in two.', fen: after(OPERA), solution: ['Qb8+', 'Nxb8', 'Rd8#'], mate: true },
      ],
    },
  ],
};
