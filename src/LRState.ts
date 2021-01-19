import {ContextFreeGrammar} from './ContextFreeGrammar';
import {psSerialize} from './interfaces/ParseSymbol';
import {NonTerminal} from './NonTerminal';
import {ProductionWithPosition} from './ProductionWithPosition';

const cache: LRState[] = [];

export class LRState {
  static getFromCache(
    cfg: ContextFreeGrammar,
    pwps: Set<ProductionWithPosition>
  ): LRState | undefined {
    for (const s of cache) {
      if (s.cfg !== cfg) {
        continue;
      }
      // same grammar
      if (s.hasAllPwps(pwps)) {
        return s;
      }
    }
    return undefined;
  }
  static seq = 0;
  id!: number;
  cfg!: ContextFreeGrammar;
  pwps!: Set<ProductionWithPosition>;
  constructor(cfg: ContextFreeGrammar, pwps: Set<ProductionWithPosition>) {
    const state = LRState.getFromCache(cfg, pwps);
    console.log('state: ', state);
    if (state) {
      return state;
    }
    LRState.seq++;
    this.id = LRState.seq;
    this.cfg = cfg;
    this.pwps = pwps;
    cache.push(this);
    this.computeClosure();
  }

  computeClosure() {
    let previousSize = -1;
    let size = this.pwps.size;
    while (size > previousSize) {
      for (const pwp of this.pwps) {
        const nextSymbol = pwp.getNextSymbol();
        if (!(nextSymbol instanceof NonTerminal)) {
          continue;
        }
        this.cfg.productions
          .filter(p => p.LHS === nextSymbol)
          .forEach(p => {
            this.pwps.add(new ProductionWithPosition(p, 0));
          });
      }

      previousSize = size;
      size = this.pwps.size;
    }
  }

  toString() {
    return `[${this.id}] ` + [...this.pwps].map(p => p.toString()).join(' ');
  }

  getSymbolTransitions(): Set<string> {
    const result = new Set<string>();
    this.pwps.forEach(pwp => {
      const symbol = pwp.getNextSymbol();
      if (symbol === undefined) {
        return;
      }

      result.add(psSerialize(symbol));
    });
    return result;
  }

  hasAllPwps(pwps: Set<ProductionWithPosition>) {
    for (const pwp of pwps.keys()) {
      if (!this.pwps.has(pwp)) {
        return false;
      }
    }
    return true;
  }
}
