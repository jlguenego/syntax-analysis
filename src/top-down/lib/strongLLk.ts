import {firstkStarSet} from './firstk';
import {NonTerminal} from './../../NonTerminal';
import {SententialForm} from '../../SententialForm';
import {getDistinctCouples, intersection} from '../../utils/set';
import {ContextFreeGrammar} from './../../ContextFreeGrammar';
import {followk} from './followk';
import {checkLLkTable} from './LLkTable';

const firstFollow = (
  cfg: ContextFreeGrammar,
  k: number,
  rhs: SententialForm,
  a: NonTerminal
) => {
  const followA = followk(cfg, k, a);
  const formSet = rhs.concatSet(followA);
  const result = firstkStarSet(cfg, k, formSet);
  return result;
};

/**
 * Check this is a strong LLk grammmar.
 *
 * @param {ContextFreeGrammar} cfg
 */
export const isStrongLLk = (cfg: ContextFreeGrammar, k: number): boolean => {
  checkLLkTable(cfg, k);
  // All LL(1) and LL(0) grammars are strong.
  if (k <= 1) {
    return true;
  }
  for (const nt of cfg.productionMap.keys()) {
    const rhsArray = cfg.productionMap.get(nt) as SententialForm[];
    const rhsSet = new Set(rhsArray);
    const distinctRhsArrayCouples = getDistinctCouples(rhsSet);
    for (const [rhs1, rhs2] of distinctRhsArrayCouples) {
      const set1 = firstFollow(cfg, k, rhs1, nt);
      const set2 = firstFollow(cfg, k, rhs2, nt);
      const intersec = intersection(set1, set2);
      if (intersec.size > 0) {
        console.log('intersec: ', intersec);
        return false;
      }
    }
  }
  return true;
};
