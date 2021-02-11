import {cfg58, sentence58} from './data/aho_ullman/cfg5.8';
import assert from 'assert';
import {buildLLkTable} from '../src/top-down/lib/LLkTable';
import {parse} from '../src';

describe('LL2 Unit Test', () => {
  it('test cfg58 is not LL1', () => {
    try {
      buildLLkTable(cfg58, 1);
      assert.fail('this should fail');
    } catch (e) {
      assert.deepStrictEqual(
        e.message,
        'Grammar is not LL1: FIRST/FOLLOW conflict for (A, b)'
      );
    }
  });
  it('test cfg58 is LL2', () => {
    // a grammar is LL2 if we can build the table. but we have a Aho Ullman 5.1.1.
    // so some sentence cannot be parsed.
    try {
      parse(sentence58, cfg58, {
        method: 'LLk',
        lookaheadTokenNbr: 2,
      });
    } catch (e) {
      assert.deepStrictEqual(e.message, 'should not come here...');
    }
  });
  // it('test cfg58 is LL3', () => {
  //   // a grammar is LL2 if we can build the table. but we have a Aho Ullman 5.1.1.
  //   // so some sentence cannot be parsed.

  //   parse(sentence58, cfg58, {
  //     method: 'LLk',
  //     lookaheadTokenNbr: 3,
  //   });
  // });
});
