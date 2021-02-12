import {wordSetToString} from '../src/Word';
import {getFirstFollowIntersec} from '../src/top-down/lib/strongLLk';
import {cfg58, sentence58} from './data/aho_ullman/cfg5.8';
import assert from 'assert';
import {buildLLkTable} from '../src/top-down/lib/LLkTable';
import {parse} from '../src';
import {isStrongLLk} from '../src/top-down/lib/strongLLk';

describe('CFG58 Unit Test', () => {
  it('test cfg58 is not LL1', () => {
    try {
      buildLLkTable(cfg58, 1);
      assert.fail('this should fail');
    } catch (e) {
      assert.deepStrictEqual(
        e.message,
        'Grammar is not LL(1): conflict for (A, b): rules 2 and 3.'
      );
    }
  });
  it('test cfg58_is_strongLL2', async () => {
    const result = isStrongLLk(cfg58, 2);
    assert.deepStrictEqual(result, false);
  });
  it('test why_cfg58 is not strong LL2', async () => {
    const result = getFirstFollowIntersec(cfg58, 2);
    assert.deepStrictEqual(wordSetToString(result), 'ba');
  });
  // it('test showLL2Table', async () => {
  //   const result = buildLLkTable(cfg58, 2);
  //   assert.deepStrictEqual(result, 'ba');
  // });
  it('test cfg58 is LL2', () => {
    // a grammar is LL2 if we can build the table. but we have a Aho Ullman 5.1.1.
    // so some sentence cannot be parsed.
    try {
      parse(sentence58, cfg58, {
        method: 'LLk',
        lookaheadTokenNbr: 2,
      });
    } catch (e) {
      assert.deepStrictEqual(
        e.message,
        'Grammar is not LL(2): conflict for (A, ba): rules 2 and 3.'
      );
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
