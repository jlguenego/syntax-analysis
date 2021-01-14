import assert from 'assert';
import {parse} from '../src';
import {cfg, expectedParseTree, NTA, sentence, TA} from './data/data';

describe('BFS Unit Test', () => {
  it('test parse with BFS1', () => {
    const parseTree = parse<NTA, TA>(sentence, cfg, {method: 'BFS1'});
    assert.deepStrictEqual(parseTree, expectedParseTree);
  });
  it('test parse with BFS2', () => {
    const parseTree = parse<NTA, TA>(sentence, cfg, {method: 'BFS2'});
    assert.deepStrictEqual(parseTree, expectedParseTree);
  });
  it('test parse with BFS3', () => {
    const parseTree = parse<NTA, TA>(sentence, cfg, {method: 'BFS3'});
    assert.deepStrictEqual(parseTree, expectedParseTree);
  });
});
