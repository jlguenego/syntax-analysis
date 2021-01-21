import {BUState} from '../interfaces/BUState';
import {LRState} from '../interfaces/LRState';
import {psSerialize} from '../interfaces/ParseSymbol';
import {Terminal} from '../interfaces/Terminal';
import {ParseError} from '../ParseError';

export const shift = <T extends LRState>(
  previousState: BUState<T>
): BUState<T> => {
  const t = previousState.remainingInput[0];
  const state = {...previousState};
  state.remainingInput = state.remainingInput.slice(1);
  state.parseStack = [...state.parseStack, {node: t}];

  updateAutomatonStateForShift<T>(state, t);
  return state;
};

const updateAutomatonStateForShift = <T extends LRState>(
  state: BUState<T>,
  t: Terminal
): void => {
  try {
    state.automaton.jump(psSerialize(t));
  } catch (error) {
    throw new ParseError('Syntax error.', t);
  }
  state.lrStateStack.push(state.automaton.getCurrentState());
};
