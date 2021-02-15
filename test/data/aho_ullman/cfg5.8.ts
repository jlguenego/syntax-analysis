import {
  CFGSpecifications,
  ContextFreeGrammar,
  Sentence,
  ParseTree,
  defineNonTerminalAlphabet,
  defineTerminalAlphabet,
} from '../../../src';

export const t58 = defineTerminalAlphabet(['a', 'b'] as const);
export const nt58 = defineNonTerminalAlphabet(['S', 'A'] as const);

// this grammar is not LL(1), it is LL(2) because the LL2 table can be built, but not strong LL(2).
const spec: CFGSpecifications<typeof t58, typeof nt58> = {
  nt: nt58,
  t: t58,
  productions: [
    {LHS: 'S', RHS: ['a', 'A', 'a', 'a']},
    {LHS: 'S', RHS: ['b', 'A', 'b', 'a']},
    {LHS: 'A', RHS: []},
    {LHS: 'A', RHS: ['b']},
  ],
  startSymbol: 'S',
};
export const cfg58 = new ContextFreeGrammar(spec);

export const sentence58: Sentence = 'abaa'.split('').map(str => ({
  name: str,
}));

export const expectedParseTree58: ParseTree = {
  node: nt58.S,
  children: [],
};
