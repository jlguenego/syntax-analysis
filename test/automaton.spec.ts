import assert from 'assert';
import {buildLR0Automaton} from '../src';
import {buildLR1Automaton} from '../src/bottom-up/lib/LR1Automaton';
import {cfg8, expectedLALR1Automaton8} from './data/cfg8';
import {cfg6, expectedAutomaton6} from './data/cfg6';
import {cfg7, expectedAutomaton7} from './data/cfg7';
import {buildLALR1Automaton} from '../src/bottom-up/lib/LALR1Automaton';

describe('First Unit Test', () => {
  it('test building the LR0Automaton_cfg6', () => {
    const automaton = buildLR0Automaton(cfg6);
    assert.deepStrictEqual(automaton.toObject(), expectedAutomaton6);
  });
  it('test building the LR1Automaton_cfg7 ', () => {
    const automaton = buildLR1Automaton(cfg7);
    assert.deepStrictEqual(automaton.toObject(), expectedAutomaton7);
  });
  it('test building the LALRAutomaton_cfg8', () => {
    const automaton = buildLALR1Automaton(cfg8);
    assert.deepStrictEqual(automaton.toObject(), expectedLALR1Automaton8);
  });
});
