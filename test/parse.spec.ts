import assert from 'assert';
import {parse} from '../src';
import {cfg1, expectedParseTree, sentence} from './data/cfg1';
import {cfg3, expectedParseTree3} from './data/cfg3';
import {cfg6, expectedParseTree6, sentence6} from './data/cfg6';
import {cfg7, expectedParseTree7, sentence7} from './data/cfg7';

describe('Parse Unit Test', () => {
  it('test parse BFS1_cfg1', () => {
    const parseTree = parse(sentence, cfg1, {method: 'BFS1'});
    assert.deepStrictEqual(parseTree, expectedParseTree);
  });
  it('test parse BFS2_cfg1', () => {
    const parseTree = parse(sentence, cfg1, {method: 'BFS2'});
    assert.deepStrictEqual(parseTree, expectedParseTree);
  });
  it('test parse BFS3_cfg1', () => {
    const parseTree = parse(sentence, cfg1, {method: 'BFS3'});
    assert.deepStrictEqual(parseTree, expectedParseTree);
  });
  it('test parse DFS1_cfg1', () => {
    const parseTree = parse(sentence, cfg1, {method: 'DFS1'});
    assert.deepStrictEqual(parseTree, expectedParseTree);
  });
  it('test parse DFS2_cfg1', () => {
    const parseTree = parse(sentence, cfg1, {method: 'DFS2'});
    assert.deepStrictEqual(parseTree, expectedParseTree);
  });
  it('test parse LL1_cfg3', () => {
    const s = ['int', '+', '(', 'int', '+', 'int', ')'].map(n => ({name: n}));
    const parseTree3 = parse(s, cfg3, {method: 'LL1'});
    assert.deepStrictEqual(parseTree3, expectedParseTree3);
  });
  it('test parse LR0_cfg6', () => {
    const parseTree6 = parse(sentence6, cfg6, {method: 'LR0'});
    assert.deepStrictEqual(parseTree6, expectedParseTree6);
  });
  it('test parse LR1_cfg7', () => {
    const parseTree7 = parse(sentence7, cfg7, {method: 'LR1'});
    assert.deepStrictEqual(parseTree7, expectedParseTree7);
  });
  it('test parse SLR1_cfg7', () => {
    const parseTree7 = parse(sentence7, cfg7, {method: 'SLR1'});
    assert.deepStrictEqual(parseTree7, expectedParseTree7);
  });
  it('test parse LALR_cfg8', () => {
    const parseTree7 = parse(sentence7, cfg7, {method: 'LALR1'});
    assert.deepStrictEqual(parseTree7, expectedParseTree7);
  });
});
