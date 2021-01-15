import assert from 'assert';
import {cfg, nt} from './data/cfg2';

describe('First Unit Test', () => {
  it('test the first function', () => {
    const array = Object.values(nt).map(s => ({nt: s, first: cfg.first(s)}));
    const expectedArray = [
      {
        nt: nt.Num,
        first: [{name: '+'}, {name: '-'}, {name: 'd'}],
      },
      {
        nt: nt.Sign,
        first: [{name: ''}, {name: '+'}, {name: '-'}],
      },
      {nt: nt.Digits, first: [{name: 'd'}]},
      {
        nt: nt.More,
        first: [{name: ''}, {name: 'd'}],
      },
    ];
    assert.deepStrictEqual(array, expectedArray);
  });
});
