import {SententialForm} from './../../SententialForm';
import {NonTerminal} from './../../NonTerminal';
import {ParseSymbol} from './../../interfaces/ParseSymbol';
import {ContextFreeGrammar} from '../../ContextFreeGrammar';
import {epsilonWord, Word} from '../../Word';
import {absorbSet} from '../../utils/set';

// See algorithm in book Aho Ullman (Theory of Parsing, Translation, and Compiling) Volume 1.
// https://dl.acm.org/doi/pdf/10.5555/578789
// Chapter 5.1, page 357 and 358.

const initFirstkCache = (cfg: ContextFreeGrammar, k: number): void => {
  const map = new Map<NonTerminal, Set<Word>>();
  cfg.firstCacheSet.set(k, map);
  for (const nt of cfg.productionMap.keys()) {
    map.set(nt, new Set<Word>());
  }
};

const getFirstkCache = (
  cfg: ContextFreeGrammar,
  k: number
): Map<NonTerminal, Set<Word>> => {
  return cfg.firstCacheSet.get(k) as Map<NonTerminal, Set<Word>>;
};

const getFirstkCacheSize = (cfg: ContextFreeGrammar, k: number): number => {
  return [...getFirstkCache(cfg, k).values()]
    .map(a => a.size)
    .reduce((acc, n) => acc + n);
};

const fi = (cfg: ContextFreeGrammar, k: number, s: ParseSymbol) => {
  if (s instanceof NonTerminal) {
    // Aho Ullman: (2) Fi-1(A)={...}
    return getFirstkCache(cfg, k).get(s) as Set<Word>;
  }
  // Aho Ullman: (1) Fi(a)={a}
  return new Set([new Word([s])]);
};

// Aho Ullman: Operator ⊕k
const concat = (k: number, ...sets: Set<Word>[]): Set<Word> => {
  if (sets.length === 0) {
    return new Set<Word>();
  }
  if (sets.length === 1) {
    return sets[0];
  }
  const allButLast = concat(k, ...sets.slice(0, -1));
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

export const buildFirstk = (cfg: ContextFreeGrammar, k: number): void => {
  initFirstkCache(cfg, k);
  let previousSize = -1; // 0
  // first round : F0(A)
  for (const [nt, firstkNt] of getFirstkCache(cfg, k)) {
    const rhsArray = cfg.getProdRHSArray(nt);
    for (const rhs of rhsArray) {
      if (rhs.isEmpty()) {
        firstkNt.add(epsilonWord);
        continue;
      }
      const x = rhs.getLeftClosedPortion().slice(0, k);
      if (x.length < k && x.length < rhs.getLength()) {
        continue;
      }
      firstkNt.add(new Word(x));
    }
  }
  let size = getFirstkCacheSize(cfg, k);
  // other rounds: Fi(A) until the sets stop growing.
  // Aho Ullman: (4)
  while (size > previousSize) {
    for (const [nt, firstkNt] of getFirstkCache(cfg, k)) {
      const rhsArray = cfg.getProdRHSArray(nt);
      for (const rhs of rhsArray) {
        if (rhs.isEmpty()) {
          firstkNt.add(epsilonWord);
          continue;
        }
        // Aho Ullman: (3) Fi-1(Yp) A=Y1Y2...YN
        const fis = rhs.symbols.map(s => fi(cfg, k, s));
        // Aho Ullman: Operator ⊕k on Fi-1(Yp)
        const set = concat(k, ...fis);
        absorbSet(firstkNt, set);
      }
    }
    previousSize = size;
    size = getFirstkCacheSize(cfg, k);
  }
};

export const firstkStar = (
  cfg: ContextFreeGrammar,
  k: number,
  form: SententialForm
): Set<Word> => {
  if (form.isEmpty()) {
    return new Set([epsilonWord]);
  }
  const fis = form.symbols.map(s => fi(cfg, k, s));
  const set = concat(k, ...fis);
  return set;
};

export const firstkStarSet = (
  cfg: ContextFreeGrammar,
  k: number,
  formSet: Set<SententialForm>
): Set<Word> => {
  const set = new Set<Word>();
  for (const form of formSet) {
    const subset = firstkStar(cfg, k, form);
    absorbSet(set, subset);
  }
  return set;
};
