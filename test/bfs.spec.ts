import assert from 'assert';
import {CFGSpec, ContextFreeGrammar} from '../src/ContextFreeGrammar';
import {Sentence} from '../src/interfaces/Sentence';
import {NonTerminal} from '../src/NonTerminal';
import {NonTerminalAlphabet} from '../src/NonTerminalAlphabet';
import {Terminal} from '../src/Terminal';
import {TerminalAlphabet} from '../src/TerminalAlphabet';
import {parseWithBFS1} from '../src/top-down/BFS1';

class TA extends NonTerminalAlphabet {
  S = new NonTerminal('S');
  E = new NonTerminal('E');
  F = new NonTerminal('F');
}
class NTA extends TerminalAlphabet {
  PLUS = new Terminal('+');
  INT = new Terminal('int');
}

const t = new NTA();
const nt = new TA();
const spec = {
  startSymbol: nt.S,
  productions: [
    {LHS: nt.S, RHS: [nt.E]},
    {LHS: nt.E, RHS: [nt.E, t.PLUS, nt.F]},
    {LHS: nt.E, RHS: [nt.F]},
    {LHS: nt.F, RHS: [t.INT]},
  ],
} as CFGSpec<NTA, TA>;
const cfg = new ContextFreeGrammar(spec);
console.log('cfg: ', cfg);

describe('BFS Unit Test', () => {
  it('test a simple graph', () => {
    const sentence: Sentence<NTA> = [t.INT, t.PLUS, t.INT, t.PLUS, t.INT];
    console.log('sentence: ', sentence);
    const parseTree = parseWithBFS1<NTA, TA>(sentence, cfg);
    assert(parseTree);
  });
});
