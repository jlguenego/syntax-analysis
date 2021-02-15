import {areSetEquals} from './utils/set';
import {Word} from './Word';

const cache = new Set<WordSet>();

export class WordSet {
  set!: Set<Word>;

  static retrieve(set: Set<Word>): WordSet | undefined {
    return [...cache].find(ws => areSetEquals(ws.set, set));
  }

  constructor(set: Set<Word>) {
    const wordset = WordSet.retrieve(set);
    if (wordset) {
      return wordset;
    }
    this.set = set;
    cache.add(this);
  }
}
