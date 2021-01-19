import assert from 'assert';
import {inspect} from 'util';
import {parse} from '../src';
import {cfg1, expectedParseTree, sentence} from './data/cfg1';
import {cfg3, expectedParseTree3} from './data/cfg3';
import {cfg6, expectedParseTree6, sentence6} from './data/cfg6';
// import {cfg5, expectedParseTree5, sentence5} from './data/cfg5';

describe('BFS Unit Test', () => {
  it('test parse with BFS1', () => {
    const parseTree = parse(sentence, cfg1, {method: 'BFS1'});
    assert.deepStrictEqual(parseTree, expectedParseTree);
  });
  it('test parse with BFS2', () => {
    const parseTree = parse(sentence, cfg1, {method: 'BFS2'});
    assert.deepStrictEqual(parseTree, expectedParseTree);
  });
  it('test parse with BFS3', () => {
    const parseTree = parse(sentence, cfg1, {method: 'BFS3'});
    assert.deepStrictEqual(parseTree, expectedParseTree);
  });
  it('test parse with DFS1', () => {
    const parseTree = parse(sentence, cfg1, {method: 'DFS1'});
    assert.deepStrictEqual(parseTree, expectedParseTree);
  });
  it('test parse with DFS2', () => {
    const parseTree = parse(sentence, cfg1, {method: 'DFS2'});
    assert.deepStrictEqual(parseTree, expectedParseTree);
  });
  it('test parse cfg3 with LL1', () => {
    const s = ['int', '+', '(', 'int', '+', 'int', ')'].map(n => ({name: n}));
    const parseTree3 = parse(s, cfg3, {method: 'LL1'});
    assert.deepStrictEqual(parseTree3, expectedParseTree3);
  });
  it('test parse cfg5 with LR0', () => {
    const parseTree5 = parse(sentence6, cfg6, {method: 'LR0'});
    console.log('parseTree5: ', inspect(parseTree5, false, null));
    assert.deepStrictEqual(parseTree5, expectedParseTree6);
  });
});
