import {ParseSymbol} from './../src/interfaces/ParseSymbol';
import {Tree} from '@jlguenego/tree';
import assert from 'assert';
import {parse} from '../src';
import {cfgJson, scanJSON, jsonStr} from './data/json/json';

describe('JSON Unit Test', () => {
  it('test JSONparse', () => {
    const jsonSentence = scanJSON(jsonStr);
    const parseTree = parse(jsonSentence, cfgJson, {
      method: 'LR1',
    });
    const tree = Tree.fromObject<ParseSymbol>(parseTree);
    console.log('tree: ', tree.getSize());
    assert.deepStrictEqual(tree.getSize(), 101);
  });
});
