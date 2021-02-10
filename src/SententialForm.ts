import {NonTerminal} from './NonTerminal';
import {ParseSymbol} from './interfaces/ParseSymbol';
import {Sentence} from './interfaces/Sentence';
import {Terminal} from './interfaces/Terminal';
import {ParseTree} from './interfaces/ParseTree';

type ParseSymbolArray = ParseSymbol[];

/**
 * A sentential form (also called working tree)
 * represents an array of terminal and nonterminal symbols.
 *
 * source:
 * https://web.stanford.edu/class/archive/cs/cs143/cs143.1128/handouts/080%20Formal%20Grammars.pdf
 *
 * @export
 * @class SententialForm
 */
export class SententialForm {
  static fromParseTreeArray(parseTrees: ParseTree[]) {
    return new SententialForm(parseTrees.map(pt => pt.node));
  }
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

  findNonTerminalIndex(nt: NonTerminal): number {
    return this.symbols.findIndex(s => s === nt);
  }

  findFirstNonTerminal(): NonTerminal | undefined {
    return this.symbols.find(s => s instanceof NonTerminal) as
      | NonTerminal
      | undefined;
  }

  getNonTerminalPrefix(): Terminal[] {
    const index = this.symbols.findIndex(s => s instanceof NonTerminal);
    return this.symbols.slice(0, index) as Terminal[];
  }

  getLength() {
    return this.symbols.length;
  }

  isEmpty() {
    return this.symbols.length === 0;
  }
}
