import {ContextFreeGrammar} from '../../ContextFreeGrammar';
import {firstStar} from './first';
import {Terminal} from '../../interfaces/Terminal';
import {NonTerminal} from '../../NonTerminal';
import {SententialForm} from '../../SententialForm';
import {dollar} from '../../terminals/dollar.terminal';
import {epsilon} from '../../terminals/epsilon.terminal';
import {absorbSet} from '../../utils/set';

const initFollowCache = (cfg: ContextFreeGrammar): void => {
  for (const nt of cfg.productionMap.keys()) {
    cfg.followCache.set(nt, new Set<Terminal>());
  }
  // add $ to S
  cfg.followCache.set(
    cfg.startSymbol,
    new Set<Terminal>([dollar])
  );
};

const getFollowCacheSize = (cfg: ContextFreeGrammar): number => {
  return [...cfg.followCache.values()]
    .map(a => a.size)
    .reduce((acc, n) => acc + n);
};

const getFollowCache = (cfg: ContextFreeGrammar, nt: NonTerminal) => {
  return cfg.followCache.get(nt) as Set<Terminal>;
};

export const buildFollow = (cfg: ContextFreeGrammar): void => {
  initFollowCache(cfg);

  let previousSize = -1;
  let size = getFollowCacheSize(cfg);
  while (size > previousSize) {
    for (const a of cfg.productionMap.keys()) {
      for (const prod of cfg.productions) {
        const b = prod.LHS;
        const rhs = prod.RHS;
        const indexA = rhs.findLeftBorderIndex(a);
        if (indexA === -1) {
          continue;
        }
        const followA = getFollowCache(cfg, a);
        const omega = new SententialForm(rhs.symbols.slice(indexA + 1));
        const firstStarOmega = firstStar(cfg, omega);
        absorbSet(followA, firstStarOmega);
        followA.delete(epsilon);
        if (firstStarOmega.has(epsilon)) {
          const followB = getFollowCache(cfg, b);
          absorbSet(followA, followB);
        }
      }
    }
    previousSize = size;
    size = getFollowCacheSize(cfg);
  }
};
