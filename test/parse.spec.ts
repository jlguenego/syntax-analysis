import assert from 'assert';
import {parse} from '../src';
import {cfg, expectedParseTree, sentence} from './data/cfg1';
import {cfg3, expectedParseTree3} from './data/cfg3';
import {cfg5, expectedParseTree5, sentence5} from './data/cfg5';

describe('BFS Unit Test', () => {
  it('test parse with BFS1', () => {
    const parseTree = parse(sentence, cfg, {method: 'BFS1'});
    assert.deepStrictEqual(parseTree, expectedParseTree);
  });
  it('test parse with BFS2', () => {
    const parseTree = parse(sentence, cfg, {method: 'BFS2'});
    assert.deepStrictEqual(parseTree, expectedParseTree);
  });
  it('test parse with BFS3', () => {
    const parseTree = parse(sentence, cfg, {method: 'BFS3'});
    assert.deepStrictEqual(parseTree, expectedParseTree);
  });
  it('test parse with DFS1', () => {
    const parseTree = parse(sentence, cfg, {method: 'DFS1'});
    assert.deepStrictEqual(parseTree, expectedParseTree);
  });
  it('test parse with DFS2', () => {
    const parseTree = parse(sentence, cfg, {method: 'DFS2'});
    assert.deepStrictEqual(parseTree, expectedParseTree);
  });
  it('test parse cfg3 with LL1', () => {
    const s = ['int', '+', '(', 'int', '+', 'int', ')'].map(n => ({name: n}));
    const parseTree3 = parse(s, cfg3, {method: 'LL1'});
    assert.deepStrictEqual(parseTree3, expectedParseTree3);
  });
  it('test parse cfg5 with LR1', () => {
    const parseTree5 = parse(sentence5, cfg5, {method: 'LR1'});
    assert.deepStrictEqual(parseTree5, expectedParseTree5);
  });
});
