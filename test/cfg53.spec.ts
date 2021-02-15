import {isStrongLLk} from '../src/top-down/lib/LLK/strongLLk';
import {isLL1Simple} from '../src/top-down/lib/simpleLL1';
import assert from 'assert';
import {cfg53, expectedParseTree53, sentence53} from './data/aho_ullman/cfg5.3';
import {parse} from '../src';

describe('cfg53 Unit Test', () => {
  it('test simple_LL1', async () => {
    assert.deepStrictEqual(isLL1Simple(cfg53), false);
  });
  it('test cfg53_is_simpleLL1', async () => {
    const result = isLL1Simple(cfg53);
    assert.deepStrictEqual(result, false);
  });
  it('test cfg53_is_strongLL2', async () => {
    const result = isStrongLLk(cfg53, 2);
    assert.deepStrictEqual(result, true);
  });
  it('test cfg53_parse', async () => {
    const parseTree = parse(sentence53, cfg53, {
      method: 'LLk',
      lookaheadTokenNbr: 2,
    });
    assert.deepStrictEqual(parseTree, expectedParseTree53);
  });
});
