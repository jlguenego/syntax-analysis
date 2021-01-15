import assert from 'assert';
import {parse} from '../src';
import {cfg, expectedParseTree, NTA, sentence, TA} from './data/cfg1';
import {cfg3, expectedParseTree3} from './data/cfg3';

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
  it('test parse with DFS1', () => {
    const parseTree = parse<NTA, TA>(sentence, cfg, {method: 'DFS1'});
    assert.deepStrictEqual(parseTree, expectedParseTree);
  });
  it('test parse with LL1', () => {
    const parseTree = parse<NTA, TA>(sentence, cfg, {method: 'LL1'});
    assert.deepStrictEqual(parseTree, expectedParseTree);
  });
  it('test parse cfg3 with LL1', () => {
    const s = ['int', '+', '(', 'int', '+', 'int', ')'].map(n => ({name: n}));
    const parseTree3 = parse<NTA, TA>(s, cfg3, {method: 'LL1'});
    assert.deepStrictEqual(parseTree3, expectedParseTree3);
  });
});
