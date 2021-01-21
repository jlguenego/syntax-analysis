import {ContextFreeGrammar} from '../ContextFreeGrammar';
import {BUState} from '../interfaces/BUState';
import {ParseTree} from '../interfaces/ParseTree';
import {Sentence} from '../interfaces/Sentence';
import {Production} from '../interfaces/Production';
import {buildLR0Automaton} from './lib/LR0Automaton';
import {LRAction, ReduceAction, ShiftAction} from './lib/LRAction';
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
  const reducables = [
    ...state.automaton.getCurrentState().configSet,
  ].filter(p => p.isReducable());
  return reducables[0].production;
};

const action = (state: BU0State): LRAction => {
  if (canShift(state)) {
    return new ShiftAction();
  }
  return new ReduceAction(findProduction(state));
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
    if (seq > 40) {
      throw new Error('Too much parsing.');
    }
    // find if you need to shift or reduce.
    const a = action(state);
    if (a instanceof ShiftAction) {
      state = shift(state);
      continue;
    }
    state = reduce(state, a.production);
  }

  return state.parseStack[0];
};
