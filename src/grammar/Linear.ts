import {Production} from './../interfaces/Production';
import {ContextFreeGrammar} from './../ContextFreeGrammar';

export const isProductionRightLinear = (p: Production): boolean => {
  return p.RHS.getLeftClosedPortion().length >= p.RHS.getLength() - 1;
};

export const isRightLinear = (cfg: ContextFreeGrammar): boolean => {
  for (const p of cfg.productions) {
    if (!isProductionRightLinear(p)) {
      return false;
    }
  }
  return true;
};
