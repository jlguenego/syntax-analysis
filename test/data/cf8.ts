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

// Source:
// https://web.stanford.edu/class/archive/cs/cs143/cs143.1128/lectures/06/Slides06.pdf/
// Slide 95
// Grammar not SLR(1)

class NTA extends NonTerminalAlphabet {
  S = new NonTerminal('S');
  E = new NonTerminal('E');
  L = new NonTerminal('L');
  R = new NonTerminal('R');
}

class TA extends TerminalAlphabet {
  '=': Terminal = {name: '='};
  'id': Terminal = {name: 'id'};
  '*': Terminal = {name: '*'};
}

const nt = new NTA();
const t = new TA();

const spec: CFGSpecifications<TA, NTA> = {
  startSymbol: 'S',
  productions: [
    {LHS: 'S', RHS: ['E']},
    {LHS: 'E', RHS: ['L', '=', 'R']},
    {LHS: 'E', RHS: ['R']},
    {LHS: 'L', RHS: ['id']},
    {LHS: 'L', RHS: ['*', 'R']},
    {LHS: 'R', RHS: ['L']},
  ],
};

// note: cfg8 is not SLR1
export const cfg8 = new ContextFreeGrammar(spec as CFGSpec, t, nt);

export const sentence8: Sentence = ['id', '=', '*', 'id'].map(str => ({
  name: str,
}));

export const expectedParseTree8: ParseTree = {
  node: nt.S,
  children: [
    {
      node: nt.E,
      children: [
        {
          node: nt.L,
          children: [{node: {name: 'id'}}],
        },
        {node: {name: '='}},
        {
          node: nt.R,
          children: [
            {
              node: nt.L,
              children: [
                {node: {name: '*'}},
                {
                  node: nt.R,
                  children: [
                    {
                      node: nt.L,
                      children: [{node: {name: 'id'}}],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const expectedAutomaton8 = {
  states: [
    '[1] S->·E E->·L=R E->·R L->·id L->·*R R->·L',
    '[2] S->E·',
    '[3] E->L·=R R->L·',
    '[4] E->R·',
    '[5] L->id·',
    '[6] L->*·R R->·L L->·id L->·*R',
    '[7] E->L=·R R->·L L->·id L->·*R',
    '[8] L->*R·',
    '[9] E->L=R·',
  ],
  transitions: [
    ['1->NT_E->2', '1->NT_L->3', '1->NT_R->4', '1->T_id->5', '1->T_*->6'],
    ['3->T_=->7'],
    ['6->NT_R->8', '6->NT_L->3', '6->T_id->5', '6->T_*->6'],
    ['7->NT_R->9', '7->NT_L->3', '7->T_id->5', '7->T_*->6'],
  ],
};
