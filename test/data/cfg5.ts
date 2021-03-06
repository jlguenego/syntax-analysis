import {
  CFGSpecifications,
  ContextFreeGrammar,
  Sentence,
  ParseTree,
  defineNonTerminalAlphabet,
  defineTerminalAlphabet,
} from '../../src';

const nt = defineNonTerminalAlphabet(['S', 'E', 'F', 'T'] as const);
const t = defineTerminalAlphabet(['+', '*', '(', ')', 'int'] as const);

type NTA = typeof nt;
type TA = typeof t;

export const spec: CFGSpecifications<NTA, TA> = {
  nt,
  t,
  productions: [
    {LHS: 'S', RHS: ['E']},
    {LHS: 'E', RHS: ['F']},
    {LHS: 'E', RHS: ['E', '+', 'F']},
    {LHS: 'F', RHS: ['F', '*', 'T']},
    {LHS: 'F', RHS: ['T']},
    {LHS: 'T', RHS: ['int']},
    {LHS: 'T', RHS: ['(', 'E', ')']},
  ],
  startSymbol: 'S',
};

// note: cfg5 is not LL1
export const cfg5 = new ContextFreeGrammar(spec);

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
