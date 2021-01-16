import {ContextFreeGrammar} from '../ContextFreeGrammar';
import {ParseSymbol} from '../interfaces/ParseSymbol';
import {hasOnlyNonTerminal} from '../interfaces/SententialForm';
import {NonTerminal} from '../NonTerminal';
import {epsilon} from '../terminals/epsilon.terminal';

export const isLeftRecursiveNonTerminal = (
  cfg: ContextFreeGrammar,
  nt: NonTerminal,
  refNt?: NonTerminal
): boolean => {
  if (refNt === undefined) {
    refNt = nt;
  }
  const forms = cfg.productionMap.get(nt);
  if (forms === undefined) {
    return false;
  }
  for (const form of forms) {
    for (const s of form) {
      if (derivateToEmptyString(cfg, s)) {
        continue;
      }
      if (!(s instanceof NonTerminal)) {
        return false;
      }
      if (s === refNt) {
        return true;
      }
      return isLeftRecursiveNonTerminal(cfg, s, refNt);
    }
  }
  return false;
};

export const derivateToEmptyString = (
  cfg: ContextFreeGrammar,
  s: ParseSymbol
) => {
  if (!(s instanceof NonTerminal)) {
    if (s === epsilon) {
      return true;
    }
    return false;
  }
  const forms = cfg.productionMap.get(s);
  if (forms === undefined || forms.length === 0) {
    throw new Error('Grammar have nonterminal without productions.');
  }
  for (const form of forms) {
    if (!hasOnlyNonTerminal(form)) {
      return false;
    }
    for (const nt of form) {
      if (!derivateToEmptyString(cfg, nt)) {
        return false;
      }
    }
    return true;
  }
  return false;
};
