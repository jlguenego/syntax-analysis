import {
  CFGSpecifications,
  ContextFreeGrammar,
  CFGSpec,
  ParseTree,
  Sentence,
  ntDef,
  tDef,
} from '../../src';

// Source:
// https://web.stanford.edu/class/archive/cs/cs143/cs143.1128/lectures/06/Slides06.pdf/
// Slide 95
// Grammar not SLR(1)

const t = tDef(['=', 'id', '*'] as const);
const nt = ntDef(['S', 'E', 'L', 'R'] as const);

type TA = typeof t;
type NTA = typeof nt;

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

export const expectedLALR1Automaton8 = {
  states: [
    '[1 (8)] S -> ·E{$} E -> ·L=R{$} E -> ·R{$} L -> ·id{=} L -> ·*R{=} R -> ·L{$} L -> ·id{$} L -> ·*R{$}',
    '[1 (1)] S -> E·{$}',
    '[1 (2)] E -> L·=R{$} R -> L·{$}',
    '[1 (1)] E -> R·{$}',
    '[1 (2)] L -> id·{=} L -> id·{$}',
    '[1 (8)] L -> *·R{=} L -> *·R{$} R -> ·L{=} R -> ·L{$} L -> ·id{=} L -> ·*R{=} L -> ·id{$} L -> ·*R{$}',
    '[1 (4)] E -> L=·R{$} R -> ·L{$} L -> ·id{$} L -> ·*R{$}',
    '[1 (2)] L -> *R·{=} L -> *R·{$}',
    '[1 (2)] R -> L·{=} R -> L·{$}',
    '[1 (1)] E -> L=R·{$}',
  ],
  transitions: [
    ['1->NT_E->1', '1->NT_L->1', '1->NT_R->1', '1->T_id->1', '1->T_*->1'],
    ['1->T_=->1'],
    ['1->NT_R->1', '1->NT_L->1', '1->T_id->1', '1->T_*->1'],
    ['1->NT_R->1', '1->NT_L->1', '1->T_id->1', '1->T_*->1'],
  ],
};
