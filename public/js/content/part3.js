import { after, mv, undefendedPieces } from './helpers.js';

const LOOSE_FEN = after('e4 e5 Nf3 Nc6 Bc4 Nf6 d3 Bc5 Bg5 h6 Bh4 g5 Bg3 d6 c3 Bg4 Nbd2');

export default {
  id: 3,
  title: 'Core Tactics',
  blurb: 'Forks, pins, skewers, discovered attacks and the other weapons that win material.',
  intro: '<p>For each motif: a definition, worked examples on the board, then puzzles. Afterwards, drill them mixed together in <a href="#/practice/tactics">Practice → Mixed tactics</a>, where you won\'t be told the motif.</p>',
  chapters: [
    {
      id: '3.1',
      title: 'Tactical Building Blocks',
      blurb: 'Loose pieces, counting, and the forcing-move checklist.',
      motif: 'Undefended pieces and pieces attacked more times than they are defended.',
      learn: [
        {
          title: 'Loose pieces drop off',
          text: `<p>A <b>loose piece</b> is one that nothing defends. Almost every tactic — forks, skewers, discovered attacks — works by hitting a loose piece (or the king) twice at once.</p>
            <p>Grandmaster John Nunn's advice: <b>"Loose pieces drop off" (LPDO)</b>. Before every move, notice which of your pieces and your opponent's are loose.</p>
            <p>Here the circled black pieces have no defender at all.</p>`,
          fen: LOOSE_FEN,
          shapes: undefendedPieces(LOOSE_FEN, 'b').map(s => `${s}:red`),
        },
        {
          title: 'Counting attackers and defenders',
          text: `<p>Before you capture, <b>count</b>: how many of your pieces attack the target, and how many enemy pieces defend it?</p>
            <ul>
              <li>More attackers than defenders → you can usually win it.</li>
              <li>Equal → capturing just trades, and may lose material if your first capturer is worth more than the target.</li>
              <li>Always capture with the <b>least valuable</b> piece first.</li>
            </ul>
            <p>The e5 pawn is attacked twice (knight and bishop) and defended once (knight). White wins it.</p>`,
          fen: '4k3/5ppp/2n5/4p3/8/2B2N2/5PPP/4K3 w - - 0 1',
          shapes: ['f3e5', 'c3e5', 'c6e5:red'],
          moves: mv('Nxe5 Nxe5 Bxe5', ['First capture.', 'Black recaptures…', '…and White is a pawn up.']),
        },
        {
          title: 'Checks, captures, threats',
          text: `<p>The <b>forcing-move checklist</b>: on every move, look at <b>all</b> your</p>
            <ol><li><b>Checks</b> — they give the opponent the fewest choices,</li><li><b>Captures</b>,</li><li><b>Threats</b> (moves that attack something).</li></ol>
            <p>Then do the same for your opponent. Forcing moves are where tactics hide. Here a check wins a piece: <code>Qa4+</code> checks the king <i>and</i> attacks the loose bishop on h4.</p>`,
          fen: '4k3/5ppp/8/8/7b/8/5PPP/2KQ4 w - - 0 1',
          shapes: ['d1a4', 'a4e8:red', 'a4h4:red'],
        },
      ],
      exercises: [
        { id: '3.1-1', type: 'move', rating: 700, prompt: 'Black\'s last move left a piece hanging. Take it.', fen: after('e4 e5 Be2 d5 exd5 Bg4'), solution: ['Bxg4'] },
        { id: '3.1-2', type: 'squares', rating: 800, prompt: 'Click every <b>undefended</b> black piece and pawn.', fen: LOOSE_FEN, answer: undefendedPieces(LOOSE_FEN, 'b'), hint: 'For each black piece, ask: if it were captured, could Black recapture?' },
        { id: '3.1-3', type: 'choice', rating: 750, prompt: 'Count attackers and defenders. Should White play <code>Nxe5</code>?', fen: '4k3/5ppp/2n5/4p3/8/5N2/5PPP/4K3 w - - 0 1', options: ['Yes — it wins a pawn', 'No — it loses the knight for a pawn'], answer: 1, explain: 'e5 is attacked once and defended once. After Nxe5 Nxe5, White has given a knight (3) for a pawn (1).' },
        { id: '3.1-4', type: 'move', rating: 850, prompt: 'Now the e5 pawn is attacked twice. Win it.', fen: '4k3/5ppp/2n5/4p3/8/2B2N2/5PPP/4K3 w - - 0 1', solution: ['Nxe5'], alts: { 0: ['Bxe5'] } },
        { id: '3.1-5', type: 'move', rating: 900, prompt: 'Checks first! Find the forcing move that wins material.', fen: '4k3/5ppp/8/8/7b/8/5PPP/2KQ4 w - - 0 1', solution: ['Qa4+'], alts: { 0: ['Qh5+', 'Qe1+'] }, explain: 'Any check that also attacks h4 wins the bishop: Qa4+, Qh5+ or Qe1+.' },
      ],
      keyPoints: ['Loose pieces drop off — track undefended pieces on both sides.', 'Count attackers vs defenders before capturing; capture with the cheapest piece first.', 'Checks, captures, threats — for you and for your opponent — every move.'],
    },

    {
      id: '3.2',
      title: 'The Fork',
      blurb: 'One piece attacking two or more targets at once.',
      motif: 'A piece (often a knight, pawn or queen) that can attack two loose pieces or the king and a piece at once.',
      learn: [
        {
          title: 'Knight forks',
          text: `<p>A <b>fork</b> is one piece attacking two (or more) targets at once. The opponent can only save one.</p>
            <p>Knights are the best forkers: they attack in eight directions and can't be blocked. A fork of king and queen is a <b>royal fork</b>; king, queen and rook is a <b>family fork</b>.</p>
            <p>Here <code>Ne7+</code> checks the king and attacks the queen.</p>`,
          fen: '6k1/5ppp/2q5/3N4/8/8/5PPP/6K1 w - - 0 1',
          moves: mv('Ne7+ Kf8 Nxc6', ['Royal fork!', 'The king must move…', '…and the queen falls.'], [['e7g8:red', 'e7c6:red'], [], []]),
        },
        {
          title: 'Pawn forks',
          text: `<p>Pawns fork too — and since a pawn is worth only one point, any fork of two pieces wins material. Watch for enemy pieces standing side by side, one square apart, in front of your pawns.</p>`,
          fen: 'r1bqk2r/ppp2ppp/2nb1n2/8/3PP3/2N5/PPP2PPP/R1BQKBNR w KQkq - 0 1',
          shapes: ['e4e5', 'e5d6:red', 'e5f6:red'],
        },
        {
          title: 'Queen and other forks',
          text: `<p>The queen moves in eight directions, so it forks often — especially a king and a loose piece. Look for queen moves that give check while also hitting something undefended.</p>
            <p><code>Qd5+</code> checks along one diagonal and attacks the rook along the other.</p>`,
          fen: 'r5k1/6pp/8/8/8/8/6PP/3Q2K1 w - - 0 1',
          moves: mv('Qd5+ Kf8 Qxa8+', ['Check and attack.', '', 'Rook won.'], [['d5g8:red', 'd5a8:red'], [], []]),
        },
      ],
      exercises: [
        { id: '3.2-1', type: 'move', rating: 800, prompt: 'Find the royal fork.', fen: '6k1/5ppp/2q5/3N4/8/8/5PPP/6K1 w - - 0 1', solution: ['Ne7+', 'Kf8', 'Nxc6'] },
        { id: '3.2-2', type: 'move', rating: 850, prompt: 'Find the family fork.', fen: 'r3k3/pp3ppp/4q3/1N6/8/8/PP3PPP/2RR2K1 w - - 0 1', solution: ['Nc7+'], explain: 'The knight checks the king and attacks the queen and rook.' },
        { id: '3.2-3', type: 'move', rating: 900, prompt: 'Fork two pieces with a pawn.', fen: 'r1bqk2r/ppp2ppp/2nb1n2/8/3PP3/2N5/PPP2PPP/R1BQKBNR w KQkq - 0 1', solution: ['e5'], explain: 'e5 attacks the bishop and the knight. Black\'s best is …Qe7, pinning the pawn, but White keeps a big advantage.' },
        { id: '3.2-4', type: 'move', rating: 850, prompt: 'Use your queen to fork.', fen: 'r5k1/6pp/8/8/8/8/6PP/3Q2K1 w - - 0 1', solution: ['Qd5+'] },
        { id: '3.2-5', type: 'move', rating: 900, prompt: 'Black to move. Fork the king and queen.', fen: '6k1/5ppp/8/4n3/8/8/3Q1P1P/6K1 b - - 0 1', solution: ['Nf3+'] },
        { id: '3.2-6', type: 'move', rating: 1200, prompt: 'Black to move. White just took on e4 with a knight. Use a pawn fork to win the piece back.', fen: after('e4 e5 Nf3 Nc6 Bc4 Nf6 Nc3 Nxe4 Nxe4'), solution: ['d5'], explain: 'The "fork trick": …d5 attacks the bishop and the knight, and Black regains the piece.' },
      ],
      keyPoints: ['Forks hit two targets at once — look for loose pieces and the king.', 'Knights fork pieces that sit on the same colour, a knight\'s jump apart.', 'Pawn forks of two pieces always win material.'],
    },

    {
      id: '3.3',
      title: 'The Pin',
      blurb: 'Absolute and relative pins — exploiting them and breaking them.',
      motif: 'A piece that can\'t move (or shouldn\'t) because a more valuable piece stands behind it on the same line.',
      learn: [
        {
          title: 'Absolute pins',
          text: `<p>A <b>pin</b> is an attack on a piece that cannot move without exposing a more valuable piece behind it.</p>
            <p>When the piece behind is the <b>king</b>, the pin is <b>absolute</b>: the pinned piece is not allowed to move at all. Here the knight on c6 is pinned by the bishop on b5.</p>`,
          fen: '4k3/ppp2ppp/2n5/1B6/3P4/8/PPP2PPP/4K3 w - - 0 1',
          shapes: ['b5e8:red'],
        },
        {
          title: 'Relative pins',
          text: `<p>When the piece behind is something other than the king (usually the queen), the pin is <b>relative</b>: the pinned piece <i>can</i> move, but it costs material.</p>
            <p>In the Queen's Gambit, <code>Bg5</code> pins the f6 knight to the queen on d8.</p>`,
          fen: after('d4 d5 c4 e6 Nc3 Nf6 Bg5'),
          shapes: ['g5d8:red'],
        },
        {
          title: 'Exploiting a pin',
          text: `<p>A pinned piece is a sitting target. <b>Attack it again</b>, especially with a pawn — it can't run away.</p>
            <p>Here <code>d5</code> attacks the pinned knight, which can't move. White wins a piece.</p>`,
          fen: '4k3/ppp2ppp/2n5/1B6/3P4/8/PPP2PPP/4K3 w - - 0 1',
          moves: mv('d5 a6 dxc6', ['The pinned knight is attacked by a pawn.', 'Black tries to kick the bishop…', '…but White simply takes the knight.'], [['d5c6:red'], [], []]),
        },
        {
          title: 'Breaking a pin',
          text: `<ul>
              <li><b>Put a piece in between</b> (e.g. …Be7 against Bg5).</li>
              <li><b>Move the piece behind</b> out of the line (the king or queen steps aside).</li>
              <li><b>Attack the pinning piece</b> (…h6 against Bg5).</li>
              <li><b>Counter-attack</b>: a relative pin isn't real if moving the pinned piece creates a bigger threat. In this famous trap White thinks the f6 knight is pinned… but Black ignores the "pin" and wins.</li>
            </ul>`,
          fen: after('d4 d5 c4 e6 Nc3 Nf6 Bg5 Nbd7 cxd5 exd5'),
          moves: mv('Nxd5 Nxd5 Bxd8 Bb4+ Qd2 Bxd2+ Kxd2 Kxd8', ['White grabs a pawn, counting on the pin.', 'Black takes anyway!', 'White wins the queen…', '…but this check comes first.', 'Forced.', '', '', 'Black has won a piece: two minor pieces for the queen, plus a knight up.']),
        },
      ],
      exercises: [
        { id: '3.3-1', type: 'move', rating: 850, prompt: 'The knight is pinned. Attack it!', fen: '4k3/ppp2ppp/2n5/1B6/3P4/8/PPP2PPP/4K3 w - - 0 1', solution: ['d5'] },
        { id: '3.3-2', type: 'move', rating: 900, prompt: 'Pin the queen to the king.', fen: '4k3/pp3ppp/8/4q3/8/8/PP3PPP/1N1R1K2 w - - 0 1', solution: ['Re1'], explain: 'The queen can\'t leave the e-file. If …Qxe1+ Kxe1, White has won the queen for a rook.' },
        { id: '3.3-3', type: 'choice', rating: 700, prompt: 'Black to move. Which move breaks the pin on the f6 knight?', fen: after('d4 d5 c4 e6 Nc3 Nf6 Bg5'), options: ['…Be7', '…a6', '…g6'], answer: 0, explain: '…Be7 puts a piece between the knight and the queen.' },
        { id: '3.3-4', type: 'move', rating: 1100, prompt: 'Black to move. White just played Nxd5, thinking your f6 knight is pinned. Is it?', fen: after('d4 d5 c4 e6 Nc3 Nf6 Bg5 Nbd7 cxd5 exd5 Nxd5'), solution: ['Nxd5'], hint: 'If White takes your queen, do you have a check?', explain: 'After 7.Bxd8 Bb4+ 8.Qd2 Bxd2+ 9.Kxd2 Kxd8 Black is a piece up. This is the Elephant Trap.' },
        { id: '3.3-5', type: 'move', rating: 1200, prompt: 'Your f3 knight is pinned — but only to the queen. Ignore the pin!', fen: after('e4 e5 Nf3 d6 Bc4 Bg4 Nc3 g6'), solution: ['Nxe5'], explain: 'If 5…Bxd1?? 6.Bxf7+ Ke7 7.Nd5# (Légal\'s Mate). If 5…dxe5 6.Qxg4 and White has won a pawn.' },
      ],
      keyPoints: ['Absolute pin: against the king — the piece can\'t move.', 'Relative pin: against another piece — moving it costs material.', 'Attack pinned pieces, especially with pawns. Break pins by blocking, stepping aside, or kicking the pinner.'],
    },

    {
      id: '3.4',
      title: 'The Skewer',
      blurb: 'Attack a valuable piece and win the one behind it.',
      motif: 'Two enemy pieces on a line, the more valuable (often the king) in front.',
      learn: [
        {
          title: 'Skewering the king',
          text: `<p>A <b>skewer</b> attacks a valuable piece that has to move, exposing a piece behind it on the same line.</p>
            <p>The most common: check the king, and when it steps aside, take the queen or rook behind it.</p>`,
          fen: '7q/8/8/7k/8/P7/K7/4R3 w - - 0 1',
          moves: mv('Rh1+ Kg6 Rxh8', ['The rook checks along the h-file.', 'The king must leave the file…', '…and the queen behind it is lost.'], [['h1h8:red'], [], []]),
        },
        {
          title: 'Pin or skewer?',
          text: `<p>Both use a line through two enemy pieces. The difference is the order:</p>
            <ul>
              <li><b>Pin</b>: the <i>less</i> valuable piece is in front. It stays stuck.</li>
              <li><b>Skewer</b>: the <i>more</i> valuable piece is in front. It must move, and the one behind falls.</li>
            </ul>
            <p>Here <code>Ba4+</code> skewers the king to the rook on e8.</p>`,
          fen: '4r3/6pp/2k5/8/8/8/5PPP/3B2K1 w - - 0 1',
          shapes: ['d1a4', 'a4e8:red'],
        },
      ],
      exercises: [
        { id: '3.4-1', type: 'move', rating: 800, prompt: 'Win the queen with a skewer.', fen: '7q/8/8/7k/8/P7/K7/4R3 w - - 0 1', solution: ['Rh1+', 'Kg6', 'Rxh8'] },
        { id: '3.4-2', type: 'move', rating: 900, prompt: 'Skewer the king to the rook.', fen: '4r3/6pp/2k5/8/8/8/5PPP/3B2K1 w - - 0 1', solution: ['Ba4+'] },
        { id: '3.4-3', type: 'move', rating: 950, prompt: 'Find the queen skewer.', fen: '8/8/2k5/8/8/K7/4Q3/7r w - - 0 1', solution: ['Qe4+'], alts: { 0: ['Qf3+', 'Qg2+'] }, explain: 'Any check along the long diagonal skewers the king to the rook on h1.' },
        { id: '3.4-4', type: 'choice', rating: 700, prompt: 'In <code>Ba4+</code> from the lesson, the king is in front of the rook. What is this?', fen: '4r3/6pp/2k5/8/B7/8/5PPP/6K1 b - - 0 1', options: ['A pin', 'A skewer', 'A fork'], answer: 1 },
      ],
      keyPoints: ['Skewer = more valuable piece in front; pin = less valuable in front.', 'Look for the enemy king and queen/rook on the same line.'],
    },

    {
      id: '3.5',
      title: 'Discovered Attacks',
      blurb: 'Move one piece to unleash another.',
      motif: 'Your piece stands in front of your own queen, rook or bishop, aimed at an enemy target.',
      learn: [
        {
          title: 'Discovered attack',
          text: `<p>When a piece moves off a line, the piece behind it suddenly attacks along that line: a <b>discovered attack</b>. Two threats at once — the moving piece's and the unmasked piece's.</p>
            <p>The knight moves with check, uncovering the bishop's attack on h8.</p>`,
          fen: '1k5r/pp6/8/8/3N4/8/1B3PPP/6K1 w - - 0 1',
          moves: mv('Nc6+ Kc7 Bxh8', ['Check from the knight, and the bishop now attacks h8.', '', 'The rook is gone.'], [['c6b8:red', 'b2h8:red'], [], []]),
        },
        {
          title: 'Discovered check',
          text: `<p>If the unmasked piece gives <b>check</b>, the moving piece can go almost anywhere — even capture something protected — because the opponent must deal with the check first.</p>
            <p>A famous trap in the Petroff Defence: Black plays …Nf6?? and White unleashes the queen on the e-file.</p>`,
          fen: after('e4 e5 Nf3 Nf6 Nxe5 Nxe4 Qe2 Nf6'),
          moves: mv('Nc6+ Qe7 Nxe7', ['Discovered check — and the knight attacks the queen.', 'Black has to block.', 'The queen is lost.'], [['e2e8:red', 'c6d8:red'], [], []]),
        },
        {
          title: 'Double check',
          text: `<p>When <b>both</b> pieces give check, it's a <b>double check</b>. You can't block two checks or capture two pieces at once, so the king <b>must move</b>. If it has nowhere to go, it's mate.</p>`,
          fen: '3qkb1r/pppp1ppp/8/8/4N3/8/PPPP1PPP/4R1K1 w - - 0 1',
          moves: mv('Nf6#', ['Double check from knight and rook — and mate!'], [['f6e8:red', 'e1e8:red']]),
        },
      ],
      exercises: [
        { id: '3.5-1', type: 'move', rating: 900, prompt: 'Find the discovered attack.', fen: '1k5r/pp6/8/8/3N4/8/1B3PPP/6K1 w - - 0 1', solution: ['Nc6+'] },
        { id: '3.5-2', type: 'move', rating: 1000, prompt: 'Black has just played …Nf6?? Punish it.', fen: after('e4 e5 Nf3 Nf6 Nxe5 Nxe4 Qe2 Nf6'), solution: ['Nc6+'] },
        { id: '3.5-3', type: 'move', rating: 1000, prompt: 'Use a discovered check to win the queen.', fen: '3qk3/pp3ppp/8/4N3/8/8/PP3PPP/4R1K1 w - - 0 1', solution: ['Nc6+'], explain: 'The rook checks, and the knight on c6 attacks the queen.' },
        { id: '3.5-4', type: 'move', rating: 900, prompt: 'Mate in one with a double check.', fen: '3qkb1r/pppp1ppp/8/8/4N3/8/PPPP1PPP/4R1K1 w - - 0 1', solution: ['Nf6#'], alts: { 0: ['Nd6#'] }, mate: true },
      ],
      keyPoints: ['Line up a long-range piece behind one of your own pieces, aimed at a target.', 'Discovered check lets the moving piece grab anything.', 'Double check: the king must move.'],
    },

    {
      id: '3.6',
      title: 'Removing the Defender',
      blurb: 'Capture, deflect or overload the piece that holds things together.',
      motif: 'One enemy piece is the only defender of something important.',
      learn: [
        {
          title: 'Capturing the defender',
          text: `<p>If a target is defended by only one piece, <b>remove that piece</b> and the target falls.</p>
            <p>The f6 knight is the only defender of h7. <code>Bxf6</code> removes it, and White threatens <code>Qh7#</code>.</p>`,
          fen: 'r2q1rk1/ppp2pp1/5n2/6BQ/8/3B4/PPP2PPP/R5K1 w - - 0 1',
          shapes: ['g5f6', 'h5h7:red', 'd3h7:blue'],
        },
        {
          title: 'Deflection',
          text: `<p><b>Deflection</b> forces a defender to leave its post, usually with a sacrifice it must take.</p>
            <p>The a8 rook guards the back rank. <code>Qxe8+!</code> drags it away from its post: after …Rxe8, Rxe8 is mate.</p>`,
          fen: 'r3r1k1/5ppp/8/8/8/8/4QPPP/4R1K1 w - - 0 1',
          moves: mv('Qxe8+ Rxe8 Rxe8#', ['The queen sacrifices itself on e8.', 'The a8 rook is forced to leave the back rank…', '…and the back rank is undefended. Mate.']),
        },
        {
          title: 'Overloading',
          text: `<p>An <b>overloaded</b> piece has too many jobs. Make it do one, and it can't do the other.</p>
            <p>Black's rook on d8 must defend the knight <i>and</i> the back rank. <code>Qxd4!</code> — if the rook recaptures, <code>Re8</code> is mate.</p>`,
          fen: '3r2k1/5ppp/8/8/3n4/8/1Q3PPP/4R1K1 w - - 0 1',
          shapes: ['b2d4', 'e1e8:red'],
        },
      ],
      exercises: [
        { id: '3.6-1', type: 'move', rating: 1100, prompt: 'Remove the defender of h7.', fen: 'r2q1rk1/ppp2pp1/5n2/6BQ/8/3B4/PPP2PPP/R5K1 w - - 0 1', solution: ['Bxf6'] },
        { id: '3.6-2', type: 'move', rating: 1200, prompt: 'Deflect the back-rank defender. Mate in two.', fen: 'r3r1k1/5ppp/8/8/8/8/4QPPP/4R1K1 w - - 0 1', solution: ['Qxe8+', 'Rxe8', 'Rxe8#'], mate: true },
        { id: '3.6-3', type: 'move', rating: 1150, prompt: 'Black\'s rook has two jobs. Exploit it.', fen: '3r2k1/5ppp/8/8/3n4/8/1Q3PPP/4R1K1 w - - 0 1', solution: ['Qxd4'], explain: 'If 1…Rxd4 2.Re8#. Otherwise White is simply a knight up.' },
      ],
      keyPoints: ['Find the defender, then capture, deflect or overload it.', 'Back-rank defenders are frequent victims.'],
    },

    {
      id: '3.7',
      title: 'Decoy and Attraction',
      blurb: 'Lure a piece — often the king — onto a fatal square.',
      motif: 'A square where, if the enemy king or queen stood there, you\'d have a fork or mate.',
      learn: [
        {
          title: 'Luring the king',
          text: `<p>A <b>decoy</b> (or <b>attraction</b>) sacrifice forces an enemy piece onto a particular square — where it can be forked, skewered or mated.</p>
            <p>The rook sacrifice drags the king to h8, a knight's jump from f7… and the queen on d8.</p>`,
          fen: '3q2k1/pp3pp1/8/6N1/8/8/PPP5/1K2R2R w - - 0 1',
          moves: mv('Rh8+ Kxh8 Nxf7+ Kg8 Nxd8', ['Decoy: the king must take.', '', 'Fork!', '', 'White has won the queen for a rook.'], [['h1h8'], [], ['f7h8:red', 'f7d8:red'], [], []]),
        },
        {
          title: 'Sacrifices that lead to mate',
          text: `<p>Decoys are the heart of many mating attacks. You'll meet them again in Part 4: <code>Qg8+!</code> in the smothered mate and <code>Qxh7+!</code> in Anastasia's mate both drag the king or a defender onto a fatal square.</p>`,
          fen: '4r2k/6pp/8/q5N1/2Q5/8/5PPP/6K1 w - - 0 1',
          shapes: ['c4g8', 'g5f7'],
        },
      ],
      exercises: [
        { id: '3.7-1', type: 'move', rating: 1300, prompt: 'Lure the king onto a forking square.', fen: '3q2k1/pp3pp1/8/6N1/8/8/PPP5/1K2R2R w - - 0 1', solution: ['Rh8+', 'Kxh8', 'Nxf7+'] },
        { id: '3.7-2', type: 'move', rating: 1250, prompt: 'Back-rank decoy: mate in two.', fen: '2r3k1/2q2ppp/8/8/8/8/4RPPP/4R1K1 w - - 0 1', solution: ['Re8+', 'Rxe8', 'Rxe8#'], mate: true },
      ],
      keyPoints: ['Ask "where would I like their king (or queen) to be?" — then force it there.'],
    },

    {
      id: '3.8',
      title: 'Interference and Clearance',
      blurb: 'Block enemy lines; clear your own.',
      motif: 'An enemy defender working along a line you can cut; or your own piece in the way of a deadly move.',
      learn: [
        {
          title: 'Interference',
          text: `<p><b>Interference</b> places a piece on a line between an enemy defender and what it defends.</p>
            <p>The black rook on a8 guards d8, stopping the pawn. <code>Rc8+!</code> cuts the line: if …Rxc8, the pawn captures and promotes with mate.</p>`,
          fen: 'r5k1/3P1ppp/8/8/8/8/5PPP/2R3K1 w - - 0 1',
          moves: mv('Rc8+ Rxc8 dxc8=Q#', ['The rook blocks the a8 rook\'s view of d8 — with check.', '', 'Promotion with mate.']),
        },
        {
          title: 'Clearance',
          text: `<p><b>Clearance</b> moves one of your own pieces out of the way — ideally with a threat — so another piece can use the square or line.</p>
            <p>The knight on e4 blocks the queen's diagonal to h7. <code>Nf6+!</code> clears it with check.</p>`,
          fen: '5rk1/5ppp/8/8/4N3/3Q3R/5PPP/6K1 w - - 0 1',
          moves: mv('Nf6+ gxf6 Qxh7#', ['Clearing the diagonal with check.', '', 'Queen and rook mate on h7.'], [['d3h7:red'], [], []]),
        },
      ],
      exercises: [
        { id: '3.8-1', type: 'move', rating: 1200, prompt: 'Interfere and promote.', fen: 'r5k1/3P1ppp/8/8/8/8/5PPP/2R3K1 w - - 0 1', solution: ['Rc8+', 'Rxc8', 'dxc8=Q#'], mate: true },
        { id: '3.8-2', type: 'move', rating: 1300, prompt: 'Clear the way for your queen. Mate in two.', fen: '5rk1/5ppp/8/8/4N3/3Q3R/5PPP/6K1 w - - 0 1', solution: ['Nf6+', 'gxf6', 'Qxh7#'], mate: true },
        { id: '3.8-3', type: 'move', rating: 1400, prompt: 'Your bishop is in the queen\'s way on the h-file. Clear it — and threaten mate.', fen: '3q1rk1/5p2/5PpB/8/8/8/PP6/1K5Q w - - 0 1', solution: ['Bg7'], explain: 'Bg7 clears the h-file and guards h8: Qh8# is coming, and Black has no good defence.' },
      ],
      keyPoints: ['Interference: block a defender\'s line.', 'Clearance: move your own piece out of the way, ideally with tempo.'],
    },

    {
      id: '3.9',
      title: 'Zwischenzug (In-between Move)',
      blurb: 'Insert a forcing move before the expected recapture.',
      motif: 'Before recapturing, ask: do I have a check or bigger threat first?',
      learn: [
        {
          title: 'The in-between move',
          text: `<p>A <b>zwischenzug</b> (German: "in-between move") is a forcing move — usually a check or a big threat — played <i>instead of</i> the obvious recapture. The opponent must answer it, and you recapture afterwards in a better version.</p>
            <p>In this Queen's Gambit trap, White has just taken Black's queen. The obvious reply is …Kxd8 — but first Black plays a check!</p>`,
          fen: after('d4 d5 c4 e6 Nc3 Nf6 Bg5 Nbd7 cxd5 exd5 Nxd5 Nxd5 Bxd8'),
          moves: mv('Bb4+ Qd2 Bxd2+ Kxd2 Kxd8', ['The in-between check.', 'White must block with the queen.', 'Now Black takes the queen…', '', '…and only then recaptures. Black is a piece up.']),
        },
      ],
      exercises: [
        { id: '3.9-1', type: 'move', rating: 1300, prompt: 'Black to move. White has just taken your queen. Don\'t recapture yet!', fen: after('d4 d5 c4 e6 Nc3 Nf6 Bg5 Nbd7 cxd5 exd5 Nxd5 Nxd5 Bxd8'), solution: ['Bb4+', 'Qd2', 'Bxd2+', 'Kxd2', 'Kxd8'] },
        { id: '3.9-2', type: 'choice', rating: 900, prompt: 'Your opponent captures one of your pieces. Before recapturing, what should you check first?', options: ['Whether you have a check or a bigger threat', 'Whether the recapture is with a pawn', 'Nothing — always recapture immediately'], answer: 0, explain: 'Recapturing is usually right, but a quick look for checks and threats first can win much more.' },
      ],
      keyPoints: ['Before an "automatic" recapture, look for checks and bigger threats.'],
    },

    {
      id: '3.10',
      title: 'Trapped Pieces',
      blurb: 'Trapping bishops, knights and queens — and not getting trapped.',
      motif: 'An enemy piece with few or no safe squares.',
      learn: [
        {
          title: 'Trapping a bishop',
          text: `<p>A piece is <b>trapped</b> when every square it can move to is unsafe. Then you can attack it at leisure.</p>
            <p>A classic: the bishop grabs the a7 pawn and gets shut in by …b6. It can't escape via b8 (the rook covers it) or b6 (defended by c7).</p>`,
          fen: '3rk3/Bpp2ppp/8/8/8/7P/5PP1/6K1 b - - 0 1',
          moves: mv('b6 Kf1 Ra8', ['The trap closes.', '', 'And the bishop is lost.']),
        },
        {
          title: 'Noah\'s Ark',
          text: `<p>In the Ruy Lopez, Black's queenside pawns can trap White's bishop on b3: …c5 and …c4. It's called the <b>Noah's Ark trap</b> because it's so old.</p>`,
          fen: after('e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 d4 b5 Bb3 Nxd4 Nxd4 exd4 Qxd4'),
          moves: mv('c5 Qd5 Be6 Qc6+ Bd7 Qd5 c4', ['Hitting the queen.', '', 'And again.', '', '', '', 'The bishop on b3 is trapped.']),
        },
        {
          title: 'Don\'t get trapped yourself',
          text: `<ul>
              <li>Before grabbing a pawn on the edge (a7, h7, b2), ask: <b>how does my piece get back?</b></li>
              <li>Knights on the rim and bishops behind enemy pawn chains are most at risk.</li>
              <li>A queen that wanders deep into enemy territory early can be surrounded.</li>
            </ul>`,
          fen: '3rk3/Bpp2ppp/8/8/8/7P/5PP1/6K1 b - - 0 1',
          shapes: ['a7b8:red', 'a7b6:red'],
        },
      ],
      exercises: [
        { id: '3.10-1', type: 'move', rating: 1000, prompt: 'Black to move. White\'s bishop has grabbed a pawn. Trap it.', fen: '3rk3/Bpp2ppp/8/8/8/7P/5PP1/6K1 b - - 0 1', solution: ['b6'] },
        { id: '3.10-2', type: 'move', rating: 1200, prompt: 'Black to move. Begin the Noah\'s Ark trap.', fen: after('e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 d4 b5 Bb3 Nxd4 Nxd4 exd4 Qxd4'), solution: ['c5'], explain: '…c5 and …c4 trap the bishop on b3.' },
        { id: '3.10-3', type: 'choice', rating: 800, prompt: 'White is thinking about playing <code>Bxa7</code>. What should White check first?', fen: '3rk3/ppp2ppp/8/8/8/4B2P/5PP1/6K1 w - - 0 1', options: ['Whether the bishop can get back out after …b6', 'Whether the pawn on a7 is defended', 'Nothing — a free pawn is a free pawn'], answer: 0, explain: 'After Bxa7 b6 the bishop is trapped: b8 is covered by the rook and b6 by the c7 pawn.' },
      ],
      keyPoints: ['Count the escape squares of pieces on the edge.', 'Trap first, win later — a trapped piece won\'t run away.'],
    },
  ],
};
