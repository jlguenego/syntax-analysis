import {ContextFreeGrammar} from '../ContextFreeGrammar';
import {BUState} from '../interfaces/BUState';
import {ParseTree} from '../interfaces/ParseTree';
import {Sentence} from '../interfaces/Sentence';
import {psSerialize} from '../interfaces/ParseSymbol';
import {Production} from '../interfaces/Production';
import {LRAction, ReduceAction, ShiftAction} from './lib/LRAction';
import {ParseError} from '../ParseError';
import {NonTerminal} from '../NonTerminal';
import {Terminal} from '../interfaces/Terminal';
import {buildLR1Automaton} from './lib/LR1Automaton';
import {LR1State} from './lib/LR1State';
import {dollar} from '../terminals/dollar.terminal';

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
  const items = [...state.automaton.getCurrentState().items];
  const reducable = items.filter(p => p.isReducableForTerminal(symbol));
  if (reducable.length > 0) {
    throw new ParseError('shift/reduce conflict.', symbol);
  }
  return true;
};

const shift = (previousState: BU1State): BU1State => {
  const t = previousState.remainingInput[0];
  const state = {...previousState};
  state.remainingInput = state.remainingInput.slice(1);
  state.parseStack = [...state.parseStack, {node: t}];

  updateAutomatonStateForShift(state, t);
  return state;
};

const updateAutomatonStateForShift = (state: BU1State, t: Terminal): void => {
  state.automaton.jump(psSerialize(t));
  state.lrStateStack.push(state.automaton.getCurrentState());
};

const reduce = (previousState: BU1State, handleProd: Production) => {
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
  state: BU1State,
  reducedHandleNode: NonTerminal,
  hLength: number
): void => {
  const lrStateStack = state.lrStateStack.slice(0, -hLength);
  const lrState = lrStateStack.pop() as LR1State;
  state.automaton.reset(lrState);
  lrStateStack.push(lrState);
  const s = reducedHandleNode;
  if (s === state.cfg.startSymbol) {
    state.isCompleted = true;
    if (state.remainingInput[0] !== dollar) {
      throw new ParseError('remaining text', state.remainingInput[0]);
    }
    return;
  }
  state.automaton.jump(psSerialize(s));
  lrStateStack.push(state.automaton.getCurrentState());
  state.lrStateStack = lrStateStack;
};

const findProduction = (state: BU1State): Production => {
  const items = [...state.automaton.getCurrentState().items].filter(p =>
    p.isReducableForTerminal(state.remainingInput[0])
  );
  if (items.length > 1) {
    throw new Error(
      'Reduce/Reduce conflict: ' + state.automaton.getCurrentState()
    );
  }
  if (items.length === 0) {
    throw new Error(
      'No reducable/No shiftable: ' + state.automaton.getCurrentState()
    );
  }
  return items[0].production;
};

const action = (state: BU1State): LRAction => {
  if (canShift(state)) {
    return new ShiftAction();
  }
  return new ReduceAction(findProduction(state));
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
    const a = action(state);
    if (a instanceof ShiftAction) {
      state = shift(state);
      continue;
    }
    state = reduce(state, a.production);
  }

  return state.parseStack[0];
};
