import {
  CFGSpecifications,
  ContextFreeGrammar,
  CFGSpec,
  defineTerminalAlphabet,
  defineNonTerminalAlphabet,
} from '../../src';

const t = defineTerminalAlphabet(['+', '-', 'd'] as const);
export const nt = defineNonTerminalAlphabet([
  'Num',
  'Sign',
  'Digits',
  'More',
] as const);

export const spec: CFGSpecifications<typeof t, typeof nt> = {
  startSymbol: 'Num',
  productions: [
    {LHS: 'Num', RHS: ['Sign', 'Digits']},
    {LHS: 'Sign', RHS: ['+']},
    {LHS: 'Sign', RHS: ['-']},
    {LHS: 'Sign', RHS: []},
    {LHS: 'Digits', RHS: ['d', 'More']},
    {LHS: 'More', RHS: ['Digits']},
    {LHS: 'More', RHS: []},
  ],
};
export const cfg2 = new ContextFreeGrammar(spec as CFGSpec, t, nt);
