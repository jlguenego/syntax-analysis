import {
  CFGSpecifications,
  ContextFreeGrammar,
  Sentence,
  ParseTree,
  CFGSpec,
  defineNonTerminalAlphabet,
  defineTerminalAlphabet,
} from '../../src';

const t = defineTerminalAlphabet(['+', 'int', '(', ')'] as const);
const nt = defineNonTerminalAlphabet(['E', 'T'] as const);

const spec: CFGSpecifications<typeof t, typeof nt> = {
  startSymbol: 'E',
  productions: [
    {LHS: 'E', RHS: ['T']},
    {LHS: 'E', RHS: ['T', '+', 'E']},
    {LHS: 'T', RHS: ['int']},
    {LHS: 'T', RHS: ['(', 'E', ')']},
  ],
};
export const cfg1 = new ContextFreeGrammar(spec as CFGSpec, t, nt);

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
