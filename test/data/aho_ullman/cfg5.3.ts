import {
  CFGSpecifications,
  ContextFreeGrammar,
  Sentence,
  ParseTree,
  CFGSpec,
  defineNonTerminalAlphabet,
  defineTerminalAlphabet,
} from '../../../src';

const t = defineTerminalAlphabet(['a', 'b'] as const);
const nt = defineNonTerminalAlphabet(['S', 'A'] as const);

// this grammar is ???
const spec: CFGSpecifications<typeof t, typeof nt> = {
  startSymbol: 'S',
  productions: [
    {LHS: 'S', RHS: []},
    {LHS: 'S', RHS: ['a', 'b', 'A']},
    {LHS: 'A', RHS: ['S', 'a', 'a']},
    {LHS: 'A', RHS: ['b']},
  ],
};
export const cfg53 = new ContextFreeGrammar(spec as CFGSpec, t, nt);

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
          children: [{node: {name: ''}}],
        },
        {node: {name: 'a'}},
        {node: {name: 'a'}},
      ],
    },
  ],
};
