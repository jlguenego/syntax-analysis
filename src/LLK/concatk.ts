import {Word} from '../Word';

// Aho Ullman: Operator ⊕k
export const concatk = (k: number, ...sets: Set<Word>[]): Set<Word> => {
  if (sets.length === 0) {
    return new Set<Word>();
  }
  if (sets.length === 1) {
    return sets[0];
  }
  const allButLast = concatk(k, ...sets.slice(0, -1));
  const last = sets[sets.length - 1];
  // now concat the first and the rest
  const result = new Set<Word>();
  for (const w1 of allButLast) {
    for (const w2 of last) {
      const w = w1.concat(w2, k);
      result.add(w);
    }
  }
  return result;
};
