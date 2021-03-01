import {cfg1} from './data/cfg1';
import assert from 'assert';
import {
  CFGSpecifications,
  ContextFreeGrammar,
  defineNonTerminalAlphabet,
  defineTerminalAlphabet,
  isRightLinear,
} from '../src';

describe('Async Unit Test', () => {
  it('test grammarLinear_false', () => {
    assert.deepStrictEqual(isRightLinear(cfg1), false);
  });
  it('test grammarLinear_true', () => {
    const nt = defineNonTerminalAlphabet(['S', 'A'] as const);
    const t = defineTerminalAlphabet(['a', 'b'] as const);

    const spec: CFGSpecifications<typeof nt, typeof t> = {
      nt: nt,
      t: t,
      productions: [
        {LHS: 'S', RHS: ['a', 'b', 'a', 'S']},
        {LHS: 'S', RHS: ['a', 'b', 'a', 'A']},
        {LHS: 'A', RHS: ['b']},
      ],
      startSymbol: 'S',
    };
    const cfg = new ContextFreeGrammar(spec);
    assert.deepStrictEqual(isRightLinear(cfg), true);
  });
});
