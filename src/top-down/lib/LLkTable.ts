import {ContextFreeGrammar} from '../../ContextFreeGrammar';
import {copyWithoutElt} from '../../utils/set';
import {epsilonWord, Word} from '../../Word';
import {buildFirstk, firstkStar} from './firstk';

export const checkLLkTable = (
  cfg: ContextFreeGrammar,
  lookaheadTokenNbr: number
): void => {
  if (cfg.lookaheadTokenNbr === lookaheadTokenNbr) {
    return;
  }
  buildLLkTable(cfg, lookaheadTokenNbr);
};

const initLLkTableCache = (cfg: ContextFreeGrammar): void => {
  for (const nt of cfg.productionMap.keys()) {
    cfg.llkTableCache.set(nt, new Map<Word, number>());
  }
};

export const buildLLkTable = (cfg: ContextFreeGrammar, k: number): void => {
  cfg.lookaheadTokenNbr = k;
  buildFirstk(cfg);
  initLLkTableCache(cfg);
  for (let i = 0; i < cfg.productions.length; i++) {
    const prod = cfg.productions[i];
    const a = prod.LHS;
    const llkTableA = cfg.llkTableCache.get(a) as Map<Word, number>;
    const fs = firstkStar(cfg, prod.RHS);
    const fsMinusEpsilon = copyWithoutElt(fs, epsilonWord);
    for (const w of fsMinusEpsilon) {
      if (llkTableA.get(w) !== undefined) {
        throw new Error(
          `Grammar is not LL(${k}): FIRST/FIRST conflict for (${
            a.label
          }, ${w.toString()}): rules ${llkTableA.get(w)} and ${i}.`
        );
      }
      llkTableA.set(w, i);
    }
    if (fs.has(epsilonWord)) {
      const followA = cfg.followkCache.get(a) as Set<Word>;
      for (const w of followA) {
        if (llkTableA.get(w) !== undefined) {
          throw new Error(
            `Grammar is not LL1: FIRST/FOLLOW conflict for (${
              a.label
            }, ${w.toString()})`
          );
        }
        llkTableA.set(w, i);
      }
    }
  }
};
