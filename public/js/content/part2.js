import { START, after, mv } from './helpers.js';

const ITALIAN = 'e4 e5 Nf3 Nc6 Bc4 Bc5';

export default {
  id: 2,
  title: 'Opening Principles',
  blurb: 'Control the centre, develop, castle — and a simple repertoire built on ideas, not memorisation.',
  chapters: [
    {
      id: '2.1',
      title: 'Core Principles',
      blurb: 'Centre, development, castling, connected rooks.',
      learn: [
        {
          title: 'Control the centre',
          text: `<p>The four centre squares — <b>e4, d4, e5, d5</b> — are the most important on the board. Pieces in the centre reach both sides of the board; pieces on the edge reach only one.</p>
            <p>Start by putting a pawn in the centre. <code>1.e4</code> occupies e4, attacks d5 and f5, and opens lines for the queen and bishop.</p>`,
          fen: START,
          moves: mv('1.e4 e5 2.d4', ['White grabs a centre square and frees the bishop and queen.', 'Black stakes a claim too.', 'White challenges e5 straight away and offers a second centre pawn.'], [['e4d5', 'e4f5'], ['e5d4:red', 'e5f4:red'], ['d4e5', 'd4c5']]),
        },
        {
          title: 'Develop knights and bishops early',
          text: `<p>"Development" means bringing pieces off the back rank to useful squares. Knights and bishops first; rooks and queen come later.</p>
            <ul>
              <li><b>Knights before bishops</b> — you usually know where knights belong (f3, c3) before you know the best square for a bishop.</li>
              <li>Develop <b>towards the centre</b>: Nf3 attacks e5 and d4; Nh3 would look at nothing.</li>
              <li>Every move should develop a new piece, if you can.</li>
            </ul>`,
          fen: after('e4 e5'),
          moves: mv('2.Nf3 Nc6 3.Bc4 Bc5', ['Develops and attacks e5.', 'Develops and defends e5.', 'The bishop eyes f7, the weakest square in Black\'s camp.', 'Black mirrors White.']),
        },
        {
          title: 'Castle early and connect your rooks',
          text: `<p>Castling tucks the king away from the centre (where files open up quickly) and brings a rook towards the middle.</p>
            <p>Once the minor pieces and queen have left the back rank, the rooks can see each other: they are <b>connected</b>. That's the sign your development is complete.</p>`,
          fen: after(`${ITALIAN} c3 Nf6 d3 d6`),
          moves: mv('6.O-O O-O 7.Bg5 h6 8.Bh4 a6 9.Nbd2 Ba7 10.Qe2', ['White castles.', 'So does Black.', 'Develops the last minor piece.', '', '', '', 'The knight heads for f1 and g3.', '', 'The queen steps off the back rank — White\'s rooks on a1 and f1 are now connected.'], [[], [], [], [], [], [], [], [], ['a1f1']]),
        },
        {
          title: 'Don\'t move the same piece twice — and keep the queen back',
          text: `<p>Each time you move a piece twice in the opening, your opponent gets a free developing move. The queen is the worst offender: it's so valuable that every enemy piece can attack it <b>with tempo</b> (gaining time).</p>
            <p>Watch White's queen get chased around while Black develops for free.</p>`,
          fen: START,
          moves: mv('1.e4 e5 2.Qh5 Nc6 3.Bc4 g6 4.Qf3 Nf6 5.Qb3 Qe7 6.Nc3 Nd4', [
            '', '', 'Out comes the queen, threatening Qxf7#.', 'Develops and defends e5.', 'Doubling up on f7.', 'Blocks the queen and kicks it.',
            'Again threatening f7.', 'Develops with a block.', 'A third queen move, attacking f7 and b7.', 'Defends f7.', 'Finally a developing move.', 'And the queen is attacked again! Black is well ahead in development.',
          ], [[], [], ['h5f7:red'], [], [], ['g6h5'], ['f3f7:red'], [], [], [], [], ['d4b3:red']]),
        },
      ],
      exercises: [
        { id: '2.1-1', type: 'move', rating: 400, strict: true, prompt: 'Make a first move that fights for the centre with a pawn.', fen: START, solution: ['e4'], alts: { 0: ['d4', 'c4'] } },
        { id: '2.1-2', type: 'move', rating: 500, strict: true, prompt: 'Develop a knight towards the centre.', fen: after('e4 e5'), solution: ['Nf3'], alts: { 0: ['Nc3'] } },
        { id: '2.1-3', type: 'choice', rating: 650, prompt: 'White to move. Which move follows the opening principles best?', fen: after(ITALIAN), options: ['4.Qe2', '4.O-O', '4.a4', '4.Nh4'], answer: 1, explain: 'Castling gets the king safe and brings the rook towards the centre. Qe2 brings the queen out early, a4 does nothing for development, and Nh4 moves the same knight twice to the edge.' },
        { id: '2.1-4', type: 'move', rating: 600, strict: true, prompt: 'Black to move. Get your king safe.', fen: after(`${ITALIAN} c3 Nf6 d3 d6 O-O`), solution: ['O-O'] },
        { id: '2.1-5', type: 'choice', rating: 550, prompt: 'Are White\'s rooks connected?', fen: after(`${ITALIAN} c3 Nf6 d3 d6 O-O O-O Bg5 h6 Bh4 a6 Nbd2 Ba7 Qe2`), options: ['Yes', 'No'], answer: 0, explain: 'Nothing stands between a1 and f1 any more.' },
        { id: '2.1-6', type: 'move', rating: 750, prompt: 'White\'s queen is out early, eyeing f7. Black to move: develop a piece <i>and</i> defend f7.', fen: after('e4 e5 Qh5 Nc6 Bc4 g6 Qf3'), solution: ['Nf6'], explain: '…Nf6 develops, blocks the queen\'s line to f7 and prepares to castle.' },
        { id: '2.1-7', type: 'move', rating: 900, prompt: 'Black to move. Develop with tempo — attack the queen!', fen: after('e4 e5 Qh5 Nc6 Bc4 g6 Qf3 Nf6 Qb3 Qe7 Nc3'), solution: ['Nd4'], explain: 'The knight jumps into the centre and attacks the queen, which must move yet again.' },
      ],
      keyPoints: ['Pawns to the centre, then knights, then bishops.', 'Castle early; connect the rooks.', 'Don\'t move one piece twice or bring the queen out early without a reason.'],
    },

    {
      id: '2.2',
      title: 'Common Opening Mistakes',
      blurb: 'Greedy pawn grabs, weakening f-pawn moves and Scholar\'s Mate.',
      learn: [
        {
          title: 'Pawn grabbing at the cost of development',
          text: `<p>A pawn is worth one point — a lead of three or four developing moves is often worth much more. In the Danish Gambit, Black takes two pawns but White's bishops sweep across the board at Black's undeveloped kingside.</p>`,
          fen: START,
          moves: mv('1.e4 e5 2.d4 exd4 3.c3 dxc3 4.Bc4 cxb2 5.Bxb2', ['', '', '', '', 'White offers a pawn…', '…Black takes it…', 'And another!', 'Black takes again.', 'White is two pawns down, but both bishops aim at Black\'s king and Black has nothing developed.'], [[], [], [], [], [], [], ['c4f7:red'], [], ['b2g7:red', 'c4f7:red']]),
        },
        {
          title: 'Weakening the king: f-pawn moves',
          text: `<p>The f-pawn shields the king along the diagonal h4–e1 (for White) or h5–e8 (for Black). Moving it early — especially together with the g-pawn — can lose instantly. This is the shortest possible game, <b>Fool's Mate</b>.</p>`,
          fen: START,
          moves: mv('1.f3 e5 2.g4 Qh4#', ['Opens the e1–h4 diagonal.', '', 'And this opens it fully.', 'Checkmate in two moves.'], [[], [], [], ['h4e1:red']]),
        },
        {
          title: 'Scholar\'s Mate — and how to stop it',
          text: `<p>White brings the queen and bishop to attack f7, which only the king defends. If Black doesn't notice, it's mate on move four.</p>
            <p><b>Defence:</b> block the queen with <code>…g6</code>, or defend f7 with <code>…Qe7</code> or <code>…Qf6</code>. Afterwards, attack the queen with your developing moves — White has broken the principles and you should gain time.</p>`,
          fen: START,
          moves: mv('1.e4 e5 2.Bc4 Nc6 3.Qh5 Nf6 4.Qxf7#', ['', '', 'The bishop aims at f7.', '', 'Now two pieces attack f7.', 'A natural developing move — but it ignores the threat!', 'Checkmate.'], [[], [], ['c4f7:red'], [], ['h5f7:red', 'c4f7:red'], [], []]),
        },
      ],
      exercises: [
        { id: '2.2-1', type: 'move', rating: 500, prompt: 'Black to move. White has weakened the king — mate in one!', fen: after('f3 e5 g4'), solution: ['Qh4#'], mate: true },
        { id: '2.2-2', type: 'move', rating: 600, prompt: 'Black has played the weakening …f6 and …g5. Mate in one.', fen: after('e4 f6 d4 g5'), solution: ['Qh5#'], mate: true },
        { id: '2.2-3', type: 'move', rating: 550, prompt: 'Black has missed the threat. Mate in one.', fen: after('e4 e5 Bc4 Nc6 Qh5 Nf6'), solution: ['Qxf7#'], mate: true },
        { id: '2.2-4', type: 'move', rating: 650, prompt: 'Black to move. Defend against Scholar\'s Mate.', fen: after('e4 e5 Bc4 Nc6 Qh5'), solution: ['g6'], alts: { 0: ['Qe7', 'Qf6'] }, anyGood: true, explain: '…g6 blocks and attacks the queen; …Qe7 and …Qf6 defend f7. All three stop the mate.' },
        { id: '2.2-5', type: 'move', rating: 800, prompt: 'Black just played 2…Qxd5, bringing the queen out early. Develop with tempo.', fen: after('e4 d5 exd5 Qxd5'), solution: ['Nc3'], explain: 'The knight develops and attacks the queen, so Black must spend another move.' },
        { id: '2.2-6', type: 'move', rating: 1200, prompt: 'Black has greedily taken your queen. Punish it — mate in three!', fen: after('e4 e5 Nf3 d6 Bc4 Bg4 Nc3 g6 Nxe5 Bxd1'), solution: ['Bxf7+', 'Ke7', 'Nd5#'], mate: true, hint: 'Check first, starting on f7.', explain: 'This is Légal\'s Mate. Black\'s undeveloped position lets three minor pieces mate the king.' },
        { id: '2.2-7', type: 'choice', rating: 750, prompt: 'Black to move. Which move would weaken Black\'s king most?', fen: after('e4 e5 Nf3'), options: ['2…Nc6', '2…f6', '2…d6'], answer: 1, explain: 'After 2…f6? 3.Nxe5! fxe5? 4.Qh5+ Black\'s king is in serious trouble. The f-pawn guards the king — don\'t use it to defend e5.' },
      ],
      keyPoints: ['Development beats a pawn in the opening.', 'Be careful with early f- and g-pawn moves.', 'Against Scholar\'s Mate: …g6, …Qe7 or …Qf6, then chase the queen.'],
    },

    {
      id: '2.3',
      title: 'A Starter Repertoire',
      blurb: 'Italian Game as White, 1…e5 and the Queen\'s Gambit Declined as Black.',
      learn: [
        {
          title: 'As White: the Italian Game',
          text: `<p>The Italian Game follows every principle: centre pawn, knight, bishop to its best diagonal, castle. The quiet <b>c3 + d3</b> set-up is solid and easy to play.</p>
            <ul>
              <li><b>c3</b> prepares the central break <b>d3–d4</b>.</li>
              <li><b>Re1, Nbd2–f1–g3</b> is the typical regrouping towards the kingside.</li>
              <li><b>Bb3</b> keeps the bishop safe from …d5 or …Na5.</li>
              <li><b>h3</b> stops …Bg4 pinning your knight.</li>
            </ul>`,
          fen: START,
          moves: mv('1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6 5.d3 d6 6.O-O O-O 7.Re1 a6 8.Bb3 Ba7 9.Nbd2', [
            '', '', '', '', 'The Italian bishop: pointing at f7.', '', 'Prepares d4.', '', 'Solid — protects e4.', '', '', '', 'Supports e4 and a later d4.', 'Gives the bishop a retreat.', 'Steps back before …Na5 or …b5.', '', 'Heading for f1 and g3.',
          ]),
        },
        {
          title: 'As Black against 1.e4: 1…e5',
          text: `<p>Answer 1.e4 with 1…e5: you get your fair share of the centre and free your pieces. The most common lines:</p>
            <ul>
              <li><b>Italian (3.Bc4):</b> 3…Bc5 or 3…Nf6, with the same ideas White has.</li>
              <li><b>Ruy Lopez (3.Bb5):</b> 3…a6 4.Ba4 Nf6 5.O-O Be7, then …b5, …d6 and …O-O.</li>
              <li><b>Scotch (3.d4):</b> 3…exd4 4.Nxd4 Nf6 and develop quickly.</li>
            </ul>
            <p>Here's the main line of the Ruy Lopez.</p>`,
          fen: START,
          moves: mv('1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 d6 8.c3 O-O', [
            '', 'Claims the centre.', '', 'Defends e5.', 'The Ruy Lopez: pressure on the defender of e5.', 'Asks the bishop to decide.', '', 'Develops and hits e4.', '', 'Ready to castle.', '', 'Gains space and kicks the bishop.', '', 'Supports e5 and opens the c8 bishop.', '', 'Black is fully developed.',
          ]),
        },
        {
          title: 'As Black against 1.d4: the Queen\'s Gambit Declined',
          text: `<p>Against 1.d4, play 1…d5 and meet 2.c4 with 2…e6: solid, classical and full of clear plans.</p>
            <ul>
              <li>Black keeps a strong pawn on d5 and develops …Nf6, …Be7, …O-O, …Nbd7.</li>
              <li>The problem piece is the <b>c8 bishop</b>, shut in by e6.</li>
              <li>Freeing ideas: <b>…dxc4</b> followed by <b>…Nd5</b> (Capablanca's manoeuvre) to trade pieces, then <b>…e5</b> or <b>…c5</b>.</li>
            </ul>`,
          fen: START,
          moves: mv('1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bg5 Be7 5.e3 O-O 6.Nf3 Nbd7 7.Rc1 c6 8.Bd3 dxc4 9.Bxc4 Nd5', [
            '', '', 'The Queen\'s Gambit.', 'Declined: d5 stays firmly protected.', '', '', 'Pins the f6 knight.', 'Unpins.', '', '', '', '', '', 'Solidifies d5.', '', 'Now that White\'s bishop has moved, Black takes on c4, gaining a tempo.', '', 'Capablanca\'s idea: trade pieces to free Black\'s game.',
          ]),
        },
        {
          title: 'Learn the ideas, not just the moves',
          text: `<p>Memorising long move orders doesn't help when your opponent plays something different on move 4. Instead, know for each opening:</p>
            <ul>
              <li><b>Where your pieces belong</b> (e.g. Italian: Bc4/b3, Nf3, Re1, Nd2–f1–g3).</li>
              <li><b>Your pawn break</b> (Italian: d3–d4; QGD: …c5 or …e5).</li>
              <li><b>Your problem piece</b> and how to fix it (QGD: the c8 bishop).</li>
            </ul>
            <p>After each game, look up where you left your repertoire and why.</p>`,
          fen: after(`${ITALIAN} c3 Nf6 d3 d6 O-O O-O Re1 a6 Bb3 Ba7 Nbd2`),
          shapes: ['d3d4', 'd2f1:blue', 'f1g3:blue'],
        },
      ],
      exercises: [
        { id: '2.3-1', type: 'move', repertoire: true, rating: 700, title: 'Italian Game as White', prompt: 'Play the first five moves of our Italian Game.', fen: START, solution: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'c3', 'Nf6', 'd3'] },
        { id: '2.3-2', type: 'move', repertoire: true, rating: 700, title: '1…e5 against the Italian', prompt: 'Black to move. Play our repertoire against the Italian.', fen: after('e4'), solution: ['e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'c3', 'Nf6'] },
        { id: '2.3-3', type: 'move', repertoire: true, rating: 800, title: '1…e5 against the Ruy Lopez', prompt: 'Black to move. White has played the Ruy Lopez.', fen: after('e4 e5 Nf3 Nc6 Bb5'), solution: ['a6', 'Ba4', 'Nf6', 'O-O', 'Be7'] },
        { id: '2.3-4', type: 'move', repertoire: true, rating: 800, title: 'Queen\'s Gambit Declined', prompt: 'Black to move. Play the Queen\'s Gambit Declined.', fen: after('d4'), solution: ['d5', 'c4', 'e6', 'Nc3', 'Nf6', 'Bg5', 'Be7', 'e3', 'O-O', 'Nf3', 'Nbd7'] },
        { id: '2.3-5', type: 'move', repertoire: true, rating: 1000, title: 'Capablanca\'s freeing manoeuvre', prompt: 'Black to move. White\'s bishop has just moved to d3. Free your position.', fen: after('d4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 O-O Nf3 Nbd7 Rc1 c6 Bd3'), solution: ['dxc4', 'Bxc4', 'Nd5'] },
        { id: '2.3-6', type: 'choice', rating: 750, prompt: 'In the Italian with c3 and d3, what is White\'s main pawn break?', fen: after(`${ITALIAN} c3 Nf6 d3 d6 O-O O-O`), options: ['d3–d4', 'f2–f4', 'b2–b4', 'h2–h4'], answer: 0, explain: 'c3 was played to support d4, which challenges Black\'s e5 pawn and gains central space.' },
        { id: '2.3-7', type: 'choice', rating: 850, prompt: 'In the Queen\'s Gambit Declined, which black piece is usually the hardest to activate?', fen: after('d4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 O-O Nf3 Nbd7'), options: ['The f6 knight', 'The c8 bishop', 'The e7 bishop', 'The f8 rook'], answer: 1, explain: 'The e6 pawn blocks the c8 bishop. Black frees it with …dxc4 and …e5, or …b6 and …Bb7.' },
      ],
      keyPoints: ['White: Italian Game with c3, d3, Re1, Nbd2–f1–g3, then d4.', 'Black vs 1.e4: 1…e5. Vs 1.d4: QGD with …e6, …Nf6, …Be7, …O-O, …Nbd7.', 'Know each opening\'s piece placement, pawn break and problem piece.'],
    },
  ],
};
