import { START } from './helpers.js';

export default {
  id: 8,
  title: 'Training and Improvement',
  blurb: 'Analysing your games, a study plan for your level, resources and tracking progress.',
  chapters: [
    {
      id: '8.1',
      title: 'Analysing Your Own Games',
      blurb: 'Notes first, engine second, then a mistakes log.',
      learn: [
        {
          title: 'Review without an engine first',
          text: `<p>Straight after a game, go through it <b>without an engine</b> and write down what you were thinking at the key moments: what you feared, what you missed, where you think it went wrong.</p>
            <p>This is where you learn the most — the engine can tell you the best move, but only you know <i>why</i> you didn't play it.</p>
            <p>Every game you <a href="#/play">play here</a> is saved. Open it from <a href="#/games">Games</a> and write your notes in step 1 of the review.</p>`,
          fen: START,
        },
        {
          title: 'Then check with an engine — find the turning point',
          text: `<p>Now run the engine (step 2 of the review). It marks your inaccuracies (?!), mistakes (?) and blunders (??) and highlights the <b>turning point</b>: the move where the evaluation swung most against you.</p>
            <ul>
              <li>Compare the engine's verdict with your notes. Did you spot the critical moment yourself?</li>
              <li>For each big mistake, find the engine's move and ask what pattern you missed.</li>
            </ul>`,
          fen: START,
        },
        {
          title: 'Keep a mistakes log',
          text: `<p>Log each significant mistake by <b>category</b>:</p>
            <ul>
              <li><b>Tactic missed</b> — there was a combination for you or your opponent.</li>
              <li><b>Blunder</b> — you simply left something hanging.</li>
              <li><b>Plan</b> — no tactical error, but the wrong strategy.</li>
              <li><b>Time</b> — you rushed, or spent too long early on.</li>
            </ul>
            <p>The log on the <a href="#/progress">Progress</a> page groups them by month, so you can see which category keeps coming back — and which chapter to revisit.</p>`,
          fen: START,
        },
      ],
      exercises: [
        { id: '8.1-1', type: 'choice', rating: 600, prompt: 'You\'ve just finished a game. What should you do first?', options: ['Write down your own thoughts about the critical moments', 'Run the engine straight away', 'Play another game immediately'], answer: 0 },
        { id: '8.1-2', type: 'choice', rating: 700, prompt: 'You left a knight undefended and your opponent took it. Which category is this?', options: ['Blunder', 'Plan', 'Time'], answer: 0 },
      ],
      keyPoints: ['Notes first, engine second.', 'Find the turning point.', 'Log mistakes by category and review them monthly.'],
    },
    {
      id: '8.2',
      title: 'Study Plan by Level',
      blurb: 'What to focus on at each stage.',
      learn: [
        {
          title: 'Study plan',
          text: `<table>
              <tr><th>Level</th><th>Focus</th></tr>
              <tr><td>Beginner (&lt; 1000)</td><td>Parts 1–3, basic mates, not hanging pieces</td></tr>
              <tr><td>Intermediate (1000–1500)</td><td>Parts 3–5, opening repertoire, basic endgames</td></tr>
              <tr><td>Club (1500–1800)</td><td>Parts 5–7, calculation depth, strategic planning</td></tr>
              <tr><td>Advanced (1800+)</td><td>Deep endgames, opening preparation, master game study</td></tr>
            </table>
            <p>Choose your level on the <a href="#/">home page</a> and the matching parts are marked <b>Focus</b>.</p>
            <p><b>Weekly rhythm:</b> 3 sessions of study and puzzles, 2–3 slower games (15+10 or longer), and 1 game-review session.</p>`,
          fen: START,
        },
      ],
      exercises: [],
    },
    {
      id: '8.3',
      title: 'Recommended Resources',
      blurb: 'Books, websites and videos.',
      learn: [
        {
          title: 'Resources',
          text: `<p><b>Books</b></p>
            <ul>
              <li><i>Logical Chess: Move by Move</i> — Irving Chernev. Every move of 33 master games explained.</li>
              <li><i>Chess Tactics for Students</i> — John Bain. Clear, graded tactics by motif.</li>
              <li><i>Silman's Complete Endgame Course</i> — Jeremy Silman. Endgames organised by rating level.</li>
            </ul>
            <p><b>Online</b></p>
            <ul>
              <li>Lichess — free puzzles, studies and engine analysis.</li>
              <li>Chess.com lessons.</li>
            </ul>
            <p><b>Video</b></p>
            <ul><li>GothamChess, Daniel Naroditsky's speedruns, ChessNetwork.</li></ul>`,
          fen: START,
        },
      ],
      exercises: [],
    },
    {
      id: '8.4',
      title: 'Tracking Progress',
      blurb: 'Puzzle rating, game rating and the monthly mistakes review.',
      learn: [
        {
          title: 'What to track',
          text: `<ul>
              <li><b>Puzzle rating over time</b> — every exercise here updates it.</li>
              <li><b>Game rating over time</b> — estimated from your results against each engine level.</li>
              <li><b>Monthly review of the mistakes log</b> — which category keeps coming up?</li>
            </ul>
            <p>All three are on your <a href="#/progress">Progress</a> page, along with your activity and chapter completion. Your progress is saved automatically, and you can download a backup there.</p>`,
          fen: START,
        },
      ],
      exercises: [],
    },
  ],
};
