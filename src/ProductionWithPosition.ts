import {ParseSymbol} from './interfaces/ParseSymbol';
import {Production} from './interfaces/Production';
import {SententialForm} from './SententialForm';

const cache: ProductionWithPosition[] = [];

export class ProductionWithPosition {
  production!: Production;
  position!: number;
  constructor(production: Production, position: number) {
    if (production.RHS.symbols.length < position) {
      throw new Error(
        `position too high: ${production.RHS.symbols.length} < ${position}: ${production.RHS} `
      );
    }
    const pwp = cache.find(
      e => e.production === production && e.position === position
    );
    if (pwp) {
      return pwp;
    }
    this.production = production;
    this.position = position;
    cache.push(this);
  }

  getNextSymbol(): ParseSymbol | undefined {
    return this.production.RHS.symbols[this.position];
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
