import {
  CFGSpecifications,
  ContextFreeGrammar,
  defineNonTerminalAlphabet,
  defineTerminalAlphabet,
} from '../../src';

export const t = defineTerminalAlphabet(['a', 'b'] as const);
export const nt = defineNonTerminalAlphabet(['S', 'E'] as const);

type TA = typeof t;
type NTA = typeof nt;

export const spec9: CFGSpecifications<TA, NTA> = {
  nt,
  t,
  productions: [
    {LHS: 'S', RHS: ['a']},
    {LHS: 'S', RHS: ['S', 'b']},
    {LHS: 'E', RHS: ['a']},
  ],
  startSymbol: 'S',
};

export const cfg9 = new ContextFreeGrammar(spec9);
