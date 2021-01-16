import {
  NonTerminalAlphabet,
  NonTerminal,
  TerminalAlphabet,
  Terminal,
  CFGSpec,
  ContextFreeGrammar,
  Sentence,
  ParseTree,
  CFGDef,
} from '../../src';

export class NTA extends NonTerminalAlphabet {
  S = new NonTerminal('S');
  E = new NonTerminal('E');
  F = new NonTerminal('F');
}

export class TA extends TerminalAlphabet {
  PLUS: Terminal = {name: '+'};
  INT: Terminal = {name: 'int'};
}

export const nt = new NTA();
const t = new TA();

export const spec: CFGSpec<TA, NTA> = {
  startSymbol: 'S',
  productions: [
    {LHS: 'S', RHS: ['E']},
    {LHS: 'E', RHS: ['F']},
    {LHS: 'E', RHS: ['F', 'PLUS', 'E']},
    {LHS: 'F', RHS: ['INT']},
  ],
};
export const cfg = new ContextFreeGrammar(spec as CFGDef, t, nt);

export const sentence: Sentence = ['int', '+', 'int', '+', 'int'].map(str => ({
  name: str,
}));

export const expectedParseTree: ParseTree = {
  node: nt.S,
  children: [
    {
      node: nt.E,
      children: [
        {
          node: nt.E,
          children: [
            {
              node: nt.E,
              children: [
                {
                  node: nt.F,
                  children: [{node: t.INT}],
                },
              ],
            },
            {
              node: t.PLUS,
            },
            {
              node: nt.F,
              children: [{node: t.INT}],
            },
          ],
        },
        {
          node: t.PLUS,
        },
        {
          node: nt.F,
          children: [{node: t.INT}],
        },
      ],
    },
  ],
};
