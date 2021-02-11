import {getDistinctCouples} from './../src/utils/set';
import {getUnReachableProductionRule} from './../src/utils/check';
import assert from 'assert';
import {cfg1} from './data/cfg1';
import {CFGSpec, getAncestors} from '../src';
import {spec9} from './data/cfg9';

describe('Async Unit Test', () => {
  it('test getAncestor', () => {
    const spec = cfg1.spec;
    const ancestors = getAncestors(spec, 'E');
    assert.deepStrictEqual(ancestors, new Set(['T', 'E']));
  });
  it('test grammar with unreachable rules', () => {
    const rules = getUnReachableProductionRule(spec9 as CFGSpec);
    assert.deepStrictEqual(rules, [{LHS: 'E', RHS: ['a']}]);
  });

  it('test distinctCouples', () => {
    const a = [1, 2, 3];
    const couple = getDistinctCouples(new Set(a));
    assert.deepStrictEqual(couple, [
      [1, 2],
      [1, 3],
      [2, 3],
    ]);
  });
});
