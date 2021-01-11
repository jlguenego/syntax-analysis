import assert from 'assert';
import {CFGSpec, ContextFreeGrammar} from '../src/ContextFreeGrammar';
import {getSentence, ParseTree} from '../src/interfaces/ParseTree';
import {Sentence} from '../src/interfaces/Sentence';
import {Terminal} from '../src/interfaces/Terminal';
import {NonTerminal} from '../src/NonTerminal';
import {NonTerminalAlphabet} from '../src/NonTerminalAlphabet';
import {TerminalAlphabet} from '../src/TerminalAlphabet';

class NTA extends NonTerminalAlphabet {
  S = new NonTerminal('S');
  E = new NonTerminal('E');
  F = new NonTerminal('F');
}

class TA extends TerminalAlphabet {
  PLUS: Terminal = {name: '+'};
  INT: Terminal = {name: 'int'};
}

const nt = new NTA();
const t = new TA();

describe('Sentence Unit Test', () => {
  it('test getSentence', () => {
    const expectedSentence: Sentence = ['int', '+', 'int', '+', 'int'].map(
      str => ({
        name: str,
      })
    );
    // const parseTree = parseWithBFS1<NTA, TA>(sentence, cfg);
    const parseTree: ParseTree = {
      v: nt.S,
      c: [
        {
          v: nt.E,
          c: [
            {
              v: nt.E,
              c: [
                {
                  v: nt.E,
                  c: [
                    {
                      v: nt.F,
                      c: [{v: t.INT}],
                    },
                  ],
                },
                {
                  v: t.PLUS,
                },
                {
                  v: nt.F,
                  c: [{v: t.INT}],
                },
              ],
            },
            {
              v: t.PLUS,
            },
            {
              v: nt.F,
              c: [{v: t.INT}],
            },
          ],
        },
      ],
    };
    const actualSentence = getSentence(parseTree);
    assert.deepStrictEqual(actualSentence, expectedSentence);
  });
});
