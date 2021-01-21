import {ContextFreeGrammar} from '../ContextFreeGrammar';
import {BUState} from '../interfaces/BUState';
import {ParseTree} from '../interfaces/ParseTree';
import {Sentence} from '../interfaces/Sentence';
import {psSerialize} from '../interfaces/ParseSymbol';
import {Production} from '../interfaces/Production';
import {ParseError} from '../ParseError';
import {buildLR1Automaton} from './lib/LR1Automaton';
import {LR1State} from './lib/LR1State';
import {dollar} from '../terminals/dollar.terminal';
import {shift} from './lib/shift';
import {reduce} from './lib/reduce';

type BU1State = BUState<LR1State>;

const canShift = (state: BU1State): boolean => {
  if (!state.automaton.hasCurrentTransitions()) {
    return false;
  }

  // LR 1
  const symbol = state.remainingInput[0];
  if (symbol === dollar) {
    return false;
  }

  // terminal case
  const transition = state.automaton.getCurrentTransition(psSerialize(symbol));
  if (!transition) {
    return false;
  }

  // if shift/reduce conflict, prefer shift.
  const configSet = [...state.automaton.getCurrentState().configSet];
  const reducables = configSet.filter(p => p.isReducableForTerminal(symbol));
  if (reducables.length > 0) {
    throw new ParseError('shift/reduce conflict.', symbol);
  }
  return true;
};

const findProduction = (state: BU1State): Production => {
  return state.automaton
    .getCurrentState()
    .reducableProductionMap.get(state.remainingInput[0].name) as Production;
};

export const parseWithLR1 = (
  sentence: Sentence,
  cfg: ContextFreeGrammar
): ParseTree => {
  const automaton = buildLR1Automaton(cfg);
  let state: BU1State = {
    remainingInput: [...sentence, dollar],
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
    if (canShift(state)) {
      state = shift(state);
      continue;
    }
    state = reduce(state, findProduction(state));
  }

  return state.parseStack[0];
};
