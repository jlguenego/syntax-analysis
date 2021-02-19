import {Word, dollarWord, epsilonWord} from '../Word';
import {ContextFreeGrammar} from '../ContextFreeGrammar';
import {NonTerminal} from '../NonTerminal';
import {SententialForm} from '../SententialForm';
import {firstkStar} from './firstk';
import {Sets} from '@jlguenego/set';

const initFollowkCache = (cfg: ContextFreeGrammar, k: number): void => {
  const map = new Map<NonTerminal, Set<Word>>();
  cfg.followCacheSet.set(k, map);
  for (const nt of cfg.productionMap.keys()) {
    map.set(nt, new Set<Word>());
  }

  // add $ to S
  map.set(
    cfg.startSymbol,
    new Set<Word>([dollarWord])
  );
};

const getFollowkCache = (
  cfg: ContextFreeGrammar,
  k: number
): Map<NonTerminal, Set<Word>> => {
  return cfg.followCacheSet.get(k) as Map<NonTerminal, Set<Word>>;
};

const getFollowkCacheSize = (cfg: ContextFreeGrammar, k: number): number => {
  return [...getFollowkCache(cfg, k).values()]
    .map(a => a.size)
    .reduce((acc, n) => acc + n);
};

const getFollowkCacheNt = (
  cfg: ContextFreeGrammar,
  k: number,
  nt: NonTerminal
) => {
  return getFollowkCache(cfg, k).get(nt) as Set<Word>;
};

export const buildFollowk = (cfg: ContextFreeGrammar, k: number): void => {
  if (cfg.followCacheSet.get(k) !== undefined) {
    return;
  }
  initFollowkCache(cfg, k);

  let previousSize = -1;
  let size = getFollowkCacheSize(cfg, k);
  while (size > previousSize) {
    for (const a of cfg.productionMap.keys()) {
      for (const prod of cfg.productions) {
        const b = prod.LHS;
        const rhs = prod.RHS;
        const followA = getFollowkCacheNt(cfg, k, a);

        for (const indexA of rhs.getNonTerminalIndexList(a)) {
          const omega = new SententialForm(rhs.symbols.slice(indexA + 1));
          const firstStarOmega = firstkStar(cfg, k, omega);
          Sets.absorb(followA, firstStarOmega);
          followA.delete(epsilonWord);
          if (firstStarOmega.has(epsilonWord)) {
            const followB = getFollowkCacheNt(cfg, k, b);
            Sets.absorb(followA, followB);
          }
        }
      }
    }
    previousSize = size;
    size = getFollowkCacheSize(cfg, k);
  }
};

export const followk = (
  cfg: ContextFreeGrammar,
  k: number,
  nt: NonTerminal
): Set<Word> => cfg.followCacheSet.get(k)?.get(nt) as Set<Word>;
