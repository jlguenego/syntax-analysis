import {sentence24, cfg24, expectedParseTree24} from './data/aho_ullman/cfg2.4';
import assert from 'assert';
import {parse} from '../src';

describe('CFG24 Unit Test', () => {
  // BFS1 and BFS2 parse too much...
  // BFS3 is ok
  // DFS1 and DFS2 are ok
  // LL1 not ok, LLk is not ok (left recursion)
  // LR0 not ok (because of start symbol)

  it('test parse_cfg24', () => {
    const parseTree = parse(sentence24, cfg24, {
      method: 'DFS2',
    });
    assert.deepStrictEqual(parseTree, expectedParseTree24);
  });
});
