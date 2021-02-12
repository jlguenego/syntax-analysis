import {ContextFreeGrammar} from '../../ContextFreeGrammar';
import {NonTerminal} from '../../NonTerminal';
import {copyWithoutElt} from '../../utils/set';
import {epsilonWord, Word} from '../../Word';
import {buildFirstk, firstkStarSet} from './firstk';
import {buildFollowk, followk} from './followk';

export const checkLLkTable = (cfg: ContextFreeGrammar, k: number): void => {
  if (cfg.llkTableCache.get(k)) {
    return;
  }
  buildLLkTable(cfg, k);
};

const initLLkTableCache = (cfg: ContextFreeGrammar, k: number): void => {
  const map = new Map<NonTerminal, Map<Word, number>>();
  cfg.llkTableCache.set(k, map);
  for (const nt of cfg.productionMap.keys()) {
    map.set(nt, new Map<Word, number>());
  }
};

const getLLkTableCache = (
  cfg: ContextFreeGrammar,
  k: number
): Map<NonTerminal, Map<Word, number>> => {
  return cfg.llkTableCache.get(k) as Map<NonTerminal, Map<Word, number>>;
};

export const buildLLkTable = (cfg: ContextFreeGrammar, k: number): void => {
  buildFirstk(cfg, k);
  buildFollowk(cfg, k);
  initLLkTableCache(cfg, k);
  for (let i = 0; i < cfg.productions.length; i++) {
    const prod = cfg.productions[i];
    const a = prod.LHS;
    const llkTableA = getLLkTableCache(cfg, k).get(a) as Map<Word, number>;
    const fs = firstkStarSet(cfg, k, prod.RHS.concatSet(followk(cfg, k, a)));
    const fsMinusEpsilon = copyWithoutElt(fs, epsilonWord);
    for (const w of fsMinusEpsilon) {
      if (![undefined, i].includes(llkTableA.get(w))) {
        throw new Error(
          `Grammar is not LL(${k}): conflict for (${
            a.label
          }, ${w.toString()}): rules ${llkTableA.get(w)} and ${i}.`
        );
      }
      llkTableA.set(w, i);
    }
  }
};
