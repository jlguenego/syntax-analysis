import {ContextFreeGrammar} from '../ContextFreeGrammar';
import {ParseTree} from './ParseTree';
import {Sentence} from './Sentence';

export interface BUState {
  remainingSentence: Sentence;
  parseTrees: ParseTree[];
  cfg: ContextFreeGrammar;
}
