import {ContextFreeGrammar} from '../ContextFreeGrammar';
import {NonTerminal} from '../NonTerminal';

export const isLeftRecursive = (cfg: ContextFreeGrammar, nt: NonTerminal) => {
  const prod = findLeftRecursiveProduction(cfg, nt);
  console.log('prod: ', prod);
  return false;
};

export const findLeftRecursiveProduction = (
  cfg: ContextFreeGrammar,
  nt: NonTerminal
) => {
  console.log('cfg: ', cfg);
  console.log('nt: ', nt);
  return;
};
