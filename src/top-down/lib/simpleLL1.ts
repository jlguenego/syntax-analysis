import {NonTerminal} from '../../NonTerminal';
import {ContextFreeGrammar} from '../../ContextFreeGrammar';
import {Terminal} from '../../interfaces/Terminal';

/**
 * See Aho Ullman page 336: Definition of a simple LL1 grammar.
 *
 * 1) Grammar has no empty rules (A->ε)
 * 2) For a given non terminal A, all alternates rules start with a different terminal.
 *
 * @param {ContextFreeGrammar} cfg
 * @returns {boolean}
 */
export const isLL1Simple = (cfg: ContextFreeGrammar): boolean => {
  if (cfg.hasEmptyProduction()) {
    return false;
  }
  for (const nt of cfg.productionMap.keys()) {
    const set = new Set<Terminal>();
    for (const rhsArray of cfg.getProdRHSArray(nt)) {
      const s = rhsArray.symbols[0];
      if (s instanceof NonTerminal) {
        return false;
      }
      if (set.has(s)) {
        return false;
      }
      set.add(s);
    }
  }
  return true;
};
