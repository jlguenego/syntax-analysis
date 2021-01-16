import assert from 'assert';
import {
  CFGSpec,
  ContextFreeGrammar,
  NonTerminal,
  NonTerminalAlphabet,
  Terminal,
  TerminalAlphabet,
} from '../src';

describe('First Unit Test', () => {
  it('test incorrect alphabets (not disjoint)', () => {
    try {
      class T extends TerminalAlphabet {
        a = {name: 'a'} as Terminal;
      }
      class N extends NonTerminalAlphabet {
        a = new NonTerminal('a');
      }
      const t = new T();
      const n = new N();
      const spec: CFGSpec<T, N> = {
        startSymbol: 'a',
        productions: [],
      };
      new ContextFreeGrammar(spec, t, n);
      assert.fail('must throw error');
    } catch (error) {
      assert.deepStrictEqual(
        error.message,
        'Terminal alphabet and nonterminal Alphabet must be disjoint'
      );
    }
  });
});
