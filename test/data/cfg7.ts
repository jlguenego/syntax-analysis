import {
  CFGSpecifications,
  ContextFreeGrammar,
  ParseTree,
  Sentence,
  defineNonTerminalAlphabet,
  defineTerminalAlphabet,
} from '../../src';

const nt = defineNonTerminalAlphabet(['S', 'E', 'T'] as const);
const t = defineTerminalAlphabet(['+', '(', ')', 'int'] as const);

type NTA = typeof nt;
type TA = typeof t;

const spec: CFGSpecifications<NTA, TA> = {
  nt,
  t,
  productions: [
    {LHS: 'S', RHS: ['E']},
    {LHS: 'E', RHS: ['T']},
    {LHS: 'E', RHS: ['E', '+', 'T']},
    {LHS: 'T', RHS: ['int']},
    {LHS: 'T', RHS: ['(', 'E', ')']},
  ],
  startSymbol: 'S',
};

// note: cfg7 is not LR0
export const cfg7 = new ContextFreeGrammar(spec);

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
    '[1 (9)] S -> ·E{$} E -> ·T{$} E -> ·E+T{$} T -> ·int{$} T -> ·(E){$} E -> ·T{+} E -> ·E+T{+} T -> ·int{+} T -> ·(E){+}',
    '[2 (3)] S -> E·{$} E -> E·+T{$} E -> E·+T{+}',
    '[3 (2)] E -> T·{$} E -> T·{+}',
    '[4 (2)] T -> int·{$} T -> int·{+}',
    '[5 (10)] T -> (·E){$} T -> (·E){+} E -> ·T{)} E -> ·E+T{)} T -> ·int{)} T -> ·(E){)} E -> ·T{+} E -> ·E+T{+} T -> ·int{+} T -> ·(E){+}',
    '[6 (6)] E -> E+·T{$} E -> E+·T{+} T -> ·int{$} T -> ·(E){$} T -> ·int{+} T -> ·(E){+}',
    '[7 (4)] T -> (E·){$} T -> (E·){+} E -> E·+T{)} E -> E·+T{+}',
    '[8 (2)] E -> T·{)} E -> T·{+}',
    '[9 (2)] T -> int·{)} T -> int·{+}',
    '[10 (10)] T -> (·E){)} T -> (·E){+} E -> ·T{)} E -> ·E+T{)} T -> ·int{)} T -> ·(E){)} E -> ·T{+} E -> ·E+T{+} T -> ·int{+} T -> ·(E){+}',
    '[11 (2)] E -> E+T·{$} E -> E+T·{+}',
    '[12 (2)] T -> (E)·{$} T -> (E)·{+}',
    '[13 (6)] E -> E+·T{)} E -> E+·T{+} T -> ·int{)} T -> ·(E){)} T -> ·int{+} T -> ·(E){+}',
    '[14 (4)] T -> (E·){)} T -> (E·){+} E -> E·+T{)} E -> E·+T{+}',
    '[15 (2)] E -> E+T·{)} E -> E+T·{+}',
    '[16 (2)] T -> (E)·{)} T -> (E)·{+}',
  ],
  transitions: [
    ['1->NT_E->2', '1->NT_T->3', '1->T_int->4', '1->T_(->5'],
    ['2->T_+->6'],
    ['5->NT_E->7', '5->NT_T->8', '5->T_int->9', '5->T_(->10'],
    ['6->NT_T->11', '6->T_int->4', '6->T_(->5'],
    ['7->T_)->12', '7->T_+->13'],
    ['10->NT_E->14', '10->NT_T->8', '10->T_int->9', '10->T_(->10'],
    ['13->NT_T->15', '13->T_int->9', '13->T_(->10'],
    ['14->T_)->16', '14->T_+->13'],
  ],
};
