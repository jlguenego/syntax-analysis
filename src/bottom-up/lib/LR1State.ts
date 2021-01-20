import {ContextFreeGrammar} from '../../ContextFreeGrammar';
import {psSerialize} from '../../interfaces/ParseSymbol';
import {NonTerminal} from '../../NonTerminal';
import {SententialForm} from '../../SententialForm';
import {firstStar} from '../../top-down/lib/first';
import {LR1Item} from './LR1Item';

const cache: LR1State[] = [];

export class LR1State {
  static getFromCache(
    cfg: ContextFreeGrammar,
    items: Set<LR1Item>
  ): LR1State | undefined {
    for (const s of cache) {
      if (s.cfg !== cfg) {
        continue;
      }
      // same items
      if (s.hasAllItems(items)) {
        return s;
      }
    }
    return undefined;
  }
  static seq = 0;
  id!: number;
  cfg!: ContextFreeGrammar;
  items!: Set<LR1Item>;
  constructor(cfg: ContextFreeGrammar, items: Set<LR1Item>) {
    const state = LR1State.getFromCache(cfg, items);
    if (state) {
      return state;
    }
    LR1State.seq++;
    this.id = LR1State.seq;
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
            const remaining = item.getAfterNextSymbol();
            remaining.push(item.lookAhead);
            for (const x of firstStar(
              this.cfg,
              new SententialForm(remaining)
            )) {
              this.items.add(new LR1Item(p, 0, x));
            }
          });
      }

      previousSize = size;
      size = this.items.size;
    }
  }

  toString() {
    return (
      `[${this.id} (${this.items.size})] ` +
      [...this.items].map(p => p.toString()).join(' ')
    );
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

  hasAllItems(items: Set<LR1Item>) {
    for (const item of items.keys()) {
      if (!this.items.has(item)) {
        return false;
      }
    }
    return true;
  }
}
