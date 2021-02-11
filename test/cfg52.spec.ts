import assert from 'assert';
import {inspect} from 'util';
import {parse} from '../src';
import {cfg52, expectedParseTree52, sentence52} from './data/aho_ullman/cfg5.2';

describe('LL1 Unit Test', () => {
  it('test LL1_cfg52', async () => {
    const parseTree = parse(sentence52, cfg52, {
      method: 'LLk',
      lookaheadTokenNbr: 1,
    });
    console.log('parseTree: ', inspect(parseTree, false, null));
    assert.deepStrictEqual(parseTree, expectedParseTree52);
  });
});
