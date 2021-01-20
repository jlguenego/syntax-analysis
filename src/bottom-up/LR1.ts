import {ContextFreeGrammar} from '../ContextFreeGrammar';
import {BUState} from '../interfaces/BUState';
import {ParseTree} from '../interfaces/ParseTree';
import {Sentence} from '../interfaces/Sentence';
import {psSerialize} from '../interfaces/ParseSymbol';
import {Production} from '../interfaces/Production';
import {buildLR0Automaton} from './lib/LR0Automaton';
import {LRAction, ReduceAction, ShiftAction} from './lib/LRAction';
import {ParseError} from '../ParseError';
import {LRState} from './lib/LRState';
import {NonTerminal} from '../NonTerminal';
import {Terminal} from '../interfaces/Terminal';

const canShift = (state: BUState): boolean => {
  if (!state.automaton.hasCurrentTransitions()) {
    return false;
  }

  if (state.remainingInput.length === 0) {
    return false;
  }
  // LR 1
  const symbol = state.remainingInput[0];

  // terminal case
  const transition = state.automaton.getCurrentTransition(psSerialize(symbol));
  if (!transition) {
    return false;
  }

  // if shift/reduce conflict, prefer shift.
  return true;
};

const shift = (previousState: BUState): BUState => {
  const t = previousState.remainingInput[0];
  const state = {...previousState};
  state.remainingInput = state.remainingInput.slice(1);
  state.parseStack = [...state.parseStack, {node: t}];

  updateAutomatonStateForShift(state, t);
  return state;
};

const updateAutomatonStateForShift = (state: BUState, t: Terminal): void => {
  state.automaton.jump(psSerialize(t));
  state.lrStateStack.push(state.automaton.getCurrentState());
};

const reduce = (previousState: BUState, handleProd: Production) => {
  const state = {...previousState};
  const hLength = handleProd.RHS.symbols.length;
  const semiDigestedStack = state.parseStack.slice(0, -hLength);
  const handle = state.parseStack.slice(-hLength);
  const reducedHandle = {node: handleProd.LHS, children: handle};
  semiDigestedStack.push(reducedHandle);
  state.parseStack = semiDigestedStack;

  updateAutomatonStateForReduce(state, reducedHandle.node, hLength);

  return state;
};

const updateAutomatonStateForReduce = (
  state: BUState,
  reducedHandleNode: NonTerminal,
  hLength: number
): void => {
  const lrStateStack = state.lrStateStack.slice(0, -hLength);
  const lrState = lrStateStack.pop() as LRState;
  state.automaton.reset(lrState);
  lrStateStack.push(lrState);
  const s = reducedHandleNode;
  if (s === state.cfg.startSymbol) {
    state.isCompleted = true;
    if (state.remainingInput.length > 0) {
      throw new ParseError('remaining text', state.remainingInput[0]);
    }
    return;
  }
  state.automaton.jump(psSerialize(s));
  lrStateStack.push(state.automaton.getCurrentState());
  state.lrStateStack = lrStateStack;
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
  if (pwps.length === 0) {
    throw new Error(
      'No reducable/No shiftable: ' + state.automaton.getCurrentState()
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

export const parseWithLR1 = (
  sentence: Sentence,
  cfg: ContextFreeGrammar
): ParseTree => {
  const automaton = buildLR0Automaton(cfg);
  let state: BUState = {
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
