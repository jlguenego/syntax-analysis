import {NonTerminal} from '../NonTerminal';
import {WordSet} from '../WordSet';

export interface LocalFollow {
  nt: NonTerminal;
  wordset: WordSet;
}
