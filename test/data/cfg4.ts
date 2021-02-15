import {
  CFGSpecifications,
  ContextFreeGrammar,
  Sentence,
  ParseTree,
  defineTerminalAlphabet,
  defineNonTerminalAlphabet,
} from '../../src';

const t = defineTerminalAlphabet(['+', 'int'] as const);
const nt = defineNonTerminalAlphabet(['S', 'E', 'F'] as const);

type TA = typeof t;
type NTA = typeof nt;

export const spec: CFGSpecifications<TA, NTA> = {
  nt,
  t,
  productions: [
    {LHS: 'S', RHS: ['E']},
    {LHS: 'E', RHS: ['F']},
    {LHS: 'E', RHS: ['F', '+', 'E']},
    {LHS: 'F', RHS: ['int']},
  ],
  startSymbol: 'S',
};
export const cfg4 = new ContextFreeGrammar(spec);

export const sentence4: Sentence = ['int', '+', 'int', '+', 'int'].map(str => ({
  name: str,
}));

export const expectedParseTree4: ParseTree = {
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
                  children: [{node: t.int}],
                },
              ],
            },
            {
              node: t['+'],
            },
            {
              node: nt.F,
              children: [{node: t.int}],
            },
          ],
        },
        {
          node: t['+'],
        },
        {
          node: nt.F,
          children: [{node: t.int}],
        },
      ],
    },
  ],
};
