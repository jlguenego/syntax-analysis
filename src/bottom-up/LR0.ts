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
import {Terminal} from '../interfaces/Terminal';

type BU0State = BUState<LR0State>;

const canShift = (state: BU0State): boolean => {
  const items = [...state.automaton.getCurrentState().items];
  const reducable = items.filter(p => p.isReducable());
  const shiftable = items.filter(p => !p.isReducable());
  if (reducable.length > 0 && shiftable.length > 0) {
    throw new ParseError(
      `shift/reduce conflict. productions: ${items.map(p => p.toString())}`,
      state.remainingInput[0]
    );
  }
  if (reducable.length > 1) {
    throw new ParseError(
      `reduce/reduce conflict. productions: ${items.map(p => p.toString())}`,
      state.remainingInput[0]
    );
  }
  if (reducable.length === 0 && shiftable.length === 0) {
    throw new ParseError(
      `no shift or reduce possible. productions: ${items.map(p =>
        p.toString()
      )}`,
      state.remainingInput[0]
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

const shift = (previousState: BU0State): BU0State => {
  const t = previousState.remainingInput[0];
  const state = {...previousState};
  state.remainingInput = state.remainingInput.slice(1);
  state.parseStack = [...state.parseStack, {node: t}];

  updateAutomatonStateForShift(state, t);
  return state;
};

const updateAutomatonStateForShift = (state: BU0State, t: Terminal): void => {
  state.automaton.jump(psSerialize(t));
  state.lrStateStack.push(state.automaton.getCurrentState());
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
  const items = [...state.automaton.getCurrentState().items].filter(p =>
    p.isReducable()
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
