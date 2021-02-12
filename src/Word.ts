import {Terminal} from './interfaces/Terminal';
import {dollar} from './terminals/dollar.terminal';
import {epsilon} from './terminals/epsilon.terminal';
// a word (or string) is a suite of terminals. (Aho Ullman: w ∊ Σ*)
// Javascript (Typescript) string already means something, so we take something else.
// for performance reason, two identical words are the same memory reference.

export const wordSetToString = (set: Set<Word>) =>
  [...set].map(w => w.toString()).toString();

const cache = new Set<Word>();

export class Word {
  static retrieve(terminals: Terminal[]): Word | undefined {
    return [...cache].find(w => {
      if (w.terminals.length !== terminals.length) {
        return false;
      }
      for (let i = 0; i < terminals.length; i++) {
        if (terminals[i].name !== w.terminals[i].name) {
          return false;
        }
      }
      return true;
    });
  }
  terminals!: Terminal[];
  constructor(terminals: Terminal[]) {
    const word = Word.retrieve(terminals);
    if (word) {
      return word;
    }
    this.terminals = terminals;
    cache.add(this);
  }

  concat(word: Word, k?: number) {
    if (this === epsilonWord) {
      return word;
    }
    if (word === epsilonWord) {
      return this;
    }
    const array = [...this.terminals, ...word.terminals];
    if (k !== undefined) {
      // truncate the array to the k first elements.
      return new Word(array.slice(0, k));
    }
    return new Word(array);
  }

  toObject(): Object {
    return {...this};
  }

  toString(): string {
    return this.terminals.map(t => t.name).join('');
  }

  destroy(): void {
    cache.delete(this);
  }
}

export const epsilonWord = new Word([epsilon]);
export const dollarWord = new Word([dollar]);
