import {ContextFreeGrammar} from '../../ContextFreeGrammar';
import {psSerialize} from '../../interfaces/ParseSymbol';
import {NonTerminal} from '../../NonTerminal';
import {LR0Item} from './LR0Item';

const cache: LR1State[] = [];

export class LR1State {
  static getFromCache(
    cfg: ContextFreeGrammar,
    pwps: Set<LR0Item>
  ): LR1State | undefined {
    for (const s of cache) {
      if (s.cfg !== cfg) {
        continue;
      }
      // same items
      if (s.hasAllPwps(pwps)) {
        return s;
      }
    }
    return undefined;
  }
  static seq = 0;
  id!: number;
  cfg!: ContextFreeGrammar;
  pwps!: Set<LR0Item>;
  constructor(cfg: ContextFreeGrammar, pwps: Set<LR0Item>) {
    const state = LR1State.getFromCache(cfg, pwps);
    if (state) {
      return state;
    }
    LR1State.seq++;
    this.id = LR1State.seq;
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
            this.pwps.add(new LR0Item(p, 0));
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

  hasAllPwps(pwps: Set<LR0Item>) {
    for (const pwp of pwps.keys()) {
      if (!this.pwps.has(pwp)) {
        return false;
      }
    }
    return true;
  }
}
