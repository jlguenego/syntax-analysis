import {LocalFollow} from './interfaces/LocalFollow';
import {TWord} from './interfaces/TWord';
import {LLkTableRow} from './LLkTableRow';
import {NonTerminal} from './NonTerminal';
import {WordSet} from './WordSet';

export class LLkTable extends NonTerminal {
  map = new Map<TWord, LLkTableRow>();

  constructor(index: number, public nt: NonTerminal, public ws: WordSet) {
    super('T' + index);
  }

  toString() {
    let result = `LLKTable ${this.nt} ${this.ws}` + '\n';
    for (const [word, tablerow] of this.map) {
      result += word + ': ' + tablerow + '\n';
    }
    return result;
  }

  getFollowSet(): Set<LocalFollow> {
    const result = new Set<LocalFollow>();
    for (const tablerow of this.map.values()) {
      for (const localFollow of tablerow.followSet) {
        result.add(localFollow);
      }
    }
    return result;
  }
}
