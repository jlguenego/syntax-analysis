import assert from 'assert';
import {cfg, nt} from './data/cfg4';

describe('Follow Unit Test', () => {
  it('test the follow function', () => {
    const array = Object.values(nt).map(s => {
      return {
        nt: s,
        follow: cfg.follow(s).map(t => t.name),
      };
    });
    const expectedArray = [];
    assert.deepStrictEqual(array, []);
  });
});
