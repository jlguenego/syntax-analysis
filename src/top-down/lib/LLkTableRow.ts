import {NonTerminal} from '../../NonTerminal';
import {WordSet} from './../../WordSet';
export class LLkTableRow {
  followSet = new Set<{nt: NonTerminal; wordset: WordSet}>();
  constructor(public prodIndex: number) {}
}
