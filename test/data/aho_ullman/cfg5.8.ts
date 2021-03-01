import {
  CFGSpecifications,
  ContextFreeGrammar,
  Sentence,
  ParseTree,
  defineNonTerminalAlphabet,
  defineTerminalAlphabet,
} from '../../../src';

export const nt58 = defineNonTerminalAlphabet(['S', 'A'] as const);
export const t58 = defineTerminalAlphabet(['a', 'b'] as const);

// this grammar is not LL(1), it is LL(2) because the LL2 table can be built, but not strong LL(2).
const spec: CFGSpecifications<typeof nt58, typeof t58> = {
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

const nt = nt58;

export const expectedParseTree58: ParseTree = {
  node: nt.S,
  children: [
    {node: {name: 'a'}},
    {
      node: nt.A,
      children: [{node: {name: 'b'}}],
    },
    {node: {name: 'a'}},
    {node: {name: 'a'}},
  ],
};

export const expectedLLkTableString58 = `T0 LLKTable S { ε }
aa: 0 | A:{ aa }
ab: 0 | A:{ aa }
bb: 1 | A:{ ba }

T1 LLKTable A { aa }
aa: 2 | <empty>
ba: 3 | <empty>

T2 LLKTable A { ba }
ba: 2 | <empty>
bb: 3 | <empty>

`;
