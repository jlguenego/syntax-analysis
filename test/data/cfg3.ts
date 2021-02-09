import {
  CFGSpecifications,
  ContextFreeGrammar,
  CFGSpec,
  defineTerminalAlphabet,
  defineNonTerminalAlphabet,
} from '../../src';

const t = defineTerminalAlphabet(['+', '*', 'int', '(', ')'] as const);
const nt = defineNonTerminalAlphabet(['E', 'Op'] as const);

type TA = typeof t;
type NTA = typeof nt;

// This grammar is LL1.
export const spec: CFGSpecifications<TA, NTA> = {
  startSymbol: 'E',
  productions: [
    {LHS: 'E', RHS: ['int']},
    {LHS: 'E', RHS: ['(', 'E', 'Op', 'E', ')']},
    {LHS: 'Op', RHS: ['+']},
    {LHS: 'Op', RHS: ['*']},
  ],
};
export const cfg3 = new ContextFreeGrammar(spec as CFGSpec, t, nt, {ll1: true});

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
