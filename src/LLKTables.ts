import {LLkTable} from './LLkTable';
import {NonTerminal} from './NonTerminal';
import {WordSet} from './WordSet';

export class LLKTables {
  map = new Map<NonTerminal, Map<WordSet, LLkTable>>();
}
