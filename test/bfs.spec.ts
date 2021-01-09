import assert from 'assert';
import {CFGSpec, ContextFreeGrammar} from '../src/ContextFreeGrammar';
import {bfs} from '../src/index';
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

describe('BFS Unit Test', () => {
  it('test a simple graph', () => {
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
    assert.deepStrictEqual(bfs, 123);
  });

  it('test attribute of', () => {
    class C {
      a = 'toto';
      b = 123;
    }

    function getProperty<T>(obj: T, str: keyof T): T[keyof T] {
      return obj[str];
    }

    const c = new C();
    const result = getProperty(c, 'b');
    assert.deepStrictEqual(result, 123);
  });
});
