import {
  CFGSpecifications,
  ContextFreeGrammar,
  Sentence,
  ParseTree,
  CFGSpec,
  defineNonTerminalAlphabet,
  defineTerminalAlphabet,
} from '../../src';

const t = defineTerminalAlphabet(['+', '*', '(', ')', 'int'] as const);
const nt = defineNonTerminalAlphabet(['S', 'E', 'F', 'T'] as const);

type TA = typeof t;
type NTA = typeof nt;

export const spec: CFGSpecifications<TA, NTA> = {
  startSymbol: 'S',
  productions: [
    {LHS: 'S', RHS: ['E']},
    {LHS: 'E', RHS: ['F']},
    {LHS: 'E', RHS: ['E', '+', 'F']},
    {LHS: 'F', RHS: ['F', '*', 'T']},
    {LHS: 'F', RHS: ['T']},
    {LHS: 'T', RHS: ['int']},
    {LHS: 'T', RHS: ['(', 'E', ')']},
  ],
};

// note: cfg5 is not LL1
export const cfg5 = new ContextFreeGrammar(spec as CFGSpec, t, nt);

export const sentence5: Sentence = ['int', '+', 'int', '*', 'int'].map(str => ({
  name: str,
}));

export const expectedParseTree5: ParseTree = {
  node: nt.E,
  children: [
    {
      node: nt.E,
      children: [
        {
          node: nt.F,
          children: [
            {
              node: nt.T,
              children: [{node: {name: 'int'}}],
            },
          ],
        },
      ],
    },
    {node: {name: '+'}},
    {
      node: nt.F,
      children: [
        {
          node: nt.F,
          children: [
            {
              node: nt.T,
              children: [{node: {name: 'int'}}],
            },
          ],
        },
        {node: {name: '*'}},
        {
          node: nt.T,
          children: [{node: {name: 'int'}}],
        },
      ],
    },
  ],
};
