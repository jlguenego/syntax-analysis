import {ParseSymbol, psSerialize} from '../../interfaces/ParseSymbol';
import {Production} from '../../interfaces/Production';
import {Terminal} from '../../interfaces/Terminal';
import {SententialForm} from '../../SententialForm';

const cache: LR1Item[] = [];

export class LR1Item {
  production!: Production;
  position!: number;
  lookAhead!: Terminal;
  constructor(production: Production, position: number, lookAhead: Terminal) {
    if (production.RHS.symbols.length < position) {
      throw new Error(
        `position too high: ${production.RHS.symbols.length} < ${position}: ${production.RHS} `
      );
    }
    const item = cache.find(
      e =>
        e.production === production &&
        e.position === position &&
        e.lookAhead === lookAhead
    );
    if (item) {
      return item;
    }
    this.production = production;
    this.position = position;
    this.lookAhead = lookAhead;
    cache.push(this);
  }

  isReducable() {
    return this.position === this.production.RHS.symbols.length;
  }

  getNextSymbol(): ParseSymbol | undefined {
    return this.production.RHS.symbols[this.position];
  }

  getAfterNextSymbol(): ParseSymbol[] {
    return this.production.RHS.symbols.slice(this.position + 1);
  }

  getNextSerializedSymbol(): string | undefined {
    const s = this.getNextSymbol();
    if (s === undefined) {
      return undefined;
    }
    return psSerialize(s);
  }

  toString() {
    const s1 = new SententialForm(
      this.production.RHS.symbols.slice(0, this.position)
    );
    const s2 = new SententialForm(
      this.production.RHS.symbols.slice(this.position)
    );
    return `${this.production.LHS.toString()} -> ${s1.toString()}·${s2.toString()}{${
      this.lookAhead.name
    }}`;
  }
}
