import {ContextFreeGrammar} from '../../ContextFreeGrammar';
import {psSerialize} from '../../interfaces/ParseSymbol';
import {Production} from '../../interfaces/Production';
import {Terminal} from '../../interfaces/Terminal';
import {NonTerminal} from '../../NonTerminal';
import {SententialForm} from '../../SententialForm';
import {firstStar} from '../../top-down/lib/first';
import {LR1Item} from './LR1Item';

export class LR1State {
  static resetCache(cfg: ContextFreeGrammar) {
    cfg.lr1AutomatonCache.length = 0;
  }
  static getFromCache(
    cfg: ContextFreeGrammar,
    configSet: Set<LR1Item>
  ): LR1State | undefined {
    for (const s of cfg.lr1AutomatonCache) {
      // configSet included
      if (s.containsConfigSet(configSet)) {
        return s;
      }
    }
    return undefined;
  }
  id!: number;
  cfg!: ContextFreeGrammar;
  configSet!: Set<LR1Item>;

  reducableProductionMap = new Map<string, Production>();

  constructor(cfg: ContextFreeGrammar, configSet: Set<LR1Item>) {
    const state = LR1State.getFromCache(cfg, configSet);
    if (state) {
      return state;
    }
    this.id = cfg.lr1AutomatonCache.length + 1;
    this.cfg = cfg;
    this.configSet = configSet;
    cfg.lr1AutomatonCache.push(this);
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
            const remaining = item.getAfterNextSymbol();
            remaining.push(item.lookAhead);
            for (const x of firstStar(
              this.cfg,
              new SententialForm(remaining)
            )) {
              this.configSet.add(new LR1Item(p, 0, x));
            }
          });
      }

      previousSize = size;
      size = this.configSet.size;
    }
    this.updateCache();
    this.checkReduceReduceConflict();
  }

  updateCache() {
    const reducables = [...this.configSet].filter(item => item.isReducable());
    for (const item of reducables) {
      this.reducableProductionMap.set(item.lookAhead.name, item.production);
    }
  }

  checkReduceReduceConflict() {
    const map = [...this.configSet]
      .filter(item => item.isReducable())
      .reduce((acc, item) => {
        const n = acc.get(item.lookAhead) ?? 0;
        acc.set(item.lookAhead, n + 1);
        return acc;
      }, new Map<Terminal, number>());
    for (const [t, n] of map) {
      if (n > 1) {
        const str = [...this.configSet]
          .filter(item => item.isReducableForTerminal(t))
          .map(item => item.toString())
          .join(' ');
        throw new Error(
          `reduce/reduce conflict while building LR(1) automaton. items: ${str}`
        );
      }
    }
  }

  toString() {
    return (
      `[${this.id} (${this.configSet.size})] ` +
      [...this.configSet].map(p => p.toString()).join(' ')
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

  containsConfigSet(configSet: Set<LR1Item>) {
    for (const item of configSet) {
      if (!this.configSet.has(item)) {
        return false;
      }
    }
    return true;
  }
}
