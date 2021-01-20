import {ContextFreeGrammar} from '../../ContextFreeGrammar';
import {psSerialize} from '../../interfaces/ParseSymbol';
import {NonTerminal} from '../../NonTerminal';
import {LR0Item} from './LR0Item';

const cache: LR0State[] = [];

export class LR0State {
  static getFromCache(
    cfg: ContextFreeGrammar,
    items: Set<LR0Item>
  ): LR0State | undefined {
    for (const s of cache) {
      if (s.cfg !== cfg) {
        continue;
      }
      // same grammar
      if (s.hasAllItems(items)) {
        return s;
      }
    }
    return undefined;
  }
  static seq = 0;
  id!: number;
  cfg!: ContextFreeGrammar;
  items!: Set<LR0Item>;
  constructor(cfg: ContextFreeGrammar, items: Set<LR0Item>) {
    const state = LR0State.getFromCache(cfg, items);
    if (state) {
      return state;
    }
    LR0State.seq++;
    this.id = LR0State.seq;
    this.cfg = cfg;
    this.items = items;
    cache.push(this);
    this.computeClosure();
  }

  computeClosure() {
    let previousSize = -1;
    let size = this.items.size;
    while (size > previousSize) {
      for (const item of this.items) {
        const nextSymbol = item.getNextSymbol();
        if (!(nextSymbol instanceof NonTerminal)) {
          continue;
        }
        this.cfg.productions
          .filter(p => p.LHS === nextSymbol)
          .forEach(p => {
            this.items.add(new LR0Item(p, 0));
          });
      }

      previousSize = size;
      size = this.items.size;
    }
  }

  toString() {
    return `[${this.id}] ` + [...this.items].map(p => p.toString()).join(' ');
  }

  getSymbolTransitions(): Set<string> {
    const result = new Set<string>();
    this.items.forEach(item => {
      const symbol = item.getNextSymbol();
      if (symbol === undefined) {
        return;
      }

      result.add(psSerialize(symbol));
    });
    return result;
  }

  hasAllItems(items: Set<LR0Item>) {
    for (const item of items.keys()) {
      if (!this.items.has(item)) {
        return false;
      }
    }
    return true;
  }
}
