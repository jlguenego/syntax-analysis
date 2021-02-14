import {
  CFGSpecifications,
  ContextFreeGrammar,
  Sentence,
  ParseTree,
  defineNonTerminalAlphabet,
  defineTerminalAlphabet,
} from '../../../src';

const t = defineTerminalAlphabet(['a', 'b'] as const);
const nt = defineNonTerminalAlphabet(['S', 'A'] as const);

// this grammar is ???
const spec: CFGSpecifications<typeof t, typeof nt> = {
  nt,
  t,
  productions: [
    {LHS: 'S', RHS: []},
    {LHS: 'S', RHS: ['a', 'b', 'A']},
    {LHS: 'A', RHS: ['S', 'a', 'a']},
    {LHS: 'A', RHS: ['b']},
  ],
  startSymbol: 'S',
};
export const cfg53 = new ContextFreeGrammar(spec);

export const sentence53: Sentence = 'abaa'.split('').map(str => ({
  name: str,
}));

export const expectedParseTree53: ParseTree = {
  node: nt.S,
  children: [
    {node: {name: 'a'}},
    {node: {name: 'b'}},
    {
      node: nt.A,
      children: [
        {
          node: nt.S,
          children: [{node: {name: 'ε'}}],
        },
        {node: {name: 'a'}},
        {node: {name: 'a'}},
      ],
    },
  ],
};
