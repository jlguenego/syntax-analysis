import {ContextFreeGrammar} from '../../ContextFreeGrammar';
import {psSerialize} from '../../interfaces/ParseSymbol';
import {NonTerminal} from '../../NonTerminal';
import {LR0Item} from './LR0Item';

const cache: LR0State[] = [];

export class LR0State {
  static getFromCache(
    cfg: ContextFreeGrammar,
    configSet: Set<LR0Item>
  ): LR0State | undefined {
    for (const s of cache) {
      if (s.cfg !== cfg) {
        continue;
      }
      // same grammar
      if (s.containsConfigSet(configSet)) {
        return s;
      }
    }
    return undefined;
  }
  static seq = 0;
  id!: number;
  cfg!: ContextFreeGrammar;
  configSet!: Set<LR0Item>;
  constructor(cfg: ContextFreeGrammar, configSet: Set<LR0Item>) {
    const state = LR0State.getFromCache(cfg, configSet);
    if (state) {
      return state;
    }
    LR0State.seq++;
    this.id = LR0State.seq;
    this.cfg = cfg;
    this.configSet = configSet;
    cache.push(this);
    this.computeClosure();
  }

  computeClosure() {
    let previousSize = -1;
    let size = this.configSet.size;
    while (size > previousSize) {
      for (const item of this.configSet) {
        const nextSymbol = item.getNextSymbol();
        if (!(nextSymbol instanceof NonTerminal)) {
          continue;
        }
        this.cfg.productions
          .filter(p => p.LHS === nextSymbol)
          .forEach(p => {
            this.configSet.add(new LR0Item(p, 0));
          });
      }

      previousSize = size;
      size = this.configSet.size;
    }
  }

  toString() {
    return (
      `[${this.id}] ` + [...this.configSet].map(p => p.toString()).join(' ')
    );
  }

  getSymbolTransitions(): Set<string> {
    const result = new Set<string>();
    this.configSet.forEach(item => {
      const symbol = item.getNextSymbol();
      if (symbol === undefined) {
        return;
      }

      result.add(psSerialize(symbol));
    });
    return result;
  }

  containsConfigSet(configSet: Set<LR0Item>) {
    for (const item of configSet.keys()) {
      if (!this.configSet.has(item)) {
        return false;
      }
    }
    return true;
  }
}
