import {
  NonTerminalAlphabet,
  NonTerminal,
  TerminalAlphabet,
  Terminal,
  CFGSpecifications,
  ContextFreeGrammar,
  CFGSpec,
  ParseTree,
  Sentence,
} from '../../src';

class NTA extends NonTerminalAlphabet {
  S = new NonTerminal('S');
  E = new NonTerminal('E');
  T = new NonTerminal('T');
}

class TA extends TerminalAlphabet {
  '+': Terminal = {name: '+'};
  '(': Terminal = {name: '('};
  ')': Terminal = {name: ')'};
  'int': Terminal = {name: 'int'};
}

const nt = new NTA();
const t = new TA();

const spec: CFGSpecifications<TA, NTA> = {
  startSymbol: 'S',
  productions: [
    {LHS: 'S', RHS: ['E']},
    {LHS: 'E', RHS: ['T']},
    {LHS: 'E', RHS: ['E', '+', 'T']},
    {LHS: 'T', RHS: ['int']},
    {LHS: 'T', RHS: ['(', 'E', ')']},
  ],
};

// note: cfg7 is not LR0
export const cfg7 = new ContextFreeGrammar(spec as CFGSpec, t, nt);

export const sentence7: Sentence = [
  'int',
  '+',
  '(',
  'int',
  '+',
  'int',
  ')',
].map(str => ({
  name: str,
}));

export const expectedParseTree7: ParseTree = {
  node: nt.S,
  children: [
    {
      node: nt.E,
      children: [
        {
          node: nt.E,
          children: [
            {
              node: nt.T,
              children: [{node: {name: 'int'}}],
            },
          ],
        },
        {node: {name: '+'}},
        {
          node: nt.T,
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
                      children: [{node: {name: 'int'}}],
                    },
                  ],
                },
                {node: {name: '+'}},
                {
                  node: nt.T,
                  children: [{node: {name: 'int'}}],
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

export const expectedAutomaton7 = {
  states: [
    '[1] S->·E E->·T; E->·T+E T->·int T->·(E)',
    '[2] S->E·',
    '[3] E->T·; E->T·+E',
    '[4] T->int·',
    '[5] T->(·E) E->·T; E->·T+E T->·int T->·(E)',
    '[6] E->T;·',
    '[7] E->T+·E E->·T; E->·T+E T->·int T->·(E)',
    '[8] T->(E·)',
    '[9] E->T+E·',
    '[10] T->(E)·',
  ],
  transitions: [
    ['1->NT_E->2', '1->NT_T->3', '1->T_int->4', '1->T_(->5'],
    ['3->T_;->6', '3->T_+->7'],
    ['5->NT_E->8', '5->NT_T->3', '5->T_int->4', '5->T_(->5'],
    ['7->NT_E->9', '7->NT_T->3', '7->T_int->4', '7->T_(->5'],
    ['8->T_)->10'],
  ],
};
