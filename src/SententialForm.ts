import {NonTerminal} from './NonTerminal';
import {ParseSymbol} from './interfaces/ParseSymbol';
import {Sentence} from './interfaces/Sentence';
import {Terminal} from './interfaces/Terminal';
import {Word} from './Word';

type ParseSymbolArray = ParseSymbol[];

/**
 * A sentential form (also called working tree)
 * represents an array of terminal and nonterminal symbols.
 *
 * Note: a sentential form never contains epsilon.
 *
 * source:
 * https://web.stanford.edu/class/archive/cs/cs143/cs143.1128/handouts/080%20Formal%20Grammars.pdf
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

  /**
   * The index of first non-terminal in the left-sentential form.
   * See Aho Ullman Definition 5.1.1
   *
   * @param {NonTerminal} nt
   * @returns {number}
   * @memberof SententialForm
   */
  findLeftBorderIndex(nt: NonTerminal): number {
    return this.symbols.findIndex(s => s === nt);
  }

  findFirstNonTerminal(): NonTerminal | undefined {
    return this.symbols.find(s => s instanceof NonTerminal) as
      | NonTerminal
      | undefined;
  }

  /**
   * The closed portion of a left-sentential form is the bigest prefix string of terminal.
   * See Aho Ullman Definition 5.1.1
   *
   * @returns {Terminal[]}
   * @memberof SententialForm
   */
  getLeftClosedPortion(): Terminal[] {
    const index = this.symbols.findIndex(s => s instanceof NonTerminal);
    return this.symbols.slice(0, index) as Terminal[];
  }

  getLength() {
    return this.symbols.length;
  }

  isEmpty() {
    return this.symbols.length === 0;
  }

  concat(s: SententialForm): SententialForm {
    return new SententialForm([...this.symbols, ...s.symbols]);
  }

  concatWord(w: Word): SententialForm {
    return new SententialForm([...this.symbols, ...w.terminals]);
  }

  concatSet(set: Set<Word>): Set<SententialForm> {
    const result = new Set<SententialForm>();
    for (const e of set) {
      result.add(this.concatWord(e));
    }
    return result;
  }
}
