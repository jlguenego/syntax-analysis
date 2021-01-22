import {
  CFGSpecifications,
  ContextFreeGrammar,
  CFGSpec,
  tDef,
  ntDef,
} from '../../src';

const t = tDef(['+', 'int', '(', ')'] as const);
const nt = ntDef(['E', 'T', 'Y'] as const);

type TA = typeof t;
type NTA = typeof nt;

export const spec: CFGSpecifications<TA, NTA> = {
  startSymbol: 'E',
  productions: [
    {LHS: 'E', RHS: ['T', 'Y']},
    {LHS: 'T', RHS: ['int']},
    {LHS: 'T', RHS: ['(', 'E', ')']},
    {LHS: 'Y', RHS: ['+', 'E']},
    {LHS: 'Y', RHS: []},
  ],
};
export const cfg3 = new ContextFreeGrammar(spec as CFGSpec, t, nt, {ll1: true});

export const expectedParseTree3 = {
  node: nt.E,
  children: [
    {
      node: nt.T,
      children: [{node: {name: 'int'}}],
    },
    {
      node: nt.Y,
      children: [
        {node: {name: '+'}},
        {
          node: nt.E,
          children: [
            {
              node: nt.T,
              children: [
                {node: {name: '('}},
                {
                  node: nt.E,
                  children: [
                    {
                      node: nt.T,
                      children: [{node: {name: 'int'}}],
                    },
                    {
                      node: nt.Y,
                      children: [
                        {node: {name: '+'}},
                        {
                          node: nt.E,
                          children: [
                            {
                              node: nt.T,
                              children: [{node: {name: 'int'}}],
                            },
                            {
                              node: nt.Y,
                              children: [{node: {name: ''}}],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {node: {name: ')'}},
              ],
            },
            {
              node: nt.Y,
              children: [{node: {name: ''}}],
            },
          ],
        },
      ],
    },
  ],
};
