import {ContextFreeGrammar} from '../../ContextFreeGrammar';
import {GrammarError} from '../../GrammarError';
import {psSerialize} from '../../interfaces/ParseSymbol';
import {Terminal} from '../../interfaces/Terminal';
import {NonTerminal} from '../../NonTerminal';
import {absorbSet} from '../../utils/set';
import {LR0Item} from './LR0Item';

const cache: LR0State[] = [];

export class LR0State {
  static resetCache() {
    cache.length = 0;
    LR0State.seq = 0;
  }
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

  reducableArrayCache!: LR0Item[];
  shiftableArrayCache!: LR0Item[];
  followNameArrayCache!: string[];

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
    this.computeCache();
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

  computeCache() {
    this.reducableArrayCache = [...this.configSet].filter(i => i.isReducable());
    this.shiftableArrayCache = [...this.configSet].filter(
      i => !i.isReducable()
    );
    const followSet = this.reducableArrayCache
      .map(
        item => this.cfg.followCache.get(item.production.LHS) as Set<Terminal>
      )
      .reduce((acc, array) => absorbSet(acc, array), new Set<Terminal>());
    this.followNameArrayCache = [...followSet].map(t => t.name);
  }

  checkReduceReduceConflict() {
    if (this.reducableArrayCache.length > 1) {
      throw new GrammarError(
        `reduce/reduce conflict. productions: ${this.reducableArrayCache.map(
          p => p.toString()
        )}`
      );
    }
  }

  checkShiftReduceConflict() {
    if (
      this.reducableArrayCache.length > 0 &&
      this.shiftableArrayCache.length > 0
    ) {
      throw new GrammarError(
        `shift/reduce conflict. productions: ${[...this.configSet].map(p =>
          p.toString()
        )}`
      );
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
