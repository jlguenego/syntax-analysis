import assert from 'assert';
import {CFGSpec, ContextFreeGrammar} from '../src/ContextFreeGrammar';
import {Sentence} from '../src/interfaces/Sentence';
import {NonTerminalAlphabet} from '../src/NonTerminalAlphabet';
import {TerminalAlphabet} from '../src/TerminalAlphabet';

class TA extends NonTerminalAlphabet {
  S = 'S';
  E = 'E';
  F = 'F';
}
class NTA extends TerminalAlphabet {
  PLUS = '+';
  INT = 'int';
}

const t = new NTA();
const nt = new TA();
const spec = {
  startSymbol: nt.S,
  productions: [
    {LHS: 'S', RHS: ['E']},
    {LHS: 'X', RHS: ['E', '+', 'F']},
    {LHS: 'E', RHS: ['F']},
    {LHS: 'F', RHS: ['int']},
  ],
} as CFGSpec<NTA, TA>;
const cfg = new ContextFreeGrammar(spec);
console.log('cfg: ', cfg);

describe('BFS Unit Test', () => {
  it('test a simple graph', () => {
    const sentence: Sentence<NTA> = [t.INT, t.PLUS, t.INT, t.PLUS, t.INT];
    console.log('sentence: ', sentence);
    // const parseTree = parseWithBFS1<NTA, TA>(sentence, cfg);
    assert(1);
  });
});
