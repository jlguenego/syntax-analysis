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

// this grammar is not LL(1), it is LL(2) because the LL2 table can be built, but not strong LL(2).
const spec: CFGSpecifications<typeof t, typeof nt> = {
  startSymbol: 'S',
  productions: [
    {LHS: 'S', RHS: ['a', 'A', 'a', 'a']},
    {LHS: 'S', RHS: ['b', 'A', 'b', 'a']},
    {LHS: 'A', RHS: ['b']},
    {LHS: 'A', RHS: []},
  ],
};
export const cfg58 = new ContextFreeGrammar(spec as CFGSpec, t, nt);

export const sentence58: Sentence = 'abaa'.split('').map(str => ({
  name: str,
}));

export const expectedParseTree58: ParseTree = {
  node: nt.S,
  children: [],
};
