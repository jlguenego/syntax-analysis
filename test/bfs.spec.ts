import assert from 'assert';
import {CFGSpec, ContextFreeGrammar} from '../src/ContextFreeGrammar';
import {bfs} from '../src/index';
import {Sentence} from '../src/interfaces/Sentence';
import {NonTerminal} from '../src/NonTerminal';
import {NonTerminalAlphabet} from '../src/NonTerminalAlphabet';
import {Terminal} from '../src/Terminal';
import {TerminalAlphabet} from '../src/TerminalAlphabet';

class TestNTAlphabet extends NonTerminalAlphabet {
  S = new NonTerminal('S');
  E = new NonTerminal('E');
  F = new NonTerminal('F');
}
class TestTAlphabet extends TerminalAlphabet {
  PLUS = new Terminal('+');
  INT = new Terminal('int');
}

const t = new TestTAlphabet();
const nt = new TestNTAlphabet();
const spec = {
  startSymbol: nt.S,
  productions: [
    {LHS: nt.S, RHS: [nt.E]},
    {LHS: nt.E, RHS: [nt.E, t.PLUS, nt.F]},
    {LHS: nt.E, RHS: [nt.F]},
    {LHS: nt.F, RHS: [t.INT]},
  ],
} as CFGSpec<TestTAlphabet, TestNTAlphabet>;
const cfg = new ContextFreeGrammar(spec);
console.log('cfg: ', cfg);

describe('BFS Unit Test', () => {
  it('test a simple graph', () => {
    const sentence: Sentence<TestTAlphabet> = [
      t.INT,
      t.PLUS,
      t.INT,
      t.PLUS,
      t.INT,
    ];
    console.log('sentence: ', sentence);
    assert.deepStrictEqual(bfs, 123);
  });
});
