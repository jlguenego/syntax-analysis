import assert from 'assert';
import {inspect} from 'util';
import {buildAutomaton} from '../src/bottom-up/LR1';
import {cfg6, expectedAutomaton6} from './data/cfg6';

describe('First Unit Test', () => {
  it('test building the automaton ', () => {
    const automaton = buildAutomaton(cfg6);
    console.log(
      'automaton.toObject(): ',
      inspect(automaton.toObject(), false, null, true)
    );
    assert.deepStrictEqual(automaton.toObject(), expectedAutomaton6);
  });
});
