import {wordSetToString} from '../src';
import assert from 'assert';
import {buildFirstk, newTWord} from '../src';
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
      {nt: 'Sign', first: ['+', '-', 'ε'].sort()},
      {nt: 'Digits', first: ['d'].sort()},
      {nt: 'More', first: ['d', 'ε'].sort()},
    ];
    assert.deepStrictEqual(array, expectedArray);
  });

  it('test the firstk function', () => {
    const k = 2;
    buildFirstk(cfg2, k);
    const array = Object.values(nt).map(s => ({
      nt: s.label,
      firstk: wordSetToString(cfg2.firstk(k, s)),
    }));
    const expectedArray = [
      {nt: 'Num', firstk: 'd,+d,-d,dd'},
      {nt: 'Sign', firstk: 'ε,+,-'},
      {nt: 'Digits', firstk: 'd,dd'},
      {nt: 'More', firstk: 'ε,d,dd'},
    ];
    assert.deepStrictEqual(array, expectedArray);
  });

  it('test the word class', () => {
    const w1 = newTWord(['1', '2'].map(s => ({name: s})));
    const w2 = newTWord(['1', '2'].map(s => ({name: s})));
    assert(w1 === w2);
  });
});
