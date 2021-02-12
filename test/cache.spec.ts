import assert from 'assert';
import {NonTerminal} from '../src';

describe('Cache Unit Test', () => {
  it('test cache', () => {
    const a = new NonTerminal('a');
    const b = new NonTerminal('a');
    assert.deepStrictEqual(a === b, true);
  });
});
