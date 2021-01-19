import {Automaton} from '../Automaton';
import {ContextFreeGrammar} from '../ContextFreeGrammar';
import {LRState} from '../LRState';
import {NonTerminal} from '../NonTerminal';
import {ParseTree} from './ParseTree';
import {Sentence} from './Sentence';

export interface BUState {
  remainingSentence: Sentence;
  parseTrees: ParseTree[];
  cfg: ContextFreeGrammar;
  automaton: Automaton<LRState>;
  isCompleted: boolean;
}

export const getForm = (state: BUState): string => {
  const left = state.parseTrees
    .map(pt => pt.node)
    .map(s => (s instanceof NonTerminal ? s.label : s.name))
    .join('');
  const right = state.remainingSentence.map(s => s.name).join('');
  const result = left + ' | ' + right;
  return result;
};
