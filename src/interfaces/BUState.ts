import {Automaton} from '../Automaton';
import {ContextFreeGrammar} from '../ContextFreeGrammar';
import {NonTerminal} from '../NonTerminal';
import {LRState} from './LRState';
import {ParseTree} from './ParseTree';
import {Sentence} from './Sentence';

export interface BUState<State extends LRState> {
  remainingInput: Sentence;
  parseStack: ParseTree[];
  lrStateStack: State[];
  cfg: ContextFreeGrammar;
  automaton: Automaton<State>;
  isCompleted: boolean;
}

export const getForm = <State extends LRState>(
  state: BUState<State>
): string => {
  const left = state.parseStack
    .map(pt => pt.node)
    .map(s => (s instanceof NonTerminal ? s.label : s.name))
    .join('');
  const right = state.remainingInput.map(s => s.name).join('');
  const result = left + ' | ' + right;
  return result;
};
