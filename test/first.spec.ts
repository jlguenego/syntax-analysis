import assert from 'assert';
import {cfg2, nt} from './data/cfg2';

describe('First Unit Test', () => {
  it('test the first function', () => {
    const array = Object.values(nt).map(s => ({
      nt: s.label,
      first: cfg2.first(s).map(t => t.name),
    }));
    const expectedArray = [
      {nt: 'Num', first: ['+', '-', 'd']},
      {nt: 'Sign', first: ['+', '-', '']},
      {nt: 'Digits', first: ['d']},
      {nt: 'More', first: ['d', '']},
    ];
    assert.deepStrictEqual(array, expectedArray);
  });
});
