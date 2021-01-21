import {ContextFreeGrammar} from '../../ContextFreeGrammar';
import {GrammarError} from '../../GrammarError';
import {psSerialize} from '../../interfaces/ParseSymbol';
import {Production} from '../../interfaces/Production';
import {NonTerminal} from '../../NonTerminal';
import {SententialForm} from '../../SententialForm';
import {firstStar} from '../../top-down/lib/first';
import {absorbSet, areSetEquals} from '../../utils/set';
import {LR0Item} from './LR0Item';
import {LR1Item} from './LR1Item';

export class LALR1State {
  static resetCache(cfg: ContextFreeGrammar) {
    cfg.lalr1AutomatonCache.length = 0;
  }
  static getFromCache(
    cfg: ContextFreeGrammar,
    configSet: Set<LR1Item>
  ): LALR1State | undefined {
    computeClosure(cfg, configSet);
    for (const s of cfg.lalr1AutomatonCache) {
      if (s.equalsCoreConfigSet(configSet)) {
        absorbSet(s.configSet, configSet);
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
    const state = LALR1State.getFromCache(cfg, configSet);
    if (state) {
      return state;
    }
    this.id = cfg.lr1AutomatonCache.length + 1;
    this.cfg = cfg;
    this.configSet = configSet;
    cfg.lalr1AutomatonCache.push(this);
    this.computeClosure();
  }

  computeClosure() {
    computeClosure(this.cfg, this.configSet);
    this.updateCache();
  }

  updateCache() {
    const reducables = [...this.configSet].filter(item => item.isReducable());
    for (const item of reducables) {
      if (this.reducableProductionMap.get(item.lookAhead.name)) {
        const str = [...this.configSet]
          .filter(i => i.isReducableForTerminal(item.lookAhead))
          .map(i => i.toString())
          .join(' ');
        throw new GrammarError(
          `reduce/reduce conflict while building LR(1) automaton. items: ${str}`
        );
      }
      this.reducableProductionMap.set(item.lookAhead.name, item.production);
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

  equalsCoreConfigSet(configSet: Set<LR1Item>) {
    const c1 = getCore(configSet);
    const c2 = getCore(this.configSet);

    return areSetEquals(c1, c2);
  }
}

const getCore = (configSet: Set<LR1Item>): Set<LR0Item> => {
  const result = new Set<LR0Item>();
  configSet.forEach(item =>
    result.add(new LR0Item(item.production, item.position))
  );
  return result;
};

const computeClosure = (cfg: ContextFreeGrammar, configSet: Set<LR1Item>) => {
  let previousSize = -1;
  let size = configSet.size;
  while (size > previousSize) {
    for (const item of configSet) {
      const nextSymbol = item.getNextSymbol();
      if (!(nextSymbol instanceof NonTerminal)) {
        continue;
      }
      cfg.productions
        .filter(p => p.LHS === nextSymbol)
        .forEach(p => {
          const remaining = item.getAfterNextSymbol();
          remaining.push(item.lookAhead);
          for (const x of firstStar(cfg, new SententialForm(remaining))) {
            configSet.add(new LR1Item(p, 0, x));
          }
        });
    }

    previousSize = size;
    size = configSet.size;
  }
};
