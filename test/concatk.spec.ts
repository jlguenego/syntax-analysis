import assert from 'assert';
import {concatk} from '../src';

describe('Concatk Unit Test', () => {
  it('test concatk', () => {
    const k = 2;
    const set = concatk(k);
    assert.deepStrictEqual(set.size, 0);
  });
});
