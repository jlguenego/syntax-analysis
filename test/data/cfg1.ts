import {
  CFGSpecifications,
  ContextFreeGrammar,
  Sentence,
  ParseTree,
  CFGSpec,
  ntDef,
  tDef,
} from '../../src';

const t = tDef(['+', 'int'] as const);
const nt = ntDef(['S', 'E', 'F'] as const);

const spec: CFGSpecifications<typeof t, typeof nt> = {
  startSymbol: 'S',
  productions: [
    {LHS: 'S', RHS: ['E']},
    {LHS: 'E', RHS: ['F']},
    {LHS: 'E', RHS: ['E', '+', 'F']},
    {LHS: 'F', RHS: ['int']},
  ],
};
export const cfg1 = new ContextFreeGrammar(spec as CFGSpec, t, nt);

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
                  children: [{node: {name: 'int'}}],
                },
              ],
            },
            {
              node: {name: '+'},
            },
            {
              node: nt.F,
              children: [{node: {name: 'int'}}],
            },
          ],
        },
        {
          node: {name: '+'},
        },
        {
          node: nt.F,
          children: [{node: {name: 'int'}}],
        },
      ],
    },
  ],
};
