import {LLkTable} from './LLkTable';
import {ParsingResultRule} from './LLK/ParsingResultRule';
import {TWord} from './interfaces/TWord';

export class LLkParsingTable {
  map = new Map<LLkTable, Map<TWord, ParsingResultRule>>();

  set(table: LLkTable, word: TWord, rule: ParsingResultRule) {
    let map = this.map.get(table);
    if (map === undefined) {
      map = new Map<TWord, ParsingResultRule>();
      this.map.set(table, map);
    }
    map.set(word, rule);
  }

  get(table: LLkTable, word: TWord): ParsingResultRule | undefined {
    return this.map.get(table)?.get(word);
  }
}
