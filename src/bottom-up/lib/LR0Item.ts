import {ParseSymbol, psSerialize} from '../../interfaces/ParseSymbol';
import {Production} from '../../interfaces/Production';
import {SententialForm} from '../../SententialForm';

const cache: LR0Item[] = [];

export class LR0Item {
  production!: Production;
  position!: number;
  constructor(production: Production, position: number) {
    if (production.RHS.symbols.length < position) {
      throw new Error(
        `position too high: ${production.RHS.symbols.length} < ${position}: ${production.RHS} `
      );
    }
    const item = cache.find(
      e => e.production === production && e.position === position
    );
    if (item) {
      return item;
    }
    this.production = production;
    this.position = position;
    cache.push(this);
  }

  isReducable() {
    return this.position === this.production.RHS.symbols.length;
  }

  getNextSymbol(): ParseSymbol | undefined {
    return this.production.RHS.symbols[this.position];
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
    return this.production.LHS + '->' + s1 + '·' + s2;
  }
}
