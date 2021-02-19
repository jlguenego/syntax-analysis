import {getUnReachableProductionRule} from '../src/utils/check';
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
    const rules = getUnReachableProductionRule((spec9 as unknown) as CFGSpec);
    assert.deepStrictEqual(rules, [{LHS: 'E', RHS: ['a']}]);
  });
});
