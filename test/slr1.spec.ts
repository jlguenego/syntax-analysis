import assert from 'assert';
import {parse} from '../src';
import {ParseError} from '../src/ParseError';
import {cfg8, sentence8} from './data/cfg8';

describe('SLR1 Unit Test', () => {
  it('test conflict', () => {
    try {
      parse(sentence8, cfg8, {method: 'SLR1'});
      assert.fail('must not be reached.');
    } catch (error) {
      if (!(error instanceof ParseError)) {
        assert.fail('error must be ParseError');
      }
      assert.deepStrictEqual(error.message, 'remaining text');
      assert.deepStrictEqual(error.t.name, '=');
    }
  });
});
