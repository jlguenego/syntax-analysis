import {NonTerminal} from './NonTerminal';
import {ParseSymbol} from './interfaces/ParseSymbol';
import {Sentence} from './interfaces/Sentence';
import {Terminal} from './interfaces/Terminal';

type ParseSymbolArray = ParseSymbol[];

/**
 * A sentential form (also called working tree)
 * represents an array of terminal and nonterminal symbols.
 *
 * @export
 * @class SententialForm
 */
export class SententialForm {
  constructor(public symbols: ParseSymbolArray) {}

  isSentence(): this is {array: Sentence} {
    for (const s of this.symbols) {
      if (s instanceof NonTerminal) {
        return false;
      }
    }
    return true;
  }

  toString(): string {
    return this.symbols
      .map(s => {
        if (s instanceof NonTerminal) {
          return s.label;
        }
        return s.name;
      })
      .join('');
  }

  hasOnlyNonTerminal(): this is {array: NonTerminal[]} {
    for (const s of this.symbols) {
      if (!(s instanceof NonTerminal)) {
        return false;
      }
    }
    return true;
  }

  isEqualsToSentence(s1: Sentence) {
    if (s1.length !== this.symbols.length) {
      return false;
    }
    for (let i = 0; i < s1.length; i++) {
      if (this.symbols[i] instanceof NonTerminal) {
        return false;
      }
    }
    for (let i = 0; i < s1.length; i++) {
      if (s1[i].name !== (this.symbols[i] as Terminal).name) {
        return false;
      }
    }
    return true;
  }
}
