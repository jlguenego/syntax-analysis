import {ContextFreeGrammar} from '../../ContextFreeGrammar';

export const checkStartSymbol = (cfg: ContextFreeGrammar): void => {
  const prod = cfg.productions.find(p =>
    p.RHS.symbols.includes(cfg.startSymbol)
  );
  if (prod) {
    throw new Error(
      'Grammar must not have start symbol appearing in production RHS. Please use an augmented grammar.'
    );
  }
};
