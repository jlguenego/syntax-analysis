import {LLkTable} from './LLkTable';
import {NonTerminal} from './NonTerminal';
import {WordSet} from './WordSet';

export class LLkTables {
  map = new Map<NonTerminal, Map<WordSet, LLkTable>>();
  cache: LLkTable[] = [];
  constructor() {}
  add(nt: NonTerminal, ws: WordSet, table: LLkTable) {
    let m = this.map.get(nt);
    if (m === undefined) {
      m = new Map<WordSet, LLkTable>();
      this.map.set(nt, m);
    }
    const t = m.get(ws);
    if (t !== undefined) {
      return;
    }
    m.set(ws, table);
    this.cache.push(table);
  }

  get(nt: NonTerminal, ws: WordSet): LLkTable | undefined {
    return this.map.get(nt)?.get(ws);
  }

  getSize(): number {
    return this.cache.length;
  }

  getTables(): LLkTable[] {
    return [...this.cache];
  }

  toString() {
    let result = '';
    for (let i = 0; i < this.cache.length; i++) {
      const table = this.cache[i];
      result += `T${i} ${table.toString()}` + '\n';
    }
    return result;
  }
}
