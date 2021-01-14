import assert from 'assert';
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
    const parseTree: ParseTree = {
      node: nt.S,
      children: [
        {
          node: nt.E,
          children: [
            {
              node: nt.E,
              children: [
                {
                  node: nt.E,
                  children: [
                    {
                      node: nt.F,
                      children: [{node: t.INT}],
                    },
                  ],
                },
                {
                  node: t.PLUS,
                },
                {
                  node: nt.F,
                  children: [{node: t.INT}],
                },
              ],
            },
            {
              node: t.PLUS,
            },
            {
              node: nt.F,
              children: [{node: t.INT}],
            },
          ],
        },
      ],
    };
    const actualSentence = getSentence(parseTree);
    assert.deepStrictEqual(actualSentence, expectedSentence);
  });
});
