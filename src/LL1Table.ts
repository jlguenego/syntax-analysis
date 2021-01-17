import {ContextFreeGrammar} from './ContextFreeGrammar';
import {firstStar} from './first';
import {Terminal} from './interfaces/Terminal';
import {epsilon} from './terminals/epsilon.terminal';
import {copyWithoutElt} from './utils/set';

const initLL1TableCache = (cfg: ContextFreeGrammar): void => {
  for (const nt of cfg.productionMap.keys()) {
    cfg.ll1TableCache.set(nt, new Map<string, number>());
  }
};

export const buildLL1Table = (cfg: ContextFreeGrammar): void => {
  initLL1TableCache(cfg);
  for (let i = 0; i < cfg.productions.length; i++) {
    const prod = cfg.productions[i];
    const a = prod.LHS;
    const ll1TableA = cfg.ll1TableCache.get(a) as Map<string, number>;
    const fs = firstStar(cfg, prod.RHS);
    const firstStarMinusEpsilon = copyWithoutElt(fs, epsilon);
    for (const t of firstStarMinusEpsilon) {
      if (ll1TableA.get(t.name)) {
        throw new Error(
          `Grammar is not LL1: FIRST/FIRST conflict for (${a.label}, ${t.name})`
        );
      }
      ll1TableA.set(t.name, i);
    }
    if (fs.has(epsilon)) {
      const followA = cfg.followCache.get(a) as Set<Terminal>;
      for (const t of followA) {
        if (ll1TableA.get(t.name)) {
          throw new Error(
            `Grammar is not LL1: FIRST/FOLLOW conflict for (${a.label}, ${t.name})`
          );
        }
        ll1TableA.set(t.name, i);
      }
    }
  }
};
