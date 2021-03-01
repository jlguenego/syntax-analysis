import assert from 'assert';
import {
  defineTerminalAlphabet,
  defineNonTerminalAlphabet,
  CFGSpecifications,
  ContextFreeGrammar,
} from '../src';

describe('CFG Unit Test', () => {
  it('test empty_prod', async () => {
    const t = defineTerminalAlphabet(['a', 'c'] as const);
    const nt = defineNonTerminalAlphabet(['A', 'B'] as const);

    const spec: CFGSpecifications<typeof nt, typeof t> = {
      nt,
      t,
      productions: [
        {LHS: 'A', RHS: []},
        {LHS: 'A', RHS: ['A', 'a']},
        {LHS: 'A', RHS: ['c']},
      ],
      startSymbol: 'A',
    };
    const cfg = new ContextFreeGrammar(spec);
    const hasEmptyProd = cfg.hasEmptyProduction();
    assert.deepStrictEqual(hasEmptyProd, true);
  });
});
