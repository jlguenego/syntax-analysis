import {SententialForm} from '../../SententialForm';
import {getDistinctCouples} from '../../utils/set';
import {ContextFreeGrammar} from './../../ContextFreeGrammar';

/**
 * Check this is a strong LLk grammmar.
 *
 * @param {ContextFreeGrammar} cfg
 */
export const checkStrongLLkGrammar = (cfg: ContextFreeGrammar) => {
  // All LL(1) grammars are strong.
  if (cfg.lookaheadTokenNbr <= 1) {
    return;
  }
  for (const nt of cfg.productionMap.keys()) {
    const rhsArray = cfg.productionMap.get(nt) as SententialForm[];
    const rhsSet = new Set(rhsArray);
    const distinctRhsArrayCouples = getDistinctCouples(rhsSet);
    for (const [rhs1, rhs2] of distinctRhsArrayCouples) {
      if (rhs1 === rhs2) {
        throw new Error('cannot be equals');
      }
    }
  }
};
