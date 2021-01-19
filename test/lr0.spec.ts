import {Group, Lexer, Rule} from '@jlguenego/lexer';
import {Token} from '@jlguenego/lexer/build/src/interfaces/Token';

import assert from 'assert';
import {parse} from '../src';
import {ParseError} from '../src/ParseError';
import {cfg7} from './data/cfg7';

describe('LR0 Unit Test', () => {
  it('test shift/reduce conflict', () => {
    try {
      const str = '345 +(12 + 34 )';
      const blank = new Rule({
        name: 'blank',
        pattern: /\s+/,
        ignore: true,
      });
      const operators = Rule.createGroup(Group.OPERATORS, [
        {
          name: '+',
          pattern: /\+/,
        },
      ]);
      const separators = Rule.createGroup(Group.SEPARATORS, [
        {
          name: '(',
          pattern: /\(/,
        },
        {
          name: ')',
          pattern: /\)/,
        },
      ]);

      const identifier = new Rule({
        name: 'int',
        pattern: /\d+/,
        group: Group.IDENTIFIERS,
      });

      const rules = [blank, ...separators, ...operators, identifier];
      const tokenSequence = new Lexer(rules).tokenize(str);

      parse(tokenSequence, cfg7, {method: 'LR0'});
      assert.fail('must not be reached.');
    } catch (error) {
      if (!(error instanceof ParseError)) {
        assert.fail('error should be ParseError.');
      }
      assert.deepStrictEqual(
        error.message,
        'shift/reduce conflict. productions: E->T·,E->T·+E'
      );
      assert.deepStrictEqual((error.t as Token).position.col, 5);
    }
  });
});
