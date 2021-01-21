import {ContextFreeGrammar} from '../ContextFreeGrammar';
import {BUState} from '../interfaces/BUState';
import {ParseTree} from '../interfaces/ParseTree';
import {Sentence} from '../interfaces/Sentence';
import {Production} from '../interfaces/Production';
import {buildLR0Automaton} from './lib/LR0Automaton';
import {LR0State} from './lib/LR0State';
import {shift} from './lib/shift';
import {reduce} from './lib/reduce';

type BU0State = BUState<LR0State>;

const canShift = (state: BU0State): boolean => {
  const currentState = state.automaton.getCurrentState();
  currentState.checkReduceReduceConflict();
  currentState.checkShiftReduceConflict();
  const shiftable = [...currentState.configSet].filter(p => !p.isReducable());

  return shiftable.length > 0;
};

const findProduction = (state: BU0State): Production => {
  return state.automaton.getCurrentState().reducableArrayCache[0].production;
};

export const parseWithLR0 = (
  sentence: Sentence,
  cfg: ContextFreeGrammar
): ParseTree => {
  const automaton = buildLR0Automaton(cfg);
  let state: BU0State = {
    remainingInput: [...sentence],
    parseStack: [],
    lrStateStack: [automaton.getStartState()],
    cfg,
    automaton,
    isCompleted: false,
  };
  let seq = 0;
  while (!state.isCompleted) {
    seq++;
    if (seq > 10000) {
      throw new Error('Too much parsing.');
    }
    // find if you need to shift or reduce.

    if (canShift(state)) {
      state = shift(state);
      continue;
    }
    state = reduce(state, findProduction(state));
  }

  return state.parseStack[0];
};
