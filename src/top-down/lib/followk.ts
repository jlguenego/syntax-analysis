import {Word, dollarWord, epsilonWord} from './../../Word';
import {ContextFreeGrammar} from '../../ContextFreeGrammar';
import {NonTerminal} from '../../NonTerminal';
import {SententialForm} from '../../SententialForm';
import {absorbSet} from '../../utils/set';
import {firstkStar} from './firstk';

const initFollowkCache = (cfg: ContextFreeGrammar): void => {
  for (const nt of cfg.productionMap.keys()) {
    cfg.followkCache.set(nt, new Set<Word>());
  }
  // add $ to S
  cfg.followkCache.set(
    cfg.startSymbol,
    new Set<Word>([dollarWord])
  );
};

const getFollowkCacheSize = (cfg: ContextFreeGrammar): number => {
  return [...cfg.followkCache.values()]
    .map(a => a.size)
    .reduce((acc, n) => acc + n);
};

const getFollowkCache = (cfg: ContextFreeGrammar, nt: NonTerminal) => {
  return cfg.followkCache.get(nt) as Set<Word>;
};

export const buildFollowk = (cfg: ContextFreeGrammar): void => {
  initFollowkCache(cfg);

  let previousSize = -1;
  let size = getFollowkCacheSize(cfg);
  while (size > previousSize) {
    for (const a of cfg.productionMap.keys()) {
      for (const prod of cfg.productions) {
        const b = prod.LHS;
        const rhs = prod.RHS;
        const indexA = rhs.findNonTerminalIndex(a);
        if (indexA === -1) {
          continue;
        }
        const followA = getFollowkCache(cfg, a);
        const omega = new SententialForm(rhs.symbols.slice(indexA + 1));
        const firstStarOmega = firstkStar(cfg, omega);
        absorbSet(followA, firstStarOmega);
        followA.delete(epsilonWord);
        if (firstStarOmega.has(epsilonWord)) {
          const followB = getFollowkCache(cfg, b);
          absorbSet(followA, followB);
        }
      }
    }
    previousSize = size;
    size = getFollowkCacheSize(cfg);
  }
};
