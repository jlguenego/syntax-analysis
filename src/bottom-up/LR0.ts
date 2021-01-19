import {ContextFreeGrammar} from '../ContextFreeGrammar';
import {BUState} from '../interfaces/BUState';
import {ParseTree} from '../interfaces/ParseTree';
import {Sentence} from '../interfaces/Sentence';
import {psSerialize} from '../interfaces/ParseSymbol';
import {Production} from '../interfaces/Production';
import {buildLR0Automaton} from './buildLR0Automaton';
import {LRAction, ReduceAction, ShiftAction} from '../LRAction';
import {ParseError} from '../ParseError';

const canShift = (state: BUState): boolean => {
  const pwps = [...state.automaton.getCurrentState().pwps];
  const reducable = pwps.filter(p => p.isReducable());
  const shiftable = pwps.filter(p => !p.isReducable());
  if (reducable.length > 0 && shiftable.length > 0) {
    throw new ParseError(
      `shift/reduce conflict. productions: ${pwps.map(p => p.toString())}`,
      state.remainingSentence[0]
    );
  }
  return shiftable.length > 0;

  // if (!state.automaton.hasCurrentTransitions()) {
  //   return false;
  // }

  // if (state.remainingSentence.length === 0) {
  //   return false;
  // }
  // // LR 1 !!!
  // const symbol = state.remainingSentence[0];

  // // terminal case
  // const transition = state.automaton.getCurrentTransition(psSerialize(symbol));
  // if (!transition) {
  //   return false;
  // }
  // return true;
};

const shift = (previousState: BUState): BUState => {
  const t = previousState.remainingSentence[0];
  const state = {...previousState};
  state.remainingSentence = state.remainingSentence.slice(1);
  state.parseTrees = [...state.parseTrees];
  state.parseTrees.push({node: t});
  state.automaton.jump(psSerialize(t));
  state.lrstateStack.push(state.automaton.getCurrentState());
  return state;
};

const reduce = (previousState: BUState, production: Production) => {
  const state = {...previousState};
  const length = production.RHS.symbols.length;
  const reducedParseTree = state.parseTrees.slice(0, -length);
  const replacedSlice = state.parseTrees.slice(-length);
  const pt = {node: production.LHS, children: replacedSlice};
  reducedParseTree.push(pt);
  state.parseTrees = reducedParseTree;

  state.lrstateStack = state.lrstateStack.slice(0, -length);
  state.automaton.reset(state.lrstateStack[state.lrstateStack.length - 1]);
  const s = pt.node;
  if (s === state.cfg.startSymbol) {
    state.isCompleted = true;
    if (state.remainingSentence.length > 0) {
      throw new ParseError('remaining text', state.remainingSentence[0]);
    }
    return state;
  }
  state.automaton.jump(psSerialize(s));
  state.lrstateStack.push(state.automaton.getCurrentState());
  return state;
};

const findProduction = (state: BUState): Production => {
  const pwps = [...state.automaton.getCurrentState().pwps].filter(p =>
    p.isReducable()
  );
  if (pwps.length > 1) {
    throw new Error(
      'Reduce/Reduce conflict: ' + state.automaton.getCurrentState()
    );
  }
  return pwps[0].production;
};

const action = (state: BUState): LRAction => {
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
  let state: BUState = {
    remainingSentence: [...sentence],
    parseTrees: [],
    lrstateStack: [automaton.getStartState()],
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

  return state.parseTrees[0];
};
