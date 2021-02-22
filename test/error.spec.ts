import {defineNonTerminalAlphabet} from './../src/NonTerminalAlphabet';
import {defineTerminalAlphabet} from './../src/TerminalAlphabet';
import assert from 'assert';
import {CFGSpecifications, ContextFreeGrammar} from '../src';

describe('Error Unit Test', () => {
  it('test incorrect alphabets (not disjoint)', () => {
    try {
      const t = defineTerminalAlphabet(['a']);
      const nt = defineNonTerminalAlphabet(['a']);
      const spec: CFGSpecifications<typeof t, typeof nt> = {
        nt,
        t,
        startSymbol: 'a',
        productions: [],
      };
      new ContextFreeGrammar(spec);
      assert.fail('must throw error');
    } catch (error) {
      assert.deepStrictEqual(
        error.message,
        'Terminal alphabet and nonterminal Alphabet must be disjoint'
      );
    }
  });
});
