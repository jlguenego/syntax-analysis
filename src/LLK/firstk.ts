import {newTWord, TWord} from './../interfaces/TWord';
import {SententialForm} from '../SententialForm';
import {NonTerminal} from '../NonTerminal';
import {ParseSymbol} from '../interfaces/ParseSymbol';
import {ContextFreeGrammar} from '../ContextFreeGrammar';
import {concatk} from './concatk';
import {Sets} from '@jlguenego/set';
import {emptyWord} from '@jlguenego/language';

// See algorithm in book Aho Ullman (Theory of Parsing, Translation, and Compiling) Volume 1.
// https://dl.acm.org/doi/pdf/10.5555/578789
// Chapter 5.1, page 357 and 358.

const initFirstkCache = (cfg: ContextFreeGrammar, k: number): void => {
  const map = new Map<NonTerminal, Set<TWord>>();
  cfg.firstCacheSet.set(k, map);
  for (const nt of cfg.productionMap.keys()) {
    map.set(nt, new Set<TWord>());
  }
};

const getFirstkCache = (
  cfg: ContextFreeGrammar,
  k: number
): Map<NonTerminal, Set<TWord>> => {
  return cfg.firstCacheSet.get(k) as Map<NonTerminal, Set<TWord>>;
};

const getFirstkCacheSize = (cfg: ContextFreeGrammar, k: number): number => {
  return [...getFirstkCache(cfg, k).values()]
    .map(a => a.size)
    .reduce((acc, n) => acc + n);
};

const fi = (cfg: ContextFreeGrammar, k: number, s: ParseSymbol) => {
  if (s instanceof NonTerminal) {
    // Aho Ullman: (2) Fi-1(A)={...}
    return getFirstkCache(cfg, k).get(s) as Set<TWord>;
  }
  // Aho Ullman: (1) Fi(a)={a}
  return new Set([newTWord([s])]);
};

const f0 = (
  cfg: ContextFreeGrammar,
  k: number,
  nt: NonTerminal
): Set<TWord> => {
  const rhsArray = cfg.getProdRHSArray(nt);
  const result = new Set<TWord>();
  for (const rhs of rhsArray) {
    if (rhs.isEmpty()) {
      result.add(emptyWord);
      continue;
    }
    // Aho Ullman {x ∊ Σ*k | A -> xα is in P, where |x|=k or |x|<k with α=ε}
    const x = rhs.getLeftClosedPortion().slice(0, k);
    if (x.length < k && x.length < rhs.getLength()) {
      continue;
    }
    result.add(newTWord(x));
  }

  return result;
};

export const buildFirstk = (cfg: ContextFreeGrammar, k: number): void => {
  if (cfg.firstCacheSet.get(k) !== undefined) {
    return;
  }
  initFirstkCache(cfg, k);
  let previousSize = -1; // 0
  // first round : F0(A)
  for (const [nt, firstkNt] of getFirstkCache(cfg, k)) {
    Sets.absorb(firstkNt, f0(cfg, k, nt));
  }
  let size = getFirstkCacheSize(cfg, k);
  // other rounds: Fi(A) until the sets stop growing.
  // Aho Ullman: (4)
  while (size > previousSize) {
    for (const [nt, firstkNt] of getFirstkCache(cfg, k)) {
      const rhsArray = cfg.getProdRHSArray(nt);
      for (const rhs of rhsArray) {
        if (rhs.isEmpty()) {
          firstkNt.add(emptyWord);
          continue;
        }
        // Aho Ullman: (3) Fi-1(Yp) A=Y1Y2...YN
        const fis = rhs.symbols.map(s => fi(cfg, k, s));
        // Aho Ullman: Operator ⊕k on Fi-1(Yp)
        const set = concatk(k, ...fis);
        Sets.absorb(firstkNt, set);
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
): Set<TWord> => {
  if (form.isEmpty()) {
    return new Set([emptyWord]);
  }
  const fis = form.symbols.map(s => fi(cfg, k, s));
  const set = concatk(k, ...fis);
  return set;
};

export const firstkStarSet = (
  cfg: ContextFreeGrammar,
  k: number,
  formSet: Set<SententialForm>
): Set<TWord> => {
  const set = new Set<TWord>();
  for (const form of formSet) {
    const subset = firstkStar(cfg, k, form);
    Sets.absorb(set, subset);
  }
  return set;
};
