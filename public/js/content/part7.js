import { mv } from './helpers.js';

const KP_DRAW = '8/8/8/4k3/8/4K3/4P3/8 w - - 0 1';
const SQUARE_YES = '8/8/5k2/1P6/8/8/8/7K b - - 0 1';
const SQUARE_NO = '8/8/6k1/1P6/8/8/8/7K b - - 0 1';
const TRIANGLE = '8/8/2k5/1pP5/1P1K4/8/8/8 w - - 0 1';
const LUCENA = '1K6/1P1k4/8/8/8/8/r7/2R5 w - - 0 1';
const PHILIDOR = '4k3/R7/1r6/3KP3/8/8/8/8 b - - 0 1';
const WRONG_BISHOP = '8/8/8/7k/8/7P/4B3/6K1 b - - 0 1';

export default {
  id: 7,
  title: 'Endgames',
  blurb: 'King and pawn endings, rook endings, minor pieces and queen against pawn — played out against Stockfish.',
  intro: '<p>Most exercises in this part are played against Stockfish at full strength. Know the technique and you\'ll beat it; drift and it will hold the draw.</p>',
  chapters: [
    {
      id: '7.1',
      title: 'King and Pawn Endgames',
      blurb: 'Opposition, the rule of the square, key squares and triangulation.',
      learn: [
        {
          title: 'The opposition',
          text: `<p>Two kings facing each other with one square between them are in <b>opposition</b>. The side that does <i>not</i> have to move "has the opposition" — the other king must give way.</p>
            <p>Here it's Black to move, so White has the opposition. Black must step aside and White's king advances.</p>`,
          fen: '8/8/8/4k3/8/4K3/4P3/8 b - - 0 1',
          moves: mv('Kd5 Kf4 Kd6 Kf5 Ke7 Ke5', ['Black gives way…', '…and White walks forward.', '', '', '', 'White\'s king leads the pawn. This is winning.']),
        },
        {
          title: 'The rule of the square',
          text: `<p>Can the king catch a passed pawn? Draw a square from the pawn to its promotion square. If the defending king can step <b>into</b> the square (on its move), it catches the pawn.</p>
            <p>The pawn on b5 has 3 squares to go: its square is b5–b8–e8–e5. The black king on f6 can step to e6, inside the square — it catches the pawn.</p>`,
          fen: SQUARE_YES,
          shapes: ['b5b8', 'b8e8:blue', 'e8e5:blue', 'e5b5:blue', 'f6e6'],
        },
        {
          title: 'Key squares',
          text: `<p>For a pawn not yet past the 4th rank, the <b>key squares</b> are the three squares two ranks in front of it. If your king reaches any of them, the pawn promotes — wherever the enemy king is.</p>
            <p>For a pawn on e4: d6, e6, f6.</p>`,
          fen: '7k/8/8/8/4P3/8/8/K7 w - - 0 1',
          squares: { d6: 'good', e6: 'good', f6: 'good' },
        },
        {
          title: 'Triangulation',
          text: `<p>Sometimes you need to <b>lose a move</b> to pass the turn to your opponent. A king can do this by walking around a triangle of three squares while the enemy king, cramped by your pawns, can only shuttle between two.</p>
            <p>Here White's king steps e4–d5 via a triangle and puts Black in zugzwang.</p>`,
          fen: TRIANGLE,
          moves: mv('Ke4 Kd7 Kd5 Kc7 c6', ['White walks into the triangle d4–e4–e5/d5.', '', 'Now Black is to move and must give way.', '', 'The pawn advances, and b5 will fall.']),
        },
      ],
      exercises: [
        { id: '7.1-1', type: 'choice', rating: 900, prompt: 'White to move. Is this a win or a draw?', fen: KP_DRAW, options: ['White wins', 'Draw'], answer: 1, explain: 'Black has the opposition. With best play the black king stays in front of the pawn.' },
        { id: '7.1-2', type: 'play', goal: 'promote', maxMoves: 20, rating: 1000, title: 'Use your king', prompt: 'Win with king and pawn. Lead with the king!', fen: '8/8/3k4/8/8/3K4/3P4/8 w - - 0 1', solutionText: 'Kc4/Ke4 to gain ground in front of the pawn, take the opposition, then push.' },
        { id: '7.1-3', type: 'play', goal: 'hold', maxMoves: 15, userColor: 'b', rating: 1000, title: 'Hold the draw', prompt: 'You are Black. Keep your king in front of the pawn and take the opposition.', fen: '4k3/8/8/8/8/8/4P3/4K3 b - - 0 1' },
        { id: '7.1-4', type: 'choice', rating: 800, prompt: 'Black to move. Can the black king catch the pawn?', fen: SQUARE_YES, options: ['Yes', 'No'], answer: 0, explain: 'Ke6 steps into the square b5–b8–e8–e5.' },
        { id: '7.1-5', type: 'choice', rating: 800, prompt: 'Black to move. Can the black king catch the pawn now?', fen: SQUARE_NO, options: ['Yes', 'No'], answer: 1, explain: 'From g6 the king can only reach f6 or f5 — still outside the square.' },
        { id: '7.1-6', type: 'play', goal: 'capture', keepCp: -50, maxMoves: 8, userColor: 'b', rating: 800, title: 'Catch the pawn', prompt: 'You are Black. Step into the square and win the pawn.', fen: SQUARE_YES },
        { id: '7.1-7', type: 'squares', rating: 900, prompt: 'Click the three <b>key squares</b> for the pawn on e4.', fen: '7k/8/8/8/4P3/8/8/K7 w - - 0 1', answer: ['d6', 'e6', 'f6'] },
        { id: '7.1-8', type: 'play', goal: 'promote', maxMoves: 25, rating: 1500, title: 'Triangulation', prompt: 'Win the b5 pawn and promote. You\'ll need to lose a move with your king.', fen: TRIANGLE },
      ],
      keyPoints: ['Opposition: the side not to move wins the standoff.', 'Rule of the square: can the king step into it?', 'Key squares: get your king two ranks in front of the pawn.', 'Triangulation: lose a move to hand over the turn.'],
    },

    {
      id: '7.2',
      title: 'Rook Endgames',
      blurb: 'Lucena (winning), Philidor (drawing), and rooks behind passed pawns.',
      learn: [
        {
          title: 'The Lucena position: building a bridge',
          text: `<p>Your pawn is on the 7th, your king in front of it, the enemy king cut off. To get your king out, <b>build a bridge</b>: bring your rook to the 4th rank so it can block checks.</p>`,
          fen: LUCENA,
          moves: mv('Rd1+ Ke7 Rd4 Rb2 Kc7 Rc2+ Kb6 Rb2+ Kc6 Rc2+ Kb5 Rb2+ Rb4', ['Push the black king one more file away.', '', 'Building the bridge on the 4th rank.', 'Black waits behind the pawn.', 'The king steps out.', 'Checks begin.', '', '', '', '', 'The king walks towards the rook…', '', '…and the bridge blocks the last check. The pawn will promote.']),
        },
        {
          title: 'The Philidor position: the third-rank defence',
          text: `<p>When defending, put your rook on your <b>3rd rank</b> (6th for Black) to stop the enemy king advancing. When the pawn advances to that rank, swing the rook to the back and check from behind — the king has no shelter.</p>`,
          fen: PHILIDOR,
          moves: mv('Rh6 e6 Rh1', ['Stay on the 6th rank, keeping the king out.', 'The pawn advances — now the white king has no cover…', '…so the rook goes to the back and checks from behind. Draw.']),
        },
        {
          title: 'Rooks belong behind passed pawns',
          text: `<p>Tarrasch's rule: rooks belong <b>behind</b> passed pawns — your own and your opponent's. From behind, the rook gets more active as the pawn advances; in front, it gets more passive.</p>`,
          fen: '1r6/5pk1/6p1/P7/8/6P1/5PK1/7R w - - 0 1',
          moves: [{ san: 'Ra1', text: 'Behind the pawn: the rook supports it all the way to a8.', shapes: ['a1a8'] }],
        },
      ],
      exercises: [
        { id: '7.2-1', type: 'play', goal: 'promote', maxMoves: 20, rating: 1500, title: 'Lucena', prompt: 'Build a bridge and promote.', fen: LUCENA, solutionText: 'Rd1+ to push the king away, then Rd4, walk the king out, and block the checks with the rook on b4.' },
        { id: '7.2-2', type: 'play', goal: 'hold', maxMoves: 12, userColor: 'b', rating: 1400, title: 'Philidor', prompt: 'You are Black. Hold the draw with the third-rank defence.', fen: PHILIDOR, solutionText: 'Keep the rook on the 6th rank until the pawn reaches e6, then check from behind.' },
        { id: '7.2-3', type: 'choice', rating: 900, prompt: 'Where does White\'s rook belong?', fen: '1r6/5pk1/6p1/P7/8/6P1/5PK1/7R w - - 0 1', options: ['Behind the pawn (Ra1)', 'In front of the pawn (Rh8–a8)', 'Stay on h1 guarding the king'], answer: 0 },
      ],
      keyPoints: ['Lucena: build a bridge on the 4th rank.', 'Philidor: third rank, then check from behind.', 'Rooks behind passed pawns.'],
    },

    {
      id: '7.3',
      title: 'Minor Piece Endgames',
      blurb: 'Bishop vs knight, the wrong-coloured bishop, bishop + knight mate.',
      learn: [
        {
          title: 'Bishop vs knight',
          text: `<ul>
              <li>The <b>bishop</b> is better in open positions with pawns on <b>both wings</b> — it covers the whole board at once.</li>
              <li>The <b>knight</b> is better in closed positions, with all pawns on one side, or when it has a strong outpost.</li>
            </ul>`,
          fen: '4k3/pp1n1ppp/8/8/8/3B4/PP3PPP/4K3 w - - 0 1',
        },
        {
          title: 'The wrong-coloured bishop',
          text: `<p>With a rook's pawn (a- or h-pawn), if the bishop can't control the promotion square, the defending king just sits in the corner and it's a <b>draw</b> — even with an extra bishop.</p>
            <p>The h8 square is dark; White's bishop is light-squared. Black's king heads for h8 and can't be removed.</p>`,
          fen: WRONG_BISHOP,
          squares: { h8: 'bad' },
        },
        {
          title: 'Bishop + knight checkmate (advanced)',
          text: `<p>Mate with bishop and knight is only possible in a corner of the <b>bishop's colour</b>. The method: drive the king to the edge, then push it along the edge to the right corner, using the "W manoeuvre" of the knight. It can take up to 33 moves — practise it until it's automatic.</p>`,
          fen: '7k/8/5K2/8/8/8/8/2B1N3 w - - 0 1',
        },
      ],
      exercises: [
        { id: '7.3-1', type: 'choice', rating: 900, prompt: 'Which minor piece is better here?', fen: '4k3/pp1n1ppp/8/8/8/3B4/PP3PPP/4K3 w - - 0 1', options: ['White\'s bishop', 'Black\'s knight', 'They\'re equal'], answer: 0, explain: 'Open board, pawns on both wings: the long-range bishop is better.' },
        { id: '7.3-2', type: 'choice', rating: 1000, prompt: 'Black to move. Can White win?', fen: '7k/8/7P/8/8/8/4B3/6K1 b - - 0 1', options: ['Yes — White has an extra bishop and pawn', 'No — it\'s a draw'], answer: 1, explain: 'The light-squared bishop can never drive the king from the dark h8 corner.' },
        { id: '7.3-3', type: 'play', goal: 'hold', maxMoves: 12, userColor: 'b', rating: 1100, title: 'Wrong bishop', prompt: 'You are Black. Get your king to the corner and hold the draw.', fen: WRONG_BISHOP },
        { id: '7.3-4', type: 'play', goal: 'mate', maxMoves: 15, rating: 1700, title: 'Bishop + knight mate', prompt: 'Finish the bishop and knight mate.', fens: ['7k/8/5K2/8/8/8/8/2B1N3 w - - 0 1', 'k7/8/2K5/8/8/8/3N4/5B2 w - - 0 1'] },
      ],
      keyPoints: ['Bishop: open board, both wings. Knight: closed board, outposts.', 'Rook pawn + wrong-coloured bishop = draw.', 'B+N mate only in the bishop\'s corner.'],
    },

    {
      id: '7.4',
      title: 'Queen Endgames',
      blurb: 'Queen against a pawn on the 7th rank.',
      learn: [
        {
          title: 'Queen vs pawn on the 7th',
          text: `<p>Against a centre or knight's pawn, the queen wins: give checks and attacks that force the enemy king <b>in front of its pawn</b>. Each time it blocks, you gain a move to bring your own king closer. Repeat until your king arrives.</p>
            <p>Against a <b>bishop's pawn or rook's pawn</b> it's often a draw: the defending king can go to the corner, and taking the pawn would be stalemate.</p>`,
          fen: '8/8/8/8/8/1K6/3pk3/6Q1 w - - 0 1',
          moves: mv('Qg2+ Ke1 Kc3', ['Check.', 'The king has to stand in front of its pawn.', 'That gives White time to bring the king.']),
        },
      ],
      exercises: [
        { id: '7.4-1', type: 'play', goal: 'capture', keepCp: 300, maxMoves: 15, rating: 1300, title: 'Queen vs d-pawn', prompt: 'Stop the pawn and win it. Force the king in front of the pawn, then bring your king.', fen: '8/8/8/8/8/1K6/3pk3/6Q1 w - - 0 1' },
        { id: '7.4-2', type: 'choice', rating: 1100, prompt: 'Against a pawn on c2 or a2 (supported by its king), why is queen vs pawn often a draw?', options: ['Because of stalemate tricks in the corner', 'Because the queen can\'t give check', 'Because the pawn promotes with check'], answer: 0, explain: 'When the defending king goes to the corner beside its rook\'s pawn (or behind a bishop\'s pawn), capturing the pawn would leave it with no moves.' },
      ],
      keyPoints: ['Force the king in front of the pawn, then bring your king.', 'Rook and bishop pawns on the 7th often draw.'],
    },
  ],
};
