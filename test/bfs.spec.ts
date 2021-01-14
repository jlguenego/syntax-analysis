import assert from 'assert';
import {
  CFGSpec,
  ContextFreeGrammar,
  NonTerminal,
  NonTerminalAlphabet,
  parse,
  ParseTree,
  Sentence,
  Terminal,
  TerminalAlphabet,
} from '../src';

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

describe('BFS Unit Test', () => {
  it('test parseWithBFS1', () => {
    const sentence: Sentence = ['int', '+', 'int', '+', 'int'].map(str => ({
      name: str,
    }));
    const parseTree = parse<NTA, TA>(sentence, cfg, {method: 'BFS1'});
    const expectedParseTree: ParseTree = {
      node: nt.S,
      children: [
        {
          node: nt.E,
          children: [
            {
              node: nt.E,
              children: [
                {
                  node: nt.E,
                  children: [
                    {
                      node: nt.F,
                      children: [{node: t.INT}],
                    },
                  ],
                },
                {
                  node: t.PLUS,
                },
                {
                  node: nt.F,
                  children: [{node: t.INT}],
                },
              ],
            },
            {
              node: t.PLUS,
            },
            {
              node: nt.F,
              children: [{node: t.INT}],
            },
          ],
        },
      ],
    };
    assert.deepStrictEqual(parseTree, expectedParseTree);
  });
});
