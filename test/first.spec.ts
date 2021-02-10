import assert from 'assert';
import {SententialForm, Terminal} from '../src';
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
    const array = Object.values(nt).map(s => ({
      nt: s.label,
      firstk: cfg2.firstk(new SententialForm([s]), 2),
    }));
    const expectedArray = [
      {nt: 'Num', firstk: new Set<Terminal[]>([])},
      {nt: 'Sign', firstk: new Set<Terminal[]>([])},
      {nt: 'Digits', firstk: new Set<Terminal[]>([])},
      {nt: 'More', firstk: new Set<Terminal[]>([])},
    ];
    assert.deepStrictEqual(array, expectedArray);
  });
});
