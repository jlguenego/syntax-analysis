import {
  CFGSpecifications,
  ContextFreeGrammar,
  defineTerminalAlphabet,
  defineNonTerminalAlphabet,
} from '../../src';

export const nt = defineNonTerminalAlphabet([
  'Num',
  'Sign',
  'Digits',
  'More',
] as const);
const t = defineTerminalAlphabet(['+', '-', 'd'] as const);

export const spec: CFGSpecifications<typeof t, typeof nt> = {
  nt,
  t,
  productions: [
    {LHS: 'Num', RHS: ['Sign', 'Digits']},
    {LHS: 'Sign', RHS: ['+']},
    {LHS: 'Sign', RHS: ['-']},
    {LHS: 'Sign', RHS: []},
    {LHS: 'Digits', RHS: ['d', 'More']},
    {LHS: 'More', RHS: ['Digits']},
    {LHS: 'More', RHS: []},
  ],
  startSymbol: 'Num',
};
export const cfg2 = new ContextFreeGrammar(spec);
