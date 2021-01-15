import {
  NonTerminalAlphabet,
  NonTerminal,
  TerminalAlphabet,
  Terminal,
  CFGSpec,
  ContextFreeGrammar,
} from '../../src';

export class TA extends TerminalAlphabet {
  PLUS: Terminal = {name: '+'};
  MOINS: Terminal = {name: '-'};
  DIGIT: Terminal = {name: 'd'};
}

export class NTA extends NonTerminalAlphabet {
  Num = new NonTerminal('Num');
  Sign = new NonTerminal('Sign');
  Digits = new NonTerminal('Digits');
  More = new NonTerminal('More');
}

export const nt = new NTA();
const t = new TA();

export const spec: CFGSpec<TA, NTA> = {
  startSymbol: 'Num',
  productions: [
    {LHS: 'Num', RHS: ['Sign', 'Digits']},
    {LHS: 'Sign', RHS: ['PLUS']},
    {LHS: 'Sign', RHS: ['MOINS']},
    {LHS: 'Sign', RHS: []},
    {LHS: 'Digits', RHS: ['DIGIT', 'More']},
    {LHS: 'More', RHS: ['Digits']},
    {LHS: 'More', RHS: []},
  ],
};
export const cfg = new ContextFreeGrammar(spec, t, nt);
