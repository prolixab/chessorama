// User progress: saved to the local server (data/progress.json) with a localStorage copy as backup.

const LS_KEY = 'chessy.progress.v1';
const START_RATING = 1000;

function blank() {
  return {
    version: 1,
    created: Date.now(),
    level: null,
    exercises: {},
    chapters: {},
    lastLesson: null,
    rating: START_RATING,
    ratingHistory: [],
    activity: [],
    games: [],
    mistakes: [],
  };
}

let state = blank();
let saveTimer = null;
let serverOk = true;
const listeners = new Set();

export async function loadProgress() {
  let fromServer = null;
  try {
    const res = await fetch('api/progress', { cache: 'no-store' });
    if (res.ok) fromServer = await res.json();
    else serverOk = false;
  } catch {
    serverOk = false;
  }
  let fromLocal = null;
  try { fromLocal = JSON.parse(localStorage.getItem(LS_KEY)); } catch { /* storage unavailable */ }
  // Prefer whichever copy was saved most recently.
  const pick = [fromServer, fromLocal].filter(Boolean).sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0))[0];
  state = Object.assign(blank(), pick || {});
  return state;
}

export function progress() { return state; }

export function onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }

export function save() {
  state.savedAt = Date.now();
  try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch { /* storage unavailable */ }
  for (const fn of listeners) fn(state);
  clearTimeout(saveTimer);
  saveTimer = setTimeout(flush, 400);
}

async function flush() {
  if (!serverOk) return;
  try {
    await fetch('api/progress', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(state) });
  } catch {
    serverOk = false;
  }
}

export function storageStatus() {
  return serverOk ? 'Saved to data/progress.json' : 'Saved in this browser only (server not reachable)';
}

function today() { return new Date().toISOString().slice(0, 10); }

// Records the outcome of one attempt at an exercise.
// clean = solved with no wrong moves and no hints. Returns the rating change.
export function recordAttempt(ex, { solved, clean }) {
  const rec = state.exercises[ex.id] ??= { attempts: 0, solved: false, firstTry: null };
  const isFirst = rec.attempts === 0;
  rec.attempts++;
  rec.lastAt = Date.now();
  rec.lastClean = clean;
  if (isFirst) rec.firstTry = clean;
  if (solved && !rec.solved) { rec.solved = true; rec.solvedAt = Date.now(); }
  // Puzzles solved cleanly drop out of the review queue; a mistake puts them back in.
  rec.review = !clean;

  let delta = 0;
  if (ex.rating) {
    const expected = 1 / (1 + 10 ** ((ex.rating - state.rating) / 400));
    const k = isFirst ? 32 : 8;
    delta = Math.round(k * ((clean ? 1 : 0) - expected));
    state.rating = Math.max(100, state.rating + delta);
    state.ratingHistory.push({ t: Date.now(), r: state.rating });
  }
  state.activity.push({ t: Date.now(), d: today(), ex: ex.id, ok: clean });
  save();
  return delta;
}

export function markLearnSeen(chapterId) {
  const ch = state.chapters[chapterId] ??= {};
  ch.started ??= Date.now();
  ch.learnSeen = true;
  save();
}

export function setLastLesson(chapterId, step) {
  state.lastLesson = { chapterId, step, t: Date.now() };
  const ch = state.chapters[chapterId] ??= {};
  ch.started ??= Date.now();
  save();
}

export function completeChapter(chapterId, score) {
  const ch = state.chapters[chapterId] ??= {};
  ch.completedAt ??= Date.now();
  ch.bestScore = Math.max(ch.bestScore ?? 0, score);
  save();
}

export function setLevel(level) { state.level = level; save(); }

export function chapterStats(chapter) {
  const exs = chapter.exercises || [];
  const solved = exs.filter(e => state.exercises[e.id]?.solved).length;
  const ch = state.chapters[chapter.id] || {};
  const total = exs.length;
  // Chapters with no exercises count as done once read.
  const pct = total ? solved / total : (ch.learnSeen ? 1 : 0);
  return { solved, total, pct, completed: !!ch.completedAt || (total === 0 && ch.learnSeen), started: !!ch.started };
}

export function streakDays() {
  const days = new Set(state.activity.map(a => a.d));
  let n = 0;
  const d = new Date();
  // A streak survives until the end of today even if nothing has been done yet today.
  if (!days.has(d.toISOString().slice(0, 10))) d.setDate(d.getDate() - 1);
  while (days.has(d.toISOString().slice(0, 10))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

export function addGame(game) {
  state.games.unshift(game);
  save();
}

export function updateGame(id, patch) {
  const g = state.games.find(g => g.id === id);
  if (g) { Object.assign(g, patch); save(); }
  return g;
}

export function deleteGame(id) {
  state.games = state.games.filter(g => g.id !== id);
  state.mistakes = state.mistakes.filter(m => m.gameId !== id);
  save();
}

export function addMistake(m) {
  state.mistakes.unshift({ id: crypto.randomUUID(), date: Date.now(), ...m });
  save();
}

export function removeMistake(id) {
  state.mistakes = state.mistakes.filter(m => m.id !== id);
  save();
}

export function exportProgress() {
  return JSON.stringify(state, null, 2);
}

export function importProgress(json) {
  const data = JSON.parse(json);
  if (!data || typeof data !== 'object' || !data.exercises) throw new Error('This does not look like a Chessy progress file.');
  state = Object.assign(blank(), data);
  save();
}

export function resetProgress() {
  state = blank();
  save();
}
