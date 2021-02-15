import {LLkTable} from './LLkTable';
import {NonTerminal} from './NonTerminal';
import {WordSet} from './WordSet';

export class LLkTables {
  map = new Map<NonTerminal, Map<WordSet, LLkTable>>();
  add(nt: NonTerminal, ws: WordSet, table: LLkTable) {
    let m = this.map.get(nt);
    if (m === undefined) {
      m = new Map<WordSet, LLkTable>();
      this.map.set(nt, m);
    }
    m.set(ws, table);
  }

  get(nt: NonTerminal, ws: WordSet): LLkTable | undefined {
    return this.map.get(nt)?.get(ws);
  }
}
