import {ContextFreeGrammar} from '../ContextFreeGrammar';
import {BUState} from '../interfaces/BUState';
import {ParseTree} from '../interfaces/ParseTree';
import {Sentence} from '../interfaces/Sentence';
import {psSerialize} from '../interfaces/ParseSymbol';
import {Production} from '../interfaces/Production';
import {buildAutomaton} from './buildAutomaton';

const canShift = (state: BUState): boolean => {
  if (!state.automaton.hasCurrentTransitions()) {
    return false;
  }

  if (state.remainingSentence.length === 0) {
    return false;
  }
  const symbol = state.remainingSentence[0];

  // terminal case
  const transition = state.automaton.getCurrentTransition(psSerialize(symbol));
  if (!transition) {
    return false;
  }
  return true;
};

const shift = (previousState: BUState): BUState => {
  const t = previousState.remainingSentence[0];
  const state = {...previousState};
  state.remainingSentence = state.remainingSentence.slice(1);
  state.parseTrees = [...state.parseTrees];
  state.parseTrees.push({node: t});
  state.automaton.jump(psSerialize(t));
  return state;
};

const reduce = (previousState: BUState, production: Production) => {
  const state = {...previousState};
  const length = production.RHS.symbols.length;
  const reducedParseTree = state.parseTrees.slice(0, -length);
  const replacedSlice = state.parseTrees.slice(-length);
  reducedParseTree.push({node: production.LHS, children: replacedSlice});
  state.parseTrees = reducedParseTree;

  state.automaton.reset(state.automaton.getStartState());
  for (const s of state.parseTrees.map(pt => pt.node)) {
    if (s === state.cfg.startSymbol) {
      state.isCompleted = true;
      break;
    }
    state.automaton.jump(psSerialize(s));
  }
  return state;
};

const findProduction = (state: BUState): Production => {
  const pwps = [...state.automaton.getCurrentState().pwps];
  if (pwps.length > 1) {
    throw new Error(
      'Many Productions can be the handle.' + state.automaton.getCurrentState()
    );
  }
  return pwps[0].production;
};

export const parseWithLR0 = (
  sentence: Sentence,
  cfg: ContextFreeGrammar
): ParseTree => {
  const automaton = buildAutomaton(cfg);
  let state: BUState = {
    remainingSentence: [...sentence],
    parseTrees: [],
    lrstateStack: [automaton.getStartState()],
    cfg,
    automaton,
    isCompleted: false,
  };
  let seq = 0;
  while (true) {
    seq++;
    if (seq > 40) {
      throw new Error('Too much parsing.');
    }
    // find if you need to shift or reduce.
    if (canShift(state)) {
      state = shift(state);
      continue;
    }
    // which production must be taken ?
    const production = findProduction(state);
    state = reduce(state, production);
    if (state.isCompleted) {
      break;
    }
  }

  return state.parseTrees[0];
};
