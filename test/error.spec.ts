import assert from 'assert';
import {
  CFGSpec,
  CFGSpecifications,
  ContextFreeGrammar,
  NonTerminal,
  NonTerminalAlphabet,
  Terminal,
  TerminalAlphabet,
} from '../src';

describe('Error Unit Test', () => {
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
      const spec: CFGSpecifications<T, N> = {
        startSymbol: 'a',
        productions: [],
      };
      new ContextFreeGrammar(spec as CFGSpec, t, n);
      assert.fail('must throw error');
    } catch (error) {
      assert.deepStrictEqual(
        error.message,
        'Terminal alphabet and nonterminal Alphabet must be disjoint'
      );
    }
  });
});
