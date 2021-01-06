import assert from 'assert';
import {ContextFreeGrammar} from '../src/ContextFreeGrammar';
import {bfs} from '../src/index';
import {P} from '../src/NonTerminal';
import {T} from '../src/Terminal';

describe('BFS Unit Test', () => {
  it('test a simple graph', () => {
    const spec = {
      startSymbol: 'S',
      productions: [
        {LHS: 'S', RHS: [P('E')]},
        {LHS: 'E', RHS: [P('E'), T('+'), P('F')]},
        {LHS: 'E', RHS: [P('F')]},
        {LHS: 'F', RHS: [T('int')]},
      ],
    };
    const cfg = new ContextFreeGrammar(spec);
    console.log('cfg: ', cfg);
    assert.deepStrictEqual(bfs, 123);
  });
});
