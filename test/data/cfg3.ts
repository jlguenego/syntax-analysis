import {
  CFGSpecifications,
  ContextFreeGrammar,
  defineTerminalAlphabet,
  defineNonTerminalAlphabet,
} from '../../src';

const nt = defineNonTerminalAlphabet(['E', 'Op'] as const);
const t = defineTerminalAlphabet(['+', '*', 'int', '(', ')'] as const);

type NTA = typeof nt;
type TA = typeof t;

// This grammar is LL1.
export const spec: CFGSpecifications<NTA, TA> = {
  nt,
  t,
  startSymbol: 'E',
  productions: [
    {LHS: 'E', RHS: ['int']},
    {LHS: 'E', RHS: ['(', 'E', 'Op', 'E', ')']},
    {LHS: 'Op', RHS: ['+']},
    {LHS: 'Op', RHS: ['*']},
  ],
};
export const cfg3 = new ContextFreeGrammar(spec, {
  ll1: true,
});

export const sentence3 = '( ( int + int ) * int )'
  .split(' ')
  .map(s => ({name: s}));

export const expectedParseTree3 = {
  node: nt.E,
  children: [
    {node: {name: '('}},
    {
      node: nt.E,
      children: [
        {node: {name: '('}},
        {
          node: nt.E,
          children: [{node: {name: 'int'}}],
        },
        {
          node: nt.Op,
          children: [{node: {name: '+'}}],
        },
        {
          node: nt.E,
          children: [{node: {name: 'int'}}],
        },
        {node: {name: ')'}},
      ],
    },
    {
      node: nt.Op,
      children: [{node: {name: '*'}}],
    },
    {
      node: nt.E,
      children: [{node: {name: 'int'}}],
    },
    {node: {name: ')'}},
  ],
};
