// The manual: parts → chapters → learn steps + exercises.
import part1 from './part1.js';
import part2 from './part2.js';
import part3 from './part3.js';
import part4 from './part4.js';
import part5 from './part5.js';
import part6 from './part6.js';
import part7 from './part7.js';
import part8 from './part8.js';

export const PARTS = [part1, part2, part3, part4, part5, part6, part7, part8];

// Study plan by level (Part 8.2).
export const LEVELS_PLAN = [
  { id: 'beginner', name: 'Beginner', range: 'Under 1000', focus: 'Parts 1–3, basic mates, not hanging pieces', parts: [1, 2, 3] },
  { id: 'intermediate', name: 'Intermediate', range: '1000–1500', focus: 'Parts 3–5, opening repertoire, basic endgames', parts: [3, 4, 5, 2, 7] },
  { id: 'club', name: 'Club', range: '1500–1800', focus: 'Parts 5–7, calculation depth, strategic planning', parts: [5, 6, 7] },
  { id: 'advanced', name: 'Advanced', range: '1800+', focus: 'Deep endgames, opening preparation, master game study', parts: [7, 8, 6] },
];

const chapterIndex = new Map();
const exerciseIndex = new Map();
for (const part of PARTS) {
  for (const chapter of part.chapters) {
    chapterIndex.set(chapter.id, { chapter, part });
    for (const ex of chapter.exercises || []) exerciseIndex.set(ex.id, { chapter, part, ex });
  }
}

export const findChapter = id => chapterIndex.get(id);
export const findChapterOfExercise = id => exerciseIndex.get(id);
export const allExercises = () => [...exerciseIndex.values()].map(v => v.ex);

export function nextChapter(id) {
  const ids = [...chapterIndex.keys()];
  const i = ids.indexOf(id);
  return i >= 0 && i < ids.length - 1 ? chapterIndex.get(ids[i + 1]).chapter : null;
}
