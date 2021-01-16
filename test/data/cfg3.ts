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
}

export const t = new TA();
export const nt = new NTA();

export const spec: CFGSpecifications<TA, NTA> = {
  startSymbol: 'E',
  productions: [
    {LHS: 'E', RHS: ['T']},
    {LHS: 'E', RHS: ['T', '+', 'E']},
    {LHS: 'T', RHS: ['INT']},
    {LHS: 'T', RHS: ['(', 'E', ')']},
  ],
};
export const cfg3 = new ContextFreeGrammar(spec as CFGSpec, t, nt);

export const expectedParseTree3 = {
  node: nt.E,
  children: [
    {
      node: nt.T,
      children: [{node: {name: 'int'}}],
    },
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
                {node: {name: '+'}},
                {
                  node: nt.E,
                  children: [
                    {
                      node: nt.T,
                      children: [{node: {name: 'int'}}],
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
};
