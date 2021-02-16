import {isLL1Simple} from '../src/top-down/lib/simpleLL1';
import assert from 'assert';
import {parse} from '../src';
import {cfg52, expectedParseTree52, sentence52} from './data/aho_ullman/cfg5.2';

describe('LL1 Unit Test', () => {
  it('test LL1_cfg52', async () => {
    const parseTree = parse(sentence52, cfg52, {
      method: 'LLk',
      lookaheadTokenNbr: 1,
    });
    assert.deepStrictEqual(parseTree, expectedParseTree52);
  });
  it('test cfg52_is_simpleLL1', async () => {
    const result = isLL1Simple(cfg52);
    assert.deepStrictEqual(result, true);
  });
});
