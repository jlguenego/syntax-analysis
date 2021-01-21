import {ContextFreeGrammar} from '../ContextFreeGrammar';
import {BUState} from '../interfaces/BUState';
import {ParseTree} from '../interfaces/ParseTree';
import {Sentence} from '../interfaces/Sentence';
import {psSerialize} from '../interfaces/ParseSymbol';
import {Production} from '../interfaces/Production';
import {ParseError} from '../ParseError';
import {buildLR1Automaton} from './lib/LR1Automaton';
import {dollar} from '../terminals/dollar.terminal';
import {shift} from './lib/shift';
import {reduce} from './lib/reduce';
import {LALR1State} from './lib/LALR1';

type BULALR1State = BUState<LALR1State>;

const canShift = (state: BULALR1State): boolean => {
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

const findProduction = (state: BULALR1State): Production => {
  return state.automaton
    .getCurrentState()
    .reducableProductionMap.get(state.remainingInput[0].name) as Production;
};

export const parseWithLALR1 = (
  sentence: Sentence,
  cfg: ContextFreeGrammar
): ParseTree => {
  const automaton = buildLR1Automaton(cfg);
  let state: BULALR1State = {
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
