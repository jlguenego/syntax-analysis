import assert from 'assert';
import {buildLR0Automaton} from '../src';
import {cfg6, expectedAutomaton6} from './data/cfg6';

describe('First Unit Test', () => {
  it('test building the automaton ', () => {
    const automaton = buildLR0Automaton(cfg6);
    assert.deepStrictEqual(automaton.toObject(), expectedAutomaton6);
  });
});
