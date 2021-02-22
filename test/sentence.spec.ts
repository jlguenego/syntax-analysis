import {defineTerminalAlphabet} from './../src/TerminalAlphabet';
import assert from 'assert';
import {getSentence, ParseTree} from '../src/interfaces/ParseTree';
import {Sentence} from '../src/interfaces/Sentence';
import {defineNonTerminalAlphabet} from '../src/NonTerminalAlphabet';

const t = defineTerminalAlphabet(['+', 'int']);
const nt = defineNonTerminalAlphabet(['S', 'E', 'F']);

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
                      children: [{node: t.int}],
                    },
                  ],
                },
                {
                  node: t['+'],
                },
                {
                  node: nt.F,
                  children: [{node: t.int}],
                },
              ],
            },
            {
              node: t['+'],
            },
            {
              node: nt.F,
              children: [{node: t.int}],
            },
          ],
        },
      ],
    };
    const actualSentence = getSentence(parseTree);
    assert.deepStrictEqual(actualSentence, expectedSentence);
  });
});
