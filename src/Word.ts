import {Terminal} from './interfaces/Terminal';
import {dollar} from './terminals/dollar.terminal';
import {epsilon} from './terminals/epsilon.terminal';
// a word is a suite of terminals. (Aho Ullman: w ∊ Σ*)
// for performance reason, two identical words are the same memory reference.

const cache: Word[] = [];

function findFromCache(terminals: Terminal[]): Word | undefined {
  return cache.find(w => {
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

export class Word {
  terminals!: Terminal[];
  constructor(terminals: Terminal[]) {
    const word = findFromCache(terminals);
    if (word) {
      return word;
    }
    this.terminals = terminals;
    cache.push(this);
  }

  concat(word: Word, k?: number) {
    if (this === epsilonWord) {
      return word;
    }
    if (word === epsilonWord) {
      return this;
    }
    let array = [...this.terminals, ...word.terminals];
    if (k !== undefined) {
      // truncate the array to the k first elements.
      array = array.slice(0, k);
    }
    return new Word(array);
  }

  toObject(): Object {
    return {...this};
  }

  toString(): string {
    return this.terminals.map(t => t.name).join(',');
  }
}

export const epsilonWord = new Word([epsilon]);
export const dollarWord = new Word([dollar]);
