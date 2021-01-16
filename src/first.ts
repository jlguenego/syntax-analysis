import {ContextFreeGrammar} from './ContextFreeGrammar';
import {Terminal} from './interfaces/Terminal';
import {NonTerminal} from './NonTerminal';
import {SententialForm} from './SententialForm';
import {epsilon} from './terminals/epsilon.terminal';

const initFirstCache = (cfg: ContextFreeGrammar): void => {
  for (const nt of cfg.productionMap.keys()) {
    cfg.firstCache.set(nt, new Set<Terminal>());
  }
};

const getFirstCacheSize = (cfg: ContextFreeGrammar): number => {
  return [...cfg.firstCache.values()]
    .map(a => a.size)
    .reduce((acc, n) => acc + n);
};

const getFirstCache = (cfg: ContextFreeGrammar, nt: NonTerminal) => {
  return cfg.firstCache.get(nt) as Set<Terminal>;
};

/**
 * For a all given non-terminal `nt`,
 * returns the list of all terminals
 * that are prefix to sentence that derives from `nt`
 *
 * The following algorithm takes care about ε-productions.
 * https://web.stanford.edu/class/archive/cs/cs143/cs143.1128/lectures/04/Slides04A.pdf
 * slide 7
 *
 * @param {ContextFreeGrammar} cfg
 */
export const buildFirst = (cfg: ContextFreeGrammar): void => {
  initFirstCache(cfg);
  let previousSize = -1;
  let size = getFirstCacheSize(cfg);
  while (size > previousSize) {
    for (const nt of cfg.firstCache.keys()) {
      const firstNt = cfg.firstCache.get(nt) as Set<Terminal>;
      const rhsArray = cfg.getProdRHSArray(nt) as SententialForm[];
      for (const rhs of rhsArray) {
        if (rhs.symbols.length === 0) {
          firstNt.add(epsilon);
          continue;
        }
        for (const symbol of rhs.symbols) {
          if (!(symbol instanceof NonTerminal)) {
            firstNt.add(symbol);
            break;
          }
          const set = getFirstCache(cfg, symbol);
          if (!set.has(epsilon)) {
            [...set].forEach(t => firstNt.add(t));
            break;
          }
          [...set].filter(t => t !== epsilon).forEach(t => firstNt.add(t));
        }
      }
    }
    previousSize = size;
    size = getFirstCacheSize(cfg);
  }
};
