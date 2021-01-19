import {
  NonTerminalAlphabet,
  NonTerminal,
  TerminalAlphabet,
  Terminal,
  CFGSpecifications,
  ContextFreeGrammar,
  CFGSpec,
} from '../../src';

class NTA extends NonTerminalAlphabet {
  S = new NonTerminal('S');
  E = new NonTerminal('E');
  T = new NonTerminal('T');
}

class TA extends TerminalAlphabet {
  '+': Terminal = {name: '+'};
  ';': Terminal = {name: ';'};
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
    {LHS: 'E', RHS: ['T', ';']},
    {LHS: 'E', RHS: ['T', '+', 'E']},
    {LHS: 'T', RHS: ['int']},
    {LHS: 'T', RHS: ['(', 'E', ')']},
  ],
};

// note: cfg5 is not LL1
export const cfg6 = new ContextFreeGrammar(spec as CFGSpec, t, nt);

// export const sentence5: Sentence = ['int', '+', 'int', '*', 'int'].map(str => ({
//   name: str,
// }));

// export const expectedParseTree5: ParseTree = {
//   node: nt.E,
//   children: [
//     {
//       node: nt.E,
//       children: [
//         {
//           node: nt.F,
//           children: [
//             {
//               node: nt.T,
//               children: [{node: {name: 'int'}}],
//             },
//           ],
//         },
//       ],
//     },
//     {node: {name: '+'}},
//     {
//       node: nt.F,
//       children: [
//         {
//           node: nt.F,
//           children: [
//             {
//               node: nt.T,
//               children: [{node: {name: 'int'}}],
//             },
//           ],
//         },
//         {node: {name: '*'}},
//         {
//           node: nt.T,
//           children: [{node: {name: 'int'}}],
//         },
//       ],
//     },
//   ],
// };

export const expectedAutomaton6 = {
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
};
