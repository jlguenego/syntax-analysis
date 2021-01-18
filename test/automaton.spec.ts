import assert from 'assert';
import {inspect} from 'util';
import {buildAutomaton} from '../src/bottom-up/LR1';
import {cfg5, expectedAutomaton5} from './data/cfg5';

describe('First Unit Test', () => {
  it('test building the automaton ', () => {
    const automaton = buildAutomaton(cfg5);
    console.log(
      'automaton.toObject(): ',
      inspect(automaton.toObject(), false, null, true)
    );
    assert.deepStrictEqual(automaton.toObject(), expectedAutomaton5);
  });
});
