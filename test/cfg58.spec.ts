import {epsilonWord} from './../src/Word';
import {wordSetToString} from '../src/Word';
import {cfg58, nt58} from './data/aho_ullman/cfg5.8';
import assert from 'assert';
import {
  buildLLkParsingTable,
  buildLLkTables,
  getFirstFollowIntersec,
  isStrongLLk,
  WordSet,
} from '../src';

describe('CFG58 Unit Test', () => {
  it('test cfg58 is not LL1', () => {
    try {
      buildLLkParsingTable(cfg58, 1);
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

  it('test cfg58_T0', () => {
    buildLLkTables(cfg58, 2);
    console.log(
      cfg58.llkTableCache
        .get(2)
        ?.map?.get(nt58.S)
        ?.get(new WordSet(new Set([epsilonWord])))
        ?.toString()
    );
  });
});
