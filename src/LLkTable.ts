import {LocalFollow} from './interfaces/LocalFollow';
import {LLkTableRow} from './LLkTableRow';
import {NonTerminal} from './NonTerminal';
import {Word} from './Word';
import {WordSet} from './WordSet';

export class LLkTable {
  map = new Map<Word, LLkTableRow>();

  constructor(public nt: NonTerminal, public ws: WordSet) {}

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
