import {
  CFGSpecifications,
  ContextFreeGrammar,
  CFGSpec,
  defineNonTerminalAlphabet,
  defineTerminalAlphabet,
} from '../../src';

export const t = defineTerminalAlphabet(['a', 'b'] as const);
export const nt = defineNonTerminalAlphabet(['S', 'E'] as const);

type TA = typeof t;
type NTA = typeof nt;

export const spec9: CFGSpecifications<TA, NTA> = {
  startSymbol: 'S',
  productions: [
    {LHS: 'S', RHS: ['a']},
    {LHS: 'S', RHS: ['S', 'b']},
    {LHS: 'E', RHS: ['a']},
  ],
};

export const cfg9 = new ContextFreeGrammar(spec9 as CFGSpec, t, nt);
