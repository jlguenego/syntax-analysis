import {Sets} from '@jlguenego/set';
import {TWord, tWordToString} from './interfaces/TWord';

const cache = new Set<WordSet>();

export class WordSet {
  set!: Set<TWord>;

  static retrieve(set: Set<TWord>): WordSet | undefined {
    return [...cache].find(ws => Sets.areEquals(ws.set, set));
  }

  constructor(set: Set<TWord>) {
    const wordset = WordSet.retrieve(set);
    if (wordset) {
      return wordset;
    }
    this.set = set;
    cache.add(this);
  }

  toString() {
    const str = [...this.set].map(w => tWordToString(w)).join(', ');
    return `{ ${str} }`;
  }
}
