import assert from 'assert';
import {Terminal} from '../src';
import {cfg2} from './data/cfg2';

describe('Follow Unit Test', () => {
  it('test the follow function', () => {
    const array = [...cfg2.productionMap.keys()].map(s => {
      return {
        nt: s.label,
        follow: [...(cfg2.followCache.get(s) as Set<Terminal>)].map(
          t => t.name
        ),
      };
    });
    const expectedArray = [
      {nt: 'Num', follow: ['$']},
      {nt: 'Sign', follow: ['d']},
      {nt: 'Digits', follow: ['$']},
      {nt: 'More', follow: ['$']},
    ];
    assert.deepStrictEqual(array, expectedArray);
  });
});
