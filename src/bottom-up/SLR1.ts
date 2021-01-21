import {ContextFreeGrammar} from '../ContextFreeGrammar';
import {BUState} from '../interfaces/BUState';
import {ParseTree} from '../interfaces/ParseTree';
import {Sentence} from '../interfaces/Sentence';
import {psSerialize} from '../interfaces/ParseSymbol';
import {Production} from '../interfaces/Production';
import {buildLR0Automaton} from './lib/LR0Automaton';
import {LRAction, ReduceAction, ShiftAction} from './lib/LRAction';
import {ParseError} from '../ParseError';
import {LR0State} from './lib/LR0State';
import {NonTerminal} from '../NonTerminal';
import {shift} from './lib/shift';

type BU0State = BUState<LR0State>;

const canShift = (state: BU0State): boolean => {
  const currentState = state.automaton.getCurrentState();
  currentState.checkReduceReduceConflict();
  if (currentState.shiftableArrayCache.length === 0) {
    return false;
  }
  const symbol = state.remainingInput[0];
  if (symbol === undefined) {
    return false;
  }

  if (currentState.followNameArrayCache.includes(symbol.name)) {
    return false;
  }

  return true;
};

const reduce = (previousState: BU0State, handleProd: Production) => {
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
  state: BU0State,
  reducedHandleNode: NonTerminal,
  hLength: number
): void => {
  const lrStateStack = state.lrStateStack.slice(0, -hLength);
  const lrState = lrStateStack.pop() as LR0State;
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

export const parseWithSLR1 = (
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
