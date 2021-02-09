import assert from 'assert';
import {cfg2, nt} from './data/cfg2';

describe('First Unit Test', () => {
  it('test the first function', () => {
    const array = Object.values(nt).map(s => ({
      nt: s.label,
      first: cfg2
        .first(s)
        .map(t => t.name)
        .sort(),
    }));
    const expectedArray = [
      {nt: 'Num', first: ['+', '-', 'd'].sort()},
      {nt: 'Sign', first: ['+', '-', ''].sort()},
      {nt: 'Digits', first: ['d'].sort()},
      {nt: 'More', first: ['d', ''].sort()},
    ];
    assert.deepStrictEqual(array, expectedArray);
  });
});
