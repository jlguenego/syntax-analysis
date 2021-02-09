import assert from 'assert';
import {Lexer, Group, Rule, Token} from '@jlguenego/lexer';

import {parse} from '../src';
import {cfg3} from './data/cfg3';
import {ParseError} from '../src/ParseError';

describe('Error Unit Test', () => {
  it('test a syntax_error', () => {
    const str = '(3 + 5) * 8';
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
      {
        name: '*',
        pattern: /\*/,
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

    const rules = [blank, ...operators, ...separators, identifier];
    const tokenSequence = new Lexer(rules).tokenize(str);
    try {
      parse(tokenSequence, cfg3, {method: 'LL1'});
      assert.fail('parse did not failed as expected.');
    } catch (error) {
      if (error instanceof ParseError) {
        assert.deepStrictEqual(error.message, 'LL(1) Parser: Syntax Error.');
        assert.deepStrictEqual((error.t as Token).position.col, 9);
      } else {
        throw error;
      }
    }
  });
});
