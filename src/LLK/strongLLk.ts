import {Word} from '../Word';
import {buildFirstk, firstkStarSet} from './firstk';
import {NonTerminal} from '../NonTerminal';
import {SententialForm} from '../SententialForm';
import {getDistinctCouples} from '../utils/set';
import {ContextFreeGrammar} from '../ContextFreeGrammar';
import {followk, buildFollowk} from './followk';
import {Sets} from '@jlguenego/set';

const firstFollow = (
  cfg: ContextFreeGrammar,
  k: number,
  rhs: SententialForm,
  a: NonTerminal
) => {
  const followA = followk(cfg, k, a);
  const formSet = rhs.concatSet(followA);

  const result = firstkStarSet(cfg, k, formSet);
  return result;
};

export const isStrongLLk = (cfg: ContextFreeGrammar, k: number): boolean =>
  getFirstFollowIntersec(cfg, k).size === 0;

export const getFirstFollowIntersec = (
  cfg: ContextFreeGrammar,
  k: number
): Set<Word> => {
  buildFirstk(cfg, k);
  buildFollowk(cfg, k);
  const result = new Set<Word>();
  // All LL(1) and LL(0) grammars are strong.
  if (k <= 1) {
    return result;
  }
  for (const nt of cfg.productionMap.keys()) {
    const rhsArray = cfg.productionMap.get(nt) as SententialForm[];
    const rhsSet = new Set(rhsArray);
    const distinctRhsArrayCouples = getDistinctCouples(rhsSet);
    for (const [rhs1, rhs2] of distinctRhsArrayCouples) {
      const set1 = firstFollow(cfg, k, rhs1, nt);

      const set2 = firstFollow(cfg, k, rhs2, nt);

      const intersec = Sets.intersection(set1, set2);

      Sets.absorb(result, intersec);
    }
  }
  return result;
};
