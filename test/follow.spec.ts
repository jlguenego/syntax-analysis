import assert from 'assert';
import {Terminal} from '../src';
import {cfg} from './data/cfg2';

describe('Follow Unit Test', () => {
  it('test the follow function', () => {
    const array = [...cfg.productionMap.keys()].map(s => {
      return {
        nt: s.label,
        follow: [...(cfg.followCache.get(s) as Set<Terminal>)].map(t => t.name),
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
