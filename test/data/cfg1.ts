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

export class TA extends TerminalAlphabet {
  readonly PLUS: Terminal = {name: '+'};
  readonly INT: Terminal = {name: 'int'};
}

export class NTA extends NonTerminalAlphabet {
  readonly S = new NonTerminal('S');
  readonly E = new NonTerminal('E');
  readonly F = new NonTerminal('F');
}

export const t = new TA();
export const nt = new NTA();

export const spec: CFGSpec<TA, NTA> = {
  startSymbol: 'S',
  productions: [
    {LHS: 'S', RHS: ['E']},
    {LHS: 'E', RHS: ['F']},
    {LHS: 'E', RHS: ['E', 'PLUS', 'F']},
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
