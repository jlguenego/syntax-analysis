import {LLkTableRow} from './LLkTableRow';
import {Word} from './Word';

export class LLkTable {
  map = new Map<Word, LLkTableRow>();

  toString() {
    let result = '';
    for (const [word, tablerow] of this.map) {
      result += word + ': ' + tablerow + '\n';
    }
    return result;
  }
}
