import assert from 'assert';
import {cfg, nt} from './data/cfg2';

describe('First Unit Test', () => {
  it('test the first function', () => {
    const array = Object.values(nt).map(s => ({nt: s, first: cfg.first(s)}));
    const expectedArray = [
      {
        nt: nt.Num,
        first: ['+', '-', 'd'],
      },
      {
        nt: nt.Sign,
        first: ['', '+', '-'],
      },
      {
        nt: nt.Digits,
        first: ['d'],
      },
      {
        nt: nt.More,
        first: ['', 'd'],
      },
    ];
    assert.deepStrictEqual(array, expectedArray);
  });
});
