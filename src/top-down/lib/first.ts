import {ContextFreeGrammar} from '../../ContextFreeGrammar';
import {Terminal} from '../../interfaces/Terminal';
import {NonTerminal} from '../../NonTerminal';
import {SententialForm} from '../../SententialForm';
import {epsilon} from '../../terminals/epsilon.terminal';
import {absorbSet} from '../../utils/set';

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
 * For all given non-terminal `nt`,
 * returns the list of all terminals
 * that are prefix to sentence that derives from `nt`
 *
 * The following algorithm takes care about ε-productions.
 * https://web.stanford.edu/class/archive/cs/cs143/cs143.1128/lectures/04/Slides04A.pdf
 * slide 7
 *
 * See also https://www.geeksforgeeks.org/first-set-in-syntax-analysis/
 *
 * @param {ContextFreeGrammar} cfg
 */
export const buildFirst = (cfg: ContextFreeGrammar): void => {
  initFirstCache(cfg);
  let previousSize = -1;
  let size = getFirstCacheSize(cfg);
  while (size > previousSize) {
    for (const [nt, firstNt] of cfg.firstCache) {
      const rhsArray = cfg.getProdRHSArray(nt);
      for (const rhs of rhsArray) {
        if (rhs.symbols.length === 0) {
          firstNt.add(epsilon);
          continue;
        }
        absorbSet(firstNt, firstStar(cfg, rhs));
      }
    }
    previousSize = size;
    size = getFirstCacheSize(cfg);
  }
};

export function firstStar(
  cfg: ContextFreeGrammar,
  f: SententialForm
): Set<Terminal> {
  const result = new Set<Terminal>();
  let broken = false;
  for (const symbol of f.symbols) {
    if (!(symbol instanceof NonTerminal)) {
      result.add(symbol);
      broken = true;
      break;
    }
    const set = getFirstCache(cfg, symbol);
    if (!set.has(epsilon)) {
      absorbSet(result, set);
      broken = true;
      break;
    }
    const setMinusEpsilon = new Set(set);
    setMinusEpsilon.delete(epsilon);
    absorbSet(result, setMinusEpsilon);
  }
  if (broken === false) {
    result.add(epsilon);
  }
  return result;
}
