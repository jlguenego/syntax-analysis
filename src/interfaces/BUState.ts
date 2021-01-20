import {Automaton} from '../Automaton';
import {ContextFreeGrammar} from '../ContextFreeGrammar';
import {LR0State} from '../bottom-up/lib/LR0State';
import {NonTerminal} from '../NonTerminal';
import {ParseTree} from './ParseTree';
import {Sentence} from './Sentence';

export interface BUState {
  remainingInput: Sentence;
  parseStack: ParseTree[];
  lrStateStack: LR0State[];
  cfg: ContextFreeGrammar;
  automaton: Automaton<LR0State>;
  isCompleted: boolean;
}

export const getForm = (state: BUState): string => {
  const left = state.parseStack
    .map(pt => pt.node)
    .map(s => (s instanceof NonTerminal ? s.label : s.name))
    .join('');
  const right = state.remainingInput.map(s => s.name).join('');
  const result = left + ' | ' + right;
  return result;
};
