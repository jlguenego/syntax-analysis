import {
  NonTerminalAlphabet,
  NonTerminal,
  TerminalAlphabet,
  Terminal,
  CFGSpecifications,
  ContextFreeGrammar,
  CFGSpec,
} from '../../src';

export class TA extends TerminalAlphabet {
  '+': Terminal = {name: '+'};
  INT: Terminal = {name: 'int'};
  '(': Terminal = {name: '('};
  ')': Terminal = {name: ')'};
}

export class NTA extends NonTerminalAlphabet {
  E = new NonTerminal('E');
  T = new NonTerminal('T');
  Y = new NonTerminal('Y');
}

export const t = new TA();
export const nt = new NTA();

export const spec: CFGSpecifications<TA, NTA> = {
  startSymbol: 'E',
  productions: [
    {LHS: 'E', RHS: ['T', 'Y']},
    {LHS: 'T', RHS: ['INT']},
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
