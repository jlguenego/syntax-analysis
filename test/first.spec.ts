import assert from 'assert';
import {buildFirstk} from '../src';
import {Word} from '../src';
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

  it('test the firstk function', () => {
    const k = 2;
    buildFirstk(cfg2, k);
    const array = Object.values(nt).map(s => ({
      nt: s.label,
      firstk: [...cfg2.firstk(k, s)].map(w => w.terminals.map(t => t.name)),
    }));
    const expectedArray = [
      {
        nt: 'Num',
        firstk: [['d'], ['+', 'd'], ['-', 'd'], ['d', 'd']],
      },
      {nt: 'Sign', firstk: [[''], ['+'], ['-']]},
      {nt: 'Digits', firstk: [['d'], ['d', 'd']]},
      {nt: 'More', firstk: [[''], ['d'], ['d', 'd']]},
    ];
    assert.deepStrictEqual(array, expectedArray);
  });

  it('test the word class', () => {
    const w1 = new Word(['1', '2'].map(s => ({name: s})));
    const w2 = new Word(['1', '2'].map(s => ({name: s})));
    assert(w1 === w2);
  });
});
