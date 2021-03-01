import {
  CFGSpecifications,
  ContextFreeGrammar,
  Sentence,
  ParseTree,
  defineNonTerminalAlphabet,
  defineTerminalAlphabet,
} from '../../../src';

export const nt24 = defineNonTerminalAlphabet(['E', 'T', 'F'] as const);
export const t24 = defineTerminalAlphabet(['a', '+', '*', '(', ')'] as const);

// this grammar is not LL(1), it is LL(2) because the LL2 table can be built, but not strong LL(2).
const spec: CFGSpecifications<typeof nt24, typeof t24> = {
  nt: nt24,
  t: t24,
  productions: [
    {LHS: 'E', RHS: ['E', '+', 'T']},
    {LHS: 'E', RHS: ['T']},
    {LHS: 'T', RHS: ['T', '*', 'F']},
    {LHS: 'T', RHS: ['F']},
    {LHS: 'F', RHS: ['(', 'E', ')']},
    {LHS: 'F', RHS: ['a']},
  ],
  startSymbol: 'E',
};
export const cfg24 = new ContextFreeGrammar(spec);

export const sentence24: Sentence = '(a+a*a)+a'.split('').map(str => ({
  name: str,
}));

const nt = nt24;

export const expectedParseTree24: ParseTree = {
  node: nt.E,
  children: [
    {
      node: nt.E,
      children: [
        {
          node: nt.T,
          children: [
            {
              node: nt.F,
              children: [
                {node: {name: '('}},
                {
                  node: nt.E,
                  children: [
                    {
                      node: nt.E,
                      children: [
                        {
                          node: nt.T,
                          children: [
                            {
                              node: nt.F,
                              children: [{node: {name: 'a'}}],
                            },
                          ],
                        },
                      ],
                    },
                    {node: {name: '+'}},
                    {
                      node: nt.T,
                      children: [
                        {
                          node: nt.T,
                          children: [
                            {
                              node: nt.F,
                              children: [{node: {name: 'a'}}],
                            },
                          ],
                        },
                        {node: {name: '*'}},
                        {
                          node: nt.F,
                          children: [{node: {name: 'a'}}],
                        },
                      ],
                    },
                  ],
                },
                {node: {name: ')'}},
              ],
            },
          ],
        },
      ],
    },
    {node: {name: '+'}},
    {
      node: nt.T,
      children: [
        {
          node: nt.F,
          children: [{node: {name: 'a'}}],
        },
      ],
    },
  ],
};
