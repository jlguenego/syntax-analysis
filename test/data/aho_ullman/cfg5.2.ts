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

// this grammar is LL(1)
const spec: CFGSpecifications<typeof t, typeof nt> = {
  startSymbol: 'S',
  productions: [
    {LHS: 'S', RHS: ['a', 'A', 'S']},
    {LHS: 'S', RHS: ['b']},
    {LHS: 'A', RHS: ['a']},
    {LHS: 'A', RHS: ['b', 'S', 'A']},
  ],
};
export const cfg52 = new ContextFreeGrammar(spec as CFGSpec, t, nt);

export const sentence52: Sentence = 'aaaab'.split('').map(str => ({
  name: str,
}));

export const expectedParseTree52: ParseTree = {
  node: nt.S,
  children: [
    {node: {name: 'a'}},
    {
      node: nt.A,
      children: [{node: {name: 'a'}}],
    },
    {
      node: nt.S,
      children: [
        {node: {name: 'a'}},
        {
          node: nt.A,
          children: [{node: {name: 'a'}}],
        },
        {
          node: nt.S,
          children: [{node: {name: 'b'}}],
        },
      ],
    },
  ],
};
