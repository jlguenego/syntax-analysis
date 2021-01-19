import assert from 'assert';
import {parse} from '../src';
import {cfg7, sentence7} from './data/cfg7';

describe('BFS Unit Test', () => {
  it('test parse cfg7 with LR0', () => {
    try {
      parse(sentence7, cfg7, {method: 'LR0'});
    } catch (error) {
      assert.deepStrictEqual(error.message, 'toto');
    }
  });
});
