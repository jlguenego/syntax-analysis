import {wordSetToString} from '../src/Word';
import {
  cfg58,
  expectedLLkTableString58,
  expectedParseTree58,
  sentence58,
} from './data/aho_ullman/cfg5.8';
import assert from 'assert';
import {
  buildLLkParsingTable,
  buildLLkTables,
  getFirstFollowIntersec,
  getLLkTableCache,
  isStrongLLk,
  parse,
} from '../src';

describe('CFG58 Unit Test', () => {
  it('test cfg58 is not LL1', () => {
    try {
      buildLLkParsingTable(cfg58, 1);
      assert.fail('this should fail');
    } catch (e) {
      assert.deepStrictEqual(
        e.message,
        'Grammar is not LL(1). Conflict while building the LLk Table. u=b, prod index rule=3 and 2.'
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
    const k = 2;
    buildLLkTables(cfg58, k);
    assert.deepStrictEqual(
      getLLkTableCache(cfg58, k).toString(),
      expectedLLkTableString58
    );
  });
  it('test parse_cfg58', () => {
    const k = 2;
    const parseTree = parse(sentence58, cfg58, {
      method: 'LLk',
      lookaheadTokenNbr: k,
    });
    assert.deepStrictEqual(parseTree, expectedParseTree58);
  });
});
