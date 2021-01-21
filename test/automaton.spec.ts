import assert from 'assert';
import {buildLR0Automaton} from '../src';
import {buildLR1Automaton} from '../src/bottom-up/lib/LR1Automaton';
import {cfg8, expectedAutomaton8} from './data/cf8';
import {cfg6, expectedAutomaton6} from './data/cfg6';
import {cfg7, expectedAutomaton7} from './data/cfg7';

describe('First Unit Test', () => {
  it('test building the LR0Automaton_cfg6', () => {
    const automaton = buildLR0Automaton(cfg6);
    assert.deepStrictEqual(automaton.toObject(), expectedAutomaton6);
  });
  it('test building the LR0Automaton_cfg8', () => {
    const automaton = buildLR0Automaton(cfg8);
    assert.deepStrictEqual(automaton.toObject(), expectedAutomaton8);
  });
  it('test building the LR1Automaton ', () => {
    const automaton = buildLR1Automaton(cfg7);
    assert.deepStrictEqual(automaton.toObject(), expectedAutomaton7);
  });
});
