import {LLkTable} from './LLkTable';
import {ParsingResultRule} from './top-down/ParsingResultRule';
import {Word} from './Word';

export class LLkParsingTable {
  map = new Map<LLkTable, Map<Word, ParsingResultRule>>();

  set(table: LLkTable, word: Word, rule: ParsingResultRule) {
    let map = this.map.get(table);
    if (map === undefined) {
      map = new Map<Word, ParsingResultRule>();
      this.map.set(table, map);
    }
    map.set(word, rule);
  }

  get(table: LLkTable, word: Word): ParsingResultRule | undefined {
    return this.map.get(table)?.get(word);
  }
}
