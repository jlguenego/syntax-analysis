import assert from 'assert';
import {
  defineTerminalAlphabet,
  defineNonTerminalAlphabet,
  CFGSpecifications,
  ContextFreeGrammar,
  CFGSpec,
} from '../src';

describe('CFG Unit Test', () => {
  it('test empty_prod', async () => {
    const t = defineTerminalAlphabet(['a', 'c'] as const);
    const nt = defineNonTerminalAlphabet(['A', 'B'] as const);

    const spec: CFGSpecifications<typeof t, typeof nt> = {
      startSymbol: 'A',
      productions: [
        {LHS: 'A', RHS: []},
        {LHS: 'A', RHS: ['A', 'a']},
        {LHS: 'A', RHS: ['c']},
      ],
    };
    const cfg = new ContextFreeGrammar(spec as CFGSpec, t, nt);
    const hasEmptyProd = cfg.hasEmptyProduction();
    assert.deepStrictEqual(hasEmptyProd, true);
  });
});
