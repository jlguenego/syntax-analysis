import {
  CFGSpecifications,
  ContextFreeGrammar,
  defineNonTerminalAlphabet,
  defineTerminalAlphabet,
} from '../../src';

export const nt = defineNonTerminalAlphabet(['S', 'E'] as const);
export const t = defineTerminalAlphabet(['a', 'b'] as const);

type NTA = typeof nt;
type TA = typeof t;

export const spec9: CFGSpecifications<NTA, TA> = {
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
