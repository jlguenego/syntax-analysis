import {
  CFGSpecifications,
  ContextFreeGrammar,
  Sentence,
  ParseTree,
  defineNonTerminalAlphabet,
  defineTerminalAlphabet,
} from '../../src';

const nt = defineNonTerminalAlphabet(['E', 'T'] as const);
const t = defineTerminalAlphabet(['+', 'int', '(', ')'] as const);

// this grammar is not LL(k) (Left recursion)
const spec: CFGSpecifications<typeof t, typeof nt> = {
  nt,
  t,
  productions: [
    {LHS: 'E', RHS: ['T']},
    {LHS: 'E', RHS: ['T', '+', 'E']},
    {LHS: 'T', RHS: ['int']},
    {LHS: 'T', RHS: ['(', 'E', ')']},
  ],
  startSymbol: 'E',
};
export const cfg1 = new ContextFreeGrammar(spec);

export const sentence: Sentence = ['int', '+', 'int'].map(str => ({
  name: str,
}));

export const expectedParseTree: ParseTree = {
  node: nt.E,
  children: [
    {
      node: nt.T,
      children: [{node: {name: 'int'}}],
    },
    {node: {name: '+'}},
    {
      node: nt.E,
      children: [
        {
          node: nt.T,
          children: [{node: {name: 'int'}}],
        },
      ],
    },
  ],
};
