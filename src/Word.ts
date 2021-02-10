import {Terminal} from './interfaces/Terminal';
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

  concat(word: Word) {
    return new Word([...this.terminals, ...word.terminals]);
  }
}
