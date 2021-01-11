import assert from 'assert';
import {CFGSpec, ContextFreeGrammar} from '../src/ContextFreeGrammar';
import {ParseTree} from '../src/interfaces/ParseTree';
import {Sentence} from '../src/interfaces/Sentence';
import {Terminal} from '../src/interfaces/Terminal';
import {NonTerminal} from '../src/NonTerminal';
import {NonTerminalAlphabet} from '../src/NonTerminalAlphabet';
import {TerminalAlphabet} from '../src/TerminalAlphabet';
import {parseWithBFS1} from '../src/top-down/BFS1';

class NTA extends NonTerminalAlphabet {
  S = new NonTerminal('S');
  E = new NonTerminal('E');
  F = new NonTerminal('F');
}

class TA extends TerminalAlphabet {
  PLUS: Terminal = {name: '+'};
  INT: Terminal = {name: 'int'};
}

const nt = new NTA();
const t = new TA();

const spec: CFGSpec<TA, NTA> = {
  startSymbol: 'S',
  productions: [
    {LHS: 'S', RHS: ['E']},
    {LHS: 'E', RHS: ['E', 'PLUS', 'F']},
    {LHS: 'E', RHS: ['F']},
    {LHS: 'F', RHS: ['INT']},
  ],
};
const cfg = new ContextFreeGrammar(spec, t, nt);
console.log('cfg: ', cfg);

describe('BFS Unit Test', () => {
  it('test a simple graph', () => {
    const sentence: Sentence = ['int', '+', 'int', '+', 'int'].map(str => ({
      name: str,
    }));
    console.log('sentence: ', sentence);
    const parseTree = parseWithBFS1<NTA, TA>(sentence, cfg);
    console.log('parseTree: ', parseTree);

    const expectedTree: ParseTree = {
      v: nt.S,
      c: [],
      // c: [
      //   {
      //     v: nt.E,
      //     c: [
      //       {
      //         v: nt.E,
      //         c: [
      //           {
      //             v: nt.E,
      //             c: [
      //               {
      //                 v: nt.F,
      //                 c: [{v: t.INT}],
      //               },
      //             ],
      //           },
      //           {
      //             v: t.PLUS,
      //           },
      //           {
      //             v: nt.F,
      //             c: [{v: t.INT}],
      //           },
      //         ],
      //       },
      //       {
      //         v: t.PLUS,
      //       },
      //       {
      //         v: nt.F,
      //         c: [{v: t.INT}],
      //       },
      //     ],
      //   },
      // ],
    };
    console.log('expectedTree: ', expectedTree);
    assert.deepStrictEqual(parseTree, expectedTree);
  });
});
